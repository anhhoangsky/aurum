import type {
  AutoAnalysis,
  AutoResult,
  BeautyMask,
  CurveChannel,
  CurvePoint,
  EditorEvents,
  EditorState,
  EnhanceSpec,
  EnhanceState,
  EventHandler,
  EventName,
  ExportOptions,
  FaceAnchor,
  FaceBox,
  FrameRect,
  HSLBandId,
  HSLBandState,
  ImageSource,
  LiquifyDab,
  LiquifyField,
  Point,
  SetStateOptions,
  Size,
  TransformState,
} from './types';
import {
  ADJUST_KEYS,
  ADJUST_RANGES,
  clamp,
  cloneState,
  defaultCrop,
  defaultCurves,
  defaultHSL,
  defaultRetouch,
  defaultState,
  defaultTransform,
  HSL_BANDS,
  isAspect,
  normalizeCurve,
  normalizeEnhance,
  normalizeState,
} from './state';
import { History } from './history';
import { GestureController, type GestureHost } from './gestures';
import { Renderer, exportImage } from './renderer';
import {
  buildEnhanceSpec,
  cssFilter,
  packFaceAnchors,
  packFaces,
  presetById,
  vignetteAmount,
} from './color';
import {
  probeCapabilities,
  resolveColorSpace,
  resolveDither,
  type AurumCapabilities,
  type ColorSpaceMode,
  type DitherMode,
  type RenderColorSpace,
} from './capabilities';
import { buildCurveLUT } from './enhance/curves';
import { buildLUT, lutById } from './enhance/lut';
import { analyzeBitmap, autoAdjust } from './enhance/analyze';
import {
  abortError,
  getAIAdapter,
  isAbortError,
  type AIPipelineOptions,
  runAIPipeline,
} from './enhance/ai';
import {
  clampOffset,
  cropQuad,
  frameRect,
  imageGeometry,
  inverseRotatePoint,
  minimumZoomForTransform,
  perspectiveWarp,
  quadSize,
  rotatePoint,
  totalRotation,
  unwarpPoint,
  warpPoint,
} from './math';
import {
  buildLiquifyField,
  MAX_LIQUIFY_DABS,
  MAX_LIQUIFY_RADIUS,
} from './liquify';

export type Bitmap = ImageBitmap | HTMLImageElement | HTMLCanvasElement;

export interface AurumCoreOptions {
  container: HTMLElement | string;
  image?: ImageSource;
  maxPreview?: number;
  maxHistory?: number;
  maxZoom?: number;
  maxExport?: number;
  /** Total output pixels; keeps a 8192px export inside mobile canvas limits. */
  maxPixels?: number;
  /** Preview tap quality. `fast` keeps slider drags smooth on phones. */
  previewQuality?: 'fast' | 'high';
  /** Colour pipeline. `auto` enables linear-light on capable devices. */
  colorSpace?: ColorSpaceMode;
  /** Output dither. `auto` enables it for linear and low-tier devices. */
  dither?: DitherMode;
  background?: string;
}

interface Animation {
  id: number;
  target: Partial<TransformState> & { zoom: number; offsetX: number; offsetY: number };
  velocity: { zoom: number; offsetX: number; offsetY: number };
  last: number;
  duration: number;
  started: number;
  commit: boolean;
}

const DEFAULT_OPTIONS = {
  maxPreview: 1080,
  maxHistory: 60,
  maxZoom: 8,
  maxExport: 8192,
  maxPixels: 67_108_864,
  previewQuality: 'fast' as const,
  colorSpace: 'auto' as ColorSpaceMode,
  dither: 'auto' as DitherMode,
};

function defaultMaxPixels(): number {
  if (typeof navigator === 'undefined') return DEFAULT_OPTIONS.maxPixels;
  const ua = navigator.userAgent || '';
  const ios =
    /iP(hone|ad|od)/.test(ua) ||
    (navigator.platform === 'MacIntel' && (navigator.maxTouchPoints || 0) > 1);
  // Safari's canvas area limit is 16.7 MP on many iPhones. Desktop Chrome and
  // Firefox handle much more, so only clamp where it is actually needed.
  return ios ? 16_777_216 : DEFAULT_OPTIONS.maxPixels;
}

function resolveContainer(container: HTMLElement | string): HTMLElement {
  if (typeof container === 'string') {
    const found = document.querySelector<HTMLElement>(container);
    if (!found) throw new Error(`Aurum: container "${container}" was not found`);
    return found;
  }
  return container;
}

function sourceSize(source: Bitmap): Size {
  if (source instanceof HTMLImageElement) {
    return {
      width: source.naturalWidth || source.width,
      height: source.naturalHeight || source.height,
    };
  }
  return { width: source.width, height: source.height };
}

async function urlToImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.decoding = 'async';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Could not load the image (check the URL and CORS headers).'));
    image.src = url;
  });
}

async function createBitmap(source: ImageSource): Promise<{ bitmap: Bitmap; owned: boolean }> {
  if (typeof source === 'string') {
    try {
      const response = await fetch(source, { mode: 'cors', credentials: 'same-origin' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      if (typeof createImageBitmap === 'function') {
        try {
          return { bitmap: await createImageBitmap(blob, { imageOrientation: 'from-image' }), owned: true };
        } catch {
          // SVG and some legacy formats cannot go through createImageBitmap.
        }
      }
      const url = URL.createObjectURL(blob);
      try {
        const image = await urlToImage(url);
        return { bitmap: image, owned: true };
      } finally {
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      if (source.startsWith('data:') || source.startsWith('blob:')) {
        const image = await urlToImage(source);
        return { bitmap: image, owned: true };
      }
      throw error;
    }
  }
  if (source instanceof Blob) {
    if (typeof createImageBitmap === 'function') {
      try {
        return { bitmap: await createImageBitmap(source, { imageOrientation: 'from-image' }), owned: true };
      } catch {
        // Fall back to an <img> for SVG.
      }
    }
    const url = URL.createObjectURL(source);
    try {
      const image = await urlToImage(url);
      return { bitmap: image, owned: true };
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  if (source instanceof HTMLImageElement) {
    if (!source.complete) {
      await new Promise<void>((resolve, reject) => {
        source.addEventListener('load', () => resolve(), { once: true });
        source.addEventListener('error', () => reject(new Error('Could not load the image')), { once: true });
      });
    }
    if (!source.naturalWidth) throw new Error('The image has no pixels');
    return { bitmap: source, owned: false };
  }
  return { bitmap: source, owned: false };
}

async function makePreview(source: Bitmap, max: number): Promise<{ bitmap: Bitmap; owned: boolean }> {
  const size = sourceSize(source);
  const longest = Math.max(size.width, size.height);
  if (longest <= max) return { bitmap: source, owned: false };
  const scale = max / longest;
  const width = Math.max(1, Math.round(size.width * scale));
  const height = Math.max(1, Math.round(size.height * scale));
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(source, {
        resizeWidth: width,
        resizeHeight: height,
        resizeQuality: 'high',
      });
      return { bitmap, owned: true };
    } catch {
      // Canvas fallback below.
    }
  }
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create the preview canvas');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, width, height);
  return { bitmap: canvas, owned: true };
}

export class AurumCore {
  readonly stage: HTMLElement;
  readonly canvas: HTMLCanvasElement;
  readonly maxZoom: number;

  protected state: EditorState = defaultState();
  protected history: History;
  protected renderer: Renderer;
  protected gesture: GestureController;
  protected options: Required<Omit<AurumCoreOptions, 'image' | 'container'>>;

  private original: Bitmap | null = null;
  private preview: Bitmap | null = null;
  private ownsOriginal = false;
  private ownsPreview = false;
  private ready = false;
  private loading = false;
  private loadSeq = 0;
  private lastFrame: FrameRect = { x: 0, y: 0, width: 0, height: 0 };
  private lastViewport: Size = { width: 0, height: 0 };
  private dpr = 1;
  private renderPending = false;
  private raf = 0;
  private animation: Animation | null = null;
  private animationSeq = 0;
  private resizeObserver: ResizeObserver | null = null;
  private listeners = new Map<EventName, Set<(payload: never) => void>>();
  private destroyed = false;
  private commitKey = '';
  private resultMode = false;
  /** Active boxes: refined landmarks when available, otherwise the fallback. */
  private faces: FaceBox[] = [];
  /** Boxes supplied by the server detector, kept for fallback. */
  private serverFaces: FaceBox[] = [];
  /** Refined anchors currently active, or an empty list. */
  private faceAnchors: FaceAnchor[] = [];
  private beautyMask: BeautyMask | null = null;
  private facePack: { data: Float32Array; count: number } = {
    data: new Float32Array(16),
    count: 0,
  };
  private anchorPack: Uint8Array | null = null;
  private curveCache: { source: EditorState['enhance']['curves'] | null; data: Uint8Array | null } = {
    source: null,
    data: null,
  };
  private lutCache = new Map<string, Uint8Array | null>();
  private liquifyCache: {
    source: readonly LiquifyDab[] | null;
    width: number;
    height: number;
    field: LiquifyField | null;
  } = { source: null, width: 0, height: 0, field: null };
  private previewQuality = 0;
  private colorMode: RenderColorSpace;
  private ditherEnabled: boolean;
  readonly capabilities: AurumCapabilities;
  private aiSeq = 0;
  private aiController: AbortController | null = null;
  /**
   * The base image and state from before the last AI pass. AI replaces the
   * pixels rather than adjusting them, so it cannot live in the normal
   * state-only history. Keeping the previous bitmap lets the UI compare
   * before/after and undo the AI pass.
   */
  private aiBefore: {
    original: Bitmap;
    preview: Bitmap;
    ownsOriginal: boolean;
    ownsPreview: boolean;
    state: EditorState;
    history: History;
  } | null = null;

  constructor(options: AurumCoreOptions) {
    const container = resolveContainer(options.container);
    this.options = {
      maxPreview: options.maxPreview ?? DEFAULT_OPTIONS.maxPreview,
      maxHistory: options.maxHistory ?? DEFAULT_OPTIONS.maxHistory,
      maxZoom: options.maxZoom ?? DEFAULT_OPTIONS.maxZoom,
      maxExport: options.maxExport ?? DEFAULT_OPTIONS.maxExport,
      maxPixels: options.maxPixels ?? defaultMaxPixels(),
      previewQuality: options.previewQuality ?? DEFAULT_OPTIONS.previewQuality,
      colorSpace: options.colorSpace ?? DEFAULT_OPTIONS.colorSpace,
      dither: options.dither ?? DEFAULT_OPTIONS.dither,
      background: options.background ?? '#08080a',
    };
    this.capabilities = probeCapabilities();
    this.colorMode = resolveColorSpace(this.options.colorSpace, this.capabilities);
    this.ditherEnabled = resolveDither(this.options.dither, this.colorMode, this.capabilities);
    this.maxZoom = this.options.maxZoom;
    this.previewQuality = this.options.previewQuality === 'high' ? 1 : 0;
    this.history = new History(this.options.maxHistory);

    if (getComputedStyle(container).position === 'static') {
      container.style.position = 'relative';
    }
    this.stage = document.createElement('div');
    this.stage.className = 'au-stage';
    Object.assign(this.stage.style, {
      position: 'absolute',
      inset: '0',
      overflow: 'hidden',
      width: '100%',
      height: '100%',
      background: this.options.background,
      touchAction: 'none',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      cursor: 'grab',
    });
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'au-canvas';
    Object.assign(this.canvas.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      display: 'block',
    });
    this.stage.appendChild(this.canvas);
    container.appendChild(this.stage);

    this.renderer = new Renderer(this.canvas);
    const host: GestureHost = {
      stage: this.stage,
      maxZoom: this.maxZoom,
      viewport: () => this.viewport(),
      frame: () => this.currentFrame(),
      source: () => this.source(),
      state: () => this.state,
      setTransform: (patch) => this.applyTransform(patch),
      commit: () => this.commit('transform'),
      settle: (target, duration) => this.settle(target, duration),
    };
    this.gesture = new GestureController(host);

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.stage);
    } else {
      window.addEventListener('resize', this.resize);
    }
    this.resize();
    if (options.image) {
      void this.load(options.image).catch(() => undefined);
    }
  }

  /* --------------------------------------------------------------- events */

  on<K extends EventName>(name: K, handler: EventHandler<K>): () => void {
    let set = this.listeners.get(name);
    if (!set) {
      set = new Set();
      this.listeners.set(name, set);
    }
    set.add(handler as (payload: never) => void);
    return () => this.off(name, handler);
  }

  off<K extends EventName>(name: K, handler: EventHandler<K>): void {
    this.listeners.get(name)?.delete(handler as (payload: never) => void);
  }

  protected emit<K extends EventName>(name: K, payload: EditorEvents[K]): void {
    const set = this.listeners.get(name);
    if (!set) return;
    for (const handler of set) {
      try {
        (handler as (value: EditorEvents[K]) => void)(payload);
      } catch {
        // A listener must never break the render loop.
      }
    }
  }

  /* ---------------------------------------------------------- dimensions */

  get isReady(): boolean {
    return this.ready;
  }

  get isLoading(): boolean {
    return this.loading;
  }

  get accelerated(): boolean {
    return this.renderer.accelerated;
  }

  viewport(): Size {
    return {
      width: Math.max(1, this.stage.clientWidth),
      height: Math.max(1, this.stage.clientHeight),
    };
  }

  source(): Size {
    return this.original ? sourceSize(this.original) : { width: 1, height: 1 };
  }

  /**
   * Read-only reference to the loaded bitmap. The lazy Beauty module uses it
   * to build a mask; callers must not mutate or close it.
   */
  sourceBitmap(): ImageBitmap | HTMLImageElement | HTMLCanvasElement | null {
    return this.original;
  }

  currentFrame(): FrameRect {
    return frameRect(this.viewport(), this.state.crop);
  }

  getFrame(): FrameRect {
    // `lastFrame` is whatever the last paint used. Before the first paint, or
    // while the dock is still settling, callers need the live geometry.
    return this.ready ? this.currentFrame() : { ...this.lastFrame };
  }

  /**
   * The view used by Adjust/Filter result mode: the crop is contained in the
   * stage. Crop mode is the identity view. Kept in one place so pointer
   * painting and the renderer agree on where the photo is.
   */
  private paintView(): { scale: number; x: number; y: number } {
    const viewport = this.viewport();
    const frame = this.currentFrame();
    if (this.resultMode && frame.width > 1 && frame.height > 1) {
      const scale = Math.min(
        viewport.width / frame.width,
        viewport.height / frame.height,
      );
      return {
        scale,
        x: (viewport.width - frame.width * scale) / 2 - frame.x * scale,
        y: (viewport.height - frame.height * scale) / 2 - frame.y * scale,
      };
    }
    return { scale: 1, x: 0, y: 0 };
  }

  /**
   * Map a DOM pointer position to source-image UV. Returns null outside the
   * photo so a liquify stroke cannot paint into the letterbox. Preview and
   * export share the same UV space, which is what makes a brush stroke
   * resolution-independent.
   */
  sourcePointAt(clientX: number, clientY: number): Point | null {
    if (!this.ready) return null;
    const rect = this.stage.getBoundingClientRect();
    const viewport = this.viewport();
    const size = this.source();
    const transform = this.state.transform;
    const view = this.paintView();
    const px = clientX - rect.left - viewport.width / 2;
    const py = clientY - rect.top - viewport.height / 2;
    const geometry = imageGeometry(viewport, size.width, size.height, transform);
    const crop = inverseRotatePoint(
      { x: (px - view.x) / view.scale, y: (py - view.y) / view.scale },
      geometry.radians,
    );
    const warped = {
      x: crop.x / geometry.sx - transform.offsetX,
      y: crop.y / geometry.sy - transform.offsetY,
    };
    const source = unwarpPoint(warped, perspectiveWarp(transform));
    const u = (source.x + 1) / 2;
    const v = (source.y + 1) / 2;
    if (u < 0 || u > 1 || v < 0 || v > 1) return null;
    return { x: u, y: v };
  }

  /** Inverse of `sourcePointAt`, in stage-local CSS pixels. */
  screenPointAt(u: number, v: number): Point | null {
    if (!this.ready) return null;
    const viewport = this.viewport();
    const size = this.source();
    const transform = this.state.transform;
    const view = this.paintView();
    const geometry = imageGeometry(viewport, size.width, size.height, transform);
    const warped = warpPoint(
      { x: u * 2 - 1, y: v * 2 - 1 },
      perspectiveWarp(transform),
    );
    const rotated = rotatePoint(
      {
        x: (warped.x + transform.offsetX) * geometry.sx,
        y: (warped.y + transform.offsetY) * geometry.sy,
      },
      geometry.radians,
    );
    return {
      x: viewport.width / 2 + rotated.x * view.scale + view.x,
      y: viewport.height / 2 + rotated.y * view.scale + view.y,
    };
  }

  getPreviewBitmap(): Bitmap | null {
    return this.preview;
  }

  /* --------------------------------------------------------------- image */

  async load(source: ImageSource): Promise<void> {
    const seq = ++this.loadSeq;
    this.loading = true;
    this.emit('loading', { loading: true });
    try {
      const { bitmap, owned } = await createBitmap(source);
      if (seq !== this.loadSeq) {
        if (owned && bitmap instanceof ImageBitmap) bitmap.close();
        return;
      }
      const preview = await makePreview(bitmap, this.options.maxPreview);
      if (seq !== this.loadSeq) {
        if (owned && bitmap instanceof ImageBitmap) bitmap.close();
        if (preview.owned && preview.bitmap instanceof ImageBitmap) preview.bitmap.close();
        return;
      }
      this.releaseBitmaps();
      this.original = bitmap;
      this.ownsOriginal = owned;
      this.preview = preview.bitmap;
      this.ownsPreview = preview.owned;
      this.beautyMask = null;
      this.renderer.setBitmap(preview.bitmap);
      this.ready = true;
      this.loading = false;

      const size = sourceSize(bitmap);
      this.state = defaultState();
      // A new image starts from a fresh fit; do not let the resize guard carry
      // geometry over from the previous image or from the loading layout.
      this.lastViewport = { width: 0, height: 0 };
      this.lastFrame = { x: 0, y: 0, width: 0, height: 0 };
      this.curveCache.source = null;
      this.state.crop.ratio = size.width / size.height;
      // Start with the image fitted inside the initial frame instead of
      // cover-scaled past the viewport. ensureCoverage lifts 0.2 to the exact
      // minimum zoom for the frame.
      this.state.transform.zoom = 0.2;
      this.ensureCoverage();
      this.history.reset(this.state);
      // Let layout settle before the first render, but do not depend on rAF:
      // hidden tabs pause it, which would leave the UI stuck in its busy state.
      await new Promise<void>((resolve) => {
        let settled = false;
        const done = (): void => {
          if (settled) return;
          settled = true;
          resolve();
        };
        requestAnimationFrame(done);
        window.setTimeout(done, 120);
      });
      this.resize();
      this.renderNow();
      this.emit('ready', size);
      this.emit('loading', { loading: false });
      this.emitState();
      this.emitHistory();
    } catch (error) {
      this.loading = false;
      this.emit('loading', { loading: false });
      const err = error instanceof Error ? error : new Error(String(error));
      this.emit('error', { error: err });
      throw err;
    }
  }

  setImage(source: ImageSource): Promise<void> {
    return this.load(source);
  }

  private releaseBitmaps(): void {
    this.disposeAIBefore();
    if (this.ownsOriginal && this.original instanceof ImageBitmap) this.original.close();
    if (this.ownsPreview && this.preview instanceof ImageBitmap && this.preview !== this.original) {
      this.preview.close();
    }
    this.original = null;
    this.preview = null;
    this.ownsOriginal = false;
    this.ownsPreview = false;
  }

  /* --------------------------------------------------------------- state */

  getState(): EditorState {
    return cloneState(this.state);
  }

  setState(input: unknown, options: SetStateOptions = {}): void {
    this.state = normalizeState(input);
    this.curveCache.source = null;
    if (this.ready) {
      this.ensureCoverage();
      if (options.history !== false) {
        this.history.push(this.state, 'set-state');
      }
      this.scheduleRender();
    }
    if (!options.silent) {
      this.emitState();
      this.emitHistory();
    }
  }

  exportState(): string {
    return JSON.stringify({ version: 1, state: this.getState() }, null, 2);
  }

  importState(value: string | object): void {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    const state = parsed && typeof parsed === 'object' && 'state' in parsed
      ? (parsed as { state: unknown }).state
      : parsed;
    this.setState(state);
  }

  setAdjust(key: keyof EditorState['adjust'], value: number, coalesce?: string): void {
    const range = ADJUST_RANGES[key];
    if (!range || !Number.isFinite(value)) return;
    const next = clamp(value, range[0], range[1]);
    if (this.state.adjust[key] === next) return;
    this.state.adjust[key] = next;
    this.scheduleRender();
    this.commit(coalesce || `adjust:${key}`);
  }

  resetAdjust(key: keyof EditorState['adjust']): void {
    this.setAdjust(key, 0, `reset:${key}`);
  }

  resetAdjustments(): void {
    let changed = false;
    for (const key of ADJUST_KEYS) {
      if (this.state.adjust[key] !== 0) {
        this.state.adjust[key] = 0;
        changed = true;
      }
    }
    if (!changed) return;
    this.scheduleRender();
    this.commit('reset-adjust');
  }

  setFilter(id: string): void {
    const preset = presetById(id);
    if (this.state.filter === preset.id) return;
    this.state.filter = preset.id;
    this.scheduleRender();
    this.commit('filter');
  }

  /* ---------------------------------------------------------- enhancement */

  /** Replace one tone curve. Points are normalised to 0..1 and sorted. */
  setCurve(channel: CurveChannel, points: CurvePoint[], coalesce = 'curve'): void {
    const curves = this.state.enhance.curves;
    if (!(channel in curves)) return;
    const next = normalizeCurve(points);
    const current = curves[channel];
    if (
      current.length === next.length &&
      current.every(
        (point, index) =>
          Math.abs(point.x - next[index].x) < 1e-5 &&
          Math.abs(point.y - next[index].y) < 1e-5,
      )
    ) {
      return;
    }
    curves[channel] = next;
    this.curveCache.source = null;
    this.scheduleRender();
    this.commit(coalesce);
  }

  resetCurves(): void {
    this.state.enhance.curves = defaultCurves();
    this.curveCache.source = null;
    this.scheduleRender();
    this.commit('reset-curves');
  }

  /** Patch one 8-band HSL mixer band. */
  setHSL(band: HSLBandId, patch: Partial<HSLBandState>, coalesce = 'hsl'): void {
    if (!HSL_BANDS.includes(band)) return;
    const current = this.state.enhance.hsl[band];
    const next: HSLBandState = {
      hue: clamp(patch.hue ?? current.hue, -100, 100),
      saturation: clamp(patch.saturation ?? current.saturation, -100, 100),
      luminance: clamp(patch.luminance ?? current.luminance, -100, 100),
    };
    if (
      next.hue === current.hue &&
      next.saturation === current.saturation &&
      next.luminance === current.luminance
    ) {
      return;
    }
    this.state.enhance.hsl[band] = next;
    this.scheduleRender();
    this.commit(coalesce);
  }

  resetHSL(): void {
    this.state.enhance.hsl = defaultHSL();
    this.scheduleRender();
    this.commit('reset-hsl');
  }

  /** Select a built-in procedural 3D LUT. Unknown ids fall back to `none`. */
  setLUT(id: string, strength?: number): void {
    const preset = lutById(id);
    const nextStrength =
      strength === undefined
        ? this.state.enhance.lutStrength
        : clamp(strength, 0, 100);
    if (this.state.enhance.lut === preset.id && this.state.enhance.lutStrength === nextStrength) {
      return;
    }
    this.state.enhance.lut = preset.id;
    this.state.enhance.lutStrength = nextStrength;
    this.scheduleRender();
    this.commit('lut');
  }

  setLUTStrength(value: number, coalesce = 'lut-strength'): void {
    const next = clamp(value, 0, 100);
    if (this.state.enhance.lutStrength === next) return;
    this.state.enhance.lutStrength = next;
    this.scheduleRender();
    this.commit(coalesce);
  }

  /** Merge a partial non-scalar enhance state (curves, HSL, LUT, auto flag). */
  setEnhance(patch: Partial<EnhanceState>, coalesce = 'enhance'): void {
    const before = JSON.stringify(this.state.enhance);
    const next = normalizeEnhance({
      ...this.state.enhance,
      ...patch,
      curves: { ...this.state.enhance.curves, ...(patch.curves || {}) },
      hsl: { ...this.state.enhance.hsl, ...(patch.hsl || {}) },
    });
    if (JSON.stringify(next) === before) return;
    this.state.enhance = next;
    this.curveCache.source = null;
    this.scheduleRender();
    this.commit(coalesce);
  }

  resetEnhance(): void {
    this.state.enhance = normalizeEnhance(null);
    this.curveCache.source = null;
    this.scheduleRender();
    this.commit('reset-enhance');
  }

  /** `fast` uses 4-tap blurs for preview; `high` uses 8-tap blurs. */
  setPreviewQuality(quality: 'fast' | 'high'): void {
    this.previewQuality = quality === 'high' ? 1 : 0;
    this.options.previewQuality = quality;
    this.scheduleRender();
  }

  /** Resolved colour pipeline used by preview and export. */
  get colorSpace(): RenderColorSpace {
    return this.colorMode;
  }

  get dither(): boolean {
    return this.ditherEnabled;
  }

  /**
   * Switch between the legacy sRGB pipeline and the hybrid linear-light one.
   * This is a render option, not edit state: it does not enter undo history,
   * but it is applied identically to preview and export.
   */
  setColorSpace(mode: ColorSpaceMode): void {
    this.options.colorSpace = mode;
    const next = resolveColorSpace(mode, this.capabilities);
    this.ditherEnabled = resolveDither(this.options.dither, next, this.capabilities);
    if (next === this.colorMode) return;
    this.colorMode = next;
    this.scheduleRender();
  }

  setDither(mode: DitherMode): void {
    this.options.dither = mode;
    this.ditherEnabled = resolveDither(mode, this.colorMode, this.capabilities);
    this.scheduleRender();
  }

  /**
   * Supply face boxes from a server-side detector. No model runs in the
   * browser: the boxes only steer skin smoothing, tone and the coarse face
   * geometry towards faces. Calling this drops any active landmark anchors;
   * supply them again with `setFaceAnchors()` once they are ready.
   */
  setFaces(faces: FaceBox[]): void {
    this.serverFaces = this.normalizeFaceBoxes(faces);
    this.faceAnchors = [];
    this.anchorPack = null;
    this.faces = this.serverFaces.map((face) => ({ ...face }));
    this.facePack = packFaces(this.faces);
    this.scheduleRender();
  }

  /**
   * Attach refined anchors from the optional, lazily loaded landmark module.
   * The boxes become the active face ellipses and the feature anchors replace
   * the shader's face-relative defaults. Passing `null` or an empty list
   * restores the server boxes and the procedural anchors, so this API can be
   * added without making MediaPipe a requirement.
   */
  setFaceAnchors(anchors: FaceAnchor[] | null): void {
    if (!Array.isArray(anchors) || !anchors.length) {
      this.faceAnchors = [];
      this.anchorPack = null;
      this.faces = this.serverFaces.map((face) => ({ ...face }));
      this.facePack = packFaces(this.faces);
      this.scheduleRender();
      return;
    }
    const pack = packFaceAnchors(anchors);
    if (!pack.count) {
      this.faceAnchors = [];
      this.anchorPack = null;
      this.faces = this.serverFaces.map((face) => ({ ...face }));
      this.facePack = packFaces(this.faces);
    } else {
      this.faceAnchors = anchors.slice();
      this.faces = pack.boxes.map((face) => ({ ...face }));
      this.facePack = { data: pack.data, count: pack.count };
      this.anchorPack = pack.anchors;
    }
    this.scheduleRender();
  }

  /** Explicit fallback path for consumers that want to undo a landmark pass. */
  clearFaceAnchors(): void {
    this.setFaceAnchors(null);
  }

  private normalizeFaceBoxes(faces: FaceBox[]): FaceBox[] {
    return faces
      .filter(
        (face) =>
          Number.isFinite(face.x) &&
          Number.isFinite(face.y) &&
          Number.isFinite(face.w) &&
          Number.isFinite(face.h) &&
          face.w > 0 &&
          face.h > 0,
      )
      .map((face) => ({
        x: clamp(face.x, 0, 1),
        y: clamp(face.y, 0, 1),
        w: clamp(face.w, 0, 1),
        h: clamp(face.h, 0, 1),
        confidence: Number.isFinite(face.confidence) ? face.confidence : 0,
      }));
  }

  clearFaces(): void {
    this.serverFaces = [];
    this.faceAnchors = [];
    this.faces = [];
    this.facePack = { data: new Float32Array(16), count: 0 };
    this.anchorPack = null;
    this.scheduleRender();
  }

  /** Active boxes: refined landmark boxes when present, server boxes otherwise. */
  getFaces(): FaceBox[] {
    return this.faces.map((face) => ({ ...face }));
  }

  /** True when the last landmark pass supplied anchors for the active source. */
  hasFaceAnchors(): boolean {
    return this.faceAnchors.length > 0;
  }

  /**
   * Attach a mask produced by the optional Beauty module. The mask is in
   * source-image UV space, so it survives crop, rotation and tile export.
   * Passing null returns to the procedural skin mask in the shader.
   */
  setBeautyMask(mask: BeautyMask | null): void {
    if (
      mask &&
      (!Number.isFinite(mask.width) ||
        !Number.isFinite(mask.height) ||
        mask.width < 1 ||
        mask.height < 1 ||
        mask.data.length !== mask.width * mask.height * 4)
    ) {
      return;
    }
    this.beautyMask = mask;
    this.scheduleRender();
  }

  getBeautyMask(): BeautyMask | null {
    return this.beautyMask;
  }

  /**
   * Append one free-liquify dab. Dabs are stored in source UV and rebuilt into
   * a tiny displacement texture on the next paint. Repeated dabs in one brush
   * stroke share `coalesce` so the history keeps one entry per stroke.
   */
  addLiquifyDab(dab: LiquifyDab, coalesce = 'liquify'): void {
    if (!this.ready || !dab) return;
    if (
      !Number.isFinite(dab.x) ||
      !Number.isFinite(dab.y) ||
      !Number.isFinite(dab.dx) ||
      !Number.isFinite(dab.dy) ||
      !Number.isFinite(dab.radius)
    ) {
      return;
    }
    if (Math.abs(dab.dx) + Math.abs(dab.dy) < 1e-6) return;
    const retouch = this.state.retouch || (this.state.retouch = defaultRetouch());
    retouch.liquify.push({
      x: clamp(dab.x, 0, 1),
      y: clamp(dab.y, 0, 1),
      dx: clamp(dab.dx, -0.25, 0.25),
      dy: clamp(dab.dy, -0.25, 0.25),
      radius: clamp(dab.radius, 0.002, MAX_LIQUIFY_RADIUS),
    });
    if (retouch.liquify.length > MAX_LIQUIFY_DABS) {
      retouch.liquify.splice(0, retouch.liquify.length - MAX_LIQUIFY_DABS);
    }
    // The array is mutated in place, so the field cache cannot use identity
    // alone to notice a new stroke.
    this.liquifyCache.source = null;
    this.scheduleRender();
    this.commit(coalesce || 'liquify');
  }

  /** Remove every free-liquify dab. Face sliders are untouched. */
  clearLiquify(coalesce = 'liquify-clear'): void {
    const dabs = this.state.retouch?.liquify;
    if (!dabs || dabs.length === 0) return;
    this.state.retouch = { liquify: [] };
    this.liquifyCache.source = null;
    this.scheduleRender();
    this.commit(coalesce);
  }

  getLiquify(): LiquifyDab[] {
    return (this.state.retouch?.liquify || []).map((dab) => ({ ...dab }));
  }

  hasLiquify(): boolean {
    return (this.state.retouch?.liquify.length || 0) > 0;
  }

  /** Histogram/exposure/WB/noise analysis used by Auto Enhance. */
  async analyze(): Promise<AutoAnalysis> {
    const source = this.original || this.preview;
    if (!source) throw new Error('No image loaded');
    return analyzeBitmap(source, 256, this.faces.length);
  }

  /**
   * Conservative, explainable Auto Enhance. It only writes scalar sliders, so
   * the result stays editable and undoable; it never replaces the image.
   */
  async autoEnhance(): Promise<AutoResult> {
    const analysis = await this.analyze();
    const result = autoAdjust(analysis);
    this.state.adjust = result.adjust;
    this.state.enhance.auto = true;
    this.scheduleRender();
    this.commit('auto');
    this.emit('auto', result);
    return result;
  }

  /** Abort a running AI job. The promise rejects with an AbortError. */
  cancelAI(): void {
    this.aiSeq += 1;
    if (this.aiController) {
      this.aiController.abort();
      this.aiController = null;
    }
  }

  /**
   * Run an optional registered AI adapter over the full-resolution source.
   * Nothing is bundled; the application registers a factory first. The result
   * replaces the source and a fresh preview is generated, so subsequent
   * adjustments and exports operate on the processed pixels.
   */
  async runAI(factoryId: string, options: AIPipelineOptions = {}): Promise<void> {
    const factory = getAIAdapter(factoryId);
    if (!factory) throw new Error(`AI adapter "${factoryId}" is not registered`);
    if (!this.ready || !this.original) throw new Error('No image loaded');

    this.cancelAI();
    const controller = new AbortController();
    this.aiController = controller;
    const seq = this.aiSeq;
    const signal = this.linkAbort(controller, options.signal);
    try {
      const adapter = await factory.load();
      // `runAIPipeline()` loads the adapter itself, so `load()` is not called
      // twice here. Adapter implementations should still make it idempotent.
      if (seq !== this.aiSeq) {
        adapter.dispose();
        throw abortError();
      }
      const output = await runAIPipeline(adapter, this.original, {
        ...options,
        signal,
      });
      if (seq !== this.aiSeq) throw abortError();

      const previousOriginal = this.original;
      const previousPreview = this.preview;
      const ownedOriginal = this.ownsOriginal;
      const ownedPreview = this.ownsPreview;

      this.original = output;
      this.ownsOriginal = true;
      this.beautyMask = null;
      const preview = await makePreview(output, this.options.maxPreview);
      if (seq !== this.aiSeq) {
        if (preview.owned && preview.bitmap instanceof ImageBitmap) preview.bitmap.close();
        throw abortError();
      }
      this.preview = preview.bitmap;
      this.ownsPreview = preview.owned;
      this.renderer.setBitmap(preview.bitmap);

      // Stash the pre-AI base image instead of closing it. The previous
      // history instance is detached rather than reset so undo/redo inside the
      // old edits survive the revert.
      this.disposeAIBefore();
      if (previousOriginal && previousPreview) {
        this.aiBefore = {
          original: previousOriginal,
          preview: previousPreview,
          ownsOriginal: ownedOriginal,
          ownsPreview: ownedPreview,
          state: cloneState(this.state),
          history: this.history,
        };
      } else if (ownedOriginal && previousOriginal instanceof ImageBitmap) {
        previousOriginal.close();
      }

      // The AI result is a new base image. Keep the colour adjustments, but
      // reset crop/transform so the old frame cannot point outside the new
      // dimensions (a 4x pass changes them dramatically).
      this.state.transform = defaultTransform();
      this.state.crop = {
        ...defaultCrop(),
        ratio: output.width / output.height,
      };
      this.lastViewport = { width: 0, height: 0 };
      this.lastFrame = { x: 0, y: 0, width: 0, height: 0 };
      this.curveCache.source = null;
      this.ensureCoverage();
      this.history = new History(this.options.maxHistory);
      this.history.reset(this.state);

      this.resize();
      this.fitToFrame();
      this.renderNow();
      this.emit('ready', sourceSize(output));
      this.emitState();
      this.emitHistory();
    } catch (error) {
      if (!isAbortError(error)) throw error;
    } finally {
      if (this.aiController === controller) this.aiController = null;
    }
  }

  /** True while the last AI pass can still be compared or reverted. */
  canRevertAI(): boolean {
    return this.aiBefore !== null;
  }

  /**
   * Show the pre-AI pixels in the same frame. The two previews share the same
   * aspect ratio, so swapping the bitmap gives a pixel-aligned comparison
   * without rebuilding the view transform.
   */
  setCompareAI(on: boolean): void {
    const before = this.aiBefore;
    if (!before || !this.ready) return;
    const bitmap = on ? before.preview : this.preview;
    if (!bitmap) return;
    this.renderer.setBitmap(bitmap);
    this.renderNow();
  }

  /**
   * Restore the base image, crop, transform and history from before the AI
   * pass. Edits made after the pass are discarded with it.
   */
  revertAI(): boolean {
    const before = this.aiBefore;
    if (!before) return false;
    if (this.ownsOriginal && this.original instanceof ImageBitmap) this.original.close();
    if (
      this.ownsPreview &&
      this.preview instanceof ImageBitmap &&
      this.preview !== this.original
    ) {
      this.preview.close();
    }
    this.original = before.original;
    this.preview = before.preview;
    this.ownsOriginal = before.ownsOriginal;
    this.ownsPreview = before.ownsPreview;
    this.beautyMask = null;
    this.state = before.state;
    this.history = before.history;
    this.aiBefore = null;
    this.curveCache.source = null;
    this.renderer.setBitmap(before.preview);
    this.lastViewport = { width: 0, height: 0 };
    this.lastFrame = { x: 0, y: 0, width: 0, height: 0 };
    this.resize();
    this.fitToFrame();
    this.renderNow();
    this.emit('ready', sourceSize(before.original));
    this.emitState();
    this.emitHistory();
    return true;
  }

  private disposeAIBefore(): void {
    const before = this.aiBefore;
    if (!before) return;
    this.aiBefore = null;
    if (before.ownsOriginal && before.original instanceof ImageBitmap) before.original.close();
    if (
      before.ownsPreview &&
      before.preview instanceof ImageBitmap &&
      before.preview !== before.original
    ) {
      before.preview.close();
    }
  }

  private linkAbort(controller: AbortController, external?: AbortSignal): AbortSignal {
    if (!external) return controller.signal;
    if (external.aborted) {
      controller.abort();
      return controller.signal;
    }
    external.addEventListener('abort', () => controller.abort(), { once: true });
    return controller.signal;
  }

  /** Build the shader payload, reusing the curve/LUT textures until they change. */
  private enhanceSpec(quality: number): EnhanceSpec {
    const enhance = this.state.enhance;
    if (this.curveCache.source !== enhance.curves) {
      this.curveCache.source = enhance.curves;
      this.curveCache.data = buildCurveLUT(enhance.curves);
    }
    let lut = this.lutCache.get(enhance.lut);
    if (lut === undefined) {
      lut = buildLUT(enhance.lut);
      this.lutCache.set(enhance.lut, lut);
    }
    const dabs = this.state.retouch?.liquify;
    let liquify: LiquifyField | null = null;
    if (dabs && dabs.length) {
      const size = this.source();
      const cache = this.liquifyCache;
      if (
        cache.source !== dabs ||
        cache.width !== size.width ||
        cache.height !== size.height
      ) {
        this.liquifyCache = {
          source: dabs,
          width: size.width,
          height: size.height,
          field: buildLiquifyField(dabs, size.width, size.height),
        };
      }
      liquify = this.liquifyCache.field;
    }
    return buildEnhanceSpec({
      adjust: this.state.adjust,
      enhance,
      curve: this.curveCache.data,
      lut,
      faces: this.facePack,
      quality,
      linear: this.colorMode === 'linear',
      dither: this.ditherEnabled ? 1 : 0,
      mask: this.beautyMask,
      liquify,
      anchors: this.anchorPack,
    });
  }

  setAspect(aspect: EditorState['crop']['aspect']): void {
    const current = this.currentFrame();
    if (this.state.crop.aspect === aspect && aspect !== 'free') return;
    if (aspect === 'free') {
      this.state.crop.ratio = current.width / Math.max(1, current.height);
    } else {
      this.state.crop.scale = 1;
    }
    this.state.crop.aspect = aspect;
    this.ensureCoverage();
    this.scheduleRender();
    this.commit('aspect');
  }

  setCrop(patch: Partial<EditorState['crop']>, coalesce = 'crop'): void {
    const crop = this.state.crop;
    if (patch.ratio !== undefined && Number.isFinite(patch.ratio)) {
      crop.ratio = clamp(patch.ratio, 0.2, 8);
    }
    if (patch.scale !== undefined && Number.isFinite(patch.scale)) {
      crop.scale = clamp(patch.scale, 0.2, 1);
    }
    if (patch.aspect !== undefined && isAspect(patch.aspect)) crop.aspect = patch.aspect;
    this.ensureCoverage();
    this.scheduleRender();
    this.commit(coalesce);
  }

  /**
   * Fine rotation only. The ±90° buttons change `turn` instead, so the angle
   * shown by this slider stays exactly where the user left it.
   */
  setRotation(degrees: number, coalesce = 'rotation'): void {
    if (!Number.isFinite(degrees)) return;
    const next = ((((degrees + 180) % 360) + 360) % 360) - 180;
    if (Math.abs(next - this.state.transform.rotation) < 0.01) return;
    this.state.transform.rotation = next;
    this.ensureCoverage();
    this.scheduleRender();
    this.commit(coalesce);
  }

  rotateBy(degrees: number): void {
    if (!Number.isFinite(degrees) || degrees === 0) return;
    const quarters = degrees / 90;
    if (Number.isInteger(quarters)) {
      this.state.transform.turn = (((this.state.transform.turn + quarters) % 4) + 4) % 4;
      // With a free frame the frame follows the photo: swap the ratio and
      // re-fit so a quarter turn keeps the whole image instead of cropping a
      // portrait out of a landscape frame (or the other way around).
      if (this.state.crop.aspect === 'free' && Math.abs(quarters) % 2 === 1) {
        this.state.crop.ratio = clamp(1 / this.state.crop.ratio, 0.2, 8);
        this.fitToFrame();
      } else {
        this.ensureCoverage();
        this.scheduleRender();
      }
      this.commit(`turn:${Date.now()}`);
      return;
    }
    this.setRotation(this.state.transform.rotation + degrees, `rotate:${Date.now()}`);
  }

  resetRotation(): void {
    const transform = this.state.transform;
    if (transform.turn === 0 && transform.rotation === 0) return;
    transform.turn = 0;
    transform.rotation = 0;
    this.ensureCoverage();
    this.scheduleRender();
    this.commit('reset-rotation');
  }

  flip(axis: 'h' | 'v'): void {
    if (axis === 'h') this.state.transform.flipH = !this.state.transform.flipH;
    else this.state.transform.flipV = !this.state.transform.flipV;
    this.ensureCoverage();
    this.scheduleRender();
    this.commit(`flip:${axis}`);
  }

  resetCrop(): void {
    const size = this.source();
    this.state.transform = {
      zoom: 0.2,
      turn: 0,
      rotation: 0,
      flipH: false,
      flipV: false,
      offsetX: 0,
      offsetY: 0,
      perspectiveX: 0,
      perspectiveY: 0,
    };
    this.state.crop = {
      aspect: 'free',
      ratio: size.width / Math.max(1, size.height),
      scale: 1,
    };
    this.ensureCoverage();
    this.scheduleRender();
    this.commit('reset-crop');
  }

  /**
   * Z-axis perspective correction. `perspectiveY` tilts the photo up/down
   * (positive grows the top edge), `perspectiveX` tilts it left/right
   * (positive grows the left edge). The relative zoom is preserved so
   * resetting the tilt returns to the previous framing instead of snapping.
   */
  setPerspective(
    patch: Partial<Pick<TransformState, 'perspectiveX' | 'perspectiveY'>>,
    coalesce = 'perspective',
  ): void {
    const transform = this.state.transform;
    const nextX = clamp(patch.perspectiveX ?? transform.perspectiveX, -100, 100);
    const nextY = clamp(patch.perspectiveY ?? transform.perspectiveY, -100, 100);
    if (nextX === transform.perspectiveX && nextY === transform.perspectiveY) return;

    const viewport = this.viewport();
    const size = this.source();
    const valid = this.ready && viewport.width >= 8 && viewport.height >= 8;
    if (valid) {
      const frame = frameRect(viewport, this.state.crop);
      const before = minimumZoomForTransform(
        viewport,
        size.width,
        size.height,
        transform,
        frame,
      );
      const ratio = before > 0 ? transform.zoom / before : 1;
      transform.perspectiveX = nextX;
      transform.perspectiveY = nextY;
      const after = minimumZoomForTransform(
        viewport,
        size.width,
        size.height,
        transform,
        frame,
      );
      transform.zoom = clamp(ratio * after, after, this.maxZoom);
      const clamped = clampOffset(viewport, size.width, size.height, transform, frame);
      transform.offsetX = clamped.x;
      transform.offsetY = clamped.y;
    } else {
      transform.perspectiveX = nextX;
      transform.perspectiveY = nextY;
    }
    this.scheduleRender();
    this.commit(coalesce);
  }

  resetPerspective(): void {
    if (
      this.state.transform.perspectiveX === 0 &&
      this.state.transform.perspectiveY === 0
    ) {
      return;
    }
    this.setPerspective({ perspectiveX: 0, perspectiveY: 0 }, 'reset-perspective');
  }

  reset(): void {
    const size = this.source();
    this.state = defaultState();
    this.state.crop.ratio = size.width / Math.max(1, size.height);
    this.state.transform.zoom = 0.2;
    this.ensureCoverage();
    this.scheduleRender();
    this.commit('reset');
  }

  private applyHistoryState(next: EditorState): void {
    // Fix: undo/redo must not "phóng ảnh" (jump-zoom). ensureCoverage() recomputes
    // the minimum zoom for the *current* viewport/frame and clamps the restored
    // zoom UP to that minimum. When the dock changed height or the undo was only
    // a colour/filter change, this raises zoom unexpectedly.
    // Strategy: if the restored geometry (rotation, flip, perspective, crop) is
    // unchanged, keep the live zoom/offset — only colour/enhance are reverted.
    // If geometry did change, restore zoom exactly and only clamp offset.
    const prev = this.state;
    const geomSame =
      prev.transform.turn === next.transform.turn &&
      prev.transform.rotation === next.transform.rotation &&
      prev.transform.flipH === next.transform.flipH &&
      prev.transform.flipV === next.transform.flipV &&
      prev.transform.perspectiveX === next.transform.perspectiveX &&
      prev.transform.perspectiveY === next.transform.perspectiveY &&
      prev.crop.aspect === next.crop.aspect &&
      prev.crop.ratio === next.crop.ratio &&
      prev.crop.scale === next.crop.scale &&
      Math.abs(prev.transform.zoom - next.transform.zoom) < 0.0001 &&
      Math.abs(prev.transform.offsetX - next.transform.offsetX) < 0.0001 &&
      Math.abs(prev.transform.offsetY - next.transform.offsetY) < 0.0001;
    this.state = next;
    if (geomSame) {
      // Keep live framing; do not re-clamp zoom to a new minimum.
      this.state.transform.zoom = prev.transform.zoom;
      this.state.transform.offsetX = prev.transform.offsetX;
      this.state.transform.offsetY = prev.transform.offsetY;
    } else {
      // Geometry changed: restore exact zoom/offset, clamp offset only (no min-zoom jump).
      this.state.transform.zoom = clamp(next.transform.zoom, 0.2, this.maxZoom);
      if (this.ready) {
        const viewport = this.viewport();
        if (viewport.width >= 8 && viewport.height >= 8) {
          const size = this.source();
          const frame = frameRect(viewport, this.state.crop);
          const clamped = clampOffset(viewport, size.width, size.height, this.state.transform, frame);
          this.state.transform.offsetX = clamped.x;
          this.state.transform.offsetY = clamped.y;
        }
      }
    }
    // Ensure state validity but never raise zoom to fit on history navigation.
    if (this.ready) {
      const viewport = this.viewport();
      if (viewport.width < 8 || viewport.height < 8) return;
      const size = this.source();
      if (size.width < 2 || size.height < 2) return;
      const frame = frameRect(viewport, this.state.crop);
      // If the restored framing truly can't cover the frame (e.g. after crop
      // ratio undo), fall back to covering fit — only then is a zoom-up correct.
      const min = minimumZoomForTransform(viewport, size.width, size.height, this.state.transform, frame);
      if (this.state.transform.zoom < min - 0.001) {
        // Keep close to restored zoom but guarantee coverage.
        this.state.transform.zoom = clamp(min, 0.2, this.maxZoom);
        const clamped = clampOffset(viewport, size.width, size.height, this.state.transform, frame);
        this.state.transform.offsetX = clamped.x;
        this.state.transform.offsetY = clamped.y;
      }
      this.lastViewport = viewport;
    }
  }

  undo(): boolean {
    // AI is not a slider edit, so the first undo after a pass reverts the base
    // image. Later edits still undo normally inside the new history.
    if (this.aiBefore && !this.history.canUndo) return this.revertAI();
    const state = this.history.undo();
    if (!state) return false;
    this.applyHistoryState(state);
    this.scheduleRender();
    this.emitState();
    this.emitHistory();
    return true;
  }

  redo(): boolean {
    const state = this.history.redo();
    if (!state) return false;
    this.applyHistoryState(state);
    this.scheduleRender();
    this.emitState();
    this.emitHistory();
    return true;
  }

  canUndo(): boolean {
    return this.history.canUndo || this.aiBefore !== null;
  }

  canRedo(): boolean {
    return this.history.canRedo;
  }

  /**
   * Result mode renders only the cropped area, contained inside the stage.
   * Crop mode (the default) shows the full image with the frame overlay.
   */
  setResultMode(enabled: boolean): void {
    if (this.resultMode === enabled) return;
    this.resultMode = enabled;
    this.cancelAnimation();
    this.gesture.setEnabled(!enabled);
    this.scheduleRender();
  }

  get isResultMode(): boolean {
    return this.resultMode;
  }

  /* -------------------------------------------------------------- export */

  /** Pixel dimensions of the current crop, as `export()` would produce them. */
  getExportSize(): Size {
    if (!this.ready) return { width: 0, height: 0 };
    const viewport = this.viewport();
    if (viewport.width < 8 || viewport.height < 8) return { width: 0, height: 0 };
    const size = this.source();
    const frame = this.currentFrame();
    // Perspective changes the sampled quad, not the intended output ratio.
    // Measure the un-warped quad so a tilt cannot stretch the export.
    const natural = quadSize(
      cropQuad(
        viewport,
        size.width,
        size.height,
        { ...this.state.transform, perspectiveX: 0, perspectiveY: 0 },
        frame,
      ),
    );
    const k = this.exportScale(natural.width, natural.height);
    return {
      width: Math.max(1, Math.round(natural.width * k)),
      height: Math.max(1, Math.round(natural.height * k)),
    };
  }

  private exportScale(width: number, height: number): number {
    const longest = Math.max(1, width, height);
    const pixels = Math.max(1, width * height);
    return Math.min(
      1,
      this.options.maxExport / longest,
      Math.sqrt(this.options.maxPixels / pixels),
    );
  }

  async export(options: ExportOptions = {}): Promise<Blob> {
    if (!this.ready || !this.original) throw new Error('No image loaded');
    const type = options.type || 'image/jpeg';
    const quality = clamp(
      Number.isFinite(options.quality) ? (options.quality as number) : 0.92,
      0.05,
      1,
    );
    const viewport = this.viewport();
    const size = this.source();
    const frame = this.currentFrame();
    const quad = cropQuad(viewport, size.width, size.height, this.state.transform, frame);
    const natural = quadSize(
      cropQuad(
        viewport,
        size.width,
        size.height,
        { ...this.state.transform, perspectiveX: 0, perspectiveY: 0 },
        frame,
      ),
    );
    const k = this.exportScale(natural.width, natural.height);
    const width = Math.max(1, Math.round(natural.width * k));
    const height = Math.max(1, Math.round(natural.height * k));
    const blob = await exportImage(
      this.original,
      {
        width,
        height,
        quad,
        warp: perspectiveWarp(this.state.transform),
        srcWidth: size.width,
        srcHeight: size.height,
        color: presetById(this.state.filter).color,
        css: cssFilter(this.state.adjust, this.state.filter),
        vignette: vignetteAmount(this.state.adjust),
        enhance: this.enhanceSpec(1),
        texel: [1 / Math.max(1, size.width), 1 / Math.max(1, size.height)],
      },
      type,
      quality,
      options,
    );
    if (blob.type !== type) {
      throw new Error(`This browser cannot encode ${type}. Choose JPEG or PNG.`);
    }
    this.emit('export', { blob });
    return blob;
  }

  async toDataURL(options: ExportOptions = {}): Promise<string> {
    const blob = await this.export(options);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error || new Error('Could not encode the image'));
      reader.readAsDataURL(blob);
    });
  }

  async toFile(name = 'aurum-edited.jpg', options: ExportOptions = {}): Promise<File> {
    const blob = await this.export(options);
    const type = blob.type || options.type || 'image/jpeg';
    return new File([blob], name, { type });
  }

  async getImageData(options: ExportOptions = {}): Promise<ImageData> {
    const blob = await this.export({ type: 'image/png', ...options });
    if (typeof createImageBitmap !== 'function') {
      throw new Error('createImageBitmap is unavailable');
    }
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('2D canvas is unavailable');
    ctx.drawImage(bitmap, 0, 0);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    bitmap.close();
    return data;
  }

  /* ------------------------------------------------------------- internal */

  protected applyTransform(patch: Partial<TransformState>): void {
    this.cancelAnimation();
    Object.assign(this.state.transform, patch);
    this.scheduleRender();
  }

  protected settle(
    target: Partial<TransformState>,
    duration = 420,
  ): void {
    this.cancelAnimation();
    const start = performance.now();
    const targetState = {
      zoom: target.zoom ?? this.state.transform.zoom,
      offsetX: target.offsetX ?? this.state.transform.offsetX,
      offsetY: target.offsetY ?? this.state.transform.offsetY,
    };
    const id = ++this.animationSeq;
    this.animation = {
      id,
      target: targetState,
      velocity: { zoom: 0, offsetX: 0, offsetY: 0 },
      last: start,
      duration,
      started: start,
      commit: true,
    };
    const tick = (now: number): void => {
      // An interrupted animation's rAF callback may still fire after a new
      // settle starts; only the newest animation may step the state.
      if (!this.animation || this.animation.id !== id) return;
      const dt = Math.min(0.04, Math.max(0.001, (now - this.animation.last) / 1000));
      this.animation.last = now;
      const t = this.state.transform;
      const spring = (value: number, goal: number, velocityKey: 'zoom' | 'offsetX' | 'offsetY'): number => {
        const v = this.animation!.velocity[velocityKey];
        const accel = (goal - value) * 220 - v * 26;
        const nextV = v + accel * dt;
        this.animation!.velocity[velocityKey] = nextV;
        return value + nextV * dt;
      };
      t.zoom = spring(t.zoom, this.animation.target.zoom, 'zoom');
      t.offsetX = spring(t.offsetX, this.animation.target.offsetX, 'offsetX');
      t.offsetY = spring(t.offsetY, this.animation.target.offsetY, 'offsetY');
      const done =
        Math.abs(t.zoom - this.animation.target.zoom) < 0.0008 &&
        Math.abs(t.offsetX - this.animation.target.offsetX) < 0.0004 &&
        Math.abs(t.offsetY - this.animation.target.offsetY) < 0.0004;
      if (done || now - this.animation.started > this.animation.duration) {
        t.zoom = this.animation.target.zoom;
        t.offsetX = this.animation.target.offsetX;
        t.offsetY = this.animation.target.offsetY;
        this.animation = null;
        this.scheduleRender();
        this.commit('transform');
        return;
      }
      this.scheduleRender();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  private cancelAnimation(): void {
    if (!this.animation) return;
    this.animation = null;
  }

  /**
   * Snap the image to the smallest zoom that exactly covers the crop frame and
   * recentre it. Used after the UI has laid out, when the dock can change the
   * stage height after the image has loaded.
   */
  fitToFrame(): void {
    if (!this.ready) return;
    const viewport = this.viewport();
    if (viewport.width < 8 || viewport.height < 8) return;
    const size = this.source();
    const frame = frameRect(viewport, this.state.crop);
    this.state.transform.zoom = minimumZoomForTransform(
      viewport,
      size.width,
      size.height,
      this.state.transform,
      frame,
    );
    this.state.transform.offsetX = 0;
    this.state.transform.offsetY = 0;
    this.ensureCoverage();
    this.scheduleRender();
  }

  private ensureCoverage(): void {
    if (!this.ready) return;
    const viewport = this.viewport();
    // A hidden or not-yet-laid-out stage reports 1x1. Fitting to that would
    // compute an absurd zoom (the source is "cover" scaled into one pixel).
    if (viewport.width < 8 || viewport.height < 8) return;
    const size = this.source();
    const frame = frameRect(viewport, this.state.crop);
    const min = minimumZoomForTransform(
      viewport,
      size.width,
      size.height,
      this.state.transform,
      frame,
    );
    this.state.transform.zoom = clamp(this.state.transform.zoom, min, this.maxZoom);
    const clamped = clampOffset(
      viewport,
      size.width,
      size.height,
      this.state.transform,
      frame,
    );
    this.state.transform.offsetX = clamped.x;
    this.state.transform.offsetY = clamped.y;
    // Geometry is now valid for this viewport; treat it as the baseline for
    // the next resize even if rAF is paused and no paint has landed yet.
    this.lastViewport = viewport;
  }

  private commit(key = ''): void {
    this.commitKey = key;
    this.history.push(this.state, key);
    this.emitState();
    this.emitHistory();
  }

  private emitState(): void {
    this.emit('change', this.getState());
  }

  private emitHistory(): void {
    this.emit('history', { canUndo: this.history.canUndo, canRedo: this.history.canRedo });
  }

  private resize = (): void => {
    if (this.destroyed) return;
    const viewport = this.viewport();
    this.dpr = Math.min(3, window.devicePixelRatio || 1);
    this.renderer.resize(viewport.width, viewport.height, this.dpr);
    if (this.ready) {
      this.syncViewport(viewport);
      this.renderNow();
    } else {
      this.lastViewport = viewport;
    }
  };

  /**
   * Re-map the transform when the stage size changes. Runs from `resize()` and
   * again from `renderNow()`: background tabs can throttle ResizeObserver, and
   * a later paint must not silently crop a different region of the photo.
   */
  private syncViewport(viewport: Size): void {
    if (!this.ready) {
      this.lastViewport = viewport;
      return;
    }
    if (viewport.width < 8 || viewport.height < 8) return;
    const prev = this.lastViewport;
    if (prev.width === viewport.width && prev.height === viewport.height) return;
    this.preserveCropOnResize(prev, viewport);
    this.ensureCoverage();
    this.lastViewport = viewport;
  }

  /**
   * Keep the same source pixels under the crop frame when the stage changes
   * size. The frame grows with the viewport, so the zoom has to absorb both
   * the frame scale and the new cover factor. Offsets stay untouched: they are
   * normalized to the image, which is exactly what we want to keep.
   */
  private preserveCropOnResize(prev: Size, next: Size): void {
    if (prev.width < 8 || prev.height < 8 || next.width < 8 || next.height < 8) return;
    const before = frameRect(prev, this.state.crop);
    const after = frameRect(next, this.state.crop);
    if (before.width < 1 || after.width < 1) return;
    const src = this.source();
    if (src.width < 2 || src.height < 2) return;
    const coverBefore = Math.max(prev.width / src.width, prev.height / src.height) || 1;
    const coverAfter = Math.max(next.width / src.width, next.height / src.height) || 1;
    const scale = after.width / before.width;
    this.state.transform.zoom = clamp(
      this.state.transform.zoom * scale * (coverBefore / coverAfter),
      0.2,
      this.maxZoom,
    );
  }

  protected scheduleRender(): void {
    if (this.renderPending || this.destroyed) return;
    this.renderPending = true;
    this.raf = requestAnimationFrame(() => {
      this.renderPending = false;
      this.renderNow();
    });
  }

  protected renderNow(): void {
    if (!this.ready || !this.preview) return;
    const viewport = this.viewport();
    this.syncViewport(viewport);
    const size = this.source();
    const transform = this.state.transform;
    const frame = this.currentFrame();
    this.lastFrame = frame;
    const geometry = imageGeometry(viewport, size.width, size.height, transform);

    let view = { scale: 1, x: 0, y: 0 };
    let vignetteRect = frame;
    let clipRect: FrameRect | null = null;
    if (this.resultMode && frame.width > 1 && frame.height > 1) {
      const scale = Math.min(
        viewport.width / frame.width,
        viewport.height / frame.height,
      );
      const x = (viewport.width - frame.width * scale) / 2 - frame.x * scale;
      const y = (viewport.height - frame.height * scale) / 2 - frame.y * scale;
      view = { scale, x, y };
      vignetteRect = {
        x: frame.x * scale + x,
        y: frame.y * scale + y,
        width: frame.width * scale,
        height: frame.height * scale,
      };
      clipRect = vignetteRect;
    }

    this.renderer.resize(viewport.width, viewport.height, this.dpr);
    const previewSize = this.preview ? sourceSize(this.preview) : size;
    this.renderer.render({
      width: viewport.width,
      height: viewport.height,
      srcWidth: size.width,
      srcHeight: size.height,
      sx: geometry.sx,
      sy: geometry.sy,
      rotation: totalRotation(transform),
      offsetX: transform.offsetX,
      offsetY: transform.offsetY,
      warp: perspectiveWarp(transform),
      view,
      vignetteRect,
      clipRect,
      color: presetById(this.state.filter).color,
      css: cssFilter(this.state.adjust, this.state.filter),
      vignette: vignetteAmount(this.state.adjust),
      enhance: this.enhanceSpec(this.previewQuality),
      texel: [1 / Math.max(1, previewSize.width), 1 / Math.max(1, previewSize.height)],
      dpr: this.dpr,
    });
    this.lastViewport = viewport;
    this.emit('render', { frame });
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.cancelAI();
    this.cancelAnimation();
    cancelAnimationFrame(this.raf);
    this.gesture.destroy();
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    window.removeEventListener('resize', this.resize);
    this.releaseBitmaps();
    this.renderer.dispose();
    this.stage.remove();
    this.listeners.clear();
  }
}
