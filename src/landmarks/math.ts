/**
 * Pure landmark-to-anchor geometry.
 *
 * Keeping this file free of MediaPipe and DOM imports means the mapping can
 * be tested in Node and reused by any detector that returns the 478-point
 * MediaPipe face mesh. The renderer consumes the resulting `FaceAnchor`
 * values; it never sees landmark indices.
 */

import type { FaceAnchor, FaceBox, Point } from '../core/types';

export interface LandmarkPoint {
  x: number;
  y: number;
  z?: number;
}

/** MediaPipe Face Landmarker returns 478 points; 387 is all this module needs. */
export const MIN_FACE_LANDMARKS = 387;

const EYE_A = [33, 133, 159, 145] as const;
const EYE_B = [362, 263, 386, 374] as const;
const NOSE_TIP = 1;
const NOSE_BRIDGE = 6;
const NOSTRIL_L = 98;
const NOSTRIL_R = 327;
const MOUTH_LEFT = 61;
const MOUTH_RIGHT = 291;
const MOUTH_TOP = 13;
const MOUTH_BOTTOM = 14;

const BOX_PADDING = 0.03;

function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

function midpoint(a: LandmarkPoint, b: LandmarkPoint): LandmarkPoint {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function finitePoint(point: LandmarkPoint | undefined): point is LandmarkPoint {
  return !!point && Number.isFinite(point.x) && Number.isFinite(point.y);
}

interface LocalMapper {
  x: number;
  y: number;
  halfW: number;
  halfH: number;
  toLocal: (point: LandmarkPoint) => Point;
}

function mapperFor(box: FaceBox): LocalMapper {
  const halfW = Math.max(0.0001, box.w / 2);
  const halfH = Math.max(0.0001, box.h / 2);
  const cx = box.x + halfW;
  const cy = box.y + halfH;
  return {
    x: cx,
    y: cy,
    halfW,
    halfH,
    toLocal: (point) => ({
      x: (point.x - cx) / halfW,
      y: (point.y - cy) / halfH,
    }),
  };
}

function localDistance(
  mapper: LocalMapper,
  a: LandmarkPoint,
  b: LandmarkPoint,
): number {
  const la = mapper.toLocal(a);
  const lb = mapper.toLocal(b);
  return Math.hypot(la.x - lb.x, la.y - lb.y);
}

function clampLocal(point: Point, limit = 0.92): Point {
  return {
    x: clamp(point.x, -limit, limit),
    y: clamp(point.y, -limit, limit),
  };
}

function localRadius(x: number, y: number): Point {
  return {
    x: clamp(x, 0.02, 0.6),
    y: clamp(y, 0.02, 0.6),
  };
}

function eyeAnchor(
  points: readonly LandmarkPoint[],
  indices: readonly [number, number, number, number],
  mapper: LocalMapper,
): { center: Point; radius: Point } | null {
  const [cornerA, cornerB, upper, lower] = indices.map((index) => points[index]);
  if (
    !finitePoint(cornerA) ||
    !finitePoint(cornerB) ||
    !finitePoint(upper) ||
    !finitePoint(lower)
  ) {
    return null;
  }
  const center = mapper.toLocal(midpoint(cornerA, cornerB));
  const width = localDistance(mapper, cornerA, cornerB);
  const height = localDistance(mapper, upper, lower);
  return {
    center: clampLocal(center),
    radius: localRadius(
      Math.max(0.12, width * 0.62),
      Math.max(0.09, height * 0.9),
    ),
  };
}

/**
 * Build one anchor set from a single 478-point face mesh. The box is the
 * landmark mesh's tight bounding box (with a little padding) clamped to the
 * image, so the shader's ellipse follows the actual face instead of the
 * detector's looser square.
 */
export function faceAnchorFromLandmarks(
  points: readonly LandmarkPoint[],
): FaceAnchor | null {
  if (!points || points.length < MIN_FACE_LANDMARKS) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < points.length; i += 1) {
    const point = points[i];
    if (!finitePoint(point)) continue;
    if (point.x < minX) minX = point.x;
    if (point.y < minY) minY = point.y;
    if (point.x > maxX) maxX = point.x;
    if (point.y > maxY) maxY = point.y;
  }
  if (!Number.isFinite(minX) || !Number.isFinite(minY)) return null;

  const rawW = maxX - minX;
  const rawH = maxY - minY;
  if (rawW <= 0.0001 || rawH <= 0.0001) return null;

  const padX = rawW * BOX_PADDING;
  const padY = rawH * BOX_PADDING;
  const x0 = clamp(minX - padX, 0, 1);
  const y0 = clamp(minY - padY, 0, 1);
  const x1 = clamp(maxX + padX, 0, 1);
  const y1 = clamp(maxY + padY, 0, 1);
  const w = x1 - x0;
  const h = y1 - y0;
  if (w <= 0.0001 || h <= 0.0001) return null;

  const box: FaceBox = {
    x: x0,
    y: y0,
    w,
    h,
    // Larger faces win when the core has to choose four of them.
    confidence: w * h,
  };
  const mapper = mapperFor(box);

  const eyeA = eyeAnchor(points, EYE_A, mapper);
  const eyeB = eyeAnchor(points, EYE_B, mapper);
  if (!eyeA || !eyeB) return null;
  const [eyeL, eyeR] =
    eyeA.center.x <= eyeB.center.x ? [eyeA, eyeB] : [eyeB, eyeA];

  const noseTip = points[NOSE_TIP];
  const noseBridge = points[NOSE_BRIDGE];
  const nostrilL = points[NOSTRIL_L];
  const nostrilR = points[NOSTRIL_R];
  const mouthLeft = points[MOUTH_LEFT];
  const mouthRight = points[MOUTH_RIGHT];
  const mouthTop = points[MOUTH_TOP];
  const mouthBottom = points[MOUTH_BOTTOM];
  if (
    !finitePoint(noseTip) ||
    !finitePoint(noseBridge) ||
    !finitePoint(nostrilL) ||
    !finitePoint(nostrilR) ||
    !finitePoint(mouthLeft) ||
    !finitePoint(mouthRight) ||
    !finitePoint(mouthTop) ||
    !finitePoint(mouthBottom)
  ) {
    return null;
  }

  // Nose influence covers the bridge-to-tip span, with a width measured from
  // the nostrils. The bridge/tip midpoint lands near the shader's old default
  // (0, 0.10), which keeps the effect stable when landmarks are noisy.
  const nose = clampLocal(mapper.toLocal(midpoint(noseBridge, noseTip)));
  const noseSpan = localDistance(mapper, noseBridge, noseTip);
  const noseWidth = localDistance(mapper, nostrilL, nostrilR);
  const noseRadius = localRadius(
    Math.max(0.16, noseWidth * 0.72),
    Math.max(0.18, noseSpan * 0.62),
  );

  const mouth = clampLocal(
    mapper.toLocal({
      x: (mouthLeft.x + mouthRight.x + mouthTop.x + mouthBottom.x) / 4,
      y: (mouthLeft.y + mouthRight.y + mouthTop.y + mouthBottom.y) / 4,
    }),
  );
  const mouthWidth = localDistance(mapper, mouthLeft, mouthRight);
  const mouthHeight = localDistance(mapper, mouthTop, mouthBottom);
  const mouthRadius = localRadius(
    Math.max(0.16, mouthWidth * 0.55),
    Math.max(0.11, mouthHeight * 0.95),
  );

  return {
    box,
    eyeL: eyeL.center,
    eyeR: eyeR.center,
    nose,
    mouth,
    eyeLRadius: eyeL.radius,
    eyeRRadius: eyeR.radius,
    noseRadius,
    mouthRadius,
    confidence: box.confidence,
  };
}

export function anchorsFromLandmarks(
  faces: readonly (readonly LandmarkPoint[])[],
): FaceAnchor[] {
  if (!Array.isArray(faces) || !faces.length) return [];
  const anchors: FaceAnchor[] = [];
  for (const face of faces) {
    const anchor = faceAnchorFromLandmarks(face);
    if (anchor) anchors.push(anchor);
  }
  // `packFaceAnchors` also sorts, but sorting here keeps the public result
  // deterministic for callers and tests.
  return anchors.sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0));
}
