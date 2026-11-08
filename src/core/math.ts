import type {
  CropState,
  FrameRect,
  PerspectiveWarp,
  Point,
  Quad,
  Size,
  TransformState,
} from './types';

export const DEG = Math.PI / 180;

export function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

export function aspectRatio(aspect: CropState['aspect'], viewport: Size, freeRatio: number): number {
  switch (aspect) {
    case '1:1':
      return 1;
    case '4:3':
      return 4 / 3;
    case '3:4':
      return 3 / 4;
    case '16:9':
      return 16 / 9;
    case '9:16':
      return 9 / 16;
    case 'screen':
      return viewport.height > 0 ? viewport.width / viewport.height : 1;
    case 'free':
    default:
      return clamp(freeRatio, 0.2, 8);
  }
}

export function framePadding(viewport: Size): number {
  return clamp(Math.min(viewport.width, viewport.height) * 0.018, 2, 8);
}

/** Quarter turns plus fine rotation. This is the angle the image is drawn at. */
export function totalRotation(transform: Pick<TransformState, 'turn' | 'rotation'>): number {
  return (transform.turn || 0) * 90 + transform.rotation;
}

/** Largest centered frame for a ratio, inside the padded viewport. */
export function maxFrame(viewport: Size, ratio: number): Size {
  const pad = framePadding(viewport);
  const availW = Math.max(24, viewport.width - pad * 2);
  const availH = Math.max(24, viewport.height - pad * 2);
  if (availW / availH > ratio) {
    return { width: availH * ratio, height: availH };
  }
  return { width: availW, height: availW / ratio };
}

export function frameRect(viewport: Size, crop: CropState): FrameRect {
  const ratio = aspectRatio(crop.aspect, viewport, crop.ratio);
  const max = maxFrame(viewport, ratio);
  const scale = clamp(crop.scale, 0.2, 1);
  const width = max.width * scale;
  const height = max.height * scale;
  return {
    x: (viewport.width - width) / 2,
    y: (viewport.height - height) / 2,
    width,
    height,
  };
}

/** Frame corners relative to the viewport centre, clockwise from top-left. */
export function frameCorners(frame: FrameRect): [Point, Point, Point, Point] {
  const hw = frame.width / 2;
  const hh = frame.height / 2;
  return [
    { x: -hw, y: -hh },
    { x: hw, y: -hh },
    { x: hw, y: hh },
    { x: -hw, y: hh },
  ];
}

export function rotatePoint(point: Point, radians: number): Point {
  const c = Math.cos(radians);
  const s = Math.sin(radians);
  return { x: c * point.x - s * point.y, y: s * point.x + c * point.y };
}

export function inverseRotatePoint(point: Point, radians: number): Point {
  const c = Math.cos(radians);
  const s = Math.sin(radians);
  return { x: c * point.x + s * point.y, y: -s * point.x + c * point.y };
}

export interface ImageGeometry {
  /** Signed half-width / half-height of the drawn image at the current zoom. */
  sx: number;
  sy: number;
  /** Uniform "cover" factor before zoom. */
  cover: number;
  radians: number;
}

export function imageGeometry(
  viewport: Size,
  srcWidth: number,
  srcHeight: number,
  transform: TransformState,
): ImageGeometry {
  const cover = Math.max(viewport.width / srcWidth, viewport.height / srcHeight) || 1;
  const zoom = Math.max(0.01, transform.zoom);
  const halfW = (srcWidth * cover * zoom) / 2;
  const halfH = (srcHeight * cover * zoom) / 2;
  return {
    sx: halfW * (transform.flipH ? -1 : 1),
    sy: halfH * (transform.flipV ? -1 : 1),
    cover,
    radians: totalRotation(transform) * DEG,
  };
}

/**
 * Perspective is deliberately capped well below the projective horizon. The
 * denominator stays above 0.36 over the whole source square, so the warp can
 * never fold or sample across the singularity.
 */
export const PERSPECTIVE_MAX = 0.32;

export function perspectiveWarp(
  transform: Pick<TransformState, 'perspectiveX' | 'perspectiveY'>,
): PerspectiveWarp {
  return {
    a: (clamp(transform.perspectiveY, -100, 100) / 100) * PERSPECTIVE_MAX,
    b: (clamp(transform.perspectiveX, -100, 100) / 100) * PERSPECTIVE_MAX,
  };
}

/** Source-normalised point -> perspective-warped source-normalised point. */
export function warpPoint(point: Point, warp: PerspectiveWarp): Point {
  const w = 1 + warp.a * point.y + warp.b * point.x;
  return { x: point.x / w, y: point.y / w };
}

/** Inverse of `warpPoint`; used for coverage and export sampling. */
export function unwarpPoint(point: Point, warp: PerspectiveWarp): Point {
  const w = 1 - warp.a * point.y - warp.b * point.x;
  return { x: point.x / w, y: point.y / w };
}

/** Smallest zoom where the rotated image can still cover the crop frame. */
export function minimumZoom(
  viewport: Size,
  srcWidth: number,
  srcHeight: number,
  rotation: number,
  frame: FrameRect,
): number {
  const cover = Math.max(viewport.width / srcWidth, viewport.height / srcHeight) || 1;
  const radians = rotation * DEG;
  const corners = frameCorners(frame);
  let needX = 0;
  let needY = 0;
  for (const corner of corners) {
    const local = inverseRotatePoint(corner, radians);
    needX = Math.max(needX, Math.abs(local.x));
    needY = Math.max(needY, Math.abs(local.y));
  }
  const zoomX = needX / ((srcWidth * cover) / 2);
  const zoomY = needY / ((srcHeight * cover) / 2);
  return Math.max(0.2, zoomX, zoomY);
}

/**
 * Minimum zoom that keeps every crop-frame corner inside the source after the
 * perspective warp. Offsets are ignored on purpose: `clampOffset()` then finds
 * the largest centred pan that is still valid at this zoom.
 */
export function minimumZoomForTransform(
  viewport: Size,
  srcWidth: number,
  srcHeight: number,
  transform: TransformState,
  frame: FrameRect,
): number {
  const base = minimumZoom(
    viewport,
    srcWidth,
    srcHeight,
    totalRotation(transform),
    frame,
  );
  const warp = perspectiveWarp(transform);
  if (Math.abs(warp.a) < 1e-4 && Math.abs(warp.b) < 1e-4) return base;

  const cover = Math.max(viewport.width / srcWidth, viewport.height / srcHeight) || 1;
  const radians = totalRotation(transform) * DEG;
  const corners = frameCorners(frame);
  const halfW = (srcWidth * cover) / 2;
  const halfH = (srcHeight * cover) / 2;
  const fits = (zoom: number): boolean => {
    const sx = halfW * zoom * (transform.flipH ? -1 : 1);
    const sy = halfH * zoom * (transform.flipV ? -1 : 1);
    for (const corner of corners) {
      const local = inverseRotatePoint(corner, radians);
      const q = unwarpPoint(
        { x: local.x / sx, y: local.y / sy },
        warp,
      );
      if (Math.abs(q.x) > 1.00001 || Math.abs(q.y) > 1.00001) return false;
    }
    return true;
  };

  if (fits(base)) return base;
  let lo = base;
  let hi = Math.max(base, 12);
  if (!fits(hi)) return hi;
  for (let i = 0; i < 24; i += 1) {
    const mid = (lo + hi) / 2;
    if (fits(mid)) hi = mid;
    else lo = mid;
  }
  return hi;
}

function offsetFits(
  viewport: Size,
  srcWidth: number,
  srcHeight: number,
  transform: TransformState,
  frame: FrameRect,
  x: number,
  y: number,
): boolean {
  const geometry = imageGeometry(viewport, srcWidth, srcHeight, transform);
  const warp = perspectiveWarp(transform);
  for (const corner of frameCorners(frame)) {
    const local = inverseRotatePoint(corner, geometry.radians);
    const q = unwarpPoint(
      { x: local.x / geometry.sx - x, y: local.y / geometry.sy - y },
      warp,
    );
    if (Math.abs(q.x) > 1.00001 || Math.abs(q.y) > 1.00001) return false;
  }
  return true;
}

/** Clamp the local pan offset so all four frame corners stay on the image. */
export function clampOffset(
  viewport: Size,
  srcWidth: number,
  srcHeight: number,
  transform: TransformState,
  frame: FrameRect,
): { x: number; y: number } {
  const warp = perspectiveWarp(transform);
  if (Math.abs(warp.a) > 1e-4 || Math.abs(warp.b) > 1e-4) {
    const targetX = transform.offsetX;
    const targetY = transform.offsetY;
    // Offsets are clamped radially towards the centre. A per-axis clamp would
    // need the intersection of four skewed polygons; the radial fallback is
    // smooth, monotonic and keeps the gesture feeling like a rubber edge.
    if (offsetFits(viewport, srcWidth, srcHeight, transform, frame, targetX, targetY)) {
      return { x: targetX, y: targetY };
    }
    if (!offsetFits(viewport, srcWidth, srcHeight, transform, frame, 0, 0)) {
      return { x: 0, y: 0 };
    }
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 22; i += 1) {
      const mid = (lo + hi) / 2;
      if (offsetFits(viewport, srcWidth, srcHeight, transform, frame, targetX * mid, targetY * mid)) {
        lo = mid;
      } else {
        hi = mid;
      }
    }
    return { x: targetX * lo, y: targetY * lo };
  }

  const geometry = imageGeometry(viewport, srcWidth, srcHeight, transform);
  const corners = frameCorners(frame);
  let minX = -Infinity;
  let maxX = Infinity;
  let minY = -Infinity;
  let maxY = Infinity;
  for (const corner of corners) {
    const local = inverseRotatePoint(corner, geometry.radians);
    const px = local.x / geometry.sx;
    const py = local.y / geometry.sy;
    minX = Math.max(minX, px - 1);
    maxX = Math.min(maxX, px + 1);
    minY = Math.max(minY, py - 1);
    maxY = Math.min(maxY, py + 1);
  }
  if (minX > maxX) {
    minX = maxX = (minX + maxX) / 2;
  }
  if (minY > maxY) {
    minY = maxY = (minY + maxY) / 2;
  }
  return {
    x: clamp(transform.offsetX, minX, maxX),
    y: clamp(transform.offsetY, minY, maxY),
  };
}

/** Convert a screen-space delta into a local normalized offset delta. */
export function screenDeltaToLocal(
  dx: number,
  dy: number,
  geometry: ImageGeometry,
): Point {
  const local = inverseRotatePoint({ x: dx, y: dy }, geometry.radians);
  return { x: local.x / geometry.sx, y: local.y / geometry.sy };
}

/**
 * Source pixels for the four crop-frame corners. Used only at export time, so
 * this is where the full-resolution image is sampled.
 */
export function cropQuad(
  viewport: Size,
  srcWidth: number,
  srcHeight: number,
  transform: TransformState,
  frame: FrameRect,
): Quad {
  const geometry = imageGeometry(viewport, srcWidth, srcHeight, transform);
  const warp = perspectiveWarp(transform);
  const corners = frameCorners(frame);
  const points = corners.map((corner) => {
    const local = inverseRotatePoint(corner, geometry.radians);
    const ux = local.x / geometry.sx - transform.offsetX;
    const uy = local.y / geometry.sy - transform.offsetY;
    const source = unwarpPoint({ x: ux, y: uy }, warp);
    return {
      x: ((source.x + 1) / 2) * srcWidth,
      y: ((source.y + 1) / 2) * srcHeight,
    };
  });
  return { tl: points[0], tr: points[1], br: points[2], bl: points[3] };
}

/** Row-major 3x3 matrix. */
export type Mat3 = [
  number, number, number,
  number, number, number,
  number, number, number,
];

/**
 * Homography that maps output pixels (0..width, 0..height) onto the four
 * source pixels of `quad` (tl, tr, br, bl). Used by the export rasteriser:
 * a quad that is not a parallelogram cannot be described by a 2D affine
 * transform, and Canvas2D has no projective drawImage.
 */
export function homographyFromQuad(quad: Quad, width: number, height: number): Mat3 {
  const x0 = quad.tl.x;
  const y0 = quad.tl.y;
  const x1 = quad.tr.x;
  const y1 = quad.tr.y;
  const x2 = quad.br.x;
  const y2 = quad.br.y;
  const x3 = quad.bl.x;
  const y3 = quad.bl.y;
  const dx3 = x0 - x1 + x2 - x3;
  const dy3 = y0 - y1 + y2 - y3;
  let a: number;
  let b: number;
  let c: number;
  let d: number;
  let e: number;
  let f: number;
  let g = 0;
  let h = 0;
  if (Math.abs(dx3) < 1e-7 && Math.abs(dy3) < 1e-7) {
    a = x1 - x0;
    b = x2 - x1;
    c = x0;
    d = y1 - y0;
    e = y2 - y1;
    f = y0;
  } else {
    const dx1 = x1 - x2;
    const dx2 = x3 - x2;
    const dy1 = y1 - y2;
    const dy2 = y3 - y2;
    const den = dx1 * dy2 - dx2 * dy1;
    if (Math.abs(den) < 1e-7) {
      a = x1 - x0;
      b = x2 - x1;
      c = x0;
      d = y1 - y0;
      e = y2 - y1;
      f = y0;
    } else {
      g = (dx3 * dy2 - dx2 * dy3) / den;
      h = (dx1 * dy3 - dx3 * dy1) / den;
      a = x1 - x0 + g * x1;
      b = x3 - x0 + h * x3;
      c = x0;
      d = y1 - y0 + g * y1;
      e = y3 - y0 + h * y3;
      f = y0;
    }
  }
  const w = Math.max(1, width);
  const v = Math.max(1, height);
  return [a / w, b / v, c, d / w, e / v, f, g / w, h / v, 1];
}

/** Map one output pixel through a homography; `w` is returned for the GPU. */
export function projectHomography(
  matrix: Mat3,
  x: number,
  y: number,
): { x: number; y: number; w: number } {
  const w = matrix[6] * x + matrix[7] * y + matrix[8];
  if (Math.abs(w) < 1e-9) {
    return { x: 0, y: 0, w: 1 };
  }
  return {
    x: (matrix[0] * x + matrix[1] * y + matrix[2]) / w,
    y: (matrix[3] * x + matrix[4] * y + matrix[5]) / w,
    w,
  };
}

export function distance(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function quadSize(quad: Quad): Size {
  return {
    width: Math.max(1, Math.round(distance(quad.tl, quad.tr))),
    height: Math.max(1, Math.round(distance(quad.tl, quad.bl))),
  };
}

export function pointerDistance(points: Point[]): number {
  if (points.length < 2) return 0;
  return distance(points[0], points[1]);
}

export function pointerMidpoint(points: Point[]): Point {
  if (!points.length) return { x: 0, y: 0 };
  let x = 0;
  let y = 0;
  for (const point of points) {
    x += point.x;
    y += point.y;
  }
  return { x: x / points.length, y: y / points.length };
}
