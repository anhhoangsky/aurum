import type { CurveChannel, CurvePoint, CurveState } from '../types';
import { clamp, identityCurve } from '../state';

/**
 * Monotone cubic Hermite interpolation (Fritsch–Carlson). Unlike a plain
 * Catmull–Rom spline it never overshoots between control points, so a curve
 * that is dragged upwards cannot create a dark dip between two bright points.
 */
function tangents(points: CurvePoint[]): number[] {
  const n = points.length;
  if (n < 2) return [0];
  const delta: number[] = new Array(n - 1);
  for (let i = 0; i < n - 1; i += 1) {
    const dx = Math.max(1e-6, points[i + 1].x - points[i].x);
    delta[i] = (points[i + 1].y - points[i].y) / dx;
  }
  const m: number[] = new Array(n);
  m[0] = delta[0];
  m[n - 1] = delta[n - 2];
  for (let i = 1; i < n - 1; i += 1) {
    m[i] = (delta[i - 1] + delta[i]) * 0.5;
  }
  for (let i = 0; i < n - 1; i += 1) {
    if (Math.abs(delta[i]) < 1e-9) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const alpha = m[i] / delta[i];
    const beta = m[i + 1] / delta[i];
    const magnitude = alpha * alpha + beta * beta;
    if (magnitude > 9) {
      const tau = 3 / Math.sqrt(magnitude);
      m[i] = tau * alpha * delta[i];
      m[i + 1] = tau * beta * delta[i];
    }
  }
  return m;
}

/** Sample a normalised curve at x (0..1). Values outside the points clamp. */
export function sampleCurve(points: CurvePoint[], x: number): number {
  const n = points.length;
  if (n === 0) return clamp(x, 0, 1);
  if (n === 1) return clamp(points[0].y, 0, 1);
  if (x <= points[0].x) return clamp(points[0].y, 0, 1);
  if (x >= points[n - 1].x) return clamp(points[n - 1].y, 0, 1);

  let lo = 0;
  let hi = n - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (points[mid].x <= x) lo = mid;
    else hi = mid;
  }
  const p0 = points[lo];
  const p1 = points[hi];
  const h = Math.max(1e-6, p1.x - p0.x);
  const t = (x - p0.x) / h;
  const m = tangents(points);
  const t2 = t * t;
  const t3 = t2 * t;
  const h00 = 2 * t3 - 3 * t2 + 1;
  const h10 = t3 - 2 * t2 + t;
  const h01 = -2 * t3 + 3 * t2;
  const h11 = t3 - t2;
  return clamp(
    h00 * p0.y + h10 * h * m[lo] + h01 * p1.y + h11 * h * m[hi],
    0,
    1,
  );
}

function isIdentity(points: CurvePoint[]): boolean {
  if (points.length !== 2) {
    for (let i = 0; i <= 16; i += 1) {
      const x = i / 16;
      if (Math.abs(sampleCurve(points, x) - x) > 1 / 255) return false;
    }
    return true;
  }
  return (
    Math.abs(points[0].x) < 1e-6 &&
    Math.abs(points[0].y) < 1e-6 &&
    Math.abs(points[1].x - 1) < 1e-6 &&
    Math.abs(points[1].y - 1) < 1e-6
  );
}

export function curvesAreIdentity(curves: CurveState): boolean {
  return (
    isIdentity(curves.rgb) &&
    isIdentity(curves.r) &&
    isIdentity(curves.g) &&
    isIdentity(curves.b)
  );
}

/**
 * Pack the master RGB curve and the three per-channel curves into one 256x1
 * RGBA texture: R/G/B hold the final channel value, A is opaque. The master
 * curve runs first, exactly like a raw processor's "RGB" tab.
 */
export function buildCurveLUT(curves: CurveState): Uint8Array | null {
  if (curvesAreIdentity(curves)) return null;
  const data = new Uint8Array(256 * 4);
  for (let i = 0; i < 256; i += 1) {
    const x = i / 255;
    const master = sampleCurve(curves.rgb, x);
    data[i * 4] = Math.round(clamp(sampleCurve(curves.r, master), 0, 1) * 255);
    data[i * 4 + 1] = Math.round(clamp(sampleCurve(curves.g, master), 0, 1) * 255);
    data[i * 4 + 2] = Math.round(clamp(sampleCurve(curves.b, master), 0, 1) * 255);
    data[i * 4 + 3] = 255;
  }
  return data;
}

export interface CurvePreset {
  id: string;
  label: string;
  labelEn: string;
  points: CurvePoint[];
}

const p = (x: number, y: number): CurvePoint => ({ x, y });

/** Small, useful curve presets for headless consumers and future UI. */
export const CURVE_PRESETS: CurvePreset[] = [
  { id: 'linear', label: 'Tuyến tính', labelEn: 'Linear', points: identityCurve() },
  {
    id: 'soft',
    label: 'Mềm',
    labelEn: 'Soft',
    points: [p(0, 0.03), p(0.25, 0.22), p(0.5, 0.5), p(0.75, 0.79), p(1, 0.98)],
  },
  {
    id: 'contrast',
    label: 'Tương phản',
    labelEn: 'Contrast',
    points: [p(0, 0), p(0.22, 0.16), p(0.5, 0.5), p(0.78, 0.85), p(1, 1)],
  },
  {
    id: 'fade',
    label: 'Bạc màu',
    labelEn: 'Fade',
    points: [p(0, 0.1), p(0.28, 0.3), p(0.5, 0.52), p(0.74, 0.73), p(1, 0.9)],
  },
];

export function curvePreset(id: string, channel: CurveChannel = 'rgb'): CurvePoint[] {
  const preset = CURVE_PRESETS.find((item) => item.id === id) || CURVE_PRESETS[0];
  return channel === 'rgb' ? preset.points.map((point) => ({ ...point })) : identityCurve();
}
