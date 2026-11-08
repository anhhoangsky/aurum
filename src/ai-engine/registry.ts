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
    id: 'birefnet-lite',
    version: '0.0.0-unpinned',
    label: 'BiRefNet Lite (background removal)',
    task: 'background-removal',
    source: '',
    sizeBytes: 0,
    sha256: '',
    license: 'MIT (upstream BiRefNet; verify per-artifact)',
    supportedBackends: ['webgpu', 'wasm'],
    inputResolutions: [512, 768, 1024],
    quantization: 'unknown',
    memoryMB: 256,
    status: 'descriptor-only',
    notes:
      'BLOCKER: pin the exact ONNX artifact and record official preprocessing ' +
      '(resize policy, normalization, output head) before Phase 2 inference. ' +
      'Community 512x512 ONNX mirrors exist; none is pinned here.',
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
