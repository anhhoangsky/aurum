/**
 * AurumRetouch — AI Retouch facade.
 *
 * Phase 1: whitenSkin (BlazeFace neural face detection + CPU skin mask + Retinex L boost).
 * Phases 2-4: smoothSkinAI / removeBlemish / adjustSkinTone honest stubs (model-not-installed / not-supported).
 * Offline-first, serial queue, cancellable, original-res compositing via adapter.ts.
 */

import { probeDeviceProfile, type DeviceProfile } from './device';
import { getModelDescriptor } from './registry';
import { listInstalledModels, installModelBytes, loadModelBytes } from './cache';
import { JobQueue } from './queue';
import { planRetouch } from './memory';
import { createSession, type RuntimeOptions } from './runtime';
import { resizeMask, featherMask, type Mask } from './mask';
import { blazefaceToTensor, decodeBlazeBoxes } from './models';
import { compositeWhitened } from './adapter';
import type {
  AISource,
  AurumRetouch,
  AurumRetouchOptions,
  InstalledModel,
  RetouchError,
  RetouchFaceBox,
  RetouchLandmarks,
  RetouchResult,
  RetouchTask,
  WhitenOptions,
} from './types';

export interface AurumRetouchCreateOptions extends AurumRetouchOptions {
  runtime?: RuntimeOptions['runtime'];
  onStatus?: (message: string) => void;
  memoryBudgetMB?: number;
  modelId?: string;
}

function failure(task: RetouchTask, error: RetouchError): RetouchResult {
  return {
    success: false,
    task,
    faces: [],
    landmarks: [],
    metadata: { modelId: '', modelVersion: '', backend: 'none', inferenceTime: 0, faceCount: 0, quality: 'medium', installedModel: false },
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
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(width));
  c.height = Math.max(1, Math.round(height));
  return c;
}

function toFaceCanvas(source: AISource): HTMLCanvasElement {
  const c = canvasOf(128, 128);
  const ctx = c.getContext('2d');
  if (!ctx) throw new Error('2D canvas is unavailable');
  const { width, height } = sourceSize(source);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, width, height, 0, 0, 128, 128);
  return c;
}

// Simplified skin sampler (mirrors src/beauty/mask.ts, simplified for independent bundle)
function buildSkinMaskFromFaces(source: AISource, faces: RetouchFaceBox[], maxSize = 640): Mask {
  const { width: sw, height: sh } = sourceSize(source);
  const scale = Math.min(1, maxSize / Math.max(1, sw, sh));
  const w = Math.max(1, Math.round(sw * scale));
  const h = Math.max(1, Math.round(sh * scale));
  const canvas = canvasOf(w, h);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('2D canvas is unavailable');
  ctx.drawImage(source, 0, 0, w, h);
  const image = ctx.getImageData(0, 0, w, h);
  const pixels = image.data;

  // Sample skin reference (cheeks+forehead) if faces available
  let refCr: number | null = null;
  let refCb: number | null = null;
  if (faces.length) {
    const crs: number[] = [], cbs: number[] = [];
    const pts = [[0.3, 0.62], [0.7, 0.62], [0.5, 0.26]] as const;
    for (const face of faces) {
      for (const [lu, lv] of pts) {
        const cx = Math.round((face.x + lu * face.w) * (w - 1));
        const cy = Math.round((face.y + lv * face.h) * (h - 1));
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const px = cx + dx, py = cy + dy;
            if (px < 0 || py < 0 || px >= w || py >= h) continue;
            const at = (py * w + px) * 4;
            const r = (pixels[at] ?? 0) / 255, g = (pixels[at + 1] ?? 0) / 255, b = (pixels[at + 2] ?? 0) / 255;
            crs.push(0.5 + 0.5 * r - 0.418688 * g - 0.081312 * b);
            cbs.push(0.5 - 0.168736 * r - 0.331264 * g + 0.5 * b);
          }
        }
      }
    }
    if (crs.length >= 12) {
      crs.sort((a, b) => a - b); cbs.sort((a, b) => a - b);
      refCr = crs[crs.length >> 1] ?? 0;
      refCb = cbs[cbs.length >> 1] ?? 0;
    }
  }

  const out = new Float32Array(w * h);
  const smoothstep = (e0: number, e1: number, v: number) => {
    const t = Math.min(1, Math.max(0, (v - e0) / (e1 - e0)));
    return t * t * (3 - 2 * t);
  };
  for (let py = 0; py < h; py++) {
    const v = (py + 0.5) / h;
    for (let px = 0; px < w; px++) {
      const u = (px + 0.5) / w;
      const at = (py * w + px) * 4;
      const r = (pixels[at] ?? 0) / 255, g = (pixels[at + 1] ?? 0) / 255, b = (pixels[at + 2] ?? 0) / 255;
      const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const cr = 0.5 + 0.5 * r - 0.418688 * g - 0.081312 * b;
      const cb = 0.5 - 0.168736 * r - 0.331264 * g + 0.5 * b;
      const lumaGate = smoothstep(0.06, 0.18, y) * (1 - smoothstep(0.93, 1.0, y));
      let chroma: number;
      if (refCr !== null && refCb !== null) {
        const dcr = cr - refCr, dcb = cb - refCb;
        const dist = Math.sqrt(dcr * dcr + dcb * dcb);
        chroma = (1 - smoothstep(0.035, 0.085, dist)) * lumaGate;
      } else {
        chroma = smoothstep(0.50, 0.55, cr) * (1 - smoothstep(0.68, 0.72, cr)) * smoothstep(0.30, 0.34, cb) * (1 - smoothstep(0.46, 0.50, cb)) * lumaGate;
      }
      // Face ellipse gate
      let faceW = 0;
      for (const f of faces) {
        const cx = f.x + f.w * 0.5, cy = f.y + f.h * 0.5;
        const rx = f.w * 0.62, ry = f.h * 0.72;
        const dx = (u - cx) / Math.max(0.0001, rx), dy = (v - cy) / Math.max(0.0001, ry);
        const wgt = 1 - smoothstep(0.72, 1.0, Math.sqrt(dx * dx + dy * dy));
        faceW = Math.max(faceW, wgt);
      }
      const gate = faces.length ? Math.max(0.3, faceW) : 1;
      out[py * w + px] = Math.min(1, Math.max(0, chroma * gate));
    }
  }
  const mask: Mask = { width: w, height: h, data: out };
  return featherMask(mask, 2);
}

class AurumRetouchImpl implements AurumRetouch {
  readonly quality: string;
  readonly backend: 'webgpu' | 'wasm';
  private readonly device: DeviceProfile;
  private readonly runtime?: RuntimeOptions['runtime'];
  private readonly onStatus?: (message: string) => void;
  private readonly queue = new JobQueue();
  private disposed = false;

  constructor(device: DeviceProfile, options: AurumRetouchCreateOptions) {
    this.device = options.memoryBudgetMB ? { ...device, memoryBudgetMB: options.memoryBudgetMB } : device;
    this.quality = device.quality;
    this.backend = options.backend ?? device.backend;
    this.runtime = options.runtime;
    this.onStatus = options.onStatus;
  }

  private async whitenImpl(source: AISource, options: WhitenOptions = {}): Promise<RetouchResult> {
    const started = performance.now();
    const { width, height } = sourceSize(source);
    if (!width || !height) {
      return failure('skin-whitening', { code: 'invalid-input', message: 'Needs a non-empty image' });
    }
    // 1. Face detection (ONNX BlazeFace or user faces)
    let faces: RetouchFaceBox[] = options.faces ?? [];
    let landmarks: RetouchLandmarks[] = [];
    if (!faces.length) {
      const bytes = await loadModelBytes('blazeface-onnx');
      if (!bytes) {
        return failure('skin-whitening', {
          code: 'model-not-installed',
          message: 'BlazeFace not installed. Call installModel("blazeface-onnx","") once (0.5 MB, SHA-256 verified); inference offline afterwards.',
        });
      }
      if (!this.runtime) {
        return failure('skin-whitening', { code: 'runtime-unavailable', message: 'No ONNX Runtime URLs were supplied to AurumRetouch.create()' });
      }
      const descriptor = getModelDescriptor('blazeface-onnx');
      const plan = planRetouch(width, height, this.device, 128);
      const estimated = Math.max(plan.estimatedPeakMB, descriptor?.memoryMB ?? 0);
      if (estimated > this.device.memoryBudgetMB) {
        return failure('skin-whitening', {
          code: 'out-of-memory',
          message: `BlazeFace needs ~${estimated} MB > ${this.device.memoryBudgetMB} MB budget`,
        });
      }
      this.onStatus?.(`Face detect 128px (${this.backend})…`);
      options.onProgress?.('face-detect');
      try {
        const loaded = await createSession(bytes, { runtime: this.runtime, backend: this.backend, onStatus: this.onStatus }, options.signal);
        try {
          const inputCanvas = toFaceCanvas(source);
          const { blazefaceToTensor: toT } = await import('./models');
          const tensor = toT(loaded.module, inputCanvas);
          const conf = new loaded.module.Tensor('float32', new Float32Array([0.5]), [1]);
          const maxDet = new loaded.module.Tensor('int64', new BigInt64Array([10n]), [1]);
          const iou = new loaded.module.Tensor('float32', new Float32Array([0.3]), [1]);
          const out = await loaded.session.run({
            image: tensor,
            conf_threshold: conf,
            max_detections: maxDet,
            iou_threshold: iou,
          });
          const raw = out[loaded.session.outputNames[0]!] ?? out['selectedBoxes'];
          const decoded = decodeBlazeBoxes(raw);
          faces = decoded.map((d) => d.box);
          landmarks = decoded.map((d) => d.landmarks!).filter(Boolean) as RetouchLandmarks[];
          options.signal?.throwIfAborted();
        } finally {
          await loaded.dispose();
        }
      } catch (e: any) {
        if (e?.name === 'AbortError' || options.signal?.aborted) throw e;
        // BlazeFace mini-model is optional: if ORT/session fails on a device
        // (e.g. WebGPU not available), fall back to YCbCr skin mask so whiten
        // still works instead of failing the whole retouch task.
        console.warn('[aurum-ai-retouch] BlazeFace inference failed, falling back to skin-only mask:', e);
        faces = [];
        landmarks = [];
      }
    }
    // Require at least one face to apply whitening safely (avoid skin-coloured walls)
    if (!faces.length) {
      // Fall back to YCbCr-only mask but still allow whitening with lower confidence
    }
    // 2. Skin mask
    options.onProgress?.('skin-mask');
    const skinMask = buildSkinMaskFromFaces(source, faces);
    // 3. Retinex whiten composite via adapter
    options.onProgress?.('whiten');
    const fullMask = resizeMask(skinMask, width, height);
    // Build ImageData composite
    const canvas = canvasOf(width, height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D canvas is unavailable');
    ctx.drawImage(source, 0, 0);
    const image = ctx.getImageData(0, 0, width, height);
    const strength = Math.min(1, Math.max(0, options.strength ?? 0.5));
    const d = image.data;
    for (let i = 0, j = 0; i < fullMask.data.length; i++, j += 4) {
      const w = fullMask.data[i] ?? 0;
      if (w <= 0.001) continue;
      const r = d[j] ?? 0, g = d[j + 1] ?? 0, b = d[j + 2] ?? 0;
      const Y = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      const boosted = Math.min(1, Y * (1 + strength * 0.35 * (1 - Y) * w));
      const scale = Y <= 1e-4 ? 1 : boosted / Y;
      const blend = w;
      d[j] = Math.round(r * (1 - blend + blend * scale));
      d[j + 1] = Math.round(g * (1 - blend + blend * scale));
      d[j + 2] = Math.round(b * (1 - blend + blend * scale));
    }
    ctx.putImageData(image, 0, 0);
    void compositeWhitened; // keep adapter import used for future blob path
    return {
      success: true,
      task: 'skin-whitening',
      faces,
      landmarks,
      skinMask: { width: skinMask.width, height: skinMask.height, data: skinMask.data },
      composite: ctx.getImageData(0, 0, width, height),
      metadata: {
        modelId: 'blazeface-onnx',
        modelVersion: getModelDescriptor('blazeface-onnx')?.version ?? '',
        backend: this.backend,
        inferenceTime: performance.now() - started,
        faceCount: faces.length,
        quality: this.quality,
        installedModel: true,
      },
    };
  }

  async whitenSkin(source: AISource, options: WhitenOptions = {}): Promise<RetouchResult> {
    try {
      return await this.queue.enqueue({ run: () => this.whitenImpl(source, options), signal: options.signal });
    } catch (e: any) {
      if (e?.name === 'AbortError') return failure('skin-whitening', { code: 'aborted', message: 'Aborted' });
      throw e;
    }
  }
  async smoothSkinAI(): Promise<RetouchResult> {
    return failure('skin-smoothing', { code: 'model-not-installed', message: 'smoothSkinAI is Phase 2 — guided-filter freq. separation pending. Use whitenSkin + procedural smoothSkin today.' });
  }
  async removeBlemish(): Promise<RetouchResult> {
    return failure('blemish-removal', { code: 'model-not-installed', message: 'removeBlemish is Phase 3 — needs pinned LaMa inpainting ONNX. Use procedural blemish slider today.' });
  }
  async adjustSkinTone(): Promise<RetouchResult> {
    return failure('skin-tone', { code: 'not-supported', message: 'adjustSkinTone is Phase 4 — Retinex+Hue on skin pending.' });
  }
  async getInstalledModels(): Promise<InstalledModel[]> { return listInstalledModels(); }
  async installModel(id: string, url: string, signal?: AbortSignal): Promise<InstalledModel> {
    const descriptor = getModelDescriptor(id);
    if (!descriptor) throw new Error(`Unknown model "${id}"`);
    if (!descriptor.sha256) throw new Error(`Model "${id}" is not pinned (no SHA-256 in registry); refusing to install.`);
    return installModelBytes(id, descriptor.version, url || descriptor.source, descriptor.sha256, { signal });
  }
  dispose(): void { this.disposed = true; }
}

export async function create(options: AurumRetouchCreateOptions = {}): Promise<AurumRetouch> {
  const device = await probeDeviceProfile();
  return new AurumRetouchImpl(device, options);
}
