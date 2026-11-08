import type {
  BeautyMask,
  ColorTransform,
  EnhanceSpec,
  ExportOptions,
  ExportSpec,
  LiquifyField,
  PerspectiveWarp,
  Point,
  PreviewSpec,
  Quad,
} from './types';
import { isAbortError, nextFrame, throwIfAborted } from './async';
import {
  homographyFromQuad,
  projectHomography,
  warpPoint,
  type Mat3,
} from './math';
import {
  SHADER_VARIANTS,
  VERTEX_SOURCE,
  shaderVariantFor,
  type ShaderVariantKey,
} from './shader';

type Bitmap = ImageBitmap | HTMLImageElement | HTMLCanvasElement;

interface Uniforms {
  matrix: WebGLUniformLocation | null;
  warp: WebGLUniformLocation | null;
  color: WebGLUniformLocation | null;
  offset: WebGLUniformLocation | null;
  vignette: WebGLUniformLocation | null;
  aspect: WebGLUniformLocation | null;
  vigCenter: WebGLUniformLocation | null;
  vigHalf: WebGLUniformLocation | null;
  texel: WebGLUniformLocation | null;
  textureLoc: WebGLUniformLocation | null;
  curveLoc: WebGLUniformLocation | null;
  lutLoc: WebGLUniformLocation | null;
  maskLoc: WebGLUniformLocation | null;
  liquifyLoc: WebGLUniformLocation | null;
  liquifyShift: WebGLUniformLocation | null;
  dither: WebGLUniformLocation | null;
  exposure: WebGLUniformLocation | null;
  brightness: WebGLUniformLocation | null;
  contrast: WebGLUniformLocation | null;
  saturation: WebGLUniformLocation | null;
  highlights: WebGLUniformLocation | null;
  shadows: WebGLUniformLocation | null;
  whites: WebGLUniformLocation | null;
  blacks: WebGLUniformLocation | null;
  warmth: WebGLUniformLocation | null;
  tint: WebGLUniformLocation | null;
  vibrance: WebGLUniformLocation | null;
  gamma: WebGLUniformLocation | null;
  clarity: WebGLUniformLocation | null;
  sharpen: WebGLUniformLocation | null;
  denoise: WebGLUniformLocation | null;
  smoothSkin: WebGLUniformLocation | null;
  blemish: WebGLUniformLocation | null;
  skinTexture: WebGLUniformLocation | null;
  skinTone: WebGLUniformLocation | null;
  hasMask: WebGLUniformLocation | null;
  hasCurve: WebGLUniformLocation | null;
  lutStrength: WebGLUniformLocation | null;
  lutSize: WebGLUniformLocation | null;
  quality: WebGLUniformLocation | null;
  faces: WebGLUniformLocation | null;
  faceCount: WebGLUniformLocation | null;
  anchors: WebGLUniformLocation | null;
  hasAnchors: WebGLUniformLocation | null;
  hsl: WebGLUniformLocation | null;
  faceSlim: WebGLUniformLocation | null;
  jawline: WebGLUniformLocation | null;
  chin: WebGLUniformLocation | null;
  eyeSize: WebGLUniformLocation | null;
  noseSize: WebGLUniformLocation | null;
  mouthSize: WebGLUniformLocation | null;
}

interface ShaderProgram {
  program: WebGLProgram;
  u: Uniforms;
}

interface GLState {
  gl: WebGLRenderingContext;
  buffer: WebGLBuffer;
  texture: WebGLTexture;
  curveTexture: WebGLTexture;
  lutTexture: WebGLTexture;
  maskTexture: WebGLTexture;
  liquifyTexture: WebGLTexture;
  anchorTexture: WebGLTexture;
  whiteTexture: WebGLTexture;
  /** Built variants, keyed by build-time variant name. `null` = compile failed. */
  programs: Map<ShaderVariantKey, ShaderProgram | null>;
  active: ShaderProgram;
  /** Minimal program used when a requested variant fails to build. */
  fallback: ShaderProgram;
  maxTexture: number;
  texWidth: number;
  texHeight: number;
  curveRef: Uint8Array | null;
  lutRef: Uint8Array | null;
  maskRef: BeautyMask | null;
  liquifyRef: LiquifyField | null;
  anchorRef: Uint8Array | null;
  lutSize: number;
}

const ATTRIB_POS = 0;
const ATTRIB_UV = 1;
const ATTRIB_W = 2;

const EMPTY_FACES = new Float32Array(16);
const EMPTY_HSL = new Float32Array(24);
const IDENTITY_MATRIX = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
const FLAT_WARP: [number, number] = [0, 0];
const PREVIEW_MESH = 10;
const EXPORT_MESH = 24;

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
  label: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) || 'unknown compile error';
    console.warn(`[aurum] ${label} shader failed: ${log}`);
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function makeUniforms(gl: WebGLRenderingContext, program: WebGLProgram): Uniforms {
  const u = (name: string): WebGLUniformLocation | null =>
    gl.getUniformLocation(program, name);
  return {
    matrix: u('u_matrix'),
    warp: u('u_warp'),
    color: u('u_color'),
    offset: u('u_offset'),
    vignette: u('u_vignette'),
    aspect: u('u_aspect'),
    vigCenter: u('u_vigCenter'),
    vigHalf: u('u_vigHalf'),
    texel: u('u_texel'),
    textureLoc: u('u_texture'),
    curveLoc: u('u_curve'),
    lutLoc: u('u_lut'),
    maskLoc: u('u_mask'),
    liquifyLoc: u('u_liquify'),
    liquifyShift: u('u_liquifyShift'),
    dither: u('u_dither'),
    exposure: u('u_exposure'),
    brightness: u('u_brightness'),
    contrast: u('u_contrast'),
    saturation: u('u_saturation'),
    highlights: u('u_highlights'),
    shadows: u('u_shadows'),
    whites: u('u_whites'),
    blacks: u('u_blacks'),
    warmth: u('u_warmth'),
    tint: u('u_tint'),
    vibrance: u('u_vibrance'),
    gamma: u('u_gamma'),
    clarity: u('u_clarity'),
    sharpen: u('u_sharpen'),
    denoise: u('u_denoise'),
    smoothSkin: u('u_smoothSkin'),
    blemish: u('u_blemish'),
    skinTexture: u('u_skinTexture'),
    skinTone: u('u_skinTone'),
    hasMask: u('u_hasMask'),
    hasCurve: u('u_hasCurve'),
    lutStrength: u('u_lutStrength'),
    lutSize: u('u_lutSize'),
    quality: u('u_quality'),
    faces: u('u_faces'),
    faceCount: u('u_faceCount'),
    anchors: u('u_anchors'),
    hasAnchors: u('u_hasAnchors'),
    hsl: u('u_hsl'),
    faceSlim: u('u_faceSlim'),
    jawline: u('u_jawline'),
    chin: u('u_chin'),
    eyeSize: u('u_eyeSize'),
    noseSize: u('u_noseSize'),
    mouthSize: u('u_mouthSize'),
  };
}

function createShaderProgram(
  gl: WebGLRenderingContext,
  key: ShaderVariantKey,
): ShaderProgram | null {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SOURCE, `${key} vertex`);
  if (!vertex) return null;
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, SHADER_VARIANTS[key], `${key} fragment`);
  if (!fragment) {
    gl.deleteShader(vertex);
    return null;
  }
  const program = gl.createProgram();
  if (!program) {
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    return null;
  }
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  // Explicit locations keep the shared quad layout stable across variants.
  gl.bindAttribLocation(program, ATTRIB_POS, 'a_pos');
  gl.bindAttribLocation(program, ATTRIB_UV, 'a_uv');
  gl.bindAttribLocation(program, ATTRIB_W, 'a_w');
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) || 'unknown link error';
    console.warn(`[aurum] ${key} program failed: ${log}`);
    gl.deleteProgram(program);
    return null;
  }
  return { program, u: makeUniforms(gl, program) };
}

function ensureProgram(state: GLState, key: ShaderVariantKey): ShaderProgram {
  if (state.programs.has(key)) return state.programs.get(key) ?? state.fallback;
  const built = createShaderProgram(state.gl, key);
  state.programs.set(key, built);
  if (built) return built;
  console.warn(`[aurum] shader variant "${key}" unavailable; using the fallback program`);
  return state.fallback;
}

function deletePrograms(
  gl: WebGLRenderingContext,
  programs: Map<ShaderVariantKey, ShaderProgram | null>,
): void {
  for (const program of programs.values()) {
    if (program) gl.deleteProgram(program.program);
  }
  programs.clear();
}

function textureParams(gl: WebGLRenderingContext): void {
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
}

function makeTexture(gl: WebGLRenderingContext): WebGLTexture | null {
  const texture = gl.createTexture();
  if (!texture) return null;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  textureParams(gl);
  return texture;
}

function initGL(canvas: HTMLCanvasElement, preserveDrawingBuffer = false): GLState | null {
  let gl: WebGLRenderingContext | null = null;
  try {
    gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer,
      powerPreference: 'high-performance',
    }) as WebGLRenderingContext | null;
  } catch {
    gl = null;
  }
  if (!gl) return null;

  const programs = new Map<ShaderVariantKey, ShaderProgram | null>();
  const base = createShaderProgram(gl, 'base');
  programs.set('base', base);
  let fallback = base;
  if (!fallback) {
    const minimal = createShaderProgram(gl, 'fallback');
    programs.set('fallback', minimal);
    fallback = minimal;
  }
  if (!fallback) return null;

  const buffer = gl.createBuffer();
  if (!buffer) {
    deletePrograms(gl, programs);
    return null;
  }
  // Interleaved unit quad: top-left, top-right, bottom-right, bottom-left.
  // Five floats per vertex: source position (x, y), texture UV, and the
  // projective weight (1 for the preview; the homography denominator for an
  // export tile).
  const data = new Float32Array([
    -1, -1, 0, 0, 1,
    1, -1, 1, 0, 1,
    1, 1, 1, 1, 1,
    -1, -1, 0, 0, 1,
    1, 1, 1, 1, 1,
    -1, 1, 0, 1, 1,
  ]);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  const texture = makeTexture(gl);
  const curveTexture = makeTexture(gl);
  const lutTexture = makeTexture(gl);
  const maskTexture = makeTexture(gl);
  const liquifyTexture = makeTexture(gl);
  const anchorTexture = makeTexture(gl);
  const whiteTexture = makeTexture(gl);
  if (
    !texture ||
    !curveTexture ||
    !lutTexture ||
    !maskTexture ||
    !liquifyTexture ||
    !anchorTexture ||
    !whiteTexture
  ) {
    gl.deleteBuffer(buffer);
    for (const item of [
      texture,
      curveTexture,
      lutTexture,
      maskTexture,
      liquifyTexture,
      anchorTexture,
      whiteTexture,
    ]) {
      if (item) gl.deleteTexture(item);
    }
    deletePrograms(gl, programs);
    return null;
  }
  // Anchor rows are packed tightly, so never interpolate between texels.
  gl.bindTexture(gl.TEXTURE_2D, anchorTexture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.bindTexture(gl.TEXTURE_2D, whiteTexture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([255, 255, 255, 255]),
  );

  return {
    gl,
    buffer,
    texture,
    curveTexture,
    lutTexture,
    maskTexture,
    liquifyTexture,
    anchorTexture,
    whiteTexture,
    programs,
    active: fallback,
    fallback,
    maxTexture: Math.min(8192, gl.getParameter(gl.MAX_TEXTURE_SIZE) as number),
    texWidth: 1,
    texHeight: 1,
    curveRef: null,
    lutRef: null,
    maskRef: null,
    liquifyRef: null,
    anchorRef: null,
    lutSize: 0,
  };
}

function sourceDimensions(bitmap: Bitmap): { width: number; height: number } {
  if (bitmap instanceof HTMLImageElement) {
    return {
      width: bitmap.naturalWidth || bitmap.width,
      height: bitmap.naturalHeight || bitmap.height,
    };
  }
  return { width: bitmap.width, height: bitmap.height };
}

function uploadTexture(state: GLState, bitmap: Bitmap): boolean {
  const { gl } = state;
  try {
    const size = sourceDimensions(bitmap);
    gl.bindTexture(gl.TEXTURE_2D, state.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmap);
    state.texWidth = size.width;
    state.texHeight = size.height;
    return true;
  } catch {
    return false;
  }
}

function uploadEnhanceTextures(state: GLState, enhance: EnhanceSpec): void {
  const { gl } = state;
  if (enhance.curve !== state.curveRef) {
    if (enhance.curve) {
      gl.bindTexture(gl.TEXTURE_2D, state.curveTexture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        256,
        1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        enhance.curve,
      );
    }
    state.curveRef = enhance.curve;
  }
  if (enhance.lut !== state.lutRef || enhance.lutSize !== state.lutSize) {
    if (enhance.lut) {
      const size = Math.max(2, Math.round(enhance.lutSize));
      gl.bindTexture(gl.TEXTURE_2D, state.lutTexture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        size * size,
        size,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        enhance.lut,
      );
    }
    state.lutRef = enhance.lut;
    state.lutSize = enhance.lutSize;
  }
  if (enhance.mask !== state.maskRef) {
    if (enhance.mask) {
      gl.bindTexture(gl.TEXTURE_2D, state.maskTexture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        enhance.mask.width,
        enhance.mask.height,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        enhance.mask.data,
      );
    }
    state.maskRef = enhance.mask;
  }
  if (enhance.liquify !== state.liquifyRef) {
    if (enhance.liquify) {
      gl.bindTexture(gl.TEXTURE_2D, state.liquifyTexture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        enhance.liquify.width,
        enhance.liquify.height,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        enhance.liquify.data,
      );
    }
    state.liquifyRef = enhance.liquify;
  }
}

function colorUniforms(color: ColorTransform): { matrix: Float32Array; offset: Float32Array } {
  const m = color.matrix;
  return {
    matrix: new Float32Array([m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]]),
    offset: new Float32Array([color.offset[0], color.offset[1], color.offset[2]]),
  };
}

function previewMatrix(spec: PreviewSpec): Float32Array {
  const rad = (spec.rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const halfW = Math.max(1, spec.width / 2);
  const halfH = Math.max(1, spec.height / 2);
  const scale = spec.view.scale;
  // Axis vectors of the image quad in crop-screen pixels, then scaled by the
  // view. Crop mode uses scale 1, x/y 0; result mode contains the crop.
  const ux = cos * spec.sx * scale;
  const uy = sin * spec.sx * scale;
  const vx = -sin * spec.sy * scale;
  const vy = cos * spec.sy * scale;
  const tx = cos * (spec.sx * spec.offsetX) - sin * (spec.sy * spec.offsetY);
  const ty = sin * (spec.sx * spec.offsetX) + cos * (spec.sy * spec.offsetY);
  const centerX = halfW + tx;
  const centerY = halfH + ty;
  const screenX = centerX * scale + spec.view.x;
  const screenY = centerY * scale + spec.view.y;
  return new Float32Array([
    ux / halfW, -uy / halfH, 0,
    vx / halfW, -vy / halfH, 0,
    (screenX - halfW) / halfW, (halfH - screenY) / halfH, 1,
  ]);
}

function bindQuad(state: GLState): void {
  const { gl } = state;
  gl.bindBuffer(gl.ARRAY_BUFFER, state.buffer);
  gl.enableVertexAttribArray(ATTRIB_POS);
  gl.vertexAttribPointer(ATTRIB_POS, 2, gl.FLOAT, false, 20, 0);
  gl.enableVertexAttribArray(ATTRIB_UV);
  gl.vertexAttribPointer(ATTRIB_UV, 2, gl.FLOAT, false, 20, 8);
  gl.enableVertexAttribArray(ATTRIB_W);
  gl.vertexAttribPointer(ATTRIB_W, 1, gl.FLOAT, false, 20, 16);
}

interface DrawParams {
  matrix: Float32Array;
  warp: [number, number];
  color: ColorTransform;
  vignette: number;
  aspect: number;
  vigCenter: [number, number];
  vigHalf: [number, number];
  texel: [number, number];
  enhance: EnhanceSpec;
}

function drawQuad(state: GLState, params: DrawParams): void {
  const { gl } = state;
  const uniforms = colorUniforms(params.color);
  const e = params.enhance;
  // The runtime only selects a variant that the build step already compiled.
  // A device that cannot link it keeps painting with the minimal fallback.
  const selected = ensureProgram(
    state,
    shaderVariantFor(e.linear > 0.5, !!e.mask, !!e.liquify),
  );
  state.active = selected;
  const u = selected.u;
  gl.useProgram(selected.program);
  bindQuad(state);
  gl.uniformMatrix3fv(u.matrix, false, params.matrix);
  gl.uniform2f(u.warp, params.warp[0], params.warp[1]);
  gl.uniformMatrix3fv(u.color, false, uniforms.matrix);
  gl.uniform3fv(u.offset, uniforms.offset);
  gl.uniform1f(u.vignette, Math.max(0, Math.min(1, params.vignette)));
  gl.uniform1f(u.aspect, params.aspect);
  gl.uniform2f(u.vigCenter, params.vigCenter[0], params.vigCenter[1]);
  gl.uniform2f(u.vigHalf, params.vigHalf[0], params.vigHalf[1]);
  gl.uniform2f(u.texel, params.texel[0], params.texel[1]);
  gl.uniform1f(u.dither, e.dither);

  gl.uniform1f(u.exposure, e.exposure);
  gl.uniform1f(u.brightness, e.brightness);
  gl.uniform1f(u.contrast, e.contrast);
  gl.uniform1f(u.saturation, e.saturation);
  gl.uniform1f(u.highlights, e.highlights);
  gl.uniform1f(u.shadows, e.shadows);
  gl.uniform1f(u.whites, e.whites);
  gl.uniform1f(u.blacks, e.blacks);
  gl.uniform1f(u.warmth, e.warmth);
  gl.uniform1f(u.tint, e.tint);
  gl.uniform1f(u.vibrance, e.vibrance);
  gl.uniform1f(u.gamma, e.gamma);
  gl.uniform1f(u.clarity, e.clarity);
  gl.uniform1f(u.sharpen, e.sharpen);
  gl.uniform1f(u.denoise, e.denoise);
  gl.uniform1f(u.smoothSkin, e.smoothSkin);
  gl.uniform1f(u.blemish, e.blemish);
  gl.uniform1f(u.skinTexture, e.skinTexture);
  gl.uniform1f(u.skinTone, e.skinTone);
  gl.uniform1f(u.hasMask, e.mask ? 1 : 0);
  gl.uniform1f(u.liquifyShift, e.liquify ? e.liquify.shift : 0);
  gl.uniform1f(u.hasCurve, e.curve ? 1 : 0);
  gl.uniform1f(u.lutStrength, e.lut ? e.lutStrength : 0);
  gl.uniform1f(u.lutSize, Math.max(2, e.lutSize));
  gl.uniform1f(u.quality, e.quality);
  gl.uniform4fv(u.faces, e.faces || EMPTY_FACES);
  gl.uniform1i(u.faceCount, Math.max(0, Math.min(4, e.faceCount)));
  gl.uniform1f(u.hasAnchors, e.anchors ? 1 : 0);
  gl.uniform3fv(u.hsl, e.hsl || EMPTY_HSL);
  gl.uniform1f(u.faceSlim, e.faceSlim);
  gl.uniform1f(u.jawline, e.jawline);
  gl.uniform1f(u.chin, e.chin);
  gl.uniform1f(u.eyeSize, e.eyeSize);
  gl.uniform1f(u.noseSize, e.noseSize);
  gl.uniform1f(u.mouthSize, e.mouthSize);

  gl.uniform1i(u.textureLoc, 0);
  gl.uniform1i(u.curveLoc, 1);
  gl.uniform1i(u.lutLoc, 2);
  gl.uniform1i(u.maskLoc, 3);
  gl.uniform1i(u.liquifyLoc, 4);
  gl.uniform1i(u.anchors, 5);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, state.texture);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, e.curve ? state.curveTexture : state.whiteTexture);
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, e.lut ? state.lutTexture : state.whiteTexture);
  gl.activeTexture(gl.TEXTURE3);
  gl.bindTexture(gl.TEXTURE_2D, e.mask ? state.maskTexture : state.whiteTexture);
  gl.activeTexture(gl.TEXTURE4);
  gl.bindTexture(gl.TEXTURE_2D, e.liquify ? state.liquifyTexture : state.whiteTexture);
  gl.activeTexture(gl.TEXTURE5);
  gl.bindTexture(gl.TEXTURE_2D, e.anchors ? state.anchorTexture : state.whiteTexture);
  if (e.anchors && state.anchorRef !== e.anchors) {
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      4,
      4,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      e.anchors,
    );
    state.anchorRef = e.anchors;
  }
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function vignetteUniforms(
  spec: PreviewSpec,
): { center: [number, number]; half: [number, number]; aspect: number } {
  const width = Math.max(1, spec.width);
  const height = Math.max(1, spec.height);
  const rect = spec.vignetteRect;
  return {
    center: [
      ((rect.x + rect.width / 2) / width) * 2 - 1,
      1 - ((rect.y + rect.height / 2) / height) * 2,
    ],
    half: [
      Math.max(0.0001, rect.width / width),
      Math.max(0.0001, rect.height / height),
    ],
    aspect: rect.width / Math.max(1, rect.height),
  };
}

function isFlatWarp(warp: PerspectiveWarp | null | undefined): boolean {
  return !warp || (Math.abs(warp.a) < 1e-4 && Math.abs(warp.b) < 1e-4);
}

/**
 * Affine matrix that maps a source triangle onto a destination triangle.
 * Canvas2D has no projective `drawImage`, so a warped photo is rasterised as a
 * grid of these triangles instead of a single quad.
 */
function triangleMatrix(
  s0: Point,
  s1: Point,
  s2: Point,
  d0: Point,
  d1: Point,
  d2: Point,
): [number, number, number, number, number, number] | null {
  const ax = s1.x - s0.x;
  const ay = s1.y - s0.y;
  const bx = s2.x - s0.x;
  const by = s2.y - s0.y;
  const det = ax * by - ay * bx;
  if (Math.abs(det) < 1e-8) return null;
  const dx1 = d1.x - d0.x;
  const dx2 = d2.x - d0.x;
  const dy1 = d1.y - d0.y;
  const dy2 = d2.y - d0.y;
  const m00 = (dx1 * by - dx2 * ay) / det;
  const m01 = (-dx1 * bx + dx2 * ax) / det;
  const m10 = (dy1 * by - dy2 * ay) / det;
  const m11 = (-dy1 * bx + dy2 * ax) / det;
  return [
    m00,
    m10,
    m01,
    m11,
    d0.x - m00 * s0.x - m01 * s0.y,
    d0.y - m10 * s0.x - m11 * s0.y,
  ];
}

function drawTexturedTriangle(
  ctx: CanvasRenderingContext2D,
  bitmap: Bitmap,
  s0: Point,
  s1: Point,
  s2: Point,
  d0: Point,
  d1: Point,
  d2: Point,
  scale: number,
): void {
  const m = triangleMatrix(s0, s1, s2, d0, d1, d2);
  if (!m) return;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(d0.x, d0.y);
  ctx.lineTo(d1.x, d1.y);
  ctx.lineTo(d2.x, d2.y);
  ctx.closePath();
  ctx.clip();
  ctx.setTransform(
    scale * m[0],
    scale * m[1],
    scale * m[2],
    scale * m[3],
    scale * m[4],
    scale * m[5],
  );
  ctx.drawImage(bitmap, 0, 0);
  ctx.restore();
}

/**
 * Preview fallback: sample the source on a regular grid, project every vertex
 * through `warpPoint()` and the current view, then draw two textured triangles
 * per cell. The grid is coarse enough to stay smooth on a phone and fine
 * enough that the straight-line triangle edges are invisible.
 */
function drawWarpedPreview(
  ctx: CanvasRenderingContext2D,
  bitmap: Bitmap,
  spec: PreviewSpec,
): void {
  const size = sourceDimensions(bitmap);
  const imgW = Math.max(1, size.width);
  const imgH = Math.max(1, size.height);
  const rad = (spec.rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const view = spec.view;
  const cx = spec.width / 2;
  const cy = spec.height / 2;
  const project = (u: number, v: number): Point => {
    const q = warpPoint({ x: u * 2 - 1, y: v * 2 - 1 }, spec.warp);
    const px = (q.x + spec.offsetX) * spec.sx;
    const py = (q.y + spec.offsetY) * spec.sy;
    return {
      x: view.x + view.scale * (cx + cos * px - sin * py),
      y: view.y + view.scale * (cy + sin * px + cos * py),
    };
  };
  const grid: Point[][] = [];
  for (let row = 0; row <= PREVIEW_MESH; row += 1) {
    const line: Point[] = [];
    for (let col = 0; col <= PREVIEW_MESH; col += 1) {
      line.push(project(col / PREVIEW_MESH, row / PREVIEW_MESH));
    }
    grid.push(line);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  for (let row = 0; row < PREVIEW_MESH; row += 1) {
    for (let col = 0; col < PREVIEW_MESH; col += 1) {
      const u0 = col / PREVIEW_MESH;
      const u1 = (col + 1) / PREVIEW_MESH;
      const v0 = row / PREVIEW_MESH;
      const v1 = (row + 1) / PREVIEW_MESH;
      const s0 = { x: u0 * imgW, y: v0 * imgH };
      const s1 = { x: u1 * imgW, y: v0 * imgH };
      const s2 = { x: u1 * imgW, y: v1 * imgH };
      const s3 = { x: u0 * imgW, y: v1 * imgH };
      const d0 = grid[row][col];
      const d1 = grid[row][col + 1];
      const d2 = grid[row + 1][col + 1];
      const d3 = grid[row + 1][col];
      drawTexturedTriangle(ctx, bitmap, s0, s1, s2, d0, d1, d2, spec.dpr);
      drawTexturedTriangle(ctx, bitmap, s0, s2, s3, d0, d2, d3, spec.dpr);
    }
  }
}

function drawCanvas2D(
  ctx: CanvasRenderingContext2D,
  bitmap: Bitmap,
  spec: PreviewSpec,
): void {
  ctx.save();
  ctx.setTransform(spec.dpr, 0, 0, spec.dpr, 0, 0);
  ctx.clearRect(0, 0, spec.width, spec.height);
  if (spec.clipRect && spec.clipRect.width > 0 && spec.clipRect.height > 0) {
    ctx.beginPath();
    ctx.rect(
      spec.clipRect.x,
      spec.clipRect.y,
      spec.clipRect.width,
      spec.clipRect.height,
    );
    ctx.clip();
  }
  ctx.filter = spec.css || 'none';
  if (isFlatWarp(spec.warp)) {
    ctx.translate(spec.view.x, spec.view.y);
    ctx.scale(spec.view.scale, spec.view.scale);
    ctx.translate(spec.width / 2, spec.height / 2);
    ctx.rotate((spec.rotation * Math.PI) / 180);
    ctx.scale(spec.sx, spec.sy);
    ctx.translate(spec.offsetX, spec.offsetY);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, -1, -1, 2, 2);
  } else {
    drawWarpedPreview(ctx, bitmap, spec);
  }
  ctx.filter = 'none';
  ctx.restore();

  const rect = spec.vignetteRect;
  if (spec.vignette > 0 && rect.width > 0 && rect.height > 0) {
    ctx.save();
    ctx.setTransform(spec.dpr, 0, 0, spec.dpr, 0, 0);
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    ctx.clip();
    const cx = rect.x + rect.width / 2;
    const cy = rect.y + rect.height / 2;
    const radius = Math.max(rect.width, rect.height) * 0.74;
    const gradient = ctx.createRadialGradient(
      cx,
      cy,
      Math.min(rect.width, rect.height) * 0.22,
      cx,
      cy,
      radius,
    );
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(0.62, `rgba(0,0,0,${spec.vignette * 0.25})`);
    gradient.addColorStop(1, `rgba(0,0,0,${spec.vignette * 0.88})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    ctx.restore();
  }
}

function vignette2D(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  amount: number,
): void {
  if (amount <= 0) return;
  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    Math.min(width, height) * 0.2,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.74,
  );
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(0.62, `rgba(0,0,0,${amount * 0.25})`);
  gradient.addColorStop(1, `rgba(0,0,0,${amount * 0.88})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function canvasBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Export failed: canvas is empty'))),
      type,
      quality,
    );
  });
}

export class Renderer {
  readonly canvas: HTMLCanvasElement;
  private glState: GLState | null = null;
  private ctx2d: CanvasRenderingContext2D | null = null;
  private bitmap: Bitmap | null = null;
  private cssWidth = 0;
  private cssHeight = 0;
  private dpr = 1;
  private textureDirty = true;
  private lastSpec: PreviewSpec | null = null;
  private contextLost = false;

  private readonly onContextLost = (event: Event): void => {
    // Without preventDefault the browser may never restore the context.
    event.preventDefault();
    this.contextLost = true;
  };

  private readonly onContextRestored = (): void => {
    this.contextLost = false;
    this.glState = initGL(this.canvas);
    this.ctx2d = null;
    this.textureDirty = true;
    if (this.lastSpec) this.render(this.lastSpec);
  };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.glState = initGL(canvas);
    if (!this.glState) {
      this.ctx2d = canvas.getContext('2d', { alpha: true });
    }
    canvas.addEventListener('webglcontextlost', this.onContextLost);
    canvas.addEventListener('webglcontextrestored', this.onContextRestored);
  }

  get accelerated(): boolean {
    return this.glState !== null && !this.contextLost;
  }

  setBitmap(bitmap: Bitmap): void {
    this.bitmap = bitmap;
    this.textureDirty = true;
  }

  resize(width: number, height: number, dpr: number): void {
    this.cssWidth = Math.max(1, width);
    this.cssHeight = Math.max(1, height);
    this.dpr = Math.max(1, Math.min(3, dpr || 1));
    const bufferW = Math.max(1, Math.round(this.cssWidth * this.dpr));
    const bufferH = Math.max(1, Math.round(this.cssHeight * this.dpr));
    if (this.canvas.width !== bufferW || this.canvas.height !== bufferH) {
      this.canvas.width = bufferW;
      this.canvas.height = bufferH;
    }
  }

  render(spec: PreviewSpec): void {
    if (!this.bitmap) return;
    this.lastSpec = spec;
    if (this.contextLost) return;
    const state = this.glState;
    if (state) {
      const { gl } = state;
      if (gl.isContextLost()) {
        // Do not try getContext('2d') here: the canvas still owns a WebGL
        // context, so the browser would return null. Wait for restoration,
        // then redraw the last spec.
        this.contextLost = true;
        return;
      }
      if (this.textureDirty) {
        if (!uploadTexture(state, this.bitmap)) {
          // Keep the GL context and retry after the next image change rather
          // than dropping to an impossible 2D context on the same canvas.
          this.textureDirty = false;
          return;
        }
        this.textureDirty = false;
      }
      uploadEnhanceTextures(state, spec.enhance);
      gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.disable(gl.BLEND);
      const clip = spec.clipRect;
      const clipped = !!clip && clip.width > 0 && clip.height > 0;
      if (clipped) {
        gl.enable(gl.SCISSOR_TEST);
        gl.scissor(
          Math.round(clip!.x * this.dpr),
          Math.round((spec.height - clip!.y - clip!.height) * this.dpr),
          Math.max(1, Math.round(clip!.width * this.dpr)),
          Math.max(1, Math.round(clip!.height * this.dpr)),
        );
      }
      const vig = vignetteUniforms(spec);
      drawQuad(state, {
        matrix: previewMatrix(spec),
        warp: [spec.warp.a, spec.warp.b],
        color: spec.color,
        vignette: spec.vignette,
        aspect: vig.aspect,
        vigCenter: vig.center,
        vigHalf: vig.half,
        texel: [1 / Math.max(1, state.texWidth), 1 / Math.max(1, state.texHeight)],
        enhance: spec.enhance,
      });
      if (clipped) gl.disable(gl.SCISSOR_TEST);
      return;
    }
    const ctx = this.ctx2d;
    if (!ctx) return;
    drawCanvas2D(ctx, this.bitmap, spec);
  }

  dispose(): void {
    this.canvas.removeEventListener('webglcontextlost', this.onContextLost);
    this.canvas.removeEventListener('webglcontextrestored', this.onContextRestored);
    const state = this.glState;
    if (state) disposeGL(state);
    this.glState = null;
    this.ctx2d = null;
    this.bitmap = null;
    this.lastSpec = null;
    this.contextLost = false;
  }
}

function disposeGL(state: GLState): void {
  const { gl } = state;
  gl.deleteBuffer(state.buffer);
  gl.deleteTexture(state.texture);
  gl.deleteTexture(state.curveTexture);
  gl.deleteTexture(state.lutTexture);
  gl.deleteTexture(state.maskTexture);
  gl.deleteTexture(state.liquifyTexture);
  gl.deleteTexture(state.anchorTexture);
  gl.deleteTexture(state.whiteTexture);
  deletePrograms(gl, state.programs);
}

function scaledTexture(bitmap: Bitmap, maxSize: number): Bitmap {
  const size = sourceDimensions(bitmap);
  if (!size.width || !size.height || Math.max(size.width, size.height) <= maxSize) {
    return bitmap;
  }
  const k = maxSize / Math.max(size.width, size.height);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(size.width * k));
  canvas.height = Math.max(1, Math.round(size.height * k));
  const ctx = canvas.getContext('2d');
  if (!ctx) return bitmap;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function orientedHomography(quad: Quad, width: number, height: number): Mat3 {
  const m = homographyFromQuad(quad, width, height);
  const w0 = m[8];
  const wx = m[6] * width + m[8];
  const wy = m[7] * height + m[8];
  const w1 = m[6] * width + m[7] * height + m[8];
  // A homography is only defined up to a scale. Normalise the sign so the
  // projective weight stays positive over the whole output rectangle; a
  // negative weight would put the quad behind the camera and break both the
  // GPU rasteriser and the mesh fallback.
  if (w0 + wx + wy + w1 < 0) {
    return [-m[0], -m[1], -m[2], -m[3], -m[4], -m[5], -m[6], -m[7], -m[8]];
  }
  return m;
}

/**
 * Export fallback for a warped crop. The output is subdivided into a regular
 * grid; each cell's four source samples come from the exact homography, so the
 * only approximation is the straight edge inside a cell.
 */
function drawWarpedExport(
  ctx: CanvasRenderingContext2D,
  bitmap: Bitmap,
  spec: ExportSpec,
  matrix: Mat3,
): void {
  const cells = EXPORT_MESH;
  const grid: Point[][] = [];
  for (let row = 0; row <= cells; row += 1) {
    const line: Point[] = [];
    for (let col = 0; col <= cells; col += 1) {
      const p = projectHomography(
        matrix,
        (col / cells) * spec.width,
        (row / cells) * spec.height,
      );
      line.push({ x: p.x, y: p.y });
    }
    grid.push(line);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  for (let row = 0; row < cells; row += 1) {
    for (let col = 0; col < cells; col += 1) {
      const d0 = { x: (col / cells) * spec.width, y: (row / cells) * spec.height };
      const d1 = { x: ((col + 1) / cells) * spec.width, y: (row / cells) * spec.height };
      const d2 = {
        x: ((col + 1) / cells) * spec.width,
        y: ((row + 1) / cells) * spec.height,
      };
      const d3 = { x: (col / cells) * spec.width, y: ((row + 1) / cells) * spec.height };
      const s0 = grid[row][col];
      const s1 = grid[row][col + 1];
      const s2 = grid[row + 1][col + 1];
      const s3 = grid[row + 1][col];
      drawTexturedTriangle(ctx, bitmap, s0, s1, s2, d0, d1, d2, 1);
      drawTexturedTriangle(ctx, bitmap, s0, s2, s3, d0, d2, d3, 1);
    }
  }
}

function export2D(
  bitmap: Bitmap,
  spec: ExportSpec,
  type: string,
  quality: number,
  options: ExportOptions,
): Promise<Blob> {
  throwIfAborted(options.signal);
  const canvas = document.createElement('canvas');
  canvas.width = spec.width;
  canvas.height = spec.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return Promise.reject(new Error('2D canvas is unavailable'));
  const matrix = orientedHomography(spec.quad, spec.width, spec.height);
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, spec.width, spec.height);
  ctx.clip();
  ctx.filter = spec.css || 'none';
  if (isFlatWarp(spec.warp)) {
    const { tl, tr, bl } = spec.quad;
    const ax = (tr.x - tl.x) / spec.width;
    const ay = (tr.y - tl.y) / spec.width;
    const bx = (bl.x - tl.x) / spec.height;
    const by = (bl.y - tl.y) / spec.height;
    const det = ax * by - ay * bx;
    if (Math.abs(det) > 1e-8) {
      const m00 = by / det;
      const m01 = -bx / det;
      const m10 = -ay / det;
      const m11 = ax / det;
      const e = -(m00 * tl.x + m01 * tl.y);
      const f = -(m10 * tl.x + m11 * tl.y);
      ctx.setTransform(m00, m10, m01, m11, e, f);
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(bitmap, 0, 0);
    }
  } else {
    drawWarpedExport(ctx, bitmap, spec, matrix);
  }
  ctx.filter = 'none';
  ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  vignette2D(ctx, spec.width, spec.height, spec.vignette);
  options.onProgress?.({ phase: 'encode', progress: 0.9, tile: 1, tiles: 1 });
  return canvasBlob(canvas, type, quality).then((blob) => {
    options.onProgress?.({ phase: 'encode', progress: 1, tile: 1, tiles: 1 });
    return blob;
  });
}

/**
 * Build the per-tile vertex buffer from the full-output homography. `a_pos`
 * holds the pre-divided clip position and `a_w` the projective weight, so the
 * rasteriser interpolates the source UVs projectively across the tile.
 */
function updateExportQuad(
  state: GLState,
  spec: ExportSpec,
  x: number,
  y: number,
  tw: number,
  th: number,
): void {
  const { gl } = state;
  const matrix = orientedHomography(spec.quad, spec.width, spec.height);
  const srcW = Math.max(1, spec.srcWidth);
  const srcH = Math.max(1, spec.srcHeight);
  const corners: Array<[number, number]> = [
    [x, y],
    [x + tw, y],
    [x + tw, y + th],
    [x, y + th],
  ];
  const vertex = (px: number, py: number): number[] => {
    const p = projectHomography(matrix, px, py);
    const w = p.w > 1e-4 ? p.w : 1e-4;
    const clipX = (2 * (px - x)) / Math.max(1, tw) - 1;
    const clipY = 1 - (2 * (py - y)) / Math.max(1, th);
    return [clipX * w, clipY * w, p.x / srcW, p.y / srcH, w];
  };
  const v = corners.map(([px, py]) => vertex(px, py));
  const data = new Float32Array([
    ...v[0],
    ...v[1],
    ...v[2],
    ...v[0],
    ...v[2],
    ...v[3],
  ]);
  gl.bindBuffer(gl.ARRAY_BUFFER, state.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
}

/**
 * Vignette coordinates for a tile. The tile covers the full clip-space square,
 * so the centre/half pair maps that square back onto the full output.
 */
function tileVignette(
  fullWidth: number,
  fullHeight: number,
  x: number,
  y: number,
  tw: number,
  th: number,
): { center: [number, number]; half: [number, number] } {
  const bx = tw / fullWidth;
  const ax = (2 * x) / fullWidth - 1;
  const cx = -(ax + bx) / bx;
  const hx = 1 / bx;
  const by = th / fullHeight;
  const ay = 1 - (2 * y) / fullHeight - by;
  const cy = -ay / by;
  const hy = 1 / by;
  return { center: [cx, cy], half: [hx, hy] };
}

function renderExportTile(
  state: GLState,
  spec: ExportSpec,
  x: number,
  y: number,
  tw: number,
  th: number,
): void {
  const { gl } = state;
  gl.viewport(0, 0, tw, th);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.disable(gl.BLEND);
  updateExportQuad(state, spec, x, y, tw, th);
  const vig = tileVignette(spec.width, spec.height, x, y, tw, th);
  drawQuad(state, {
    matrix: IDENTITY_MATRIX,
    warp: FLAT_WARP,
    color: spec.color,
    vignette: spec.vignette,
    aspect: spec.width / Math.max(1, spec.height),
    vigCenter: vig.center,
    vigHalf: vig.half,
    texel: [1 / Math.max(1, state.texWidth), 1 / Math.max(1, state.texHeight)],
    enhance: { ...spec.enhance, quality: 1 },
  });
}

async function exportGL(
  bitmap: Bitmap,
  spec: ExportSpec,
  type: string,
  quality: number,
  options: ExportOptions,
): Promise<Blob> {
  const tileSize = Math.max(256, Math.min(8192, Math.round(options.tileSize ?? 2048)));
  const cols = Math.ceil(spec.width / tileSize);
  const rows = Math.ceil(spec.height / tileSize);
  const total = cols * rows;
  const single = total === 1;

  const canvas = document.createElement('canvas');
  canvas.width = single ? spec.width : Math.min(tileSize, spec.width);
  canvas.height = single ? spec.height : Math.min(tileSize, spec.height);
  const state = initGL(canvas, true);
  if (!state) throw new Error('WebGL unavailable');
  try {
    const textureSource = scaledTexture(bitmap, state.maxTexture);
    if (!uploadTexture(state, textureSource)) throw new Error('Texture upload failed');
    uploadEnhanceTextures(state, spec.enhance);

    if (single) {
      renderExportTile(state, spec, 0, 0, spec.width, spec.height);
      options.onProgress?.({ phase: 'encode', progress: 0.9, tile: 1, tiles: 1 });
      const blob = await canvasBlob(canvas, type, quality);
      options.onProgress?.({ phase: 'encode', progress: 1, tile: 1, tiles: 1 });
      return blob;
    }

    const out = document.createElement('canvas');
    out.width = spec.width;
    out.height = spec.height;
    const ctx = out.getContext('2d');
    if (!ctx) throw new Error('2D canvas is unavailable');
    let done = 0;
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        throwIfAborted(options.signal);
        const x = col * tileSize;
        const y = row * tileSize;
        const tw = Math.min(tileSize, spec.width - x);
        const th = Math.min(tileSize, spec.height - y);
        canvas.width = tw;
        canvas.height = th;
        renderExportTile(state, spec, x, y, tw, th);
        ctx.drawImage(canvas, x, y);
        done += 1;
        options.onProgress?.({
          phase: 'render',
          progress: (done / total) * 0.9,
          tile: done,
          tiles: total,
        });
        await nextFrame();
      }
    }
    throwIfAborted(options.signal);
    options.onProgress?.({ phase: 'encode', progress: 0.95, tile: total, tiles: total });
    const blob = await canvasBlob(out, type, quality);
    options.onProgress?.({ phase: 'encode', progress: 1, tile: total, tiles: total });
    return blob;
  } finally {
    disposeGL(state);
  }
}

export async function exportImage(
  bitmap: Bitmap,
  spec: ExportSpec,
  type: string,
  quality: number,
  options: ExportOptions = {},
): Promise<Blob> {
  throwIfAborted(options.signal);
  try {
    if (typeof WebGLRenderingContext !== 'undefined') {
      const probe = document.createElement('canvas').getContext('webgl');
      if (probe) {
        return await exportGL(bitmap, spec, type, quality, options);
      }
    }
  } catch (error) {
    if (isAbortError(error)) throw error;
    // Fall through to the Canvas2D rasterizer.
  }
  return export2D(bitmap, spec, type, quality, options);
}

export { canvasBlob };
