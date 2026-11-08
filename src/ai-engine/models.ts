/**
 * Model adapters: the boundary between the generic runtime and one model's
 * preprocessing/output head. A model is only usable when its adapter is
 * registered AND its bytes are installed. Until BiRefNet preprocessing is
 * validated against the official code (docs/ai-engine/model-selection.md),
 * no adapter is registered — `removeBackground()` reports
 * `model-not-installed` instead of guessing.
 */

import type { Mask } from './mask';
import type { OrtTensor } from './runtime';

export interface ModelAdapter {
  id: string;
  /** Native input edge (e.g. 512 / 768 / 1024). */
  inputSize: number;
  /** RGBA canvas (square, inputSize) -> NCHW float32 tensor. */
  toTensor(module: { Tensor: new (t: 'float32', d: Float32Array, dims: readonly number[]) => OrtTensor }, input: HTMLCanvasElement): OrtTensor;
  /** Output tensor -> probability mask at inputSize resolution. */
  fromTensor(output: OrtTensor, inputSize: number): Mask;
}

const adapters = new Map<string, ModelAdapter>();

export function registerModelAdapter(adapter: ModelAdapter): void {
  adapters.set(adapter.id, adapter);
}

export function getModelAdapter(id: string): ModelAdapter | undefined {
  return adapters.get(id);
}

export function listModelAdapters(): ModelAdapter[] {
  return Array.from(adapters.values());
}
