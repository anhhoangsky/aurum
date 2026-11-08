/**
 * Client capability probe for the optional AI runtime.
 *
 * The probe is intentionally dependency-free and never throws: a browser that
 * blocks WebGPU, WebGL introspection or the Network Information API must still
 * get a usable WASM plan. Results are cached because requesting a GPU adapter
 * and creating a throw-away WebGL context are not free.
 */

export type AIBackend = 'webgpu' | 'wasm';

export interface AIClientProfile {
  /** Preferred inference backend. */
  readonly backend: AIBackend;
  readonly webgpu: boolean;
  readonly webnn: boolean;
  readonly webgl2: boolean;
  readonly gpuVendor: string;
  readonly gpuArchitecture: string;
  readonly gpuDescription: string;
  readonly gpuRenderer: string;
  readonly maxTextureDimension2D: number;
  readonly maxBufferSize: number;
  readonly maxComputeInvocationsPerWorkgroup: number;
  readonly deviceMemoryGB: number | null;
  readonly hardwareConcurrency: number;
  readonly mobile: boolean;
  readonly ios: boolean;
  readonly crossOriginIsolated: boolean;
  /** SharedArrayBuffer + COOP/COEP means the threaded WASM build can run. */
  readonly wasmThreads: boolean;
  readonly saveData: boolean;
  readonly effectiveType: string;
}

interface GPUAdapterInfoLike {
  vendor?: string;
  architecture?: string;
  device?: string;
  description?: string;
}

interface GPUAdapterLike {
  info?: GPUAdapterInfoLike;
  limits?: {
    maxTextureDimension2D?: number;
    maxBufferSize?: number;
    maxComputeInvocationsPerWorkgroup?: number;
  };
  requestAdapterInfo?: () => Promise<GPUAdapterInfoLike>;
}

interface GPULike {
  requestAdapter(options?: { powerPreference?: string }): Promise<GPUAdapterLike | null>;
}

interface NavigatorExtras {
  gpu?: GPULike;
  deviceMemory?: number;
  userAgentData?: { mobile?: boolean };
  connection?: { saveData?: boolean; effectiveType?: string };
}

let cached: Promise<AIClientProfile> | null = null;

function nav(): Navigator & NavigatorExtras {
  return navigator as Navigator & NavigatorExtras;
}

function numberOr(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : fallback;
}

function webglInfo(): {
  webgl2: boolean;
  vendor: string;
  renderer: string;
} {
  let canvas: HTMLCanvasElement | null = null;
  try {
    canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) return { webgl2: false, vendor: '', renderer: '' };
    const debug = gl.getExtension('WEBGL_debug_renderer_info');
    const vendor = debug
      ? String(gl.getParameter(debug.UNMASKED_VENDOR_WEBGL) ?? '')
      : String(gl.getParameter(gl.VENDOR) ?? '');
    const renderer = debug
      ? String(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) ?? '')
      : String(gl.getParameter(gl.RENDERER) ?? '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return { webgl2: true, vendor, renderer };
  } catch {
    return { webgl2: false, vendor: '', renderer: '' };
  } finally {
    canvas = null;
  }
}

function isIOS(ua: string): boolean {
  if (/iPad|iPhone|iPod/i.test(ua)) return true;
  // iPadOS reports a desktop Mac user agent; touch points give it away.
  return /Macintosh/i.test(ua) && navigator.maxTouchPoints > 1;
}

function isMobile(ua: string): boolean {
  const hinted = nav().userAgentData?.mobile;
  if (typeof hinted === 'boolean') return hinted;
  return /Android|iPhone|iPad|iPod|Mobile|Windows Phone|IEMobile/i.test(ua);
}

async function probeWebGPU(): Promise<{
  adapter: GPUAdapterLike | null;
  info: GPUAdapterInfoLike;
}> {
  const gpu = nav().gpu;
  if (!gpu) return { adapter: null, info: {} };
  try {
    const adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' });
    if (!adapter) return { adapter: null, info: {} };
    let info = adapter.info ?? {};
    if ((!info.vendor && !info.architecture) && adapter.requestAdapterInfo) {
      try {
        info = await adapter.requestAdapterInfo();
      } catch {
        // Some builds reject after the adapter is consumed; ignore it.
      }
    }
    return { adapter, info };
  } catch {
    return { adapter: null, info: {} };
  }
}

async function collect(): Promise<AIClientProfile> {
  const ua = navigator.userAgent || '';
  const webgl = webglInfo();
  const { adapter, info } = await probeWebGPU();
  const mobile = isMobile(ua);
  const ios = isIOS(ua);
  const crossOriginIsolated =
    typeof globalThis.crossOriginIsolated === 'boolean' && globalThis.crossOriginIsolated;
  const shared = typeof SharedArrayBuffer === 'function';
  const limits = adapter?.limits ?? {};
  const connection = nav().connection;

  return {
    backend: adapter ? 'webgpu' : 'wasm',
    webgpu: adapter !== null,
    webnn: typeof (navigator as unknown as { ml?: unknown }).ml === 'object',
    webgl2: webgl.webgl2,
    gpuVendor: String(info.vendor || ''),
    gpuArchitecture: String(info.architecture || ''),
    gpuDescription: String(info.description || info.device || ''),
    gpuRenderer: webgl.renderer,
    maxTextureDimension2D: numberOr(limits.maxTextureDimension2D, 8192),
    maxBufferSize: numberOr(limits.maxBufferSize, 256 * 1024 * 1024),
    maxComputeInvocationsPerWorkgroup: numberOr(
      limits.maxComputeInvocationsPerWorkgroup,
      256,
    ),
    deviceMemoryGB: typeof nav().deviceMemory === 'number' ? nav().deviceMemory! : null,
    hardwareConcurrency: numberOr(navigator.hardwareConcurrency, 4),
    mobile,
    ios,
    crossOriginIsolated,
    wasmThreads: crossOriginIsolated && shared,
    saveData: connection?.saveData === true,
    effectiveType: String(connection?.effectiveType || ''),
  };
}

/**
 * Probe the current client. The first call requests a WebGPU adapter and is
 * therefore asynchronous; later calls reuse the same promise. Never rejects.
 */
export function probeAIClient(force = false): Promise<AIClientProfile> {
  if (force || !cached) {
    cached = collect().catch(
      (): AIClientProfile => ({
        backend: 'wasm',
        webgpu: false,
        webnn: false,
        webgl2: false,
        gpuVendor: '',
        gpuArchitecture: '',
        gpuDescription: '',
        gpuRenderer: '',
        maxTextureDimension2D: 4096,
        maxBufferSize: 256 * 1024 * 1024,
        maxComputeInvocationsPerWorkgroup: 256,
        deviceMemoryGB: null,
        hardwareConcurrency: numberOr(navigator.hardwareConcurrency, 4),
        mobile: isMobile(navigator.userAgent || ''),
        ios: isIOS(navigator.userAgent || ''),
        crossOriginIsolated: false,
        wasmThreads: false,
        saveData: false,
        effectiveType: '',
      }),
    );
  }
  return cached;
}

/** Test hook: forget the cached probe. */
export function resetAIClientProbe(): void {
  cached = null;
}
