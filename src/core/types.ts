export type AspectId = 'free' | '1:1' | '4:3' | '3:4' | '16:9' | '9:16' | 'screen';

/**
 * Scalar adjustments. Every value is expressed in "editor units" (-100..100
 * unless noted) so it can be serialised, diffed and shown in the UI without
 * knowing how the renderer maps it to a shader uniform.
 *
 * The original six keys keep their meaning and their order; new keys are
 * additive so states saved by older builds still load unchanged.
 */
export interface Adjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  exposure: number;
  warmth: number;
  vignette: number;
  /** Recovery/boost of the upper tonal range. */
  highlights: number;
  /** Recovery/boost of the lower tonal range. */
  shadows: number;
  /** White point, positive lifts the brightest pixels. */
  whites: number;
  /** Black point, positive lifts the darkest pixels. */
  blacks: number;
  /** Green (-) / magenta (+) white-balance correction. */
  tint: number;
  /** Saturation boost weighted towards already-muted colours. */
  vibrance: number;
  /** Mid-tone gamma, -100 = darker mid-tones, +100 = brighter. */
  gamma: number;
  /** Local contrast (unsharp mask on luminance, halo-limited). */
  clarity: number;
  /** Small-radius output sharpening. 0..100. */
  sharpen: number;
  /** Edge-aware luminance denoise. 0..100. */
  denoise: number;
  /** Portrait skin smoothing, edge-aware. 0..100. */
  smoothSkin: number;
  /** Blemish/spot removal strength, 0..100. */
  blemish: number;
  /** Skin texture preservation, 0..100. Higher keeps more pore/detail. */
  skinTexture: number;
  /** Skin hue/tone correction, -100 = cooler, +100 = warmer. */
  skinTone: number;
  /** Face-width shaping, -100 = wider, +100 = slimmer. */
  faceSlim: number;
  /** Lower-face/jaw shaping, -100 = wider, +100 = slimmer. */
  jawline: number;
  /** Chin length, -100 = shorter, +100 = longer. */
  chin: number;
  /** Eye size, -100 = smaller, +100 = larger. */
  eyeSize: number;
  /** Nose size, -100 = smaller, +100 = larger. */
  noseSize: number;
  /** Mouth size, -100 = smaller, +100 = larger. */
  mouthSize: number;
}

export interface TransformState {
  /** Zoom relative to the "cover" scale. 1 = image covers the viewport. */
  zoom: number;
  /** Quarter turns applied by the ±90° buttons, 0..3. */
  turn: number;
  /** Fine rotation in degrees, -180..180. Does not include `turn`. */
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  /**
   * Pan offsets in image-local normalized units (the image quad is -1..1).
   * Keeping them local makes the bounds trivially axis-aligned under rotation.
   */
  offsetX: number;
  offsetY: number;
  /**
   * Z-axis perspective correction, -100..100. Positive `perspectiveY` brings
   * the top edge towards the viewer (it grows), positive `perspectiveX` brings
   * the left edge towards the viewer. Both are applied in source-image space
   * before the crop transform, so preview and export stay pixel-identical.
   */
  perspectiveX: number;
  perspectiveY: number;
}

export interface CropState {
  aspect: AspectId;
  /** Width / height of the free-form frame. */
  ratio: number;
  /** Frame size relative to the largest centered frame for the current ratio. */
  scale: number;
}

export interface CurvePoint {
  x: number;
  y: number;
}

export type CurveChannel = 'rgb' | 'r' | 'g' | 'b';

/** Points are normalised to 0..1 and sorted by x. */
export interface CurveState {
  rgb: CurvePoint[];
  r: CurvePoint[];
  g: CurvePoint[];
  b: CurvePoint[];
}

export interface HSLBandState {
  /** -100..100, mapped to roughly ±30°. */
  hue: number;
  /** -100..100. */
  saturation: number;
  /** -100..100. */
  luminance: number;
}

export type HSLBandId =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'aqua'
  | 'blue'
  | 'purple'
  | 'magenta';

export type HSLState = Record<HSLBandId, HSLBandState>;

/**
 * Non-scalar colour pipeline state. Kept in the same `version: 1` envelope so
 * existing exports keep loading; missing fields are filled with defaults.
 */
export interface EnhanceState {
  curves: CurveState;
  hsl: HSLState;
  /** Built-in procedural 3D LUT id, or `none`. */
  lut: string;
  /** 0..100. */
  lutStrength: number;
  /** Informational: the last Auto Enhance run produced the current scalars. */
  auto: boolean;
}

/**
 * One liquify dab in source-image UV space. `dx/dy` is the drag displacement
 * in UV units, not screen pixels, so preview and full-resolution export move
 * the same pixels. `radius` is measured on the source width.
 */
export interface LiquifyDab {
  x: number;
  y: number;
  dx: number;
  dy: number;
  /** Brush radius in width-normalised UV units. */
  radius: number;
}

export interface RetouchState {
  liquify: LiquifyDab[];
}

/** Small RGBA8 displacement texture; RG = signed source-UV offset. */
export interface LiquifyField {
  width: number;
  height: number;
  data: Uint8Array;
  /** Maximum displacement encoded in RG, in source-UV units. */
  shift: number;
}

export interface EditorState {
  version: 1;
  transform: TransformState;
  crop: CropState;
  adjust: Adjustments;
  filter: string;
  enhance: EnhanceState;
  /** Geometry retouch data. Optional so older saved states still load. */
  retouch?: RetouchState;
}

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface FrameRect extends Size {
  x: number;
  y: number;
}

export interface Quad {
  tl: Point;
  tr: Point;
  br: Point;
  bl: Point;
}

/** Normalised projective coefficients used by the renderer. */
export interface PerspectiveWarp {
  /** Vertical tilt. Positive grows the top edge. */
  a: number;
  /** Horizontal tilt. Positive grows the left edge. */
  b: number;
}

export type ImageSource =
  | string
  | Blob
  | File
  | ImageBitmap
  | HTMLImageElement
  | HTMLCanvasElement;

export type ExportMime = 'image/jpeg' | 'image/webp' | 'image/png';

export interface ExportProgress {
  phase: 'render' | 'encode';
  /** 0..1 across the whole export. */
  progress: number;
  tile: number;
  tiles: number;
}

export interface ExportOptions {
  type?: ExportMime | string;
  quality?: number;
  /** Called after every rendered tile and once before encoding. */
  onProgress?: (progress: ExportProgress) => void;
  /** Abort a long studio export. The promise rejects with an AbortError. */
  signal?: AbortSignal;
  /** Tile edge in output pixels. Defaults to 2048. */
  tileSize?: number;
}

export interface SetStateOptions {
  history?: boolean;
  silent?: boolean;
}

/** Normalised face box in source-image coordinates (0..1, top-left origin). */
export interface FaceBox {
  x: number;
  y: number;
  w: number;
  h: number;
  confidence?: number;
}

/**
 * One refined face from the optional landmark module. Feature points and
 * radii use the renderer's face-local space: the face box maps to -1..1
 * across its half-width and half-height. The core packs these values into a
 * 4x4 RGBA8 texture, so adding landmarks does not change the draw-call count.
 *
 * Everything is optional in practice: callers that only have a face box keep
 * using `setFaces()` and the shader's built-in feature anchors.
 */
export interface FaceAnchor {
  /** Tight face box derived from the landmark mesh. */
  box: FaceBox;
  /** Eye centres, image-left first. */
  eyeL: Point;
  eyeR: Point;
  nose: Point;
  mouth: Point;
  /** Elliptical influence radii for each feature, in face-local units. */
  eyeLRadius: Point;
  eyeRRadius: Point;
  noseRadius: Point;
  mouthRadius: Point;
  /** Larger values win when more than four faces are supplied. */
  confidence?: number;
}

export interface AutoAnalysis {
  width: number;
  height: number;
  mean: number;
  median: number;
  p1: number;
  p5: number;
  p95: number;
  p99: number;
  clipLow: number;
  clipHigh: number;
  meanR: number;
  meanG: number;
  meanB: number;
  /** Mean HSL saturation, 0..1. */
  saturation: number;
  /** Estimated luma noise sigma in flat areas, 0..1. */
  noise: number;
  /** Mean absolute Laplacian, 0..1. */
  sharpness: number;
  /** Fraction of skin-coloured pixels, 0..1. */
  skinRatio: number;
  faceCount: number;
}

export interface AutoResult {
  adjust: Adjustments;
  analysis: AutoAnalysis;
  /** Machine-readable hints for the UI, e.g. `low-light`, `portrait`. */
  notes: string[];
}

export interface EditorEvents {
  ready: { width: number; height: number };
  change: EditorState;
  history: { canUndo: boolean; canRedo: boolean };
  render: { frame: FrameRect };
  loading: { loading: boolean };
  error: { error: Error };
  export: { blob: Blob };
  auto: AutoResult;
}

export type EventName = keyof EditorEvents;
export type EventHandler<K extends EventName> = (payload: EditorEvents[K]) => void;

export interface ColorTransform {
  /** Row-major 3x3. */
  matrix: number[];
  offset: number[];
}

/**
 * Maps crop-screen coordinates to stage coordinates. Crop mode uses the
 * identity view; Adjust/Filter use a contain view so the crop fills the stage.
 */
export interface ViewTransform {
  scale: number;
  x: number;
  y: number;
}

export interface BeautyMask {
  width: number;
  height: number;
  /** RGBA8. R = skin, G = protected features, B = lips, A = 255. */
  data: Uint8Array;
}

/**
 * Everything the fragment shader needs beyond geometry. Numeric fields are
 * already normalised to the shader's working range; `curve` and `lut` are
 * packed texture payloads (see `enhance/curves.ts` and `enhance/lut.ts`).
 */
export interface EnhanceSpec {
  exposure: number;
  brightness: number;
  contrast: number;
  saturation: number;
  highlights: number;
  shadows: number;
  whites: number;
  blacks: number;
  /** White-balance warmth, -1..1. Applied before exposure, in linear space. */
  warmth: number;
  tint: number;
  vibrance: number;
  gamma: number;
  clarity: number;
  sharpen: number;
  denoise: number;
  smoothSkin: number;
  /** Blemish/spot removal strength, 0..1. */
  blemish: number;
  /** Skin texture preservation, 0..1. */
  skinTexture: number;
  skinTone: number;
  /** Face-width shaping, -1..1. */
  faceSlim: number;
  /** Lower-face/jaw shaping, -1..1. */
  jawline: number;
  /** Chin length, -1..1. */
  chin: number;
  /** Eye size, -1..1. */
  eyeSize: number;
  /** Nose size, -1..1. */
  noseSize: number;
  /** Mouth size, -1..1. */
  mouthSize: number;
  /** 256x1 RGBA curve LUT, or null when every curve is linear. */
  curve: Uint8Array | null;
  /** size^3 RGBA LUT atlas, or null when no LUT is active. */
  lut: Uint8Array | null;
  lutSize: number;
  lutStrength: number;
  /** Up to four `[cx, cy, rx, ry]` face ellipses in image UV space. */
  faces: Float32Array | null;
  faceCount: number;
  /**
   * Optional 4x4 RGBA8 landmark-anchor texture. Row = face, columns =
   * eye/nose/mouth positions and radii, encoded by `packFaceAnchors()`.
   */
  anchors: Uint8Array | null;
  /** Eight `[hue, saturation, luminance]` triples for the HSL mixer. */
  hsl: Float32Array | null;
  /** Optional beauty mask generated by the lazy Beauty module. */
  mask: BeautyMask | null;
  /** Optional liquify displacement field. */
  liquify: LiquifyField | null;
  /** 1 = hybrid linear-light pipeline, 0 = legacy sRGB pipeline. */
  linear: number;
  /** 0..1 output dither strength. */
  dither: number;
  /** 0 = fast preview taps, 1 = high-quality export taps. */
  quality: number;
}

export interface PreviewSpec {
  width: number;
  height: number;
  srcWidth: number;
  srcHeight: number;
  sx: number;
  sy: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
  warp: PerspectiveWarp;
  view: ViewTransform;
  /** Screen rectangle the vignette is centred on (crop frame or displayed crop). */
  vignetteRect: FrameRect;
  /** Result mode clips the image to the displayed crop; crop mode leaves it open. */
  clipRect: FrameRect | null;
  color: ColorTransform;
  css: string;
  vignette: number;
  enhance: EnhanceSpec;
  /** Image-UV distance covered by one output pixel, per image axis. */
  texel: [number, number];
  dpr: number;
}

export interface ExportSpec {
  width: number;
  height: number;
  quad: Quad;
  warp: PerspectiveWarp;
  srcWidth: number;
  srcHeight: number;
  color: ColorTransform;
  css: string;
  vignette: number;
  enhance: EnhanceSpec;
  /** Image-UV distance covered by one output pixel, per image axis. */
  texel: [number, number];
}
