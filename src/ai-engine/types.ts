/**
 * Public API contracts for the Aurum AI Engine.
 *
 * The engine is a separate, opt-in subsystem: it never imports the editor UI,
 * never mutates editor state, and returns structured results. A result with
 * `success: false` and a machine-readable `error.code` is a normal outcome —
 * the engine MUST NOT fabricate masks when a model is absent or unsupported.
 */

export type AIQuality = 'low' | 'medium' | 'high' | 'professional';
/** low=512, medium=768, high=1024, professional=adaptive up to 1024. */
export type AIInputResolution = 512 | 768 | 1024;
export type AIBackend = 'webgpu' | 'wasm';
export type AITask =
  | 'background-removal'
  | 'background-replace'
  | 'background-blur'
  | 'person-segmentation'
  | 'instance-segmentation'
  | 'object-segmentation'
  | 'matting';

export interface AIError {
  code:
    | 'model-not-installed'
    | 'not-supported'
    | 'aborted'
    | 'out-of-memory'
    | 'checksum-mismatch'
    | 'runtime-unavailable'
    | 'invalid-input';
  message: string;
}

export interface AIMaskResult {
  /** Probability/alpha mask at `width`×`height` (values 0..1). */
  width: number;
  height: number;
  data: Float32Array;
}

export interface AIInstance {
  id: number;
  label: string;
  confidence: number;
  mask: AIMaskResult;
  /** Optional bounding box in source pixels. */
  box?: { x: number; y: number; w: number; h: number };
}

export interface AIResultMetadata {
  modelId: string;
  modelVersion: string;
  backend: AIBackend | 'none';
  inputResolution: [number, number];
  inferenceTime: number;
  quality: AIQuality;
  installedModel: boolean;
}

export interface AIResult {
  success: boolean;
  task: AITask;
  masks: AIMaskResult[];
  instances: AIInstance[];
  /** Original-resolution RGBA composite when the task produces one. */
  composite?: ImageData;
  metadata: AIResultMetadata;
  error?: AIError;
}

export interface AurumAIOptions {
  /** When true (default), inference MUST NOT use the network. */
  offline?: boolean;
  quality?: AIQuality;
  /** Override the probed backend (tests / forced fallback). */
  backend?: AIBackend;
}

export interface RemoveBackgroundOptions {
  resolution?: 'adaptive' | AIInputResolution;
  refineEdges?: boolean;
  preserveHair?: boolean;
  feather?: number;
  expand?: number;
  signal?: AbortSignal;
  onProgress?: (stage: string, done?: number, total?: number) => void;
}

export interface SegmentObjectsOptions {
  interactive?: boolean;
  point?: { x: number; y: number };
  box?: { x: number; y: number; w: number; h: number };
  signal?: AbortSignal;
}

export interface InstalledModel {
  id: string;
  version: string;
  bytes: number;
  sha256: string;
  installedAt: number;
}

export type AISource = ImageBitmap | HTMLImageElement | HTMLCanvasElement;

export interface AurumAI {
  readonly quality: AIQuality;
  readonly backend: AIBackend;
  removeBackground(source: AISource, options?: RemoveBackgroundOptions): Promise<AIResult>;
  replaceBackground(source: AISource, background: AISource, options?: RemoveBackgroundOptions): Promise<AIResult>;
  blurBackground(source: AISource, options?: RemoveBackgroundOptions): Promise<AIResult>;
  segmentPeople(source: AISource, options?: { signal?: AbortSignal }): Promise<AIResult>;
  segmentObjects(source: AISource, options?: SegmentObjectsOptions): Promise<AIResult>;
  getInstalledModels(): Promise<InstalledModel[]>;
  installModel(id: string, url: string, signal?: AbortSignal): Promise<InstalledModel>;
  dispose(): void;
}
