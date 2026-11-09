/**
 * Aurum AI Retouch — public contracts.
 *
 * Independent offline-first retouch subsystem (Meitu/Xingtu-class skin
 * smoothing/whitening/blemish/tone). Never imports editor UI or mutates
 * editor state; returns structured results the host can composite.
 * Honest states: missing model -> { success:false, error:{code:'model-not-installed'} }.
 */

export type RetouchTask =
  | 'skin-whitening'
  | 'skin-smoothing'
  | 'blemish-removal'
  | 'skin-tone';

export interface RetouchError {
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

export interface RetouchFaceBox {
  x: number; y: number; w: number; h: number; // normalized 0..1
  confidence?: number;
}

export interface RetouchLandmarks {
  eyeL: { x: number; y: number };
  eyeR: { x: number; y: number };
  nose: { x: number; y: number };
  mouth: { x: number; y: number };
}

export interface SkinMaskResult {
  width: number; height: number; // mask resolution (preview, max 640)
  data: Float32Array; // 0..1, skin weight per pixel
}

export interface RetouchMetadata {
  modelId: string;
  modelVersion: string;
  backend: 'webgpu' | 'wasm' | 'none';
  inferenceTime: number;
  faceCount: number;
  quality: string;
  installedModel: boolean;
}

export interface RetouchResult {
  success: boolean;
  task: RetouchTask;
  faces: RetouchFaceBox[];
  landmarks: RetouchLandmarks[];
  skinMask?: SkinMaskResult;
  /** Original-resolution RGBA composite when the task produces one. */
  composite?: ImageData;
  metadata: RetouchMetadata;
  error?: RetouchError;
}

export interface WhitenOptions {
  /** 0..1, default 0.5. Luminance boost on skin only. */
  strength?: number;
  /** User-supplied face boxes (normalized). If omitted, BlazeFace runs. */
  faces?: RetouchFaceBox[];
  signal?: AbortSignal;
  onProgress?: (stage: string, done?: number, total?: number) => void;
}

export interface InstalledModel {
  id: string; version: string; bytes: number; sha256: string; installedAt: number;
}

export type AISource = ImageBitmap | HTMLImageElement | HTMLCanvasElement;

export interface AurumRetouchOptions {
  quality?: 'low' | 'medium' | 'high' | 'professional';
  backend?: 'webgpu' | 'wasm';
  offline?: boolean;
}

export interface AurumRetouch {
  readonly quality: string;
  readonly backend: 'webgpu' | 'wasm';
  whitenSkin(source: AISource, options?: WhitenOptions): Promise<RetouchResult>;
  smoothSkinAI(source: AISource, options?: WhitenOptions): Promise<RetouchResult>;
  removeBlemish(source: AISource, options?: WhitenOptions): Promise<RetouchResult>;
  adjustSkinTone(source: AISource, options?: WhitenOptions): Promise<RetouchResult>;
  getInstalledModels(): Promise<InstalledModel[]>;
  installModel(id: string, url: string, signal?: AbortSignal): Promise<InstalledModel>;
  dispose(): void;
}
