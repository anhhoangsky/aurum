import layoutsJson from '../../specs/layouts.json';
import { clamp, finite } from './state';

/**
 * The collage layout contract shared with the Swift client.
 *
 * `specs/layouts.json` stores every layout on a 12 × 12 unit grid, so a third
 * of the frame is exactly `4/12` and two clients that read the same file
 * cannot disagree about a cell edge. A cell is a rectangle; the rounded
 * corners are applied at render time, which keeps the geometry testable
 * without a canvas.
 */
export interface CollageRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** One layout of the rail: 2…9 rectangles in draw order. */
export interface CollageLayout {
  id: string;
  cellCount: number;
  /** Normalized to the square frame, 0…1. */
  cells: CollageRect[];
}

/**
 * How one photo sits inside its cell.
 *
 * `zoom` 1 covers the cell exactly; larger values crop in. The offsets are a
 * fraction of the slack: `-1` shows the left/top edge, `+1` the right/bottom
 * edge, and `0` centres the photo. The renderer clamps both ends, so a cell
 * can never show the background through a pan.
 */
export interface CollageCellState {
  /** Index into the source list the host hands to the renderer. */
  source: number;
  zoom: number;
  offsetX: number;
  offsetY: number;
}

/** The editable collage document. */
export interface CollageState {
  layout: string;
  /** Gutter between and around the cells, a fraction of the frame side. */
  gap: number;
  /** Corner radius, a fraction of the shorter side of each cell. */
  radius: number;
  background: string;
  cells: CollageCellState[];
}

/** The source crop and destination box of one photo inside its cell. */
export interface CollageCover {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  dx: number;
  dy: number;
  dw: number;
  dh: number;
}

export type CollageSource =
  | HTMLImageElement
  | HTMLCanvasElement
  | ImageBitmap
  | OffscreenCanvas;

export interface CollageRenderOptions {
  /** Output side in pixels. Defaults to the canvas width. */
  size?: number;
}

export const COLLAGE_MIN_CELLS = 2;
export const COLLAGE_MAX_CELLS = 9;
/** 6 % of the frame side is the widest gutter the rail offers. */
export const COLLAGE_MAX_GAP = 0.06;
/** 0.5 makes a cell a capsule; larger values are clamped per cell. */
export const COLLAGE_MAX_RADIUS = 0.5;
export const COLLAGE_MAX_ZOOM = 4;
export const COLLAGE_DEFAULT_GAP = 0.012;
export const COLLAGE_DEFAULT_BACKGROUND = '#ffffff';

interface LayoutFile {
  version: number;
  unit: number;
  layouts: { id: string; cells: number[][] }[];
}

const layoutFile = layoutsJson as unknown as LayoutFile;
const layoutUnit =
  typeof layoutFile.unit === 'number' && layoutFile.unit > 0
    ? layoutFile.unit
    : 12;

function buildLayouts(): CollageLayout[] {
  if (layoutFile.version !== 1 || !Array.isArray(layoutFile.layouts)) {
    return [];
  }
  const seen = new Set<string>();
  const out: CollageLayout[] = [];
  for (const entry of layoutFile.layouts) {
    if (
      !entry ||
      typeof entry.id !== 'string' ||
      !entry.id ||
      seen.has(entry.id) ||
      !Array.isArray(entry.cells)
    ) {
      continue;
    }
    const cells: CollageRect[] = [];
    let valid = entry.cells.length >= COLLAGE_MIN_CELLS
      && entry.cells.length <= COLLAGE_MAX_CELLS;
    for (const raw of entry.cells) {
      if (!valid) break;
      if (!Array.isArray(raw) || raw.length !== 4) {
        valid = false;
        break;
      }
      const [x, y, width, height] = raw;
      if (
        ![x, y, width, height].every(
          (value) => typeof value === 'number' && Number.isFinite(value),
        ) ||
        width <= 0 ||
        height <= 0 ||
        x < 0 ||
        y < 0 ||
        x + width > layoutUnit ||
        y + height > layoutUnit
      ) {
        valid = false;
        break;
      }
      cells.push({
        x: x / layoutUnit,
        y: y / layoutUnit,
        width: width / layoutUnit,
        height: height / layoutUnit,
      });
    }
    if (!valid) continue;
    seen.add(entry.id);
    out.push({ id: entry.id, cellCount: cells.length, cells });
  }
  return out;
}

/** Every valid layout of the shared spec, in rail order. */
export const COLLAGE_LAYOUTS: readonly CollageLayout[] = buildLayouts();

const layoutById = new Map<string, CollageLayout>(
  COLLAGE_LAYOUTS.map((layout) => [layout.id, layout]),
);

/** The layout with this id, or null when the spec does not name it. */
export function collageLayout(id: unknown): CollageLayout | null {
  return typeof id === 'string' ? layoutById.get(id) ?? null : null;
}

/** Every layout that holds exactly `count` photos. */
export function collageLayoutsFor(count: number): CollageLayout[] {
  const wanted = Math.round(finite(count, 0));
  return COLLAGE_LAYOUTS.filter((layout) => layout.cellCount === wanted);
}

/**
 * The gap shrinks the whole grid by `gap` and every cell by another `gap / 2`
 * on each side, so the outer border and the gutters all measure one gap.
 */
export function collageCellRects(
  layout: CollageLayout | string,
  gap: number,
): CollageRect[] {
  const target = typeof layout === 'string' ? collageLayout(layout) : layout;
  if (!target) return [];
  const gutter = clamp(finite(gap, 0), 0, COLLAGE_MAX_GAP);
  const scale = 1 - gutter;
  return target.cells.map((cell) => ({
    x: gutter + cell.x * scale,
    y: gutter + cell.y * scale,
    width: Math.max(0, cell.width * scale - gutter),
    height: Math.max(0, cell.height * scale - gutter),
  }));
}

/**
 * Cover-fit one source inside a cell.
 *
 * The scale is the larger of the two cover ratios, so at `zoom` 1 the photo
 * always fills the cell and only the overflowing axis is cropped. The pan is
 * expressed as a fraction of the slack, which keeps both ends reachable and
 * never exposes the background.
 */
export function collageCover(
  source: { width: number; height: number },
  cell: { width: number; height: number },
  view: { zoom: number; offsetX: number; offsetY: number } = {
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
  },
): CollageCover {
  const empty: CollageCover = {
    sx: 0,
    sy: 0,
    sw: 0,
    sh: 0,
    dx: 0,
    dy: 0,
    dw: 0,
    dh: 0,
  };
  const sourceWidth = finite(source?.width, 0);
  const sourceHeight = finite(source?.height, 0);
  const cellWidth = finite(cell?.width, 0);
  const cellHeight = finite(cell?.height, 0);
  if (
    sourceWidth <= 0 ||
    sourceHeight <= 0 ||
    cellWidth <= 0 ||
    cellHeight <= 0
  ) {
    return empty;
  }
  const zoom = clamp(finite(view?.zoom, 1), 1, COLLAGE_MAX_ZOOM);
  const offsetX = clamp(finite(view?.offsetX, 0), -1, 1);
  const offsetY = clamp(finite(view?.offsetY, 0), -1, 1);
  const scale =
    Math.max(cellWidth / sourceWidth, cellHeight / sourceHeight) * zoom;
  const dw = sourceWidth * scale;
  const dh = sourceHeight * scale;
  const dx = ((cellWidth - dw) * (1 + offsetX)) / 2;
  const dy = ((cellHeight - dh) * (1 + offsetY)) / 2;
  const sw = Math.min(sourceWidth, cellWidth / scale);
  const sh = Math.min(sourceHeight, cellHeight / scale);
  const sx = clamp(-dx / scale, 0, Math.max(0, sourceWidth - sw));
  const sy = clamp(-dy / scale, 0, Math.max(0, sourceHeight - sh));
  return { sx, sy, sw, sh, dx, dy, dw, dh };
}

function normalizeBackground(value: unknown): string {
  if (typeof value !== 'string') return COLLAGE_DEFAULT_BACKGROUND;
  const text = value.trim().toLowerCase();
  if (/^#[0-9a-f]{6}$/.test(text)) return text;
  if (/^#[0-9a-f]{3}$/.test(text)) {
    return `#${text[1]}${text[1]}${text[2]}${text[2]}${text[3]}${text[3]}`;
  }
  return COLLAGE_DEFAULT_BACKGROUND;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Normalize an untrusted collage document.
 *
 * The layout decides the cell count: extra cells are trimmed and missing ones
 * are filled, so changing two photos to a three-cell layout cannot leave the
 * renderer with a hole. A document whose layout is unknown keeps its cell
 * count when a layout offers it, otherwise it falls back to the first layout.
 */
export function normalizeCollageState(input: unknown): CollageState {
  const raw = isRecord(input) ? input : {};
  const rawCells = Array.isArray(raw.cells) ? raw.cells : [];
  let layout = collageLayout(raw.layout);
  if (!layout) {
    layout = collageLayoutsFor(rawCells.length)[0] ?? COLLAGE_LAYOUTS[0] ?? null;
  }
  if (!layout) {
    return {
      layout: '',
      gap: COLLAGE_DEFAULT_GAP,
      radius: 0,
      background: COLLAGE_DEFAULT_BACKGROUND,
      cells: [],
    };
  }
  const cells = layout.cells.map((_, index) => {
    const cell = isRecord(rawCells[index]) ? rawCells[index] : {};
    return {
      source: Math.max(0, Math.floor(finite(cell.source, index))),
      zoom: clamp(finite(cell.zoom, 1), 1, COLLAGE_MAX_ZOOM),
      offsetX: clamp(finite(cell.offsetX, 0), -1, 1),
      offsetY: clamp(finite(cell.offsetY, 0), -1, 1),
    };
  });
  return {
    layout: layout.id,
    gap: clamp(finite(raw.gap, COLLAGE_DEFAULT_GAP), 0, COLLAGE_MAX_GAP),
    radius: clamp(finite(raw.radius, 0), 0, COLLAGE_MAX_RADIUS),
    background: normalizeBackground(raw.background),
    cells,
  };
}

/** A fresh document: the first cell per photo, one source each. */
export function defaultCollageState(
  layoutId = 'duo-split',
): CollageState {
  const layout = collageLayout(layoutId) ?? COLLAGE_LAYOUTS[0];
  if (!layout) {
    return normalizeCollageState({});
  }
  return {
    layout: layout.id,
    gap: COLLAGE_DEFAULT_GAP,
    radius: 0,
    background: COLLAGE_DEFAULT_BACKGROUND,
    cells: layout.cells.map((_, index) => ({
      source: index,
      zoom: 1,
      offsetX: 0,
      offsetY: 0,
    })),
  };
}

function roundedPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  const r = Math.max(0, Math.min(radius, Math.min(width, height) / 2));
  ctx.beginPath();
  if (r < 0.01) {
    ctx.rect(x, y, width, height);
    return;
  }
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.arcTo(x + width, y, x + width, y + r, r);
  ctx.lineTo(x + width, y + height - r);
  ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
  ctx.lineTo(x + r, y + height);
  ctx.arcTo(x, y + height, x, y + height - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

/**
 * Composite the document onto a 2D context.
 *
 * The host renders each cell (a child aurum state, an adjusted bitmap or a
 * plain photo) and passes the bitmaps in source order; this pass only lays
 * them out, so preview and export share one geometry. The whole frame is
 * painted with the background first, which also makes an opaque JPEG export
 * impossible to get wrong.
 */
export function renderCollage(
  ctx: CanvasRenderingContext2D,
  state: unknown,
  sources: readonly CollageSource[],
  options: CollageRenderOptions = {},
): CollageState {
  const next = normalizeCollageState(state);
  const layout = collageLayout(next.layout);
  const side = Math.max(
    1,
    Math.round(finite(options.size, ctx.canvas.width || 2048)),
  );
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = next.background;
  ctx.fillRect(0, 0, side, side);
  if (!layout) {
    ctx.restore();
    return next;
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  const rects = collageCellRects(layout, next.gap);
  for (let index = 0; index < layout.cells.length; index += 1) {
    const rect = rects[index];
    if (!rect) continue;
    const x0 = Math.round(rect.x * side);
    const y0 = Math.round(rect.y * side);
    const x1 = Math.round((rect.x + rect.width) * side);
    const y1 = Math.round((rect.y + rect.height) * side);
    const width = x1 - x0;
    const height = y1 - y0;
    if (width <= 0 || height <= 0) continue;
    const cell = next.cells[index];
    const source = cell ? sources[cell.source] : undefined;
    ctx.save();
    roundedPath(
      ctx,
      x0,
      y0,
      width,
      height,
      next.radius * Math.min(width, height),
    );
    ctx.clip();
    if (source) {
      const cover = collageCover(
        { width: source.width, height: source.height },
        { width, height },
        cell,
      );
      if (cover.sw > 0 && cover.sh > 0) {
        ctx.drawImage(
          source,
          cover.sx,
          cover.sy,
          cover.sw,
          cover.sh,
          x0,
          y0,
          width,
          height,
        );
      }
    }
    ctx.restore();
  }
  ctx.restore();
  return next;
}
