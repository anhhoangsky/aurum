import type {
  Adjustments,
  CropState,
  CurvePoint,
  CurveState,
  EditorState,
  EnhanceState,
  HSLBandId,
  HSLBandState,
  HSLState,
  LiquifyDab,
  RetouchState,
  TransformState,
} from './types';
import {
  MAX_LIQUIFY_DABS,
  MAX_LIQUIFY_RADIUS,
} from './liquify';

export const ADJUST_RANGES: Record<keyof Adjustments, [number, number]> = {
  brightness: [-100, 100],
  contrast: [-100, 100],
  saturation: [-100, 100],
  exposure: [-100, 100],
  warmth: [-100, 100],
  vignette: [0, 100],
  highlights: [-100, 100],
  shadows: [-100, 100],
  whites: [-100, 100],
  blacks: [-100, 100],
  tint: [-100, 100],
  vibrance: [-100, 100],
  gamma: [-100, 100],
  clarity: [-100, 100],
  sharpen: [0, 100],
  denoise: [0, 100],
  smoothSkin: [0, 100],
  blemish: [0, 100],
  skinTexture: [0, 100],
  skinTone: [-100, 100],
  faceSlim: [-100, 100],
  jawline: [-100, 100],
  chin: [-100, 100],
  eyeSize: [-100, 100],
  noseSize: [-100, 100],
  mouthSize: [-100, 100],
};

export const ADJUST_KEYS = Object.keys(ADJUST_RANGES) as (keyof Adjustments)[];

export const HSL_BANDS: HSLBandId[] = [
  'red',
  'orange',
  'yellow',
  'green',
  'aqua',
  'blue',
  'purple',
  'magenta',
];

export function defaultAdjust(): Adjustments {
  return {
    brightness: 0,
    contrast: 0,
    saturation: 0,
    exposure: 0,
    warmth: 0,
    vignette: 0,
    highlights: 0,
    shadows: 0,
    whites: 0,
    blacks: 0,
    tint: 0,
    vibrance: 0,
    gamma: 0,
    clarity: 0,
    sharpen: 0,
    denoise: 0,
    smoothSkin: 0,
    blemish: 0,
    skinTexture: 55,
    skinTone: 0,
    faceSlim: 0,
    jawline: 0,
    chin: 0,
    eyeSize: 0,
    noseSize: 0,
    mouthSize: 0,
  };
}

export function defaultTransform(): TransformState {
  return {
    zoom: 1,
    turn: 0,
    rotation: 0,
    flipH: false,
    flipV: false,
    offsetX: 0,
    offsetY: 0,
    perspectiveX: 0,
    perspectiveY: 0,
  };
}

export function defaultCrop(): CropState {
  return { aspect: 'free', ratio: 3 / 2, scale: 1 };
}

export function identityCurve(): CurvePoint[] {
  return [
    { x: 0, y: 0 },
    { x: 1, y: 1 },
  ];
}

export function defaultCurves(): CurveState {
  return {
    rgb: identityCurve(),
    r: identityCurve(),
    g: identityCurve(),
    b: identityCurve(),
  };
}

export function defaultHSLBand(): HSLBandState {
  return { hue: 0, saturation: 0, luminance: 0 };
}

export function defaultHSL(): HSLState {
  return {
    red: defaultHSLBand(),
    orange: defaultHSLBand(),
    yellow: defaultHSLBand(),
    green: defaultHSLBand(),
    aqua: defaultHSLBand(),
    blue: defaultHSLBand(),
    purple: defaultHSLBand(),
    magenta: defaultHSLBand(),
  };
}

export function defaultEnhance(): EnhanceState {
  return {
    curves: defaultCurves(),
    hsl: defaultHSL(),
    lut: 'none',
    lutStrength: 100,
    auto: false,
  };
}

export function defaultRetouch(): RetouchState {
  return { liquify: [] };
}

/**
 * Saved liquify dabs are untrusted input: clamp every coordinate and drop
 * malformed entries instead of letting the shader see NaN or an unbounded
 * history. Older states without `retouch` simply start with an empty field.
 */
export function normalizeRetouch(input: unknown): RetouchState {
  const base = defaultRetouch();
  if (!input || typeof input !== 'object') return base;
  const raw = input as Partial<RetouchState>;
  if (!Array.isArray(raw.liquify)) return base;
  const dabs: LiquifyDab[] = [];
  const start = Math.max(0, raw.liquify.length - MAX_LIQUIFY_DABS);
  for (let i = start; i < raw.liquify.length; i += 1) {
    const item = raw.liquify[i];
    if (!item || typeof item !== 'object') continue;
    const dab = item as Partial<LiquifyDab>;
    if (
      !Number.isFinite(dab.x) ||
      !Number.isFinite(dab.y) ||
      !Number.isFinite(dab.dx) ||
      !Number.isFinite(dab.dy) ||
      !Number.isFinite(dab.radius)
    ) {
      continue;
    }
    dabs.push({
      x: clamp(dab.x as number, 0, 1),
      y: clamp(dab.y as number, 0, 1),
      dx: clamp(dab.dx as number, -0.25, 0.25),
      dy: clamp(dab.dy as number, -0.25, 0.25),
      radius: clamp(dab.radius as number, 0.002, MAX_LIQUIFY_RADIUS),
    });
  }
  base.liquify = dabs;
  return base;
}

export function defaultState(): EditorState {
  return {
    version: 1,
    transform: defaultTransform(),
    crop: defaultCrop(),
    adjust: defaultAdjust(),
    filter: 'original',
    enhance: defaultEnhance(),
    retouch: defaultRetouch(),
  };
}

function cloneCurve(points: CurvePoint[]): CurvePoint[] {
  return points.map((point) => ({ x: point.x, y: point.y }));
}

export function cloneState(state: EditorState): EditorState {
  const enhance = state.enhance || defaultEnhance();
  const retouch = state.retouch || defaultRetouch();
  const hsl = defaultHSL();
  for (const band of HSL_BANDS) {
    hsl[band] = { ...(enhance.hsl[band] || hsl[band]) };
  }
  return {
    version: 1,
    transform: { ...state.transform },
    crop: { ...state.crop },
    adjust: { ...state.adjust },
    filter: state.filter,
    enhance: {
      curves: {
        rgb: cloneCurve(enhance.curves.rgb),
        r: cloneCurve(enhance.curves.r),
        g: cloneCurve(enhance.curves.g),
        b: cloneCurve(enhance.curves.b),
      },
      hsl,
      lut: enhance.lut,
      lutStrength: enhance.lutStrength,
      auto: enhance.auto,
    },
    retouch: {
      liquify: retouch.liquify.map((dab) => ({ ...dab })),
    },
  };
}

export function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

export function finite(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

export function bool(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

const ASPECTS = ['free', '1:1', '4:3', '3:4', '16:9', '9:16', 'screen'] as const;

export function isAspect(value: unknown): value is CropState['aspect'] {
  return typeof value === 'string' && (ASPECTS as readonly string[]).includes(value);
}

/**
 * Curves are stored as up to 16 control points with fixed endpoints. Keeping
 * them normalised in one place means the renderer can assume sorted, in-range
 * input and never has to defend against a hand-edited JSON export.
 */
export function normalizeCurve(input: unknown): CurvePoint[] {
  const points: CurvePoint[] = [];
  if (Array.isArray(input)) {
    for (const raw of input) {
      if (!raw || typeof raw !== 'object') continue;
      const point = raw as Partial<CurvePoint>;
      if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) continue;
      points.push({
        x: clamp(point.x as number, 0, 1),
        y: clamp(point.y as number, 0, 1),
      });
    }
  }
  points.sort((a, b) => a.x - b.x);
  const deduped: CurvePoint[] = [];
  for (const point of points) {
    const previous = deduped[deduped.length - 1];
    if (previous && Math.abs(previous.x - point.x) < 0.0005) {
      previous.y = point.y;
    } else {
      deduped.push(point);
    }
  }
  if (deduped.length < 2) return identityCurve();
  if (deduped[0].x > 0.0005) deduped.unshift({ x: 0, y: deduped[0].y });
  const last = deduped[deduped.length - 1];
  if (last.x < 0.9995) deduped.push({ x: 1, y: last.y });
  if (deduped.length > 16) {
    // Keep both endpoints and spread the remaining samples evenly.
    const kept: CurvePoint[] = [deduped[0]];
    const inner = deduped.length - 2;
    const slots = 14;
    for (let i = 1; i <= slots; i += 1) {
      const index = 1 + Math.round((i * (inner - 1)) / slots);
      const point = deduped[index];
      if (point && point.x > kept[kept.length - 1].x + 0.0005) kept.push(point);
    }
    kept.push(deduped[deduped.length - 1]);
    return kept;
  }
  return deduped;
}

function normalizeHSLBand(input: unknown): HSLBandState {
  const raw = (input || {}) as Partial<HSLBandState>;
  return {
    hue: clamp(finite(raw.hue, 0), -100, 100),
    saturation: clamp(finite(raw.saturation, 0), -100, 100),
    luminance: clamp(finite(raw.luminance, 0), -100, 100),
  };
}

export function normalizeEnhance(input: unknown): EnhanceState {
  const base = defaultEnhance();
  if (!input || typeof input !== 'object') return base;
  const raw = input as Partial<EnhanceState> & Record<string, unknown>;
  const curves = (raw.curves || {}) as Partial<CurveState>;
  base.curves = {
    rgb: normalizeCurve(curves.rgb),
    r: normalizeCurve(curves.r),
    g: normalizeCurve(curves.g),
    b: normalizeCurve(curves.b),
  };
  const hsl = (raw.hsl || {}) as Partial<HSLState>;
  for (const band of HSL_BANDS) {
    base.hsl[band] = normalizeHSLBand(hsl[band]);
  }
  base.lut =
    typeof raw.lut === 'string' && /^[a-z0-9-]{1,24}$/i.test(raw.lut) ? raw.lut : 'none';
  base.lutStrength = clamp(finite(raw.lutStrength, 100), 0, 100);
  base.auto = bool(raw.auto, false);
  return base;
}

export function normalizeState(input: unknown): EditorState {
  const base = defaultState();
  if (!input || typeof input !== 'object') {
    return base;
  }
  const raw = input as Partial<EditorState> & Record<string, unknown>;
  const transform = (raw.transform || {}) as Partial<TransformState>;
  const crop = (raw.crop || {}) as Partial<CropState>;
  const adjust = (raw.adjust || {}) as Partial<Adjustments>;

  const rotation = finite(transform.rotation, base.transform.rotation);
  const turn = Math.round(finite(transform.turn, 0));
  base.transform = {
    zoom: clamp(finite(transform.zoom, 1), 0.2, 12),
    turn: ((turn % 4) + 4) % 4,
    rotation: ((((rotation + 180) % 360) + 360) % 360) - 180,
    flipH: bool(transform.flipH, false),
    flipV: bool(transform.flipV, false),
    offsetX: clamp(finite(transform.offsetX, 0), -4, 4),
    offsetY: clamp(finite(transform.offsetY, 0), -4, 4),
    perspectiveX: clamp(finite(transform.perspectiveX, 0), -100, 100),
    perspectiveY: clamp(finite(transform.perspectiveY, 0), -100, 100),
  };

  const aspect = isAspect(crop.aspect) ? crop.aspect : 'free';
  base.crop = {
    aspect,
    ratio: clamp(finite(crop.ratio, base.crop.ratio), 0.2, 8),
    scale: clamp(finite(crop.scale, 1), 0.2, 1),
  };

  base.adjust = { ...base.adjust };
  for (const key of ADJUST_KEYS) {
    const [min, max] = ADJUST_RANGES[key];
    base.adjust[key] = clamp(finite(adjust[key], base.adjust[key]), min, max);
  }

  base.filter = typeof raw.filter === 'string' && raw.filter ? raw.filter : 'original';
  base.enhance = normalizeEnhance(raw.enhance);
  base.retouch = normalizeRetouch(raw.retouch);
  return base;
}

export function filterId(value: string): string {
  return /^[a-z0-9-]{1,24}$/i.test(value) ? value : 'original';
}
