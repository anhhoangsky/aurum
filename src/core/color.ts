import type {
  Adjustments,
  BeautyMask,
  ColorTransform,
  EnhanceSpec,
  EnhanceState,
  FaceAnchor,
  FaceBox,
  LiquifyField,
  Point,
} from './types';
import { clamp } from './state';
import { buildCurveLUT } from './enhance/curves';
import { LUT_SIZE } from './enhance/lut';

const IDENTITY = [1, 0, 0, 0, 1, 0, 0, 0, 1];
const ZERO = [0, 0, 0];

export function multiplyMatrix(a: number[], b: number[]): number[] {
  const out = new Array<number>(9);
  for (let row = 0; row < 3; row += 1) {
    const r = row * 3;
    for (let col = 0; col < 3; col += 1) {
      out[r + col] =
        (a[r] || 0) * (b[col] || 0) +
        (a[r + 1] || 0) * (b[3 + col] || 0) +
        (a[r + 2] || 0) * (b[6 + col] || 0);
    }
  }
  return out;
}

export function multiplyVector(m: number[], v: number[]): number[] {
  return [
    (m[0] || 0) * v[0] + (m[1] || 0) * v[1] + (m[2] || 0) * v[2],
    (m[3] || 0) * v[0] + (m[4] || 0) * v[1] + (m[5] || 0) * v[2],
    (m[6] || 0) * v[0] + (m[7] || 0) * v[1] + (m[8] || 0) * v[2],
  ];
}

/** Combine two color transforms: apply `before`, then `after`. */
export function compose(after: ColorTransform, before: ColorTransform): ColorTransform {
  const matrix = multiplyMatrix(after.matrix, before.matrix);
  const rotated = multiplyVector(after.matrix, before.offset);
  return {
    matrix,
    offset: [
      rotated[0] + after.offset[0],
      rotated[1] + after.offset[1],
      rotated[2] + after.offset[2],
    ],
  };
}

export function identityColor(): ColorTransform {
  return { matrix: IDENTITY.slice(), offset: ZERO.slice() };
}

function gains(r: number, g: number, b: number, o: number[] = ZERO): ColorTransform {
  return { matrix: [r, 0, 0, 0, g, 0, 0, 0, b], offset: o.slice() };
}

function saturationColor(value: number): ColorTransform {
  const s = Math.max(0, 1 + value);
  const lr = 0.2126;
  const lg = 0.7152;
  const lb = 0.0722;
  const inv = 1 - s;
  return {
    matrix: [
      lr * inv + s, lg * inv, lb * inv,
      lr * inv, lg * inv + s, lb * inv,
      lr * inv, lg * inv, lb * inv + s,
    ],
    offset: ZERO.slice(),
  };
}

function contrastColor(value: number): ColorTransform {
  const c = Math.max(0.05, 1 + value);
  return { matrix: [c, 0, 0, 0, c, 0, 0, 0, c], offset: [0.5 * (1 - c), 0.5 * (1 - c), 0.5 * (1 - c)] };
}

function brightnessColor(value: number): ColorTransform {
  const add = value * 0.22;
  return { matrix: IDENTITY.slice(), offset: [add, add, add] };
}

function exposureColor(value: number): ColorTransform {
  const factor = Math.pow(2, value);
  return { matrix: [factor, 0, 0, 0, factor, 0, 0, 0, factor], offset: ZERO.slice() };
}

function warmthColor(value: number): ColorTransform {
  return gains(1 + value * 0.16, 1 + value * 0.03, 1 - value * 0.16);
}

export type PresetCategory = 'root' | 'meitu' | 'xingtu' | 'lr' | 'mono';

export interface Preset {
  id: string;
  label: string;
  labelEn: string;
  color: ColorTransform;
  css: string;
  /** Tone family for the filter rail. `root` = built-in editor tones. */
  category: PresetCategory;
  /** Hint shown in the tone detail strip (procedural approx, not proprietary LUT). */
  hint?: string;
}

function preset(
  id: string,
  label: string,
  labelEn: string,
  color: ColorTransform,
  css: string,
  category: PresetCategory,
  hint?: string,
): Preset {
  return { id, label, labelEn, color, css, category, hint };
}

export const PRESETS: Preset[] = [
  preset('original', 'Nguyên bản', 'Original', identityColor(), '', 'root', 'Không đổi màu'),
  preset(
    'vivid',
    'Sống động',
    'Vivid',
    compose(contrastColor(0.08), saturationColor(0.38)),
    'saturate(1.38) contrast(1.08)',
    'root',
  ),
  preset(
    'dramatic',
    'Kịch tính',
    'Dramatic',
    compose(
      { matrix: [1.05, 0, 0, 0, 1.02, 0, 0, 0, 1.08], offset: [-0.012, -0.008, 0.012] },
      compose(contrastColor(0.27), saturationColor(-0.18)),
    ),
    'contrast(1.27) saturate(0.82)',
    'root',
  ),
  preset(
    'mono',
    'Đen trắng',
    'Mono',
    compose(contrastColor(0.1), saturationColor(-1)),
    'grayscale(1) contrast(1.1)',
    'mono',
  ),
  preset(
    'vintage',
    'Cổ điển',
    'Vintage',
    {
      matrix: [
        0.92, 0.32, 0.08,
        0.14, 0.86, 0.11,
        0.06, 0.19, 0.72,
      ],
      offset: [0.035, 0.02, 0],
    },
    'sepia(0.42) saturate(0.86) contrast(0.95)',
    'root',
  ),
  preset('warm', 'Ấm', 'Warm', gains(1.12, 1.02, 0.88), 'sepia(0.18) saturate(1.06) brightness(1.02)', 'root'),
  preset('cool', 'Lạnh', 'Cool', gains(0.9, 1, 1.16), 'saturate(0.96) hue-rotate(-8deg) brightness(1.01)', 'root'),
  // ---- Meitu-inspired (procedural, skin-friendly) ----
  preset(
    'meitu-natural',
    'Tự nhiên',
    'Natural',
    compose(gains(1.04, 1.02, 0.98), saturationColor(0.12)),
    'brightness(1.03) saturate(1.12) sepia(0.08)',
    'meitu',
    'Meitu · Sáng nhẹ, giữ tông da tự nhiên',
  ),
  preset(
    'meitu-korea',
    'Hàn Quốc',
    'Korea',
    compose(gains(1.06, 1.0, 0.98), saturationColor(0.15)),
    'brightness(1.06) saturate(1.15) contrast(0.97)',
    'meitu',
    'Meitu · Da hồng sáng, tương phản mềm',
  ),
  preset(
    'meitu-japan',
    'Nhật Bản',
    'Japan',
    compose(gains(1.03, 1.01, 1.02), contrastColor(-0.08)),
    'brightness(1.03) saturate(1.06) contrast(0.92)',
    'meitu',
    'Meitu · Trong vắt, đỡ gắt',
  ),
  preset(
    'meitu-skin',
    'Sáng da',
    'Bright Skin',
    compose(gains(1.05, 1.03, 0.99), brightnessColor(0.14)),
    'brightness(1.07) saturate(1.05)',
    'meitu',
    'Meitu · Nâng sáng vùng da, giữ chi tiết',
  ),
  preset(
    'meitu-pink',
    'Hồng đào',
    'Peach Pink',
    compose(gains(1.07, 0.99, 0.97), saturationColor(0.2)),
    'saturate(1.2) brightness(1.04)',
    'meitu',
    'Meitu · Hồng ấm, hợp chân dung',
  ),
  preset(
    'meitu-white',
    'Trắng sáng',
    'Bright White',
    compose(gains(1.08, 1.08, 1.08), saturationColor(-0.05)),
    'brightness(1.08) saturate(0.95)',
    'meitu',
    'Meitu · Sáng tinh khôi, giảm bão hoà nhẹ',
  ),
  // ---- Xingtu / Hypic-inspired (film & city) ----
  preset(
    'xingtu-film',
    'Điện ảnh',
    'Cinematic',
    compose(gains(0.97, 1.02, 1.07), compose(contrastColor(0.12), saturationColor(0.05))),
    'contrast(1.12) saturate(1.05) hue-rotate(-6deg)',
    'xingtu',
    'Xingtu · Teal–orange mềm, hợp đường phố',
  ),
  preset(
    'xingtu-hk',
    'Hồng Kông',
    'Hong Kong',
    compose(gains(1.02, 1.0, 1.04), compose(contrastColor(0.1), saturationColor(-0.08))),
    'contrast(1.1) saturate(0.92) hue-rotate(4deg)',
    'xingtu',
    'Xingtu · Đêm đô thị, xanh lạnh',
  ),
  preset(
    'xingtu-showa',
    'Chiêu Hoà',
    'Showa',
    compose(gains(1.04, 1.0, 0.93), compose(contrastColor(-0.05), saturationColor(-0.15))),
    'sepia(0.22) saturate(0.85) contrast(0.95)',
    'xingtu',
    'Xingtu · Hoài cổ, phai màu nhẹ',
  ),
  preset(
    'xingtu-kama',
    'Kamakura',
    'Kamakura',
    compose(gains(1.06, 1.02, 0.9), saturationColor(0.1)),
    'brightness(1.05) sepia(0.2) saturate(1.1)',
    'xingtu',
    'Xingtu · Bình minh biển, ấm sáng',
  ),
  preset(
    'xingtu-night',
    'Ban đêm',
    'Night',
    compose(gains(0.94, 0.98, 1.08), compose(contrastColor(0.08), saturationColor(-0.05))),
    'brightness(0.96) contrast(1.08) hue-rotate(-10deg)',
    'xingtu',
    'Xingtu · Đêm sâu, giữ bóng tối',
  ),
  preset(
    'xingtu-morning',
    'Buổi sáng',
    'Morning',
    compose(gains(1.07, 1.04, 0.93), saturationColor(0.08)),
    'brightness(1.05) sepia(0.14) saturate(1.08)',
    'xingtu',
    'Xingtu · Nắng sớm, ấm và trong',
  ),
  // ---- Adobe Lightroom-inspired ----
  preset(
    'lr-cinema',
    'Cinematic',
    'Cinematic',
    compose(gains(0.98, 1.02, 1.06), compose(contrastColor(0.15), saturationColor(0.05))),
    'contrast(1.15) saturate(1.05) hue-rotate(-8deg)',
    'lr',
    'Lightroom · Điện ảnh tương phản mạnh',
  ),
  preset(
    'lr-moody',
    'Moody',
    'Moody',
    compose(gains(0.97, 0.98, 1.02), compose(contrastColor(0.18), saturationColor(-0.15))),
    'contrast(1.18) saturate(0.85) brightness(0.97)',
    'lr',
    'Lightroom · Ẩm ướt, bóng gắt',
  ),
  preset(
    'lr-vibrant',
    'Vibrant',
    'Vibrant',
    compose(contrastColor(0.05), saturationColor(0.35)),
    'saturate(1.35) contrast(1.05)',
    'lr',
    'Lightroom · Màu rực, hợp phong cảnh',
  ),
  preset(
    'lr-pastel',
    'Pastel',
    'Pastel',
    compose(gains(1.03, 1.03, 1.03), compose(contrastColor(-0.1), saturationColor(0.1))),
    'brightness(1.04) contrast(0.9) saturate(1.1)',
    'lr',
    'Lightroom · Nhẹ, trong, chữ chụp đồ',
  ),
  preset(
    'lr-desert',
    'Sa mạc',
    'Desert',
    compose(gains(1.08, 1.0, 0.88), saturationColor(0.15)),
    'sepia(0.28) saturate(1.15) contrast(1.04)',
    'lr',
    'Lightroom · Vàng cát ấm',
  ),
  preset(
    'lr-street',
    'Đường phố',
    'Street',
    compose(contrastColor(0.2), saturationColor(-0.1)),
    'contrast(1.2) saturate(0.9)',
    'lr',
    'Lightroom · Grit, hợp street life',
  ),
  preset(
    'lr-faded',
    'Mờ phai',
    'Faded',
    compose(gains(1.02, 1.02, 1.02), compose(contrastColor(-0.12), saturationColor(-0.15))),
    'brightness(1.03) contrast(0.88) saturate(0.85)',
    'lr',
    'Lightroom · Film phai, giảm tương phản',
  ),
  preset(
    'lr-teal',
    'Teal',
    'Teal',
    compose(gains(0.93, 1.04, 1.07), saturationColor(0.1)),
    'hue-rotate(-14deg) saturate(1.1) contrast(1.05)',
    'lr',
    'Lightroom · Xanh teal mát',
  ),
  preset(
    'mono-warm',
    'Đen trắng ấm',
    'Mono Warm',
    compose(gains(1.06, 1.02, 0.94), saturationColor(-1)),
    'grayscale(1) sepia(0.18) contrast(1.06)',
    'mono',
    'Đen trắng · Ấm hạt',
  ),
  preset(
    'mono-cool',
    'Đen trắng lạnh',
    'Mono Cool',
    compose(gains(0.94, 0.98, 1.06), saturationColor(-1)),
    'grayscale(1) hue-rotate(-10deg) contrast(1.06)',
    'mono',
    'Đen trắng · Lạnh, gắt',
  ),
];

export function presetById(id: string): Preset {
  return PRESETS.find((item) => item.id === id) || PRESETS[0];
}

/**
 * The shader applies exposure/brightness/contrast/saturation/tone itself, so
 * the matrix uploaded for the render path contains only the preset and the
 * temperature gain. `buildColorTransform()` below is kept as the public
 * single-matrix helper for consumers that only need a 3x3 approximation.
 */
export function buildPresetColor(filter: string, warmth: number): ColorTransform {
  let result = presetById(filter).color;
  if (warmth !== 0) result = compose(warmthColor(warmth / 100), result);
  return result;
}

/**
 * Build the single matrix uploaded to the shader:
 * preset -> exposure -> brightness -> contrast -> saturation -> warmth.
 */
export function buildColorTransform(adjust: Adjustments, filter: string): ColorTransform {
  let result = presetById(filter).color;
  result = compose(exposureColor(adjust.exposure / 100), result);
  result = compose(brightnessColor(adjust.brightness / 100), result);
  result = compose(contrastColor(adjust.contrast / 100), result);
  result = compose(saturationColor(adjust.saturation / 100), result);
  result = compose(warmthColor(adjust.warmth / 100), result);
  return result;
}

export function vignetteAmount(adjust: Adjustments): number {
  return clamp(adjust.vignette / 100, 0, 1);
}

/** Approximate the shader with Canvas2D filters (fallback + thumbnails). */
export function cssFilter(adjust: Adjustments, filter: string, includePreset = true): string {
  const parts: string[] = [];
  if (includePreset) {
    const css = presetById(filter).css;
    if (css) parts.push(css);
  }
  const exposure = Math.pow(2, adjust.exposure / 100);
  const brightness = 1 + adjust.brightness / 200;
  if (Math.abs(exposure * brightness - 1) > 0.005) {
    parts.push(`brightness(${(exposure * brightness).toFixed(4)})`);
  }
  if (adjust.contrast !== 0) {
    parts.push(`contrast(${Math.max(0.05, 1 + adjust.contrast / 100).toFixed(4)})`);
  }
  const sat = Math.max(0, 1 + adjust.saturation / 100 + adjust.vibrance / 260);
  if (Math.abs(sat - 1) > 0.005) {
    parts.push(`saturate(${sat.toFixed(4)})`);
  }
  if (adjust.warmth !== 0) {
    parts.push(`sepia(${(Math.abs(adjust.warmth) * 0.0015).toFixed(4)})`);
  }
  if (adjust.tint !== 0) {
    parts.push(`hue-rotate(${(adjust.tint * 0.045).toFixed(3)}deg)`);
  }
  return parts.join(' ') || 'none';
}

export function applyColorToImageData(data: ImageData, color: ColorTransform): void {
  const pixels = data.data;
  const m = color.matrix;
  const o = color.offset;
  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] === 0) continue;
    const r = pixels[i] / 255;
    const g = pixels[i + 1] / 255;
    const b = pixels[i + 2] / 255;
    pixels[i] = clamp((m[0] * r + m[1] * g + m[2] * b + o[0]) * 255, 0, 255);
    pixels[i + 1] = clamp((m[3] * r + m[4] * g + m[5] * b + o[1]) * 255, 0, 255);
    pixels[i + 2] = clamp((m[6] * r + m[7] * g + m[8] * b + o[2]) * 255, 0, 255);
  }
}

/** Small square thumbnail for the filter strip. */
export function presetThumbnail(bitmap: CanvasImageSource, width: number, height: number, filter: string): HTMLCanvasElement {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return canvas;
  const scale = Math.max(size / width, size / height);
  const dw = width * scale;
  const dh = height * scale;
  ctx.drawImage(bitmap, (size - dw) / 2, (size - dh) / 2, dw, dh);
  try {
    const data = ctx.getImageData(0, 0, size, size);
    applyColorToImageData(data, presetById(filter).color);
    ctx.putImageData(data, 0, 0);
  } catch {
    // A tainted canvas can happen only with a cross-origin image that was
    // not CORS-enabled; the editor itself refuses those earlier.
  }
  return canvas;
}

/** Pack the eight HSL bands into the flat uniform array the shader expects. */
export function packHSL(enhance: EnhanceState): Float32Array {
  const bands = [
    enhance.hsl.red,
    enhance.hsl.orange,
    enhance.hsl.yellow,
    enhance.hsl.green,
    enhance.hsl.aqua,
    enhance.hsl.blue,
    enhance.hsl.purple,
    enhance.hsl.magenta,
  ];
  const out = new Float32Array(24);
  for (let i = 0; i < bands.length; i += 1) {
    const band = bands[i];
    out[i * 3] = clamp(band.hue / 100, -1, 1);
    out[i * 3 + 1] = clamp(band.saturation / 100, -1, 1);
    out[i * 3 + 2] = clamp(band.luminance / 100, -1, 1);
  }
  return out;
}

/** Pack up to four normalised face boxes as `[cx, cy, rx, ry]` ellipses. */
export function packFaces(faces: FaceBox[]): { data: Float32Array; count: number } {
  const sorted = faces
    .filter((face) => face.w > 0 && face.h > 0)
    .slice()
    .sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0))
    .slice(0, 4);
  const data = new Float32Array(16);
  for (let i = 0; i < sorted.length; i += 1) {
    const face = sorted[i];
    data[i * 4] = clamp(face.x + face.w / 2, 0, 1);
    data[i * 4 + 1] = clamp(face.y + face.h / 2, 0, 1);
    data[i * 4 + 2] = clamp(face.w * 0.62, 0.01, 1);
    data[i * 4 + 3] = clamp(face.h * 0.72, 0.01, 1);
  }
  return { data, count: sorted.length };
}

/** Anchor texture radius encoding: 0..0.6 face-local units map to 0..255. */
const ANCHOR_RADIUS_SCALE = 0.6;
const DEFAULT_EYE_L: Point = { x: -0.34, y: -0.18 };
const DEFAULT_EYE_R: Point = { x: 0.34, y: -0.18 };
const DEFAULT_NOSE: Point = { x: 0, y: 0.1 };
const DEFAULT_MOUTH: Point = { x: 0, y: 0.4 };
const DEFAULT_EYE_RADIUS: Point = { x: 0.22, y: 0.16 };
const DEFAULT_NOSE_RADIUS: Point = { x: 0.2, y: 0.24 };
const DEFAULT_MOUTH_RADIUS: Point = { x: 0.3, y: 0.16 };

function anchorPoint(point: Point | undefined, fallback: Point): Point {
  if (
    !point ||
    !Number.isFinite(point.x) ||
    !Number.isFinite(point.y)
  ) {
    return fallback;
  }
  return {
    x: clamp(point.x, -0.92, 0.92),
    y: clamp(point.y, -0.92, 0.92),
  };
}

function anchorRadius(point: Point | undefined, fallback: Point): Point {
  if (
    !point ||
    !Number.isFinite(point.x) ||
    !Number.isFinite(point.y)
  ) {
    return fallback;
  }
  return {
    x: clamp(point.x, 0.02, ANCHOR_RADIUS_SCALE),
    y: clamp(point.y, 0.02, ANCHOR_RADIUS_SCALE),
  };
}

function anchorPositionByte(value: number): number {
  return Math.round(clamp(value * 0.5 + 0.5, 0, 1) * 255);
}

function anchorRadiusByte(value: number): number {
  return Math.round(clamp(value / ANCHOR_RADIUS_SCALE, 0, 1) * 255);
}

export interface FaceAnchorPack {
  /** Face ellipses for `u_faces`, aligned with the anchor texture rows. */
  data: Float32Array;
  /** RGBA8 4x4 texture; one row per face. */
  anchors: Uint8Array;
  count: number;
  /** Sorted, clamped boxes in the same order as the texture rows. */
  boxes: FaceBox[];
}

/**
 * Pack refined landmark anchors into the same ellipse layout as `packFaces`
 * plus a tiny RGBA8 texture. Four bytes per texel is enough because each
 * anchor is constant across its face; the smooth warp comes from the shader.
 *
 * Texture layout (4x4):
 *   row = face
 *   texel 0 = eyeL.xy, eyeR.xy (local -1..1, encoded 0..1)
 *   texel 1 = nose.xy, mouth.xy
 *   texel 2 = eyeLRadius.xy, eyeRRadius.xy (0..0.6 encoded 0..1)
 *   texel 3 = noseRadius.xy, mouthRadius.xy
 */
export function packFaceAnchors(anchors: FaceAnchor[]): FaceAnchorPack {
  const sorted = anchors
    .filter(
      (anchor) =>
        anchor &&
        anchor.box &&
        Number.isFinite(anchor.box.x) &&
        Number.isFinite(anchor.box.y) &&
        Number.isFinite(anchor.box.w) &&
        Number.isFinite(anchor.box.h) &&
        anchor.box.w > 0 &&
        anchor.box.h > 0,
    )
    .slice()
    .sort((a, b) => {
      const areaA = a.box.w * a.box.h;
      const areaB = b.box.w * b.box.h;
      return (b.confidence ?? areaB) - (a.confidence ?? areaA);
    })
    .slice(0, 4);

  const data = new Float32Array(16);
  const texture = new Uint8Array(4 * 4 * 4);
  const boxes: FaceBox[] = [];
  for (let i = 0; i < sorted.length; i += 1) {
    const anchor = sorted[i];
    const x = clamp(anchor.box.x, 0, 1);
    const y = clamp(anchor.box.y, 0, 1);
    const w = clamp(anchor.box.w, 0, 1);
    const h = clamp(anchor.box.h, 0, 1);
    data[i * 4] = clamp(x + w / 2, 0, 1);
    data[i * 4 + 1] = clamp(y + h / 2, 0, 1);
    data[i * 4 + 2] = clamp(w * 0.62, 0.01, 1);
    data[i * 4 + 3] = clamp(h * 0.72, 0.01, 1);
    boxes.push({ x, y, w, h, confidence: anchor.confidence ?? w * h });

    const eyeL = anchorPoint(anchor.eyeL, DEFAULT_EYE_L);
    const eyeR = anchorPoint(anchor.eyeR, DEFAULT_EYE_R);
    const nose = anchorPoint(anchor.nose, DEFAULT_NOSE);
    const mouth = anchorPoint(anchor.mouth, DEFAULT_MOUTH);
    const eyeLR = anchorRadius(anchor.eyeLRadius, DEFAULT_EYE_RADIUS);
    const eyeRR = anchorRadius(anchor.eyeRRadius, DEFAULT_EYE_RADIUS);
    const noseR = anchorRadius(anchor.noseRadius, DEFAULT_NOSE_RADIUS);
    const mouthR = anchorRadius(anchor.mouthRadius, DEFAULT_MOUTH_RADIUS);

    const base = i * 16;
    texture[base] = anchorPositionByte(eyeL.x);
    texture[base + 1] = anchorPositionByte(eyeL.y);
    texture[base + 2] = anchorPositionByte(eyeR.x);
    texture[base + 3] = anchorPositionByte(eyeR.y);
    texture[base + 4] = anchorPositionByte(nose.x);
    texture[base + 5] = anchorPositionByte(nose.y);
    texture[base + 6] = anchorPositionByte(mouth.x);
    texture[base + 7] = anchorPositionByte(mouth.y);
    texture[base + 8] = anchorRadiusByte(eyeLR.x);
    texture[base + 9] = anchorRadiusByte(eyeLR.y);
    texture[base + 10] = anchorRadiusByte(eyeRR.x);
    texture[base + 11] = anchorRadiusByte(eyeRR.y);
    texture[base + 12] = anchorRadiusByte(noseR.x);
    texture[base + 13] = anchorRadiusByte(noseR.y);
    texture[base + 14] = anchorRadiusByte(mouthR.x);
    texture[base + 15] = anchorRadiusByte(mouthR.y);
  }
  return { data, anchors: texture, count: sorted.length, boxes };
}

export interface EnhanceBuildInput {
  adjust: Adjustments;
  enhance: EnhanceState;
  curve: Uint8Array | null;
  lut: Uint8Array | null;
  faces: { data: Float32Array; count: number };
  quality: number;
  /** Enable the hybrid linear-light pipeline. */
  linear?: boolean;
  /** Output dither strength, 0..1. */
  dither?: number;
  /** Optional skin/feature mask from the lazy Beauty module. */
  mask?: BeautyMask | null;
  /** Optional free-liquify displacement field. */
  liquify?: LiquifyField | null;
  /** Optional landmark anchor texture, aligned with `faces`. */
  anchors?: Uint8Array | null;
}

/**
 * Normalise editor units to shader units and attach the packed textures.
 * Pure and cheap; the expensive LUT construction stays in the caller so it
 * only runs when a curve or LUT actually changes.
 */
export function buildEnhanceSpec(input: EnhanceBuildInput): EnhanceSpec {
  const a = input.adjust;
  return {
    exposure: a.exposure / 100,
    brightness: a.brightness / 100,
    contrast: a.contrast / 100,
    saturation: a.saturation / 100,
    highlights: a.highlights / 100,
    shadows: a.shadows / 100,
    whites: a.whites / 100,
    blacks: a.blacks / 100,
    warmth: a.warmth / 100,
    tint: a.tint / 100,
    vibrance: a.vibrance / 100,
    gamma: a.gamma / 100,
    clarity: a.clarity / 100,
    sharpen: a.sharpen / 100,
    denoise: a.denoise / 100,
    smoothSkin: a.smoothSkin / 100,
    blemish: a.blemish / 100,
    skinTexture: a.skinTexture / 100,
    skinTone: a.skinTone / 100,
    faceSlim: a.faceSlim / 100,
    jawline: a.jawline / 100,
    chin: a.chin / 100,
    eyeSize: a.eyeSize / 100,
    noseSize: a.noseSize / 100,
    mouthSize: a.mouthSize / 100,
    curve: input.curve,
    lut: input.lut,
    lutSize: LUT_SIZE,
    lutStrength: input.enhance.lutStrength / 100,
    faces: input.faces.count ? input.faces.data : null,
    faceCount: input.faces.count,
    anchors: input.faces.count ? input.anchors ?? null : null,
    hsl: packHSL(input.enhance),
    mask: input.mask ?? null,
    liquify: input.liquify ?? null,
    linear: input.linear ? 1 : 0,
    dither: input.dither ?? 0,
    quality: input.quality,
  };
}

/** Convenience for headless consumers that only have an EnhanceState. */
export function curveLUT(enhance: EnhanceState): Uint8Array | null {
  return buildCurveLUT(enhance.curves);
}
