#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform sampler2D u_texture;
uniform mat3 u_color;
uniform vec3 u_offset;
uniform float u_exposure;
uniform float u_brightness;
uniform float u_contrast;
uniform float u_saturation;
uniform float u_gamma;
uniform float u_vignette;
uniform float u_aspect;
uniform vec2 u_vigCenter;
uniform vec2 u_vigHalf;
uniform float u_dither;

varying vec2 v_uv;
varying vec2 v_screen;

float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

float bayer2(vec2 a) {
  a = floor(a);
  return fract(a.x * 0.5 + a.y * a.y * 0.75);
}

float bayer4(vec2 a) {
  return bayer2(0.5 * a) * 0.25 + bayer2(a);
}

/*
 * Last-resort variant: basic colour, vignette and dither only. It is selected
 * only when a full variant fails to compile, so the editor still paints a
 * usable image on a constrained driver instead of showing a blank canvas.
 */
void main() {
  vec4 texel = texture2D(u_texture, v_uv);
  vec3 c = clamp(u_color * texel.rgb + u_offset, 0.0, 1.0);
  c *= pow(2.0, u_exposure);
  c += u_brightness * 0.22;
  c = (c - 0.5) * max(0.05, 1.0 + u_contrast) + 0.5;
  c = clamp(c, 0.0, 1.0);

  float lc = luma(c);
  c = mix(vec3(lc), c, max(0.0, 1.0 + u_saturation));
  if (abs(u_gamma) > 0.001) {
    c = pow(c, vec3(1.0 / max(0.2, 1.0 + u_gamma * 0.8)));
  }

  c = clamp(c, 0.0, 1.0);
  vec2 p = (v_screen - u_vigCenter) / max(u_vigHalf, vec2(0.0001));
  float d = length(vec2(p.x * u_aspect, p.y)) / sqrt(u_aspect * u_aspect + 1.0);
  float v = smoothstep(0.34, 1.0, d) * u_vignette * 0.88;
  c *= (1.0 - v);

  if (u_dither > 0.001) {
    float b = bayer4(gl_FragCoord.xy) * 1.0666667 - 0.5;
    c += b * (u_dither / 255.0);
  }
  gl_FragColor = vec4(clamp(c, 0.0, 1.0), texel.a);
}
