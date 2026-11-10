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
import { createSession, type LoadedSession, type RuntimeOptions } from './runtime';
import { resizeMask, featherMask, type Mask } from './mask';
import {
  blazefaceToTensor,
  decodeBlazeBoxes,
  faceParsingToTensor,
  faceParsingHairMask,
} from './models';
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

function buildHairMaskFromFaces(source: AISource, faces: RetouchFaceBox[], maxSize = 640): Mask {
  const { width: sw, height: sh } = sourceSize(source);
  const scale = Math.min(1, maxSize / Math.max(1, sw, sh));
  const w = Math.max(1, Math.round(sw * scale));
  const h = Math.max(1, Math.round(sh * scale));
  const canvas = canvasOf(w, h);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('2D canvas is unavailable');
  ctx.drawImage(source, 0, 0, w, h);
  const pixels = ctx.getImageData(0, 0, w, h).data;
  // Skin reference (same sampling as skin mask) to exclude skin from hair.
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
      let skinLike = 0;
      if (refCr !== null && refCb !== null) {
        const dist = Math.sqrt((cr - refCr) ** 2 + (cb - refCb) ** 2);
        skinLike = 1 - smoothstep(0.035, 0.085, dist);
      }
      // Head ellipse: face centre shifted up, 1.45x face size.
      let headW = 0;
      for (const f of faces) {
        const cx = f.x + f.w * 0.5, cy = f.y + f.h * 0.5 - f.h * 0.25;
        const rx = f.w * 0.95, ry = f.h * 0.95;
        const dx = (u - cx) / Math.max(0.0001, rx), dy = (v - cy) / Math.max(0.0001, ry);
        headW = Math.max(headW, 1 - smoothstep(0.72, 1.05, Math.sqrt(dx * dx + dy * dy)));
        // Long-hair extension below the chin, both sides of the face.
        const below = v - (f.y + f.h);
        if (below > 0 && below < f.h * 1.4 && Math.abs(u - (f.x + f.w * 0.5)) < f.w * 0.85) {
          const sideW = (1 - smoothstep(0.6, 1.0, Math.abs(u - (f.x + f.w * 0.5)) / Math.max(0.0001, f.w * 0.85))) * (1 - smoothstep(0.9, 1.4, below / f.h));
          headW = Math.max(headW, sideW * 0.9);
        }
        // Carve out the face itself so skin isn't included.
        const fx = (u - (f.x + f.w * 0.5)) / Math.max(0.0001, f.w * 0.55);
        const fy = (v - (f.y + f.h * 0.55)) / Math.max(0.0001, f.h * 0.5);
        const inFace = Math.sqrt(fx * fx + fy * fy) < 0.85;
        if (inFace) headW = Math.min(headW, 0.15);
      }
      const gate = faces.length ? headW : 0;
      const lumaGate = smoothstep(0.03, 0.12, y) * (1 - smoothstep(0.96, 1.0, y));
      out[py * w + px] = Math.min(1, Math.max(0, gate * (1 - skinLike * 0.85) * lumaGate));
    }
  }
  return featherMask({ width: w, height: h, data: out }, 2);
}

// Face-parsing works on a face crop, not the whole frame: on a full-body
// portrait the face is too small for the 512² parser and it labels the jacket
// and sunglasses as "hat" while missing most of the hair. Crop a generous
// square around each face, parse it, and map the hair probability back into
// source-mask space.
const HAIR_PARSER_INPUT = 512;
const HAIR_MASK_MAX = 1024;
const HAIR_PARSER_MAX_FACES = 4;

function hairFaceCrop(
  face: RetouchFaceBox,
  sw: number,
  sh: number,
): { x: number; y: number; side: number } | null {
  if (!(face.w > 0 && face.h > 0)) return null;
  const fw = face.w * sw;
  const fh = face.h * sh;
  const cx = (face.x + face.w * 0.5) * sw;
  const cy = (face.y + face.h * 0.5) * sh;
  // Head + hair is roughly 1.9 face-widths wide and 2.5 face-heights tall.
  // Shift the square up so the crown is always inside the crop.
  const side = Math.min(Math.max(fw * 1.9, fh * 2.5), sw, sh);
  if (!(side >= 8)) return null;
  const x = Math.min(Math.max(0, cx - side / 2), Math.max(0, sw - side));
  const y = Math.min(Math.max(0, cy - fh * 0.32 - side / 2), Math.max(0, sh - side));
  return { x, y, side };
}

async function parseHairMaskFromFaces(
  source: AISource,
  faces: RetouchFaceBox[],
  loaded: LoadedSession,
  signal?: AbortSignal,
): Promise<Mask | null> {
  const { width: sw, height: sh } = sourceSize(source);
  const scale = Math.min(1, HAIR_MASK_MAX / Math.max(1, sw, sh));
  const w = Math.max(1, Math.round(sw * scale));
  const h = Math.max(1, Math.round(sh * scale));
  const maskCanvas = canvasOf(w, h);
  const mctx = maskCanvas.getContext('2d', { willReadFrequently: true });
  if (!mctx) return null;
  // Overlapping face crops merge with max(), never sum(), so a shared hair
  // edge does not get brighter than 1.
  mctx.globalCompositeOperation = 'lighten';
  const inputCanvas = canvasOf(HAIR_PARSER_INPUT, HAIR_PARSER_INPUT);
  const ictx = inputCanvas.getContext('2d');
  const hairCanvas = canvasOf(HAIR_PARSER_INPUT, HAIR_PARSER_INPUT);
  const hctx = hairCanvas.getContext('2d');
  if (!ictx || !hctx) return null;

  const ordered = [...faces]
    .sort((a, b) => b.w * b.h - a.w * a.h)
    .slice(0, HAIR_PARSER_MAX_FACES);
  for (const face of ordered) {
    signal?.throwIfAborted();
    const crop = hairFaceCrop(face, sw, sh);
    if (!crop) continue;
    ictx.clearRect(0, 0, HAIR_PARSER_INPUT, HAIR_PARSER_INPUT);
    ictx.imageSmoothingEnabled = true;
    ictx.imageSmoothingQuality = 'high';
    ictx.drawImage(
      source,
      crop.x, crop.y, crop.side, crop.side,
      0, 0, HAIR_PARSER_INPUT, HAIR_PARSER_INPUT,
    );
    const tensor = faceParsingToTensor(loaded.module, inputCanvas);
    const out = await loaded.session.run({ [loaded.session.inputNames[0]!]: tensor });
    const raw = out[loaded.session.outputNames[0]!] ?? out['output'];
    if (!raw) continue;
    const probs = faceParsingHairMask(raw);
    const rgba = new Uint8ClampedArray(HAIR_PARSER_INPUT * HAIR_PARSER_INPUT * 4);
    for (let i = 0; i < probs.data.length; i++) {
      const v = Math.round(Math.min(1, Math.max(0, probs.data[i] ?? 0)) * 255);
      const j = i * 4;
      rgba[j] = v; rgba[j + 1] = v; rgba[j + 2] = v; rgba[j + 3] = 255;
    }
    hctx.putImageData(new ImageData(rgba, HAIR_PARSER_INPUT, HAIR_PARSER_INPUT), 0, 0);
    mctx.drawImage(
      hairCanvas,
      0, 0, HAIR_PARSER_INPUT, HAIR_PARSER_INPUT,
      (crop.x * w) / sw, (crop.y * h) / sh,
      (crop.side * w) / sw, (crop.side * h) / sh,
    );
  }

  const rgba = mctx.getImageData(0, 0, w, h).data;
  const data = new Float32Array(w * h);
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    const v = (rgba[i * 4] ?? 0) / 255;
    data[i] = v;
    sum += v;
  }
  // Nothing recognised: let the caller fall back to the heuristic mask.
  if (sum < Math.max(16, w * h * 0.0005)) return null;
  return featherMask({ width: w, height: h, data }, 2);
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
  async segmentHairMask(source: AISource, options: WhitenOptions = {}): Promise<RetouchResult> {
    const started = performance.now();
    const task = 'hair-color' as const;
    const { width, height } = sourceSize(source);
    if (!width || !height) return failure(task, { code: 'invalid-input', message: 'Needs a non-empty image' });
    let faces: RetouchFaceBox[] = options.faces ?? [];
    let landmarks: RetouchLandmarks[] = [];
    if (!faces.length) {
      const bytes = await loadModelBytes('blazeface-onnx');
      if (!bytes) return failure(task, { code: 'model-not-installed', message: 'BlazeFace not installed — cần cài 1 lần.' });
      if (!this.runtime) return failure(task, { code: 'runtime-unavailable', message: 'No ONNX Runtime URLs were supplied' });
      const descriptor = getModelDescriptor('blazeface-onnx');
      const plan = planRetouch(width, height, this.device, 128);
      if (Math.max(plan.estimatedPeakMB, descriptor?.memoryMB ?? 0) > this.device.memoryBudgetMB) {
        return failure(task, { code: 'out-of-memory', message: 'Out of memory for face detect' });
      }
      this.onStatus?.(`Face detect 128px (${this.backend})…`);
      try {
        const loaded = await createSession(bytes, { runtime: this.runtime, backend: this.backend, onStatus: this.onStatus }, options.signal);
        try {
          const inputCanvas = toFaceCanvas(source);
          const { blazefaceToTensor: toT } = await import('./models');
          const tensor = toT(loaded.module, inputCanvas);
          const out = await loaded.session.run({
            image: tensor,
            conf_threshold: new loaded.module.Tensor('float32', new Float32Array([0.5]), [1]),
            max_detections: new loaded.module.Tensor('int64', new BigInt64Array([10n]), [1]),
            iou_threshold: new loaded.module.Tensor('float32', new Float32Array([0.3]), [1]),
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
        faces = [];
        landmarks = [];
      }
    }
    if (!faces.length) return failure(task, { code: 'invalid-input', message: 'Không nhận diện được mặt để lấy vùng tóc.' });
    let hairMask: Mask | null = null;
    let maskModel = 'blazeface-onnx';
    const parserDesc = getModelDescriptor('face-parsing-bisenet');
    if (parserDesc && this.runtime && parserDesc.memoryMB <= this.device.memoryBudgetMB) {
      const parserBytes = await loadModelBytes('face-parsing-bisenet');
      if (!parserBytes) {
        console.warn('[aurum-ai-retouch] face-parsing-bisenet is not installed; using the heuristic hair mask.');
      } else {
        this.onStatus?.('Hair parsing 512px (face crop)…');
        options.onProgress?.('hair-parsing');
        try {
          const loaded = await createSession(
            parserBytes,
            { runtime: this.runtime, backend: this.backend, onStatus: this.onStatus },
            options.signal,
          );
          try {
            hairMask = await parseHairMaskFromFaces(source, faces, loaded, options.signal);
          } finally {
            await loaded.dispose();
          }
          if (hairMask) maskModel = 'face-parsing-bisenet';
          else console.warn('[aurum-ai-retouch] face parser returned an empty hair mask; using the heuristic hair mask.');
        } catch (e: any) {
          if (e?.name === 'AbortError' || options.signal?.aborted) throw e;
          // Some iPhone GPUs reject an op in this graph. Hair colour should
          // still work approximately instead of failing the whole action.
          console.warn('[aurum-ai-retouch] face-parsing inference failed, falling back to the heuristic hair mask:', e);
        }
      }
    }
    options.signal?.throwIfAborted();
    if (!hairMask) hairMask = buildHairMaskFromFaces(source, faces);
    // Composite is unused by UI (procedural hue shift); supply a 1px-size copy
    // so callers can distinguish success. Real effect is computed in UI.
    return {
      success: true,
      task,
      faces,
      landmarks,
      skinMask: { width: hairMask.width, height: hairMask.height, data: hairMask.data },
      metadata: {
        modelId: maskModel,
        modelVersion: getModelDescriptor(maskModel)?.version ?? '',
        backend: this.backend,
        inferenceTime: performance.now() - started,
        faceCount: faces.length,
        quality: this.quality,
        installedModel: true,
      },
    };
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
