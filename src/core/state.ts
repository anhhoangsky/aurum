import type {
  Adjustments,
  ChainState,
  CropState,
  CurvePoint,
  CurveState,
  EditorState,
  EffectDab,
  EffectState,
  EnhanceState,
  HSLBandId,
  HSLBandState,
  HSLState,
  LayerState,
  LiquifyDab,
  RetouchState,
  TextLayerState,
  TransformState,
} from './types';
import {
  MAX_LIQUIFY_DABS,
  MAX_LIQUIFY_RADIUS,
} from './liquify';
import {
  defaultEffectState,
  normalizeEffectState,
} from './effects';

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
  return { liquify: [], effects: defaultEffectState() };
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
  base.effects = normalizeEffectState(raw.effects);
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

/* ------------------------------------------------------------------ layers */

/** Hard cap so a hand-edited state cannot ask the UI to build thousands of nodes. */
export const MAX_LAYERS = 64;

const TEXT_ALIGNS = ['left', 'center', 'right'] as const;
const LAYER_ID = /^[a-zA-Z0-9_-]{1,40}$/;
const LAYER_FONT = /^[a-z0-9-]{1,24}$/i;
const LAYER_COLOR = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const MAX_TEXT_LENGTH = 500;

/**
 * Layers are untrusted input in the same way liquify dabs are: clamp every
 * number, whitelist fonts and colours, and drop anything that is not a text
 * layer instead of letting the host build a node from a hand-edited JSON.
 */
function normalizeLayer(input: unknown, index: number): TextLayerState | null {
  if (!input || typeof input !== 'object') return null;
  const raw = input as Partial<TextLayerState> & Record<string, unknown>;
  // v2.0 only knows text; an unknown `kind` is kept out rather than guessed.
  if (raw.kind !== undefined && raw.kind !== 'text') return null;
  const align = (TEXT_ALIGNS as readonly string[]).includes(raw.align as string)
    ? (raw.align as TextLayerState['align'])
    : 'center';
  return {
    kind: 'text',
    id: typeof raw.id === 'string' && LAYER_ID.test(raw.id) ? raw.id : `t${index}`,
    text: typeof raw.text === 'string' ? raw.text.slice(0, MAX_TEXT_LENGTH) : '',
    x: clamp(finite(raw.x, 0.5), 0, 1),
    y: clamp(finite(raw.y, 0.5), 0, 1),
    size: clamp(finite(raw.size, 0.07), 0.01, 0.5),
    color:
      typeof raw.color === 'string' && LAYER_COLOR.test(raw.color)
        ? raw.color
        : '#ffffff',
    bold: bool(raw.bold, false),
    italic: bool(raw.italic, false),
    outline: bool(raw.outline, false),
    shadow: bool(raw.shadow, true),
    align,
    rotation: clamp(finite(raw.rotation, 0), -180, 180),
    opacity: clamp(finite(raw.opacity, 1), 0, 1),
    font:
      typeof raw.font === 'string' && LAYER_FONT.test(raw.font)
        ? raw.font
        : 'sys',
  };
}

export function normalizeLayers(input: unknown): LayerState[] {
  if (!Array.isArray(input)) return [];
  const out: TextLayerState[] = [];
  const seen = new Set<string>();
  const start = Math.max(0, input.length - MAX_LAYERS);
  for (let i = start; i < input.length; i += 1) {
    const layer = normalizeLayer(input[i], i);
    if (!layer) continue;
    // Duplicate ids make selection and reordering ambiguous, so a hand-edited
    // state gets a suffix. Keep the base short enough that the result still
    // matches LAYER_ID on the next normalise pass (round-trip stays stable).
    let id = layer.id;
    for (let n = 1; seen.has(id); n += 1) id = `${layer.id.slice(0, 36)}-${n}`;
    layer.id = id;
    seen.add(id);
    out.push(layer);
  }
  return out;
}

export function cloneLayers(layers: LayerState[]): LayerState[] {
  return layers.map((layer) => ({ ...layer }));
}

export function normalizeChain(input: unknown): ChainState | undefined {
  if (!input || typeof input !== 'object') return undefined;
  const raw = input as Partial<ChainState>;
  if (typeof raw.id !== 'string' || !/^[a-z0-9-]{1,32}$/i.test(raw.id)) {
    return undefined;
  }
  const strengths: Record<string, number> = {};
  if (raw.strengths && typeof raw.strengths === 'object') {
    for (const [key, value] of Object.entries(raw.strengths)) {
      if (!/^[a-zA-Z0-9]{1,24}$/.test(key) || !Number.isFinite(value)) continue;
      strengths[key] = clamp(value as number, 0, 100);
    }
  }
  return { id: raw.id, strengths };
}

export function defaultState(): EditorState {
  return {
    version: 2,
    transform: defaultTransform(),
    crop: defaultCrop(),
    adjust: defaultAdjust(),
    filter: 'original',
    enhance: defaultEnhance(),
    retouch: defaultRetouch(),
    layers: [],
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
    version: 2,
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
      effects: {
        dabs: (retouch.effects?.dabs || []).map((dab) => ({ ...dab })),
        size: retouch.effects?.size ?? defaultEffectState().size,
        strength: retouch.effects?.strength ?? defaultEffectState().strength,
      },
    },
    layers: cloneLayers(state.layers || []),
    ...(state.chain
      ? {
          chain: {
            id: state.chain.id,
            strengths: { ...state.chain.strengths },
          },
        }
      : {}),
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
  base.layers = normalizeLayers(raw.layers);
  const chain = normalizeChain(raw.chain);
  if (chain) base.chain = chain;
  return base;
}

export function filterId(value: string): string {
  return /^[a-z0-9-]{1,24}$/i.test(value) ? value : 'original';
}
