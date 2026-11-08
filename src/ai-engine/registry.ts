/**
 * Model registry. Every entry describes one installable artifact.
 *
 * `sha256: ''` means "not yet pinned" — such a model MUST NOT be installed
 * until the checksum of the exact bytes is recorded (see docs/ai-engine/
 * model-selection.md). The registry never trusts remote metadata blindly:
 * install verifies the downloaded bytes against `sha256` (cache.ts).
 */

import type { AIBackend, AITask } from './types';

export interface ModelDescriptor {
  id: string;
  version: string;
  label: string;
  task: AITask;
  /** Download URL (trusted CDN). Empty until the artifact is pinned. */
  source: string;
  /** Expected size in bytes; 0 = unknown. */
  sizeBytes: number;
  /** Lowercase hex SHA-256 of the exact bytes; '' = not pinned. */
  sha256: string;
  license: string;
  supportedBackends: readonly AIBackend[];
  inputResolutions: readonly number[];
  quantization: 'fp32' | 'fp16' | 'int8' | 'unknown';
  /** Estimated peak inference memory in MiB (single job, incl. runtime). */
  memoryMB: number;
  status: 'descriptor-only' | 'installable' | 'blocked';
  notes: string;
}

export const MODEL_REGISTRY: readonly ModelDescriptor[] = [
  {
    id: 'birefnet-lite-512-fp16',
    version: '1.0.0+962e679',
    label: 'BiRefNet Lite 512 (background removal, fp16)',
    task: 'background-removal',
    source:
      'https://huggingface.co/studioludens/birefnet-lite-512/resolve/main/onnx/model_fp16.onnx',
    sizeBytes: 98_484_532,
    // Verified locally 2026-11-09: matches the HF LFS oid and the
    // X-Linked-ETag of the resolved file. Re-verify before trusting.
    sha256: 'eff9216bb2f9d3f023d9c2b7196845a7485739ab1f231593633e4d2344ffc516',
    license: 'MIT (studioludens/birefnet-lite-512; upstream ZhengPeng7/BiRefNet_lite)',
    supportedBackends: ['webgpu', 'wasm'],
    inputResolutions: [512],
    quantization: 'fp16',
    memoryMB: 384,
    status: 'installable',
    notes:
      'Pinned Phase 2 artifact. Fixed 512x512 input (1024 OOMs in every browser ' +
      'backend per the model card). Preprocessing from preprocessor_config.json: ' +
      'resize 512x512, rescale 1/255, ImageNet mean [0.485,0.456,0.406] ' +
      'std [0.229,0.224,0.225], NCHW, tensor name input_image. Output logits ' +
      '[1,1,512,512] -> sigmoid -> bilinear to original size. ' +
      'Python/ORT CPU smoke 2026-11-09: portrait alpha mean 0.508, ~2.5s desktop CPU.',
  },
  {
    id: 'birefnet-lite-512-fp32',
    version: '1.0.0+962e679',
    label: 'BiRefNet Lite 512 (background removal, fp32)',
    task: 'background-removal',
    source:
      'https://huggingface.co/studioludens/birefnet-lite-512/resolve/main/onnx/model.onnx',
    sizeBytes: 191_877_254,
    sha256: '1cb0fb360dadd15af77c639085d77a9df67db0c64315560c3de005f676345ac2',
    license: 'MIT (studioludens/birefnet-lite-512; upstream ZhengPeng7/BiRefNet_lite)',
    supportedBackends: ['webgpu', 'wasm'],
    inputResolutions: [512],
    quantization: 'fp32',
    memoryMB: 512,
    status: 'installable',
    notes:
      'Same weights as the fp16 variant at 2x download size. Python/ORT CPU ' +
      'smoke matches fp16 to 3 decimals. Prefer fp16 on iPhone; fp32 is the ' +
      'fallback for backends without fp16 support.',
  },
  {
    id: 'longpipe-xl',
    version: '0.0.0-unpinned',
    label: 'LongPipe XL (person matting)',
    task: 'matting',
    source: '',
    sizeBytes: 0,
    sha256: '',
    license: 'unknown',
    supportedBackends: ['webgpu', 'wasm'],
    inputResolutions: [512, 768, 1024],
    quantization: 'unknown',
    memoryMB: 320,
    status: 'blocked',
    notes:
      'BLOCKER: no public LongPipe XL artifact (weights/license/ONNX) could be ' +
      'verified. Fallback order if unobtainable: MODNet -> BackgroundMattingV2. ' +
      'See docs/ai-engine/model-selection.md §B.',
  },
  {
    id: 'mobilesam',
    version: '0.0.0-unpinned',
    label: 'MobileSAM (interactive object segmentation)',
    task: 'object-segmentation',
    source: '',
    sizeBytes: 0,
    sha256: '',
    license: 'Apache-2.0 (MobileSAM) / verify per-artifact',
    supportedBackends: ['webgpu', 'wasm'],
    inputResolutions: [1024],
    quantization: 'unknown',
    memoryMB: 256,
    status: 'descriptor-only',
    notes: 'Phase 4. Promptable still-image segmentation (point/box).',
  },
  {
    id: 'edgetam',
    version: '0.0.0-unpinned',
    label: 'EdgeTAM (on-device promptable segmentation)',
    task: 'object-segmentation',
    source: '',
    sizeBytes: 0,
    sha256: '',
    license: 'verify per-artifact',
    supportedBackends: ['webgpu', 'wasm'],
    inputResolutions: [1024],
    quantization: 'unknown',
    memoryMB: 320,
    status: 'descriptor-only',
    notes: 'Phase 4. SAM 2 derivative optimized for on-device tracking/segmentation.',
  },
  {
    id: 'mediapipe-selfie',
    version: '0.0.0-unpinned',
    label: 'MediaPipe Selfie Segmentation (baseline)',
    task: 'person-segmentation',
    source: '',
    sizeBytes: 447_000,
    sha256: '',
    license: 'verify per-artifact',
    supportedBackends: ['wasm'],
    inputResolutions: [256],
    quantization: 'fp32',
    memoryMB: 32,
    status: 'descriptor-only',
    notes:
      'Low-profile fallback and benchmark floor. Binary semantic mask only — ' +
      'NOT alpha matting and NOT per-instance separation.',
  },
] as const;

export function getModelDescriptor(id: string): ModelDescriptor | undefined {
  return MODEL_REGISTRY.find((m) => m.id === id);
}

export function listModels(): readonly ModelDescriptor[] {
  return MODEL_REGISTRY;
}
