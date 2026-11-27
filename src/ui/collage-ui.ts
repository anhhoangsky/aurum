import {
  COLLAGE_DEFAULT_BACKGROUND,
  COLLAGE_DEFAULT_GAP,
  COLLAGE_DEFAULT_SIZE,
  COLLAGE_MAX_CELLS,
  COLLAGE_MAX_GAP,
  COLLAGE_MAX_RADIUS,
  COLLAGE_MAX_ZOOM,
  COLLAGE_MIN_CELLS,
  COLLAGE_SIZES,
  collageAspect,
  collageCellRects,
  collageCover,
  collageFrameSize,
  collageLayout,
  collageLayoutsFor,
  collageSize,
  defaultCollageState,
  normalizeCollageState,
  renderCollage,
} from '../core/collage';
import type {
  CollageSource,
  CollageState,
} from '../core/collage';
import collageCss from './collage.css';
import { ensureStyles } from './styles';

/** The collage screen, bundled as text like the editor stylesheet. */
export const COLLAGE_CSS: string = collageCss;

let collageStylesInjected = false;

/** Inject the collage stylesheet once, on top of the shared aurum tokens. */
export function ensureCollageStyles(): void {
  ensureStyles();
  if (collageStylesInjected || typeof document === 'undefined') return;
  if (document.querySelector('style[data-aurum-collage]')) {
    collageStylesInjected = true;
    return;
  }
  const style = document.createElement('style');
  style.setAttribute('data-aurum-collage', '');
  style.textContent = COLLAGE_CSS;
  document.head.appendChild(style);
  collageStylesInjected = true;
}

export type CollageLocale = 'vi' | 'en';

export type CollageExportType = 'image/png' | 'image/jpeg' | 'image/webp';

export type CollageInput =
  | string
  | Blob
  | HTMLImageElement
  | HTMLCanvasElement
  | ImageBitmap
  | OffscreenCanvas;

export interface CollageUIOptions {
  /** Initial photos: URLs, files, canvases or bitmaps. */
  sources?: CollageInput[];
  /** Preferred layout when the photo count matches it. */
  layout?: string;
  /** Preferred output-size preset, e.g. `square` or `story`. */
  size?: string;
  /** Export side in pixels, 256…4096. Defaults to 2048. */
  exportSize?: number;
  /** Starting export format. Defaults to PNG. */
  format?: CollageExportType;
  downloadName?: string;
  locale?: CollageLocale;
  /** Receives the encoded blob instead of the default download. */
  onSave?: (blob: Blob, state: CollageState) => void | Promise<void>;
  onStateChange?: (state: CollageState) => void;
  /** When present, the header shows a close button. */
  onClose?: () => void;
}

interface Copy {
  title: string;
  add: string;
  close: string;
  save: string;
  saving: string;
  emptyTitle: string;
  emptyBody: string;
  choose: string;
  gap: string;
  radius: string;
  background: string;
  selected: string;
  zoom: string;
  reset: string;
  hint: string;
  layouts: string;
  sizes: string;
  auto: string;
  format: string;
  formatFallback: string;
  canvas: string;
  count: (count: number) => string;
  max: string;
  loading: string;
  loadFail: string;
  exportFail: string;
  saved: string;
}

const COPY: Record<CollageLocale, Copy> = {
  vi: {
    title: 'Ghép ảnh',
    add: 'Thêm ảnh',
    close: 'Đóng',
    save: 'Lưu ảnh',
    saving: 'Đang lưu…',
    emptyTitle: 'Chưa đủ ảnh',
    emptyBody: 'Chọn ít nhất 2 ảnh để ghép. Bạn có thể thêm tối đa 9 ảnh.',
    choose: 'Chọn ảnh',
    gap: 'Khoảng cách',
    radius: 'Bo góc',
    background: 'Nền',
    selected: 'Ô',
    zoom: 'Zoom',
    reset: 'Đặt lại',
    hint: 'Kéo để căn · chụm hoặc cuộn để zoom · chạm đúp để đặt lại',
    layouts: 'Bố cục',
    sizes: 'Kích thước',
    auto: 'Tự động',
    format: 'Định dạng',
    formatFallback: 'Trình duyệt không hỗ trợ định dạng này, đã lưu PNG.',
    canvas: 'Khung ghép ảnh. Kéo để căn ảnh, cuộn để zoom, nhấp đúp để đặt lại.',
    count: (count) => `${count}/${COLLAGE_MAX_CELLS} ảnh`,
    max: 'Tối đa 9 ảnh.',
    loading: 'Đang tải ảnh…',
    loadFail: 'Không đọc được ảnh đã chọn.',
    exportFail: 'Chưa thể xuất ảnh.',
    saved: 'Đã xuất ảnh.',
  },
  en: {
    title: 'Collage',
    add: 'Add photos',
    close: 'Close',
    save: 'Save image',
    saving: 'Saving…',
    emptyTitle: 'Not enough photos',
    emptyBody: 'Pick at least 2 photos. Up to 9 fit in one collage.',
    choose: 'Pick photos',
    gap: 'Gap',
    radius: 'Corners',
    background: 'Background',
    selected: 'Cell',
    zoom: 'Zoom',
    reset: 'Reset',
    hint: 'Drag to position · pinch or scroll to zoom · double-tap to reset',
    layouts: 'Layout',
    sizes: 'Size',
    auto: 'Auto',
    format: 'Format',
    formatFallback: 'This browser does not support that format; saved PNG instead.',
    canvas: 'Collage canvas. Drag to position, scroll to zoom, double-tap to reset.',
    count: (count) => `${count}/${COLLAGE_MAX_CELLS} photos`,
    max: 'Up to 9 photos.',
    loading: 'Loading photos…',
    loadFail: 'One of the photos could not be read.',
    exportFail: 'The collage could not be exported.',
    saved: 'Image exported.',
  },
};

const LAYOUT_NAMES: Record<string, string> = {
  'duo-split': 'Đôi dọc',
  'duo-stack': 'Đôi ngang',
  'trio-columns': 'Ba cột',
  'trio-rows': 'Ba hàng',
  'trio-left': 'Ba trái',
  'trio-top': 'Ba trên',
  'quad-grid': 'Bốn lưới',
  'quad-columns': 'Bốn cột',
  'quad-rows': 'Bốn hàng',
  'quad-left': 'Bốn trái',
  'penta-top': 'Năm trên',
  'penta-left': 'Năm trái',
  'hex-grid': 'Sáu lưới',
  'hex-grid-tall': 'Sáu dọc',
  'seven-left': 'Bảy trái',
  'seven-top': 'Bảy trên',
  'eight-grid': 'Tám lưới',
  'eight-grid-tall': 'Tám dọc',
  'nine-grid': 'Chín lưới',
};

const SIZE_NAMES: Record<string, string> = {
  square: '1:1',
  portrait: '4:5',
  classic: '3:4',
  landscape: '16:9',
  story: '9:16',
};

/** Diagonal two-stop presets; the first stop is the document background. */
const GRADIENT_PRESETS: readonly (readonly [string, string])[] = [
  ['#f7e7c3', '#d4a24a'],
  ['#2d2a4a', '#101014'],
  ['#ffd9c0', '#f3a6a0'],
  ['#d9f3e3', '#8fcfb4'],
  ['#cfe4ff', '#9db8e8'],
];

const FORMATS: readonly { type: CollageExportType; label: string }[] = [
  { type: 'image/png', label: 'PNG' },
  { type: 'image/jpeg', label: 'JPEG' },
  { type: 'image/webp', label: 'WebP' },
];

const ICONS = {
  collage:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="5" rx="2"/><rect x="13" y="10" width="8" height="11" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/></svg>',
  plus:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  close:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  save:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M4 20h16"/></svg>',
  empty:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="8.5" cy="9" r="1.4"/><path d="M4 17l5-5 4 4 3-3 4 4"/></svg>',
};

interface Point {
  x: number;
  y: number;
}

interface CollageDom {
  root: HTMLDivElement;
  addButton: HTMLButtonElement;
  closeButton: HTMLButtonElement | null;
  fileInput: HTMLInputElement;
  stage: HTMLDivElement;
  canvas: HTMLCanvasElement;
  empty: HTMLDivElement;
  chooseButton: HTMLButtonElement;
  hint: HTMLDivElement;
  sizeRail: HTMLDivElement;
  rail: HTMLDivElement;
  formats: HTMLDivElement;
  gapInput: HTMLInputElement;
  gapValue: HTMLElement;
  radiusInput: HTMLInputElement;
  radiusValue: HTMLElement;
  backgroundValue: HTMLElement;
  swatches: HTMLDivElement;
  colorInput: HTMLInputElement;
  cellBar: HTMLDivElement;
  cellName: HTMLElement;
  zoomInput: HTMLInputElement;
  zoomValue: HTMLElement;
  resetButton: HTMLButtonElement;
  count: HTMLElement;
  saveButton: HTMLButtonElement;
  status: HTMLDivElement;
  subtitle: HTMLElement;
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

function isImage(value: unknown): value is HTMLImageElement {
  return typeof HTMLImageElement !== 'undefined'
    && value instanceof HTMLImageElement;
}

function isCanvas(value: unknown): value is HTMLCanvasElement {
  return typeof HTMLCanvasElement !== 'undefined'
    && value instanceof HTMLCanvasElement;
}

function isBitmap(value: unknown): value is ImageBitmap {
  return typeof ImageBitmap !== 'undefined' && value instanceof ImageBitmap;
}

function isOffscreenCanvas(value: unknown): value is OffscreenCanvas {
  return typeof OffscreenCanvas !== 'undefined'
    && value instanceof OffscreenCanvas;
}

/**
 * A standalone collage screen.
 *
 * It owns the photo picker, the layout rail, the gap/radius/background
 * controls and the per-cell gestures, but the pixels come from the shared
 * `renderCollage` pass. A host that wants a child aurum state per cell can
 * render those bitmaps itself and hand them to `setSources`; this class stays
 * an ordinary image path, so the same screen works with plain photos.
 */
export class AurumCollage {
  readonly host: HTMLElement;
  readonly element: HTMLDivElement;
  /** Resolves after the initial photo list has decoded. */
  readonly ready: Promise<void>;

  private readonly options: CollageUIOptions;
  private readonly copy: Copy;
  private readonly abort = new AbortController();
  private readonly dom: CollageDom;
  private readonly layoutButtons = new Map<string, HTMLButtonElement>();
  private readonly sizeButtons = new Map<string, HTMLButtonElement>();
  private readonly formatButtons = new Map<CollageExportType, HTMLButtonElement>();
  private readonly pointers = new Map<number, Point>();
  private readonly swatchButtons: HTMLButtonElement[] = [];
  private readonly gradientButtons: HTMLButtonElement[] = [];
  private state: CollageState;
  private sources: CollageSource[] = [];
  private selected = 0;
  private exportFormat: CollageExportType;
  private drag: {
    cell: number;
    lastX: number;
    lastY: number;
    moved: boolean;
  } | null = null;
  private pinch: {
    cell: number;
    distance: number;
    zoom: number;
  } | null = null;
  private lastTap = { time: 0, x: 0, y: 0, cell: -1 };
  private raf = 0;
  private observer: ResizeObserver | null = null;
  private statusTimer = 0;
  private hintTimer = 0;
  private hintDismissed = false;
  private saving = false;
  private destroyed = false;

  constructor(host: HTMLElement, options: CollageUIOptions = {}) {
    this.host = host;
    this.options = options;
    this.copy = COPY[options.locale === 'en' ? 'en' : 'vi'];
    ensureCollageStyles();

    this.state = normalizeCollageState({
      ...defaultCollageState(options.layout ?? 'duo-split'),
      size: options.size ?? COLLAGE_DEFAULT_SIZE,
    });
    this.exportFormat = options.format ?? 'image/png';
    this.dom = this.buildDom();
    this.element = this.dom.root;
    this.host.appendChild(this.element);
    this.bindEvents();
    this.buildRail();

    if (typeof ResizeObserver !== 'undefined') {
      this.observer = new ResizeObserver(() => this.scheduleRender());
      this.observer.observe(this.dom.stage);
    }
    window.addEventListener('resize', () => this.scheduleRender(), {
      signal: this.abort.signal,
    });

    this.updateUI();
    this.ready = this.setSources(options.sources ?? []);
  }

  /** Number of decoded photos. */
  get sourceCount(): number {
    return this.sources.length;
  }

  /** The index of the highlighted cell, or -1. */
  get selectedCell(): number {
    return this.dom.cellBar.hidden ? -1 : this.selected;
  }

  /** A defensive copy of the current document. */
  getState(): CollageState {
    return {
      ...this.state,
      cells: this.state.cells.map((cell) => ({ ...cell })),
    };
  }

  /** Replace the document without touching the photos. */
  setState(state: CollageState): void {
    this.state = normalizeCollageState(state);
    this.selected = Math.min(
      Math.max(0, this.selected),
      Math.max(0, this.state.cells.length - 1),
    );
    this.updateUI();
    this.scheduleRender();
    this.emitState();
  }

  /** Replace every photo, resetting the per-cell crops. */
  async setSources(inputs: CollageInput[]): Promise<void> {
    const limited = inputs.slice(0, COLLAGE_MAX_CELLS);
    const loaded = await this.loadAll(limited);
    if (loaded.length !== limited.length && limited.length > 0) {
      this.toast(this.copy.loadFail);
    }
    this.replaceSources(loaded);
  }

  /** Append photos up to the nine-cell ceiling. */
  async addSources(inputs: CollageInput[]): Promise<void> {
    const room = COLLAGE_MAX_CELLS - this.sources.length;
    if (room <= 0) {
      this.toast(this.copy.max);
      return;
    }
    const limited = inputs.slice(0, room);
    if (limited.length === 0) return;
    const loaded = await this.loadAll(limited);
    if (loaded.length === 0) {
      this.toast(this.copy.loadFail);
      return;
    }
    if (loaded.length !== limited.length) this.toast(this.copy.loadFail);

    const previous = this.state.cells.map((cell) => ({ ...cell }));
    this.sources = [...this.sources, ...loaded];
    const target = collageLayoutsFor(this.sources.length)[0];
    if (target) {
      while (previous.length < this.sources.length) {
        previous.push({
          source: previous.length,
          zoom: 1,
          offsetX: 0,
          offsetY: 0,
        });
      }
      this.state = normalizeCollageState({
        ...this.state,
        layout: target.id,
        cells: previous,
      });
    }
    this.selected = Math.min(this.selected, this.state.cells.length - 1);
    this.buildRail();
    this.updateUI();
    this.scheduleRender();
    this.emitState();
  }

  /** Re-render the preview immediately. */
  render(): void {
    if (this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
    this.renderPreview();
  }

  /** Encode the full-size collage. */
  async exportBlob(
    type: CollageExportType = 'image/png',
    quality = 0.92,
  ): Promise<Blob | null> {
    if (this.sources.length < COLLAGE_MIN_CELLS) return null;
    if (!collageLayout(this.state.layout)) return null;
    const maxSide = Math.round(
      clamp(this.options.exportSize ?? 2048, 256, 4096),
    );
    const frame = collageFrameSize(
      this.state.size,
      this.sources[0],
      maxSide,
    );
    const canvas = document.createElement('canvas');
    canvas.width = frame.width;
    canvas.height = frame.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    renderCollage(ctx, this.state, this.sources, {
      size: frame.width,
      height: frame.height,
    });
    return new Promise((resolve) => {
      canvas.toBlob(resolve, type, quality);
    });
  }

  /** Export and either hand the blob to `onSave` or download it. */
  async save(): Promise<void> {
    if (this.saving || this.sources.length < COLLAGE_MIN_CELLS) return;
    this.saving = true;
    this.dom.saveButton.disabled = true;
    this.dom.saveButton.textContent = this.copy.saving;
    try {
      const requested = this.exportFormat;
      const blob = await this.exportBlob(requested);
      if (!blob) {
        this.toast(this.copy.exportFail);
        return;
      }
      if (blob.type && blob.type !== requested) {
        this.toast(this.copy.formatFallback);
      } else {
        this.toast(this.copy.saved);
      }
      if (this.options.onSave) {
        await this.options.onSave(blob, this.getState());
      } else {
        downloadBlob(blob, this.options.downloadName ?? this.defaultName(blob));
      }
    } catch {
      this.toast(this.copy.exportFail);
    } finally {
      this.saving = false;
      this.dom.saveButton.disabled = this.sources.length < COLLAGE_MIN_CELLS;
      this.dom.saveButton.innerHTML =
        `${ICONS.save}<span>${this.copy.save}</span>`;
    }
  }

  /** Remove the screen, listeners and pending frame. */
  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.abort.abort();
    if (this.observer) this.observer.disconnect();
    if (this.raf) cancelAnimationFrame(this.raf);
    if (this.statusTimer) window.clearTimeout(this.statusTimer);
    if (this.hintTimer) window.clearTimeout(this.hintTimer);
    this.element.remove();
  }

  private hideHint(): void {
    this.hintDismissed = true;
    this.dom.hint.classList.add('is-hidden');
    if (this.hintTimer) {
      window.clearTimeout(this.hintTimer);
      this.hintTimer = 0;
    }
  }

  // ---------------------------------------------------------------- DOM

  private buildDom(): CollageDom {
    const root = el('div', 'au-root au-collage');
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', this.copy.title);

    const head = el('header', 'au-collage__head');
    const brand = el('div', 'au-collage__brand');
    const title = el('div', 'au-collage__title');
    title.innerHTML = ICONS.collage;
    title.append(document.createTextNode(this.copy.title));
    const subtitle = el('div', 'au-collage__sub');
    brand.append(title, subtitle);

    const actions = el('div', 'au-collage__actions');
    let closeButton: HTMLButtonElement | null = null;
    if (this.options.onClose) {
      closeButton = el('button', 'au-collage__iconbtn');
      closeButton.type = 'button';
      closeButton.title = this.copy.close;
      closeButton.setAttribute('aria-label', this.copy.close);
      closeButton.innerHTML = ICONS.close;
      closeButton.addEventListener(
        'click',
        () => this.options.onClose?.(),
        { signal: this.abort.signal },
      );
      actions.appendChild(closeButton);
    }
    const addButton = el('button', 'au-collage__iconbtn');
    addButton.type = 'button';
    addButton.innerHTML = `${ICONS.plus}<span>${this.copy.add}</span>`;
    addButton.setAttribute('aria-label', this.copy.add);
    actions.appendChild(addButton);
    head.append(brand, actions);

    const fileInput = el('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;
    fileInput.hidden = true;

    const body = el('div', 'au-collage__body');
    const stage = el('div', 'au-collage__stage is-empty');
    const canvas = el('canvas');
    canvas.width = 720;
    canvas.height = 720;
    canvas.tabIndex = 0;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', this.copy.canvas);
    stage.appendChild(canvas);

    const empty = el('div', 'au-collage__empty');
    const emptyIcon = el('div');
    emptyIcon.innerHTML = ICONS.empty;
    const emptyTitle = el('strong', '', this.copy.emptyTitle);
    const emptyBody = el('p', '', this.copy.emptyBody);
    emptyBody.style.margin = '0';
    const chooseButton = el('button', '', this.copy.choose);
    chooseButton.type = 'button';
    empty.append(emptyIcon, emptyTitle, emptyBody, chooseButton);
    stage.appendChild(empty);

    const hint = el('div', 'au-collage__hint', this.copy.hint);
    stage.appendChild(hint);

    const sizeRail = el('div', 'au-collage__sizes');
    sizeRail.setAttribute('role', 'group');
    sizeRail.setAttribute('aria-label', this.copy.sizes);
    for (const size of COLLAGE_SIZES) {
      const button = el('button', 'au-collage__size', this.sizeName(size.id));
      button.type = 'button';
      button.dataset.size = size.id;
      button.addEventListener(
        'click',
        () => this.setSize(size.id),
        { signal: this.abort.signal },
      );
      this.sizeButtons.set(size.id, button);
      sizeRail.appendChild(button);
    }

    const rail = el('div', 'au-collage__rail');
    rail.setAttribute('role', 'group');
    rail.setAttribute('aria-label', this.copy.layouts);

    const panel = el('section', 'au-collage__panel');

    const gapInput = el('input', 'au-collage__slider');
    gapInput.type = 'range';
    gapInput.min = '0';
    gapInput.max = String(COLLAGE_MAX_GAP * 100);
    gapInput.step = '0.2';
    gapInput.setAttribute('aria-label', this.copy.gap);
    const gapValue = el('b');
    const gapGroup = el('div', 'au-collage__group');
    const gapLabel = el('label', 'au-collage__label');
    gapLabel.append(el('span', '', this.copy.gap), gapValue);
    gapGroup.append(gapLabel, gapInput);

    const radiusInput = el('input', 'au-collage__slider');
    radiusInput.type = 'range';
    radiusInput.min = '0';
    radiusInput.max = String(COLLAGE_MAX_RADIUS * 100);
    radiusInput.step = '1';
    radiusInput.setAttribute('aria-label', this.copy.radius);
    const radiusValue = el('b');
    const radiusGroup = el('div', 'au-collage__group');
    const radiusLabel = el('label', 'au-collage__label');
    radiusLabel.append(el('span', '', this.copy.radius), radiusValue);
    radiusGroup.append(radiusLabel, radiusInput);

    const backgroundValue = el('b');
    const backgroundGroup = el('div', 'au-collage__group');
    const backgroundLabel = el('div', 'au-collage__label');
    backgroundLabel.append(
      el('span', '', this.copy.background),
      backgroundValue,
    );
    const swatches = el('div', 'au-collage__swatches');
    const presets = ['#ffffff', '#101014', '#f4f2ec', '#f3c77b'];
    for (const color of presets) {
      const swatch = el('button', 'au-collage__swatch');
      swatch.type = 'button';
      swatch.style.background = color;
      swatch.dataset.color = color;
      swatch.title = color;
      swatch.setAttribute('aria-label', `${this.copy.background} ${color}`);
      swatch.addEventListener(
        'click',
        () => this.setBackground(color),
        { signal: this.abort.signal },
      );
      this.swatchButtons.push(swatch);
      swatches.appendChild(swatch);
    }
    for (const [from, to] of GRADIENT_PRESETS) {
      const swatch = el(
        'button',
        'au-collage__swatch au-collage__swatch--gradient',
      );
      swatch.type = 'button';
      swatch.style.background = `linear-gradient(135deg, ${from}, ${to})`;
      swatch.dataset.gradient = `${from},${to}`;
      swatch.title = `${from} → ${to}`;
      swatch.setAttribute(
        'aria-label',
        `${this.copy.background} ${from} → ${to}`,
      );
      swatch.addEventListener(
        'click',
        () => this.setBackground(from, to),
        { signal: this.abort.signal },
      );
      this.gradientButtons.push(swatch);
      swatches.appendChild(swatch);
    }
    const custom = el('label', 'au-collage__swatch au-collage__swatch--custom');
    custom.title = this.copy.background;
    const colorInput = el('input');
    colorInput.type = 'color';
    colorInput.value = COLLAGE_DEFAULT_BACKGROUND;
    colorInput.setAttribute('aria-label', this.copy.background);
    custom.appendChild(colorInput);
    swatches.appendChild(custom);
    backgroundGroup.append(backgroundLabel, swatches);

    const cellBar = el('div', 'au-collage__cellbar');
    const cellName = el('span', 'au-collage__cellname');
    const zoomInput = el('input', 'au-collage__slider');
    zoomInput.type = 'range';
    zoomInput.min = '100';
    zoomInput.max = String(COLLAGE_MAX_ZOOM * 100);
    zoomInput.step = '1';
    zoomInput.setAttribute('aria-label', this.copy.zoom);
    const zoomValue = el('span');
    const zoomWrap = el('div', 'au-collage__cellzoom');
    zoomWrap.append(zoomInput, zoomValue);
    const resetButton = el('button', 'au-collage__reset', this.copy.reset);
    resetButton.type = 'button';
    cellBar.append(cellName, zoomWrap, resetButton);

    panel.append(gapGroup, radiusGroup, backgroundGroup, cellBar);
    body.append(stage, sizeRail, rail, panel);

    const foot = el('footer', 'au-collage__foot');
    const count = el('div', 'au-collage__count');
    const formats = el('div', 'au-collage__formats');
    formats.setAttribute('role', 'group');
    formats.setAttribute('aria-label', this.copy.format);
    for (const format of FORMATS) {
      const button = el('button', 'au-collage__format', format.label);
      button.type = 'button';
      button.dataset.format = format.type;
      button.addEventListener(
        'click',
        () => this.setFormat(format.type),
        { signal: this.abort.signal },
      );
      this.formatButtons.set(format.type, button);
      formats.appendChild(button);
    }
    const saveButton = el('button', 'au-collage__save');
    saveButton.type = 'button';
    saveButton.disabled = true;
    saveButton.innerHTML = `${ICONS.save}<span>${this.copy.save}</span>`;
    foot.append(count, formats, saveButton);

    const status = el('div', 'au-collage__status');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');

    root.append(head, fileInput, body, foot, status);

    return {
      root,
      addButton,
      closeButton,
      fileInput,
      stage,
      canvas,
      empty,
      chooseButton,
      hint,
      sizeRail,
      rail,
      formats,
      gapInput,
      gapValue,
      radiusInput,
      radiusValue,
      backgroundValue,
      swatches,
      colorInput,
      cellBar,
      cellName,
      zoomInput,
      zoomValue,
      resetButton,
      count,
      saveButton,
      status,
      subtitle,
    };
  }

  private bindEvents(): void {
    const signal = this.abort.signal;
    const pick = () => this.dom.fileInput.click();
    this.dom.addButton.addEventListener('click', pick, { signal });
    this.dom.chooseButton.addEventListener('click', pick, { signal });
    this.dom.fileInput.addEventListener(
      'change',
      () => void this.handleFiles(this.dom.fileInput.files),
      { signal },
    );
    this.dom.gapInput.addEventListener(
      'input',
      () => {
        const percent = Number(this.dom.gapInput.value);
        this.state.gap = clamp(
          Number.isFinite(percent) ? percent / 100 : 0,
          0,
          COLLAGE_MAX_GAP,
        );
        this.updateControlLabels();
        this.scheduleRender();
        this.emitState();
      },
      { signal },
    );
    this.dom.radiusInput.addEventListener(
      'input',
      () => {
        const percent = Number(this.dom.radiusInput.value);
        this.state.radius = clamp(
          Number.isFinite(percent) ? percent / 100 : 0,
          0,
          COLLAGE_MAX_RADIUS,
        );
        this.updateControlLabels();
        this.scheduleRender();
        this.emitState();
      },
      { signal },
    );
    this.dom.colorInput.addEventListener(
      'input',
      () => this.setBackground(this.dom.colorInput.value),
      { signal },
    );
    this.dom.zoomInput.addEventListener(
      'input',
      () => {
        const cell = this.state.cells[this.selected];
        if (!cell) return;
        const value = Number(this.dom.zoomInput.value);
        cell.zoom = clamp(
          Number.isFinite(value) ? value / 100 : 1,
          1,
          COLLAGE_MAX_ZOOM,
        );
        this.updateCellControls();
        this.scheduleRender();
        this.emitState();
      },
      { signal },
    );
    this.dom.resetButton.addEventListener(
      'click',
      () => this.resetCell(this.selected),
      { signal },
    );
    this.dom.saveButton.addEventListener(
      'click',
      () => void this.save(),
      { signal },
    );

    const canvas = this.dom.canvas;
    canvas.addEventListener('pointerdown', (event) => this.onPointerDown(event), {
      signal,
    });
    canvas.addEventListener('pointermove', (event) => this.onPointerMove(event), {
      signal,
    });
    canvas.addEventListener('pointerup', (event) => this.onPointerUp(event), {
      signal,
    });
    canvas.addEventListener(
      'pointercancel',
      (event) => this.onPointerUp(event),
      { signal },
    );
    canvas.addEventListener('wheel', (event) => this.onWheel(event), {
      passive: false,
      signal,
    });
    canvas.addEventListener('dblclick', (event) => this.onDoubleClick(event), {
      signal,
    });
    canvas.addEventListener('keydown', (event) => this.onKeyDown(event), {
      signal,
    });
  }

  // --------------------------------------------------------------- input

  private async handleFiles(files: FileList | null): Promise<void> {
    if (!files || files.length === 0) return;
    const room = COLLAGE_MAX_CELLS - this.sources.length;
    if (room <= 0) {
      this.toast(this.copy.max);
      return;
    }
    const picked = Array.from(files).slice(0, room);
    this.dom.fileInput.value = '';
    this.dom.addButton.disabled = true;
    this.toast(this.copy.loading);
    try {
      await this.addSources(picked);
    } finally {
      this.dom.addButton.disabled = this.sources.length >= COLLAGE_MAX_CELLS;
      this.updateUI();
    }
  }

  private onPointerDown(event: PointerEvent): void {
    if (this.sources.length < COLLAGE_MIN_CELLS) return;
    if (event.button !== undefined && event.button !== 0) return;
    this.hideHint();
    const cell = this.cellAt(event);
    if (cell >= 0) this.selectCell(cell);
    this.pointers.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });
    try {
      this.dom.canvas.setPointerCapture(event.pointerId);
    } catch {
      // A synthetic pointer in tests has no active capture; gestures still work.
    }
    if (this.pointers.size === 1) {
      this.drag = {
        cell: cell >= 0 ? cell : this.selected,
        lastX: event.clientX,
        lastY: event.clientY,
        moved: false,
      };
      this.pinch = null;
    } else if (this.pointers.size === 2) {
      const [first, second] = [...this.pointers.values()];
      this.pinch = {
        cell: this.selected,
        distance: Math.max(
          1,
          Math.hypot(second.x - first.x, second.y - first.y),
        ),
        zoom: this.state.cells[this.selected]?.zoom ?? 1,
      };
      this.drag = null;
    }
    event.preventDefault();
  }

  private onPointerMove(event: PointerEvent): void {
    const point = this.pointers.get(event.pointerId);
    if (!point) return;
    point.x = event.clientX;
    point.y = event.clientY;

    if (this.pinch && this.pointers.size >= 2) {
      const [first, second] = [...this.pointers.values()];
      const distance = Math.max(
        1,
        Math.hypot(second.x - first.x, second.y - first.y),
      );
      const cell = this.state.cells[this.pinch.cell];
      if (cell) {
        cell.zoom = clamp(
          this.pinch.zoom * (distance / this.pinch.distance),
          1,
          COLLAGE_MAX_ZOOM,
        );
        this.updateCellControls();
        this.scheduleRender();
      }
      event.preventDefault();
      return;
    }

    if (!this.drag) return;
    const dx = event.clientX - this.drag.lastX;
    const dy = event.clientY - this.drag.lastY;
    if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return;
    this.drag.lastX = event.clientX;
    this.drag.lastY = event.clientY;
    this.drag.moved = true;
    this.panCell(this.drag.cell, dx, dy);
    event.preventDefault();
  }

  private onPointerUp(event: PointerEvent): void {
    this.pointers.delete(event.pointerId);
    try {
      this.dom.canvas.releasePointerCapture(event.pointerId);
    } catch {
      // The pointer may already be released; nothing to do.
    }
    if (this.pointers.size === 1) {
      this.pinch = null;
      return;
    }
    if (this.pointers.size > 1) return;
    const drag = this.drag;
    this.drag = null;
    this.pinch = null;
    if (drag?.moved) {
      this.emitState();
      return;
    }
    if (drag) this.detectDoubleTap(event, drag.cell);
  }

  private onWheel(event: WheelEvent): void {
    if (this.sources.length < COLLAGE_MIN_CELLS) return;
    const cellIndex = this.cellAt(event);
    if (cellIndex < 0) return;
    const cell = this.state.cells[cellIndex];
    if (!cell) return;
    event.preventDefault();
    this.hideHint();
    const factor = Math.exp(-event.deltaY * 0.0015);
    cell.zoom = clamp(cell.zoom * factor, 1, COLLAGE_MAX_ZOOM);
    this.selectCell(cellIndex, false);
    this.updateCellControls();
    this.scheduleRender();
    this.emitState();
  }

  private onDoubleClick(event: MouseEvent): void {
    const cell = this.cellAt(event);
    if (cell < 0) return;
    this.selectCell(cell);
    this.resetCell(cell);
    event.preventDefault();
  }

  private onKeyDown(event: KeyboardEvent): void {
    const cell = this.state.cells[this.selected];
    if (!cell) return;
    let handled = true;
    switch (event.key) {
      case 'ArrowLeft':
        cell.offsetX = clamp(cell.offsetX - 0.05, -1, 1);
        break;
      case 'ArrowRight':
        cell.offsetX = clamp(cell.offsetX + 0.05, -1, 1);
        break;
      case 'ArrowUp':
        cell.offsetY = clamp(cell.offsetY - 0.05, -1, 1);
        break;
      case 'ArrowDown':
        cell.offsetY = clamp(cell.offsetY + 0.05, -1, 1);
        break;
      case '+':
      case '=':
        cell.zoom = clamp(cell.zoom + 0.1, 1, COLLAGE_MAX_ZOOM);
        break;
      case '-':
      case '_':
        cell.zoom = clamp(cell.zoom - 0.1, 1, COLLAGE_MAX_ZOOM);
        break;
      case '0':
        cell.zoom = 1;
        cell.offsetX = 0;
        cell.offsetY = 0;
        break;
      default:
        handled = false;
    }
    if (!handled) return;
    event.preventDefault();
    this.updateCellControls();
    this.scheduleRender();
    this.emitState();
  }

  private detectDoubleTap(event: PointerEvent, cell: number): void {
    if (cell < 0) return;
    const now = performance.now();
    const last = this.lastTap;
    if (
      last.cell === cell
      && now - last.time < 320
      && Math.hypot(event.clientX - last.x, event.clientY - last.y) < 14
    ) {
      this.resetCell(cell);
      this.lastTap = { time: 0, x: 0, y: 0, cell: -1 };
      return;
    }
    this.lastTap = {
      time: now,
      x: event.clientX,
      y: event.clientY,
      cell,
    };
  }

  private cellAt(event: { clientX: number; clientY: number }): number {
    const layout = collageLayout(this.state.layout);
    if (!layout) return -1;
    const box = this.dom.canvas.getBoundingClientRect();
    if (box.width <= 0 || box.height <= 0) return -1;
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    if (x < 0 || y < 0 || x > 1 || y > 1) return -1;
    const rects = collageCellRects(layout, this.state.gap);
    return rects.findIndex(
      (rect) => x >= rect.x
        && x <= rect.x + rect.width
        && y >= rect.y
        && y <= rect.y + rect.height,
    );
  }

  private panCell(index: number, dx: number, dy: number): void {
    const layout = collageLayout(this.state.layout);
    if (!layout) return;
    const rect = collageCellRects(layout, this.state.gap)[index];
    const cell = this.state.cells[index];
    if (!rect || !cell) return;
    const source = this.sources[cell.source];
    if (!source) return;

    const side = this.dom.canvas.getBoundingClientRect().width || 360;
    const cellWidth = rect.width * side;
    const cellHeight = rect.height * side;
    const cover = collageCover(
      { width: source.width, height: source.height },
      { width: cellWidth, height: cellHeight },
      cell,
    );
    const slackX = cover.dw - cellWidth;
    if (slackX > 0.5) {
      // Dragging the photo right reveals its left edge, which is offset -1.
      cell.offsetX = clamp(cell.offsetX - (dx * 2) / slackX, -1, 1);
    }
    const slackY = cover.dh - cellHeight;
    if (slackY > 0.5) {
      cell.offsetY = clamp(cell.offsetY - (dy * 2) / slackY, -1, 1);
    }
    this.updateCellControls();
    this.scheduleRender();
  }

  // --------------------------------------------------------------- state

  private async loadAll(inputs: CollageInput[]): Promise<CollageSource[]> {
    const results = await Promise.all(
      inputs.map((input) => this.loadInput(input).catch(() => null)),
    );
    return results.filter((value): value is CollageSource => value !== null);
  }

  private async loadInput(input: CollageInput): Promise<CollageSource | null> {
    if (typeof input === 'string') return loadImage(input);
    if (input instanceof Blob) {
      const url = URL.createObjectURL(input);
      try {
        return await loadImage(url);
      } finally {
        URL.revokeObjectURL(url);
      }
    }
    if (isImage(input)) {
      if (!input.complete) {
        await new Promise<void>((resolve, reject) => {
          input.addEventListener('load', () => resolve(), { once: true });
          input.addEventListener(
            'error',
            () => reject(new Error('image')),
            { once: true },
          );
        });
      }
      return input.naturalWidth > 0 ? input : null;
    }
    if (isCanvas(input)) {
      return input.width > 0 && input.height > 0 ? input : null;
    }
    if (isBitmap(input) || isOffscreenCanvas(input)) {
      return input.width > 0 && input.height > 0 ? input : null;
    }
    return null;
  }

  private replaceSources(loaded: CollageSource[]): void {
    this.sources = loaded.slice(0, COLLAGE_MAX_CELLS);
    const count = this.sources.length;
    const current = collageLayout(this.state.layout);
    const keepCurrent = current?.cellCount === count;
    const target = keepCurrent
      ? current
      : collageLayoutsFor(count)[0] ?? current ?? collageLayout('duo-split');
    const base = target
      ? defaultCollageState(target.id)
      : defaultCollageState();
    this.state = normalizeCollageState({
      ...base,
      size: this.state.size,
      gap: this.state.gap,
      radius: this.state.radius,
      background: this.state.background,
      backgroundEnd: this.state.backgroundEnd,
    });
    this.selected = 0;
    this.hintDismissed = false;
    if (this.hintTimer) window.clearTimeout(this.hintTimer);
    this.hintTimer = window.setTimeout(() => this.hideHint(), 7000);
    this.buildRail();
    this.updateUI();
    this.scheduleRender();
    this.emitState();
  }

  private setLayout(id: string): void {
    const layout = collageLayout(id);
    if (!layout) return;
    this.state = normalizeCollageState({ ...this.state, layout: id });
    this.selected = Math.min(
      this.selected,
      Math.max(0, this.state.cells.length - 1),
    );
    this.updateUI();
    this.scheduleRender();
    this.emitState();
  }

  private selectCell(index: number, sync = true): void {
    if (index < 0 || index >= this.state.cells.length) return;
    this.selected = index;
    if (sync) this.updateUI();
    else this.updateCellControls();
  }

  private resetCell(index: number): void {
    const cell = this.state.cells[index];
    if (!cell) return;
    cell.zoom = 1;
    cell.offsetX = 0;
    cell.offsetY = 0;
    this.updateCellControls();
    this.scheduleRender();
    this.emitState();
  }

  private setBackground(value: string, end = ''): void {
    const next = normalizeCollageState({
      ...this.state,
      background: value,
      backgroundEnd: end,
    });
    if (
      next.background === this.state.background
      && next.backgroundEnd === this.state.backgroundEnd
    ) {
      return;
    }
    this.state.background = next.background;
    this.state.backgroundEnd = next.backgroundEnd;
    this.updateBackgroundUI();
    this.scheduleRender();
    this.emitState();
  }

  private setSize(id: string): void {
    if (!collageSize(id) || id === this.state.size) return;
    this.state = normalizeCollageState({ ...this.state, size: id });
    this.updateUI();
    this.scheduleRender();
    this.emitState();
  }

  private setFormat(type: CollageExportType): void {
    this.exportFormat = type;
    for (const [key, button] of this.formatButtons) {
      const active = key === type;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    }
  }

  private sizeName(id: string): string {
    if (id === 'auto') return this.copy.auto;
    return SIZE_NAMES[id] ?? id;
  }

  // ---------------------------------------------------------------- view

  private buildRail(): void {
    this.layoutButtons.clear();
    this.dom.rail.textContent = '';
    const layouts = collageLayoutsFor(this.sources.length);
    this.dom.rail.hidden = layouts.length === 0;
    for (const layout of layouts) {
      const button = el('button', 'au-collage__layout');
      button.type = 'button';
      button.dataset.layout = layout.id;
      const name = LAYOUT_NAMES[layout.id] ?? layout.id;
      button.setAttribute(
        'aria-label',
        `${name} · ${layout.cellCount} ô`,
      );
      const mini = el('span', 'au-collage__mini');
      for (const cell of layout.cells) {
        const part = el('span', 'au-collage__mini-cell');
        part.style.left = `${cell.x * 100}%`;
        part.style.top = `${cell.y * 100}%`;
        part.style.width = `${cell.width * 100}%`;
        part.style.height = `${cell.height * 100}%`;
        mini.appendChild(part);
      }
      button.append(mini, document.createTextNode(name));
      button.addEventListener(
        'click',
        () => this.setLayout(layout.id),
        { signal: this.abort.signal },
      );
      this.layoutButtons.set(layout.id, button);
      this.dom.rail.appendChild(button);
    }
  }

  private updateUI(): void {
    const count = this.sources.length;
    const enough = count >= COLLAGE_MIN_CELLS;
    this.dom.subtitle.textContent = enough
      ? `${this.copy.count(count)} · ${this.copy.layouts.toLowerCase()}`
      : this.copy.emptyBody;
    this.dom.count.textContent = this.copy.count(count);
    this.dom.addButton.disabled = count >= COLLAGE_MAX_CELLS;
    this.dom.saveButton.disabled = !enough || this.saving;
    this.dom.stage.classList.toggle('is-empty', !enough);
    this.dom.empty.hidden = enough;
    this.dom.hint.classList.toggle(
      'is-hidden',
      !enough || this.hintDismissed,
    );
    this.dom.cellBar.hidden = !enough;
    for (const [id, button] of this.layoutButtons) {
      const active = id === this.state.layout;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    }
    for (const [id, button] of this.sizeButtons) {
      const active = id === this.state.size;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    }
    this.setFormat(this.exportFormat);
    this.applyFrame();
    this.updateControlLabels();
    this.updateBackgroundUI();
    this.updateCellControls();
  }

  /** Keep the stage's box and the size rail in sync with the document. */
  private applyFrame(): void {
    const aspect = collageAspect(this.state.size, this.sources[0] ?? null);
    this.dom.stage.style.setProperty('--au-collage-ratio', String(aspect));
    this.dom.stage.dataset.size = this.state.size;
  }

  private updateControlLabels(): void {
    this.dom.gapInput.value = (this.state.gap * 100).toFixed(1);
    this.dom.gapValue.textContent = `${(this.state.gap * 100).toFixed(1)}%`;
    this.dom.radiusInput.value = String(Math.round(this.state.radius * 100));
    this.dom.radiusValue.textContent = `${Math.round(this.state.radius * 100)}%`;
  }

  private updateBackgroundUI(): void {
    const background = this.state.background.toLowerCase();
    const end = this.state.backgroundEnd.toLowerCase();
    for (const swatch of this.swatchButtons) {
      swatch.classList.toggle(
        'is-active',
        !end && swatch.dataset.color === background,
      );
    }
    for (const swatch of this.gradientButtons) {
      const pair = swatch.dataset.gradient ?? '';
      const [from, to] = pair.split(',');
      swatch.classList.toggle(
        'is-active',
        Boolean(end) && from === background && to === end,
      );
    }
    if (this.dom.colorInput.value.toLowerCase() !== background) {
      this.dom.colorInput.value = background;
    }
    this.dom.backgroundValue.textContent = end
      ? `${background} → ${end}`
      : background;
  }

  private updateCellControls(): void {
    const cell = this.state.cells[this.selected];
    if (!cell) {
      this.dom.cellBar.hidden = true;
      return;
    }
    this.dom.cellBar.hidden = this.sources.length < COLLAGE_MIN_CELLS;
    this.dom.cellName.textContent = '';
    const dot = el('i');
    this.dom.cellName.append(
      dot,
      document.createTextNode(`${this.copy.selected} ${this.selected + 1}`),
    );
    const percent = Math.round(cell.zoom * 100);
    this.dom.zoomInput.value = String(percent);
    this.dom.zoomValue.textContent = `${percent}%`;
  }

  private renderPreview(): void {
    if (this.destroyed) return;
    const canvas = this.dom.canvas;
    const stageWidth = this.dom.stage.clientWidth || 360;
    const stageHeight = this.dom.stage.clientHeight || stageWidth;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const longest = Math.max(stageWidth, stageHeight);
    const scale = Math.min(dpr, 1080 / Math.max(1, longest));
    const width = Math.max(1, Math.round(stageWidth * scale));
    const height = Math.max(1, Math.round(stageHeight * scale));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (this.sources.length < COLLAGE_MIN_CELLS) {
      ctx.clearRect(0, 0, width, height);
      return;
    }
    renderCollage(ctx, this.state, this.sources, { size: width, height });

    const layout = collageLayout(this.state.layout);
    const shortest = Math.min(width, height);
    const gapX = (shortest * this.state.gap) / width;
    const gapY = (shortest * this.state.gap) / height;
    const rect = layout
      ? collageCellRects(layout, gapX, gapY)[this.selected]
      : undefined;
    if (rect) {
      const inset = Math.max(1, shortest / 600);
      ctx.save();
      ctx.strokeStyle = 'rgba(243,199,123,.92)';
      ctx.lineWidth = Math.max(2, shortest / 240);
      ctx.strokeRect(
        rect.x * width + inset,
        rect.y * height + inset,
        Math.max(0, rect.width * width - inset * 2),
        Math.max(0, rect.height * height - inset * 2),
      );
      ctx.restore();
    }
  }

  private scheduleRender(): void {
    if (this.destroyed || this.raf) return;
    this.raf = requestAnimationFrame(() => {
      this.raf = 0;
      this.renderPreview();
    });
  }

  private emitState(): void {
    if (!this.options.onStateChange) return;
    try {
      this.options.onStateChange(this.getState());
    } catch {
      // A host callback must not break the gesture loop.
    }
  }

  private toast(message: string): void {
    if (this.statusTimer) window.clearTimeout(this.statusTimer);
    this.dom.status.textContent = message;
    this.dom.status.classList.add('is-on');
    this.statusTimer = window.setTimeout(() => {
      this.dom.status.classList.remove('is-on');
    }, 2200);
  }

  private defaultName(blob: Blob): string {
    const extension = blob.type === 'image/jpeg'
      ? 'jpg'
      : blob.type === 'image/webp'
        ? 'webp'
        : 'png';
    return `aurum-collage.${extension}`;
  }
}

/** Create a collage screen inside `host`. */
export function createCollageEditor(
  host: HTMLElement | string,
  options: CollageUIOptions = {},
): AurumCollage {
  const element = typeof host === 'string'
    ? document.querySelector<HTMLElement>(host)
    : host;
  if (!element) {
    throw new Error('createCollageEditor: host element not found');
  }
  return new AurumCollage(element, options);
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.decoding = 'async';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('image'));
    image.src = url;
  });
}

function downloadBlob(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}
