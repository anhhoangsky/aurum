#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform sampler2D u_texture;
uniform sampler2D u_curve;
uniform sampler2D u_lut;
#ifdef AURUM_BEAUTY_MASK
uniform sampler2D u_mask;
uniform float u_hasMask;
#endif
#ifdef AURUM_LIQUIFY
uniform sampler2D u_liquify;
uniform float u_liquifyShift;
#endif
uniform mat3 u_color;
uniform vec3 u_offset;
uniform float u_vignette;
uniform float u_aspect;
uniform vec2 u_vigCenter;
uniform vec2 u_vigHalf;
uniform vec2 u_texel;
uniform float u_dither;

uniform float u_exposure;
uniform float u_brightness;
uniform float u_contrast;
uniform float u_saturation;
uniform float u_highlights;
uniform float u_shadows;
uniform float u_whites;
uniform float u_blacks;
uniform float u_warmth;
uniform float u_tint;
uniform float u_vibrance;
uniform float u_gamma;
uniform float u_clarity;
uniform float u_sharpen;
uniform float u_denoise;
uniform float u_smoothSkin;
uniform float u_blemish;
uniform float u_skinTexture;
uniform float u_skinTone;
uniform float u_hasCurve;
uniform float u_lutStrength;
uniform float u_lutSize;
uniform float u_quality;
uniform vec4 u_faces[4];
uniform int u_faceCount;
uniform sampler2D u_anchors;
uniform float u_hasAnchors;
uniform vec3 u_hsl[8];
uniform float u_faceSlim;
uniform float u_jawline;
uniform float u_chin;
uniform float u_eyeSize;
uniform float u_noseSize;
uniform float u_mouthSize;

varying vec2 v_uv;
varying vec2 v_screen;

float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

/*
 * Exact sRGB transfer functions. An 8-bit transfer LUT is tempting, but it
 * quantises linear values below 1/255 to zero, which destroys shadow detail
 * (a 64-step ramp collapsed to 14 levels in testing). highp is guaranteed
 * whenever the linear path is enabled, so the pow-based curves are exact.
 */
#ifdef AURUM_LINEAR
float srgbToLinear1(float v) {
  v = clamp(v, 0.0, 1.0);
  return v <= 0.04045 ? v / 12.92 : pow((v + 0.055) / 1.055, 2.4);
}

float linearToSrgb1(float v) {
  v = clamp(v, 0.0, 1.0);
  return v <= 0.0031308 ? v * 12.92 : 1.055 * pow(v, 1.0 / 2.4) - 0.055;
}

vec3 toLinear(vec3 c) {
  return vec3(srgbToLinear1(c.r), srgbToLinear1(c.g), srgbToLinear1(c.b));
}

vec3 toSrgb(vec3 c) {
  return vec3(linearToSrgb1(c.r), linearToSrgb1(c.g), linearToSrgb1(c.b));
}
#endif
