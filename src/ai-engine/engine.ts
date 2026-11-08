/**
 * AurumAI — the AI Engine facade.
 *
 * Offline-first and local-only: after `installModel()` the engine makes no
 * network calls. All heavy jobs go through a serial queue (one at a time),
 * accept `AbortSignal`, and release the ORT session on `dispose()`.
 *
 * Honest states: when no model adapter/bytes are available, methods return
 * `{ success: false, error: { code: 'model-not-installed' } }`. The engine
 * never synthesizes masks from heuristics and presents them as AI output.
 */

import { probeDeviceProfile, type DeviceProfile } from './device';
import { getModelAdapter } from './models';
import { getModelDescriptor } from './registry';
import { installModelBytes, listInstalledModels, loadModelBytes } from './cache';
import { JobQueue } from './queue';
import { planSegmentation, type SegmentationPlan } from './memory';
import { createSession, type RuntimeOptions } from './runtime';
import { applyAlpha, featherMask, morphMask, resizeMask, type Mask } from './mask';
import type {
  AIError,
  AIInputResolution,
  AIQuality,
  AIResult,
  AIResultMetadata,
  AISource,
  AurumAI,
  AurumAIOptions,
  InstalledModel,
  RemoveBackgroundOptions,
  SegmentObjectsOptions,
} from './types';

export interface AurumAICreateOptions extends AurumAIOptions {
  /** ORT runtime URLs supplied by the host (same posture as aurum-ai). */
  runtime?: RuntimeOptions['runtime'];
  onStatus?: (message: string) => void;
  /**
   * Preferred background-removal model. Defaults to the pinned fp16 artifact;
   * the fp32 artifact is used when only it is installed (backend fallback).
   */
  modelId?: string;
}

function failure(
  task: AIResult['task'],
  quality: AIQuality,
  error: AIError,
  inputResolution: [number, number] = [0, 0],
): AIResult {
  return {
    success: false,
    task,
    masks: [],
    instances: [],
    metadata: {
      modelId: '',
      modelVersion: '',
      backend: 'none',
      inputResolution,
      inferenceTime: 0,
      quality,
      installedModel: false,
    },
    error,
  };
}

function sourceSize(source: AISource): { width: number; height: number } {
  if (typeof HTMLImageElement !== 'undefined' && source instanceof HTMLImageElement) {
    return { width: source.naturalWidth || source.width, height: source.naturalHeight || source.height };
  }
  return { width: source.width, height: source.height };
}

function canvasOf(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  return canvas;
}

/** Draw the source into a square input canvas (direct resize — see blocker). */
function toSquareCanvas(source: AISource, size: number): HTMLCanvasElement {
  const canvas = canvasOf(size, size);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas is unavailable');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  const { width, height } = sourceSize(source);
  ctx.drawImage(source, 0, 0, width, height, 0, 0, size, size);
  return canvas;
}

/** Aspect-preserved resize: shortest edge = `shortEdge`, both divisible by 32. */
function toDynamicCanvas(source: AISource, shortEdge: number): HTMLCanvasElement {
  const { width, height } = sourceSize(source);
  const scale = shortEdge / Math.min(width, height);
  const w = Math.max(32, Math.round((width * scale) / 32) * 32);
  const h = Math.max(32, Math.round((height * scale) / 32) * 32);
  const canvas = canvasOf(w, h);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas is unavailable');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, width, height, 0, 0, w, h);
  return canvas;
}

class AurumAIImpl implements AurumAI {
  readonly quality: AIQuality;
  readonly backend: 'webgpu' | 'wasm';
  private readonly device: DeviceProfile;
  private readonly runtime?: RuntimeOptions['runtime'];
  private readonly onStatus?: (message: string) => void;
  private readonly modelId: string;
  private readonly queue = new JobQueue();
  private disposed = false;

  constructor(device: DeviceProfile, options: AurumAICreateOptions) {
    this.device = device;
    this.quality = device.quality;
    this.backend = options.backend ?? device.backend;
    this.runtime = options.runtime;
    this.onStatus = options.onStatus;
    this.modelId = options.modelId ?? 'birefnet-lite-512-fp16';
  }

  /** Exposed for tests/diagnostics; not part of the public AurumAI contract. */
  plan(width: number, height: number, resolution?: AIInputResolution): SegmentationPlan {
    return planSegmentation(width, height, this.device, resolution);
  }

  /** Shared inference path: resolve installed bytes -> session -> mask ->
   *  upscale to original resolution -> refine. Used by removeBackground
   *  (BiRefNet) and mattePerson (MODNet); the mask never replaces the
   *  original-resolution image. */
  private async runWithModel(
    task: AIResult['task'],
    candidates: readonly string[],
    source: AISource,
    options: RemoveBackgroundOptions,
    installHint: string,
  ): Promise<AIResult> {
    const run = async (signal: AbortSignal): Promise<AIResult> => {
      const started = performance.now();
      const { width, height } = sourceSize(source);
      if (!width || !height) {
        return failure(task, this.quality, {
          code: 'invalid-input',
          message: 'AI needs a non-empty image',
        });
      }
      let adapter: ReturnType<typeof getModelAdapter>;
      let modelId = candidates[0]!;
      let bytes: ArrayBuffer | null = null;
      for (const id of [...new Set(candidates)]) {
        adapter = getModelAdapter(id);
        if (!adapter) continue;
        const found = await loadModelBytes(id);
        if (found) {
          modelId = id;
          bytes = found;
          break;
        }
      }
      if (!adapter || !bytes) {
        return failure(task, this.quality, {
          code: 'model-not-installed',
          message: installHint,
        });
      }
      if (!this.runtime) {
        return failure(task, this.quality, {
          code: 'runtime-unavailable',
          message: 'No ONNX Runtime URLs were supplied to AurumAI.create()',
        });
      }
      const descriptor = getModelDescriptor(modelId);
      const plan = planSegmentation(width, height, this.device, adapter.inputSize);
      this.onStatus?.(`AI input ${plan.inputSize}px (${this.backend})…`);
      const loaded = await createSession(
        bytes,
        { runtime: this.runtime, backend: this.backend, onStatus: this.onStatus },
        signal,
      );
      try {
        const inputCanvas = adapter.square
          ? toSquareCanvas(source, adapter.inputSize)
          : toDynamicCanvas(source, adapter.inputSize);
        const tensor = adapter.toTensor(loaded.module, inputCanvas);
        options.onProgress?.('inference');
        const output = await loaded.session.run({ [loaded.session.inputNames[0]!]: tensor });
        signal.throwIfAborted();
        const raw = output[loaded.session.outputNames[0]!];
        if (!raw) throw new Error('AI model returned no output');
        let mask: Mask = adapter.fromTensor(raw, adapter.inputSize);

        // Upscale to original resolution, then refine (soft alpha preserved).
        mask = resizeMask(mask, width, height);
        if (options.expand) {
          mask = morphMask(mask, Math.round(options.expand), options.expand >= 0 ? 'expand' : 'contract');
        }
        if (options.feather) mask = featherMask(mask, options.feather);
        if (options.refineEdges || options.preserveHair) {
          // Light feather keeps hair detail from being destroyed by hard
          // thresholding. Manual brush refinement (Phase 5) builds on this.
          mask = featherMask(mask, 1);
        }

        const inferenceTime = performance.now() - started;
        const metadata: AIResultMetadata = {
          modelId,
          modelVersion: descriptor?.version ?? '',
          backend: loaded.backend,
          inputResolution: [inputCanvas.width, inputCanvas.height],
          inferenceTime,
          quality: this.quality,
          installedModel: true,
        };
        return { success: true, task, masks: [mask], instances: [], metadata };
      } finally {
        await loaded.dispose();
      }
    };
    try {
      return await this.queue.enqueue({ run, signal: options.signal });
    } catch (error) {
      if ((error as Error)?.name === 'AbortError') {
        return failure(task, this.quality, { code: 'aborted', message: 'Aborted' });
      }
      throw error;
    }
  }

  async removeBackground(source: AISource, options: RemoveBackgroundOptions = {}): Promise<AIResult> {
    const first = this.modelId.startsWith('birefnet') ? this.modelId : undefined;
    return this.runWithModel(
      'background-removal',
      [first, 'birefnet-lite-512-fp16', 'birefnet-lite-512-fp32'].filter((v): v is string => Boolean(v)),
      source,
      options,
      'BiRefNet Lite 512 is not installed. Call installModel("birefnet-lite-512-fp16") once (94 MB, verified SHA-256); inference is offline afterwards.',
    );
  }

  async mattePerson(source: AISource, options: RemoveBackgroundOptions = {}): Promise<AIResult> {
    // MODNet ONLY. BiRefNet is a dichotomous segmentation model, not a
    // trimap-free matting model — substituting it here would be a false claim.
    return this.runWithModel(
      'matting',
      ['modnet-fp16', 'modnet-fp32'],
      source,
      options,
      'MODNet is not installed. Call installModel("modnet-fp16") once (13 MB, verified SHA-256); person matting is offline afterwards.',
    );
  }

  async replaceBackground(source: AISource, background: AISource, options: RemoveBackgroundOptions = {}): Promise<AIResult> {
    const result = await this.removeBackground(source, options);
    if (!result.success || !result.masks[0]) return { ...result, task: 'background-replace' };
    const { width, height } = sourceSize(source);
    const bg = canvasOf(width, height);
    const bctx = bg.getContext('2d');
    if (!bctx) throw new Error('2D canvas is unavailable');
    bctx.imageSmoothingEnabled = true;
    bctx.imageSmoothingQuality = 'high';
    const bs = sourceSize(background);
    bctx.drawImage(background, 0, 0, bs.width, bs.height, 0, 0, width, height);
    const image = bctx.getImageData(0, 0, width, height);
    const fg = canvasOf(width, height);
    const fctx = fg.getContext('2d');
    if (!fctx) throw new Error('2D canvas is unavailable');
    fctx.drawImage(source, 0, 0);
    const fgData = fctx.getImageData(0, 0, width, height);
    applyAlpha(fgData.data, result.masks[0]);
    fctx.putImageData(fgData, 0, 0);
    bctx.drawImage(fg, 0, 0);
    return {
      ...result,
      task: 'background-replace',
      composite: bctx.getImageData(0, 0, width, height),
    };
  }

  async blurBackground(source: AISource, options: RemoveBackgroundOptions = {}): Promise<AIResult> {
    const result = await this.removeBackground(source, options);
    if (!result.success || !result.masks[0]) return { ...result, task: 'background-blur' };
    const { width, height } = sourceSize(source);
    const fg = canvasOf(width, height);
    const fctx = fg.getContext('2d');
    if (!fctx) throw new Error('2D canvas is unavailable');
    fctx.drawImage(source, 0, 0);
    const fgData = fctx.getImageData(0, 0, width, height);
    applyAlpha(fgData.data, result.masks[0]);
    fctx.putImageData(fgData, 0, 0);
    // Cheap depth-free bokeh: downscaled background upscaled = soft blur.
    const small = canvasOf(Math.max(1, width >> 3), Math.max(1, height >> 3));
    const sctx = small.getContext('2d');
    if (!sctx) throw new Error('2D canvas is unavailable');
    sctx.imageSmoothingEnabled = true;
    sctx.imageSmoothingQuality = 'high';
    sctx.drawImage(source, 0, 0, small.width, small.height);
    const bg = canvasOf(width, height);
    const bctx = bg.getContext('2d');
    if (!bctx) throw new Error('2D canvas is unavailable');
    bctx.imageSmoothingEnabled = true;
    bctx.imageSmoothingQuality = 'high';
    bctx.drawImage(small, 0, 0, width, height);
    bctx.drawImage(fg, 0, 0);
    return {
      ...result,
      task: 'background-blur',
      composite: bctx.getImageData(0, 0, width, height),
    };
  }

  async segmentPeople(_source: AISource, _options?: { signal?: AbortSignal }): Promise<AIResult> {
    // No instance-capable model is installed yet (Phase 4). Semantic person
    // segmentation (MediaPipe) must not be presented as instance separation.
    return failure('person-segmentation', this.quality, {
      code: 'not-supported',
      message: 'Per-person instance segmentation is not yet supported (no instance model installed).',
    });
  }

  async segmentObjects(_source: AISource, _options?: SegmentObjectsOptions): Promise<AIResult> {
    return failure('object-segmentation', this.quality, {
      code: 'not-supported',
      message: 'Interactive object segmentation is not yet supported (MobileSAM/EdgeTAM not installed).',
    });
  }

  async getInstalledModels(): Promise<InstalledModel[]> {
    return listInstalledModels();
  }

  async installModel(id: string, url: string, signal?: AbortSignal): Promise<InstalledModel> {
    const descriptor = getModelDescriptor(id);
    if (!descriptor) throw new Error(`Unknown model "${id}"`);
    if (!descriptor.sha256) {
      throw new Error(
        `Model "${id}" is not pinned (no SHA-256 in registry); refusing to install. See docs/ai-engine/model-selection.md.`,
      );
    }
    return installModelBytes(id, descriptor.version, url || descriptor.source, descriptor.sha256, { signal });
  }

  dispose(): void {
    this.disposed = true;
  }
}

/** Create the AI Engine. Probes the device; never throws on probe failure. */
export async function create(options: AurumAICreateOptions = {}): Promise<AurumAI> {
  const device = await probeDeviceProfile(options.quality);
  return new AurumAIImpl(device, options);
}
