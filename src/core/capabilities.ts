/**
 * One-shot device probe for the renderer.
 *
 * This is deliberately cheap and defensive: it creates a throwaway WebGL
 * context, reads the limits that decide shader precision and texture budget,
 * then releases the context. The result is cached because repeated context
 * creation is both slow and limited by the browser.
 */

export type ColorSpaceMode = 'auto' | 'srgb' | 'linear';
export type RenderColorSpace = 'srgb' | 'linear';
export type DitherMode = 'auto' | boolean;
export type DeviceTier = 'low' | 'mid' | 'high' | 'ultra';

export interface AurumCapabilities {
  webgl: 0 | 1 | 2;
  highp: boolean;
  maxTexture: number;
  maxVaryings: number;
  maxUniforms: number;
  gpuVendor: string;
  gpuRenderer: string;
  deviceMemoryGB: number | null;
  hardwareConcurrency: number;
  dpr: number;
  mobile: boolean;
  ios: boolean;
  saveData: boolean;
  reducedMotion: boolean;
  tier: DeviceTier;
}

const FALLBACK: AurumCapabilities = {
  webgl: 0,
  highp: false,
  maxTexture: 2048,
  maxVaryings: 8,
  maxUniforms: 16,
  gpuVendor: '',
  gpuRenderer: '',
  deviceMemoryGB: null,
  hardwareConcurrency: 2,
  dpr: 1,
  mobile: false,
  ios: false,
  saveData: false,
  reducedMotion: false,
  tier: 'low',
};

let cached: AurumCapabilities | null = null;

function detectTier(
  webgl: 0 | 1 | 2,
  highp: boolean,
  maxTexture: number,
  deviceMemoryGB: number | null,
  hardwareConcurrency: number,
  mobile: boolean,
  saveData: boolean,
): DeviceTier {
  let score = webgl === 2 ? 2 : webgl === 1 ? 1 : 0;
  if (highp) score += 2;
  if (maxTexture >= 8192) score += 2;
  else if (maxTexture >= 4096) score += 1;
  if (deviceMemoryGB !== null) {
    if (deviceMemoryGB >= 8) score += 2;
    else if (deviceMemoryGB >= 4) score += 1;
  } else if (hardwareConcurrency >= 8) {
    score += 1;
  }
  if (!mobile) score += 1;
  if (saveData) score -= 1;
  const tier: DeviceTier =
    score >= 8 ? 'ultra' : score >= 6 ? 'high' : score >= 4 ? 'mid' : 'low';
  // `ultra` is reserved for a browser that exposes WebGL2 and high precision;
  // a fast WebGL1 desktop is still `high`.
  return tier === 'ultra' && (webgl < 2 || !highp) ? 'high' : tier;
}

export function probeCapabilities(): AurumCapabilities {
  if (cached) return cached;
  if (typeof document === 'undefined' || typeof navigator === 'undefined') {
    cached = FALLBACK;
    return cached;
  }

  const ua = navigator.userAgent || '';
  const mobile = /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(ua);
  const ios = /iP(hone|ad|od)/.test(ua) || (ua.includes('Macintosh') && 'ontouchend' in document);
  const deviceMemoryGB =
    typeof (navigator as Navigator & { deviceMemory?: number }).deviceMemory === 'number'
      ? ((navigator as Navigator & { deviceMemory?: number }).deviceMemory as number)
      : null;
  const hardwareConcurrency = navigator.hardwareConcurrency || 2;
  const saveData =
    (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
  const reducedMotion =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;
  const dpr =
    typeof window !== 'undefined' ? Math.min(3, Math.max(1, window.devicePixelRatio || 1)) : 1;

  let webgl: 0 | 1 | 2 = 0;
  let highp = false;
  let maxTexture = FALLBACK.maxTexture;
  let maxVaryings = FALLBACK.maxVaryings;
  let maxUniforms = FALLBACK.maxUniforms;
  let gpuVendor = '';
  let gpuRenderer = '';

  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const options: WebGLContextAttributes = {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: false,
    powerPreference: 'high-performance',
  };

  let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
  try {
    gl = canvas.getContext('webgl2', options) as WebGL2RenderingContext | null;
    if (gl) webgl = 2;
    if (!gl) {
      gl = canvas.getContext('webgl', options) as WebGLRenderingContext | null;
      if (gl) webgl = 1;
    }
  } catch {
    gl = null;
  }

  if (gl) {
    try {
      const precision = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
      highp = !!precision && precision.precision > 0;
      maxTexture = (gl.getParameter(gl.MAX_TEXTURE_SIZE) as number) || maxTexture;
      maxVaryings = (gl.getParameter(gl.MAX_VARYING_VECTORS) as number) || maxVaryings;
      maxUniforms =
        (gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS) as number) || maxUniforms;
      const debug = gl.getExtension('WEBGL_debug_renderer_info');
      if (debug) {
        gpuVendor = String(gl.getParameter(debug.UNMASKED_VENDOR_WEBGL) || '');
        gpuRenderer = String(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) || '');
      } else {
        gpuVendor = String(gl.getParameter(gl.VENDOR) || '');
        gpuRenderer = String(gl.getParameter(gl.RENDERER) || '');
      }
    } catch {
      // A browser may expose a context but block introspection; the defaults
      // above are conservatively safe.
    }
    try {
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    } catch {
      // Releasing the probe context is best-effort.
    }
  }

  cached = {
    webgl,
    highp,
    maxTexture,
    maxVaryings,
    maxUniforms,
    gpuVendor,
    gpuRenderer,
    deviceMemoryGB,
    hardwareConcurrency,
    dpr,
    mobile,
    ios,
    saveData,
    reducedMotion,
    tier: detectTier(
      webgl,
      highp,
      maxTexture,
      deviceMemoryGB,
      hardwareConcurrency,
      mobile,
      saveData,
    ),
  };
  return cached;
}

export function resolveColorSpace(
  mode: ColorSpaceMode,
  capabilities: AurumCapabilities,
): RenderColorSpace {
  if (mode === 'linear') return 'linear';
  if (mode === 'srgb') return 'srgb';
  return capabilities.webgl > 0 && capabilities.highp && capabilities.tier !== 'low'
    ? 'linear'
    : 'srgb';
}

export function resolveDither(
  mode: DitherMode,
  colorSpace: RenderColorSpace,
  capabilities: AurumCapabilities,
): boolean {
  if (typeof mode === 'boolean') return mode;
  // Linear output needs dither most; a low tier also benefits because its
  // framebuffer is often 8-bit and its shader precision is the lowest.
  return colorSpace === 'linear' || capabilities.tier === 'low';
}
