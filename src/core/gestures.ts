import type { EditorState, FrameRect, Point, Size, TransformState } from './types';
import {
  clamp,
  clampOffset,
  imageGeometry,
  inverseRotatePoint,
  minimumZoomForTransform,
  perspectiveWarp,
  pointerDistance,
  pointerMidpoint,
  screenDeltaToLocal,
  unwarpPoint,
  warpPoint,
} from './math';

export interface GestureHost {
  readonly stage: HTMLElement;
  readonly maxZoom: number;
  viewport(): Size;
  frame(): FrameRect;
  source(): Size;
  state(): EditorState;
  setTransform(patch: Partial<TransformState>): void;
  commit(): void;
  settle(target: Partial<TransformState>, duration?: number): void;
}

interface PointerSample {
  x: number;
  y: number;
}

interface PanStart {
  id: number;
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
  moved: boolean;
}

interface PinchStart {
  distance: number;
  mid: Point;
  zoom: number;
  offsetX: number;
  offsetY: number;
}

const ELASTIC = 0.24;

export class GestureController {
  private host: GestureHost;
  private pointers = new Map<number, PointerSample>();
  private panStart: PanStart | null = null;
  private pinchStart: PinchStart | null = null;
  private lastTap = { at: 0, x: 0, y: 0 };
  private wheelTimer: number | null = null;
  private disposed = false;
  private enabled = true;

  private onPointerDown = (event: PointerEvent): void => {
    if (!this.enabled) return;
    if (!event.isPrimary && this.pointers.size === 0) return;
    const target = event.target as Element | null;
    if (target?.closest('[data-gesture-ignore]')) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (this.pointers.size === 1) {
      const state = this.host.state();
      this.panStart = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        offsetX: state.transform.offsetX,
        offsetY: state.transform.offsetY,
        moved: false,
      };
      this.pinchStart = null;
    } else if (this.pointers.size === 2) {
      this.beginPinch();
    }
    this.host.stage.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  };

  private onPointerMove = (event: PointerEvent): void => {
    if (!this.pointers.has(event.pointerId)) return;
    this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (this.pointers.size === 1 && this.panStart) {
      this.pan();
    } else if (this.pointers.size >= 2 && this.pinchStart) {
      this.pinch();
    }
    event.preventDefault();
  };

  private onPointerUp = (event: PointerEvent): void => {
    if (!this.pointers.has(event.pointerId)) return;
    const wasSingle = this.pointers.size === 1;
    const pan = this.panStart;
    this.pointers.delete(event.pointerId);
    if (this.pointers.size === 0) {
      this.panStart = null;
      this.pinchStart = null;
      this.finish(wasSingle, pan, event);
    } else if (this.pointers.size === 1) {
      // Keep the remaining finger as a fresh pan anchor instead of jumping.
      const [id, sample] = Array.from(this.pointers.entries())[0];
      const state = this.host.state();
      this.panStart = {
        id,
        x: sample.x,
        y: sample.y,
        offsetX: state.transform.offsetX,
        offsetY: state.transform.offsetY,
        moved: true,
      };
      this.pinchStart = null;
    }
  };

  private onPointerCancel = (event: PointerEvent): void => {
    this.pointers.delete(event.pointerId);
    if (this.pointers.size === 0) {
      this.panStart = null;
      this.pinchStart = null;
      this.settle();
    }
  };

  private onWheel = (event: WheelEvent): void => {
    if (!this.enabled) return;
    event.preventDefault();
    const rect = this.host.stage.getBoundingClientRect();
    const point = {
      x: event.clientX - rect.left - rect.width / 2,
      y: event.clientY - rect.top - rect.height / 2,
    };
    const state = this.host.state();
    const factor = Math.exp(-event.deltaY * 0.0018);
    const zoom = this.softZoom(state.transform.zoom * factor);
    const target = this.zoomAround(zoom, point, state.transform);
    this.host.setTransform(target);
    if (this.wheelTimer !== null) window.clearTimeout(this.wheelTimer);
    this.wheelTimer = window.setTimeout(() => {
      this.wheelTimer = null;
      this.settle();
    }, 220);
  };

  constructor(host: GestureHost) {
    this.host = host;
    const stage = host.stage;
    stage.addEventListener('pointerdown', this.onPointerDown);
    stage.addEventListener('pointermove', this.onPointerMove);
    stage.addEventListener('pointerup', this.onPointerUp);
    stage.addEventListener('pointercancel', this.onPointerCancel);
    stage.addEventListener('wheel', this.onWheel, { passive: false });
  }

  private beginPinch(): void {
    const points = Array.from(this.pointers.values());
    const state = this.host.state();
    const rect = this.host.stage.getBoundingClientRect();
    const mid = pointerMidpoint(points);
    this.pinchStart = {
      distance: Math.max(1, pointerDistance(points)),
      mid: {
        x: mid.x - rect.left - rect.width / 2,
        y: mid.y - rect.top - rect.height / 2,
      },
      zoom: state.transform.zoom,
      offsetX: state.transform.offsetX,
      offsetY: state.transform.offsetY,
    };
    this.panStart = null;
  }

  private stagePoint(clientX: number, clientY: number): Point {
    const rect = this.host.stage.getBoundingClientRect();
    return {
      x: clientX - rect.left - rect.width / 2,
      y: clientY - rect.top - rect.height / 2,
    };
  }

  private pan(): void {
    const start = this.panStart;
    if (!start) return;
    const state = this.host.state();
    const geometry = imageGeometry(
      this.host.viewport(),
      this.host.source().width,
      this.host.source().height,
      state.transform,
    );
    const dx = (this.pointers.get(start.id)?.x ?? start.x) - start.x;
    const dy = (this.pointers.get(start.id)?.y ?? start.y) - start.y;
    if (!start.moved && Math.hypot(dx, dy) > 2.5) start.moved = true;
    const delta = screenDeltaToLocal(dx, dy, geometry);
    const rawX = start.offsetX + delta.x;
    const rawY = start.offsetY + delta.y;
    this.applyOffsets(rawX, rawY, state.transform, true);
  }

  private pinch(): void {
    const start = this.pinchStart;
    if (!start) return;
    const points = Array.from(this.pointers.values());
    const distance = Math.max(1, pointerDistance(points));
    const state = this.host.state();
    const zoom = this.softZoom(start.zoom * (distance / start.distance));
    const current = this.pointers.values().next().value as PointerSample | undefined;
    const rect = this.host.stage.getBoundingClientRect();
    const mid = pointerMidpoint(points);
    const m = { x: mid.x - rect.left - rect.width / 2, y: mid.y - rect.top - rect.height / 2 };
    const target = this.zoomAround(zoom, m, { ...state.transform, zoom: start.zoom, offsetX: start.offsetX, offsetY: start.offsetY }, start.mid, current);
    this.host.setTransform(target);
  }

  /**
   * Compute offsets so the image point under `anchorStart` (when the gesture
   * began) sits under `anchorNow`. Passing neither anchors zooms around the
   * viewport centre.
   */
  private zoomAround(
    zoom: number,
    anchorNow: Point,
    base: TransformState,
    anchorStart?: Point,
    _sample?: PointerSample | null,
    elastic = true,
  ): Partial<TransformState> {
    const viewport = this.host.viewport();
    const source = this.host.source();
    const startAnchor = anchorStart || anchorNow;
    const baseGeometry = imageGeometry(viewport, source.width, source.height, base);
    const warp = perspectiveWarp(base);
    const local = inverseRotatePoint(startAnchor, baseGeometry.radians);
    // Keep the un-warped source point under the anchor, then re-apply the same
    // projective warp for the new zoom. With no tilt this reduces to the old
    // affine formula.
    const sourcePoint = unwarpPoint(
      {
        x: local.x / baseGeometry.sx - base.offsetX,
        y: local.y / baseGeometry.sy - base.offsetY,
      },
      warp,
    );
    const warped = warpPoint(sourcePoint, warp);
    const next = imageGeometry(viewport, source.width, source.height, { ...base, zoom });
    const now = inverseRotatePoint(anchorNow, next.radians);
    let offsetX = now.x / next.sx - warped.x;
    let offsetY = now.y / next.sy - warped.y;
    const clamped = clampOffset(viewport, source.width, source.height, { ...base, zoom, offsetX, offsetY }, this.host.frame());
    if (elastic) {
      offsetX = clamped.x + (offsetX - clamped.x) * ELASTIC;
      offsetY = clamped.y + (offsetY - clamped.y) * ELASTIC;
    } else {
      offsetX = clamped.x;
      offsetY = clamped.y;
    }
    return { zoom, offsetX, offsetY };
  }

  private softZoom(zoom: number): number {
    const min = this.minimum();
    const max = this.host.maxZoom;
    // Resist past the limits, but cap the overshoot. Without the cap a single
    // large wheel notch can ask for a 5-digit zoom and flash a broken frame
    // until the settle animation starts.
    if (zoom < min) return Math.max(min * 0.6, min + (zoom - min) * 0.35);
    if (zoom > max) return Math.min(max * 1.15, max + (zoom - max) * 0.35);
    return zoom;
  }

  private minimum(): number {
    const viewport = this.host.viewport();
    const source = this.host.source();
    const state = this.host.state();
    return minimumZoomForTransform(
      viewport,
      source.width,
      source.height,
      state.transform,
      this.host.frame(),
    );
  }

  private applyOffsets(
    rawX: number,
    rawY: number,
    base: TransformState,
    elastic: boolean,
  ): void {
    const viewport = this.host.viewport();
    const source = this.host.source();
    const frame = this.host.frame();
    const probe = { ...base, offsetX: rawX, offsetY: rawY };
    const clamped = clampOffset(viewport, source.width, source.height, probe, frame);
    const x = elastic ? clamped.x + (rawX - clamped.x) * ELASTIC : clamped.x;
    const y = elastic ? clamped.y + (rawY - clamped.y) * ELASTIC : clamped.y;
    this.host.setTransform({ offsetX: x, offsetY: y });
  }

  private settle(): void {
    const state = this.host.state();
    const viewport = this.host.viewport();
    const source = this.host.source();
    const frame = this.host.frame();
    const min = this.minimum();
    const zoom = clamp(state.transform.zoom, min, this.host.maxZoom);
    const clamped = clampOffset(
      viewport,
      source.width,
      source.height,
      { ...state.transform, zoom },
      frame,
    );
    const needs =
      Math.abs(zoom - state.transform.zoom) > 0.001 ||
      Math.abs(clamped.x - state.transform.offsetX) > 0.0005 ||
      Math.abs(clamped.y - state.transform.offsetY) > 0.0005;
    if (needs) {
      this.host.settle({ zoom, offsetX: clamped.x, offsetY: clamped.y }, 420);
    } else {
      this.host.commit();
    }
  }

  private finish(single: boolean, pan: PanStart | null, event: PointerEvent): void {
    if (single && pan && !pan.moved) {
      const now = Date.now();
      const tapDistance = Math.hypot(event.clientX - this.lastTap.x, event.clientY - this.lastTap.y);
      if (now - this.lastTap.at < 320 && tapDistance < 22) {
        this.lastTap = { at: 0, x: 0, y: 0 };
        this.doubleTap(this.stagePoint(event.clientX, event.clientY));
        return;
      }
      this.lastTap = { at: now, x: event.clientX, y: event.clientY };
    }
    this.settle();
  }

  private doubleTap(point: Point): void {
    const state = this.host.state();
    const min = this.minimum();
    const zoom = state.transform.zoom > min * 1.35 ? min : Math.min(this.host.maxZoom, min * 2.2);
    // A double tap is a committed zoom, so land exactly on the clamped offset
    // instead of keeping the pinch overstretch.
    const target = this.zoomAround(zoom, point, state.transform, undefined, undefined, false);
    this.host.settle(target, 380);
  }

  setEnabled(value: boolean): void {
    if (this.enabled === value) return;
    this.enabled = value;
    if (!value) {
      this.pointers.clear();
      this.panStart = null;
      this.pinchStart = null;
    }
  }

  destroy(): void {
    if (this.disposed) return;
    this.disposed = true;
    const stage = this.host.stage;
    stage.removeEventListener('pointerdown', this.onPointerDown);
    stage.removeEventListener('pointermove', this.onPointerMove);
    stage.removeEventListener('pointerup', this.onPointerUp);
    stage.removeEventListener('pointercancel', this.onPointerCancel);
    stage.removeEventListener('wheel', this.onWheel);
    if (this.wheelTimer !== null) window.clearTimeout(this.wheelTimer);
  }
}
