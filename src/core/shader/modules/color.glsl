vec3 whiteBalance() {
  return vec3(
    1.0 + u_warmth * 0.16 + u_tint * 0.04,
    1.0 + u_warmth * 0.03 - u_tint * 0.18,
    1.0 - u_warmth * 0.16 + u_tint * 0.04
  );
}

#ifndef AURUM_LINEAR
/*
 * Gamma-space tonal block kept for the legacy sRGB path. It is byte-for-byte
 * the same formula the editor used before the linear pipeline existed.
 */
vec3 toneGamma(vec3 c) {
  float lc = luma(clamp(c, 0.0, 1.0));
  if (abs(u_highlights) > 0.001) {
    float m = smoothstep(0.42, 1.0, lc);
    c += u_highlights * m * (u_highlights > 0.0 ? (1.0 - c) : c) * 0.6;
  }
  if (abs(u_shadows) > 0.001) {
    float m = 1.0 - smoothstep(0.0, 0.58, lc);
    c += u_shadows * m * (u_shadows > 0.0 ? (1.0 - c) : c) * 0.6;
  }
  if (abs(u_whites) > 0.001 || abs(u_blacks) > 0.001) {
    float black = -u_blacks * 0.16;
    float white = 1.0 - u_whites * 0.16;
    c = (c - black) / max(0.08, white - black);
  }
  return clamp(c, 0.0, 1.0);
}
#endif

#ifdef AURUM_LINEAR
/*
 * Linear-light tonal block. The tone curve is evaluated on perceptual luma
 * (the same place the sliders have always operated) and then applied as a
 * luminance gain. Doing it per channel would desaturate shadows because a
 * linear offset of 0.1 is a huge perceptual lift.
 */
vec3 toneLinear(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  float lc = luma(c);
  if (lc < 0.000001) return c;
  float lp = linearToSrgb1(lc);
  float t = lp;
  if (abs(u_highlights) > 0.001) {
    float m = smoothstep(0.42, 1.0, lp);
    t += u_highlights * m * (u_highlights > 0.0 ? (1.0 - lp) : lp) * 0.6;
  }
  if (abs(u_shadows) > 0.001) {
    float m = 1.0 - smoothstep(0.0, 0.58, lp);
    t += u_shadows * m * (u_shadows > 0.0 ? (1.0 - lp) : lp) * 0.6;
  }
  if (abs(u_whites) > 0.001 || abs(u_blacks) > 0.001) {
    float black = -u_blacks * 0.16;
    float white = 1.0 - u_whites * 0.16;
    t = (t - black) / max(0.08, white - black);
  }
  float target = srgbToLinear1(clamp(t, 0.0, 1.0));
  c *= target / lc;
  return clamp(c, 0.0, 1.0);
}
#endif
