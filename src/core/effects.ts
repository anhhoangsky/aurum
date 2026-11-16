import type { EffectDab, EffectMask, EffectState } from './types';

const clamp = (value: number, min: number, max: number): number =>
  value < min ? min : value > max ? max : value;

const finite = (value: unknown, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

/** Longest mask side. A stroke edge stays soft at 4K without a heavy upload. */
export const EFFECT_MASK_MAX = 1024;

/**
 * A hand-edited state must not ask the renderer to stamp millions of circles.
 * A normal painted session stays far below this: one stroke is ~20–100 dabs.
 */
export const MAX_EFFECT_DABS = 1600;

export function defaultEffectState(): EffectState {
  return { dabs: [], size: 0.08, strength: 60 };
}

const KINDS: readonly EffectDab['kind'][] = ['mosaic', 'blur'];

/**
 * Effects are untrusted input like liquify dabs. Coordinates and radii are
 * clamped, unknown kinds are dropped and only the newest stamps survive the
 * cap, so a saved JSON can never stall a frame or paint outside the photo.
 */
export function normalizeEffectState(input: unknown): EffectState {
  const base = defaultEffectState();
  if (!input || typeof input !== 'object') return base;
  const raw = input as Partial<EffectState>;
  const rawDabs = Array.isArray(raw.dabs) ? raw.dabs : [];
  const start = Math.max(0, rawDabs.length - MAX_EFFECT_DABS);
  for (let i = start; i < rawDabs.length; i += 1) {
    const item = rawDabs[i];
    if (!item || typeof item !== 'object') continue;
    const dab = item as Partial<EffectDab>;
    if (
      !KINDS.includes(dab.kind as EffectDab['kind']) ||
      !Number.isFinite(dab.x) ||
      !Number.isFinite(dab.y) ||
      !Number.isFinite(dab.radius)
    ) {
      continue;
    }
    base.dabs.push({
      kind: dab.kind as EffectDab['kind'],
      x: clamp(dab.x as number, 0, 1),
      y: clamp(dab.y as number, 0, 1),
      radius: clamp(dab.radius as number, 0.002, 0.2),
    });
  }
  base.size = clamp(finite(raw.size, base.size), 0.01, 0.2);
  base.strength = clamp(finite(raw.strength, base.strength), 0, 100);
  return base;
}

export interface EffectGeometry {
  /** Mosaic block edge in source pixels. */
  blockPx: number;
  /** Mosaic grid counts across the source width and height. */
  grid: [number, number];
  /** Blur radius in image-UV units, per axis. */
  blur: [number, number];
  /** Blend strength, 0..1. */
  strength: number;
}

/**
 * Derive the shader uniforms from the live brush settings. The block edge and
 * blur radius follow the brush size, so a 20 % brush produces a visibly coarse
 * mosaic and a soft bokeh, while a 1 % brush leaves fine detail intact.
 */
export function effectGeometry(
  effects: EffectState | undefined,
  srcWidth: number,
  srcHeight: number,
): EffectGeometry {
  const size = effects ? clamp(finite(effects.size, 0.08), 0.01, 0.2) : 0.08;
  const strength = effects ? clamp(finite(effects.strength, 60), 0, 100) / 100 : 0;
  const width = Math.max(1, srcWidth);
  const height = Math.max(1, srcHeight);
  const blockPx = Math.max(2, Math.round(size * width * 0.55));
  const blurX = size * 0.42;
  return {
    blockPx,
    grid: [width / blockPx, height / blockPx],
    // A UV step of `blurX` spans the same number of source pixels on both
    // axes, so the blur stays circular on non-square photos.
    blur: [blurX, (blurX * width) / height],
    strength,
  };
}

/**
 * Rasterise the painted stamps into one small RGBA8 mask. Channels accumulate
 * with `max`, so overlapping strokes of the same kind do not darken or build
 * up beyond full coverage. The outer 35 % of every stamp is a linear feather;
 * the core is solid, which keeps a mosaic edge crisp but not aliased.
 */
export function buildEffectMask(
  dabs: readonly EffectDab[],
  srcWidth: number,
  srcHeight: number,
): EffectMask | null {
  if (!dabs.length || srcWidth < 1 || srcHeight < 1) return null;
  const longest = Math.max(srcWidth, srcHeight);
  const scale = Math.min(1, EFFECT_MASK_MAX / longest);
  const width = Math.max(1, Math.round(srcWidth * scale));
  const height = Math.max(1, Math.round(srcHeight * scale));
  const data = new Uint8Array(width * height * 4);
  const feather = 0.35;
  let painted = false;

  for (const dab of dabs) {
    const channel = dab.kind === 'mosaic' ? 0 : 1;
    // Radius is width-normalised in source space; the mask keeps the source
    // aspect, so the same pixel count is the same physical radius on both axes.
    const radius = Math.max(0.5, dab.radius * width);
    const cx = dab.x * width;
    const cy = dab.y * height;
    const x0 = Math.max(0, Math.floor(cx - radius));
    const x1 = Math.min(width - 1, Math.ceil(cx + radius));
    const y0 = Math.max(0, Math.floor(cy - radius));
    const y1 = Math.min(height - 1, Math.ceil(cy + radius));
    if (x1 < x0 || y1 < y0) continue;
    const invRadius = 1 / radius;
    for (let y = y0; y <= y1; y += 1) {
      const dy = y + 0.5 - cy;
      const row = y * width;
      for (let x = x0; x <= x1; x += 1) {
        const dx = x + 0.5 - cx;
        const distance = Math.sqrt(dx * dx + dy * dy) * invRadius;
        if (distance >= 1) continue;
        const coverage = Math.min(1, (1 - distance) / feather);
        const value = Math.round(coverage * 255);
        const at = (row + x) * 4 + channel;
        if (value > data[at]) {
          data[at] = value;
          painted = true;
        }
      }
    }
  }

  if (!painted) return null;
  for (let i = 3; i < data.length; i += 4) data[i] = 255;
  return { width, height, data };
}
