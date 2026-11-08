/**
 * Procedural 3D colour-grading LUTs.
 *
 * The shader samples a 2D atlas: `size` slices of `size x size`, laid out
 * horizontally (texture width = size * size, height = size). No binary asset
 * is shipped, so the LUTs stay offline-friendly and cost only the generator.
 * A 17³ grid is the usual film-LUT resolution and is smooth enough at 8-bit.
 */
export const LUT_SIZE = 17;

export interface LUTPreset {
  id: string;
  label: string;
  labelEn: string;
}

export const LUTS: LUTPreset[] = [
  { id: 'none', label: 'Không', labelEn: 'None' },
  { id: 'cinema', label: 'Điện ảnh', labelEn: 'Cinema' },
  { id: 'teal', label: 'Xanh ngọc', labelEn: 'Teal & Orange' },
  { id: 'fade', label: 'Bạc màu', labelEn: 'Fade' },
  { id: 'noir', label: 'Đen trắng', labelEn: 'Noir' },
  { id: 'warm', label: 'Ấm', labelEn: 'Warm' },
  { id: 'cool', label: 'Lạnh', labelEn: 'Cool' },
];

type RGB = [number, number, number];

const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);
const luma = (r: number, g: number, b: number): number =>
  r * 0.2126 + g * 0.7152 + b * 0.0722;

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / Math.max(1e-6, edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function saturate(rgb: RGB, amount: number): RGB {
  const l = luma(rgb[0], rgb[1], rgb[2]);
  return [
    l + (rgb[0] - l) * amount,
    l + (rgb[1] - l) * amount,
    l + (rgb[2] - l) * amount,
  ];
}

function contrast(rgb: RGB, amount: number, pivot = 0.5): RGB {
  return [
    (rgb[0] - pivot) * amount + pivot,
    (rgb[1] - pivot) * amount + pivot,
    (rgb[2] - pivot) * amount + pivot,
  ];
}

function clampRGB(rgb: RGB): RGB {
  return [clamp01(rgb[0]), clamp01(rgb[1]), clamp01(rgb[2])];
}

type Grade = (r: number, g: number, b: number) => RGB;

const GRADES: Record<string, Grade> = {
  cinema(r, g, b) {
    const l = luma(r, g, b);
    let c: RGB = [
      r + 0.032 * l - 0.018 * (1 - l),
      g + 0.006 * l + 0.008 * (1 - l),
      b - 0.03 * l + 0.045 * (1 - l),
    ];
    c = contrast(c, 1.06, 0.46);
    c = saturate(c, 1.06);
    return clampRGB(c);
  },
  teal(r, g, b) {
    const l = luma(r, g, b);
    let c: RGB = [
      r + 0.06 * l - 0.035 * (1 - l),
      g + 0.012 * l + 0.022 * (1 - l),
      b - 0.05 * l + 0.075 * (1 - l),
    ];
    c = contrast(c, 1.08, 0.47);
    c = saturate(c, 1.1);
    return clampRGB(c);
  },
  fade(r, g, b) {
    let c: RGB = [r * 0.82 + 0.11, g * 0.82 + 0.105, b * 0.82 + 0.1];
    c = saturate(c, 0.82);
    c = [c[0] * 1.015, c[1], c[2] * 0.99];
    return clampRGB(c);
  },
  noir(r, g, b) {
    let l = luma(r, g, b);
    l = smoothstep(0.06, 0.94, l);
    return [l * 0.995, l, l * 1.012];
  },
  warm(r, g, b) {
    let c: RGB = [r * 1.06, g * 1.012, b * 0.915];
    c = saturate(c, 1.05);
    return clampRGB(c);
  },
  cool(r, g, b) {
    let c: RGB = [r * 0.93, g * 0.995, b * 1.075];
    c = saturate(c, 0.97);
    return clampRGB(c);
  },
};

export function lutById(id: string): LUTPreset {
  return LUTS.find((item) => item.id === id) || LUTS[0];
}

/** Build the atlas for `id`, or null for `none`/unknown ids. */
export function buildLUT(id: string, size = LUT_SIZE): Uint8Array | null {
  if (id === 'none') return null;
  const grade = GRADES[id];
  if (!grade) return null;
  const grid = Math.max(2, Math.round(size));
  const width = grid * grid;
  const height = grid;
  const data = new Uint8Array(width * height * 4);
  const step = grid - 1;
  for (let slice = 0; slice < grid; slice += 1) {
    for (let row = 0; row < grid; row += 1) {
      for (let col = 0; col < grid; col += 1) {
        const rgb = grade(col / step, row / step, slice / step);
        const index = ((slice * grid + row) * width + (slice * grid + col)) * 4;
        data[index] = Math.round(clamp01(rgb[0]) * 255);
        data[index + 1] = Math.round(clamp01(rgb[1]) * 255);
        data[index + 2] = Math.round(clamp01(rgb[2]) * 255);
        data[index + 3] = 255;
      }
    }
  }
  return data;
}
