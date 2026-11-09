/**
 * Model registry for AI Retouch. Only pinned artifacts with SHA-256 are
 * installable; anything else is descriptor-only/blocked and MUST refuse install.
 */

import type { RetouchTask } from './types';

export interface ModelDescriptor {
  id: string;
  version: string;
  label: string;
  task: RetouchTask | 'face-detection';
  source: string;
  sizeBytes: number;
  sha256: string;
  license: string;
  supportedBackends: readonly ('webgpu' | 'wasm')[];
  inputResolutions: readonly number[];
  quantization: 'fp32' | 'fp16' | 'int8' | 'unknown';
  memoryMB: number;
  status: 'descriptor-only' | 'installable' | 'blocked';
  notes: string;
}

export const MODEL_REGISTRY: readonly ModelDescriptor[] = [
  {
    id: 'blazeface-onnx',
    version: '1.0.0',
    label: 'BlazeFace ONNX (face detection, 128px)',
    task: 'face-detection',
    source: 'https://huggingface.co/garavv/blazeface-onnx/resolve/main/blaze.onnx',
    sizeBytes: 535_842,
    sha256: '564740c5146673c840257402cee8309161848e48e64d277a862ab4d501adf8a5',
    license: 'Apache-2.0 (MediaPipe, Google) — verify per-artifact',
    supportedBackends: ['webgpu', 'wasm'],
    inputResolutions: [128],
    quantization: 'fp32',
    memoryMB: 32,
    status: 'installable',
    notes: 'Pinned Phase 1. Inputs: image [1,3,128,128] RGB/255, conf_threshold [1] float, max_detections [1] int64, iou_threshold [1] float. Output selectedBoxes [1,16] = top_y,top_x,bot_y,bot_x, eyeL x/y, eyeR x/y, nose x/y, mouth x/y, earL x/y, earR x/y (HF README quick-start order, note y/x swapped in doc comment). Python ORT CPU smoke 2026-11-09: portrait.jpg → 1 box ~8 ms. iPhone WebGPU pending (Phase 6).',
  },
  {
    id: 'nafnet-gopro-w64',
    version: '0.0.0-unpinned',
    label: 'NAFNet GoPro width64 (restoration)',
    task: 'skin-smoothing',
    source: 'https://huggingface.co/deepghs/image_restoration/resolve/main/NAFNet-GoPro-width64.onnx',
    sizeBytes: 467_748_365,
    sha256: '',
    license: 'Apache-2.0 (megvii-research/NAFNet) — verify per-artifact',
    supportedBackends: ['webgpu', 'wasm'],
    inputResolutions: [512],
    quantization: 'fp32',
    memoryMB: 1024,
    status: 'blocked',
    notes: '467 MB HEAD 2026-11-09 — exceeds 512 MB iPhone WebGPU budget. Excluded. A width16/32 artifact may be revisited in Phase 2 after pinning exact bytes.',
  },
  {
    id: 'scunet-psnr',
    version: '0.0.0-unpinned',
    label: 'SCUNet (denoise)',
    task: 'skin-smoothing',
    source: 'https://huggingface.co/deepghs/image_restoration/resolve/main/SCUNet-PSNR.onnx',
    sizeBytes: 0,
    sha256: '',
    license: 'unknown — verify per-artifact',
    supportedBackends: ['webgpu', 'wasm'],
    inputResolutions: [512],
    quantization: 'fp32',
    memoryMB: 512,
    status: 'descriptor-only',
    notes: 'Candidate for Phase 2 smoothing. Needs size/SHA pin + smoke before installable.',
  },
  {
    id: 'lama-inpaint',
    version: '0.0.0-unpinned',
    label: 'LaMa (blemish inpainting)',
    task: 'blemish-removal',
    source: '',
    sizeBytes: 0,
    sha256: '',
    license: 'verify per-artifact',
    supportedBackends: ['webgpu', 'wasm'],
    inputResolutions: [512],
    quantization: 'fp32',
    memoryMB: 384,
    status: 'descriptor-only',
    notes: 'Phase 3 candidate. No verified ONNX artifact pinned yet; install must refuse until SHA-256 recorded.',
  },
] as const;

export function getModelDescriptor(id: string): ModelDescriptor | undefined {
  return MODEL_REGISTRY.find((m) => m.id === id);
}
export function listModels(): readonly ModelDescriptor[] {
  return MODEL_REGISTRY;
}
