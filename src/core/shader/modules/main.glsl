void main() {
  vec2 uv = warpFace(v_uv);
  vec4 texel = texture2D(u_texture, uv);
  vec3 c = texel.rgb;
  float lc = luma(c);

  /* 1. Edge-aware denoise. */
  if (u_denoise > 0.001) {
    float sigma = 0.022 + u_denoise * 0.09;
    float invSigma2 = 1.0 / max(0.0001, sigma * sigma);
    vec3 acc = c;
    float wsum = 1.0;
    vec2 o = u_texel * (1.0 + u_quality * 1.5);
    addTap(uv, vec2(o.x, 0.0), lc, invSigma2, acc, wsum);
    addTap(uv, vec2(-o.x, 0.0), lc, invSigma2, acc, wsum);
    addTap(uv, vec2(0.0, o.y), lc, invSigma2, acc, wsum);
    addTap(uv, vec2(0.0, -o.y), lc, invSigma2, acc, wsum);
    if (u_quality > 0.5) {
      addTap(uv, vec2(o.x, o.y), lc, invSigma2, acc, wsum);
      addTap(uv, vec2(-o.x, o.y), lc, invSigma2, acc, wsum);
      addTap(uv, vec2(o.x, -o.y), lc, invSigma2, acc, wsum);
      addTap(uv, vec2(-o.x, -o.y), lc, invSigma2, acc, wsum);
    }
    c = mix(c, acc / wsum, u_denoise * 0.9);
    lc = luma(c);
  }

  /* 2. Clarity: halo-limited local contrast on the original detail. */
  if (abs(u_clarity) > 0.001) {
    vec2 o = u_texel * (4.0 + u_quality * 6.0);
    vec3 blur = c;
    blur += texture2D(u_texture, uv + vec2(o.x, 0.0)).rgb;
    blur += texture2D(u_texture, uv + vec2(-o.x, 0.0)).rgb;
    blur += texture2D(u_texture, uv + vec2(0.0, o.y)).rgb;
    blur += texture2D(u_texture, uv + vec2(0.0, -o.y)).rgb;
    if (u_quality > 0.5) {
      blur += texture2D(u_texture, uv + vec2(o.x, o.y)).rgb;
      blur += texture2D(u_texture, uv + vec2(-o.x, o.y)).rgb;
      blur += texture2D(u_texture, uv + vec2(o.x, -o.y)).rgb;
      blur += texture2D(u_texture, uv + vec2(-o.x, -o.y)).rgb;
      blur /= 9.0;
    } else {
      blur /= 5.0;
    }
    float detail = clamp(lc - luma(blur), -0.18, 0.18);
    float mid = 1.0 - smoothstep(0.72, 1.0, lc) * 0.55;
    c += detail * u_clarity * 1.25 * mid;
    lc = luma(c);
  }

  /* 3. Small-radius sharpening with a noise floor. */
  if (u_sharpen > 0.001) {
    vec2 o = u_texel;
    float lb =
      luma(texture2D(u_texture, uv + vec2(o.x, 0.0)).rgb) +
      luma(texture2D(u_texture, uv + vec2(-o.x, 0.0)).rgb) +
      luma(texture2D(u_texture, uv + vec2(0.0, o.y)).rgb) +
      luma(texture2D(u_texture, uv + vec2(0.0, -o.y)).rgb);
    float detail = clamp(lc - lb * 0.25, -0.2, 0.2);
    float mask = smoothstep(0.006, 0.022, abs(detail));
    c += detail * mask * u_sharpen * 2.2;
    lc = luma(c);
  }

  /* 4. Portrait: mask-guided smoothing, blemish removal and skin tone. */
  if (
    u_smoothSkin > 0.001 ||
    abs(u_skinTone) > 0.001 ||
    u_blemish > 0.001
  ) {
    float skin = skinWeight(c, uv);
    float protect = 0.0;
    float lips = 0.0;
#ifdef AURUM_BEAUTY_MASK
    if (u_hasMask > 0.5) {
      vec3 m = texture2D(u_mask, uv).rgb;
      skin = m.r;
      protect = m.g;
      lips = m.b;
    }
#endif
    float mask = clamp(skin * (1.0 - protect), 0.0, 1.0);
    if (mask > 0.01) {
      vec3 base = c;
      if (u_smoothSkin > 0.001) {
        float invSigma2 = 1.0 / (0.045 * 0.045);
        vec3 acc = c;
        float wsum = 1.0;
        // UV radius, not pixel radius: the same visual smoothing at preview
        // and full-resolution export, and identical tile seams.
        vec2 o = vec2(0.0045);
        addTap(uv, vec2(o.x, 0.0), lc, invSigma2, acc, wsum);
        addTap(uv, vec2(-o.x, 0.0), lc, invSigma2, acc, wsum);
        addTap(uv, vec2(0.0, o.y), lc, invSigma2, acc, wsum);
        addTap(uv, vec2(0.0, -o.y), lc, invSigma2, acc, wsum);
        if (u_quality > 0.5) {
          addTap(uv, vec2(o.x, o.y), lc, invSigma2, acc, wsum);
          addTap(uv, vec2(-o.x, o.y), lc, invSigma2, acc, wsum);
          addTap(uv, vec2(o.x, -o.y), lc, invSigma2, acc, wsum);
          addTap(uv, vec2(-o.x, -o.y), lc, invSigma2, acc, wsum);
        }
        vec3 soft = acc / wsum;
        float detail = length(base - soft);
        float keep = smoothstep(0.025, 0.14, detail);
        // u_skinTexture 0 = strongest smoothing, 1 = keep pores and fine detail.
        float preserve = mix(0.35, 0.95, u_skinTexture);
        float strength = mask * u_smoothSkin * 0.92;
        c = mix(base, soft, strength * (1.0 - keep * preserve));
        c += (base - soft) * (u_skinTexture * 0.3 * strength);
      }
      if (u_blemish > 0.001) {
        // Spot removal deliberately averages across the blemish edge, so it
        // must not use the edge-aware addTap weights that preserve edges.
        // A UV ring wider than the spot keeps preview and export identical.
        vec2 o = vec2(0.011);
        vec3 avg = texture2D(u_texture, uv + vec2(o.x, 0.0)).rgb;
        avg += texture2D(u_texture, uv + vec2(-o.x, 0.0)).rgb;
        avg += texture2D(u_texture, uv + vec2(0.0, o.y)).rgb;
        avg += texture2D(u_texture, uv + vec2(0.0, -o.y)).rgb;
        avg += texture2D(u_texture, uv + vec2(o.x, o.y)).rgb;
        avg += texture2D(u_texture, uv + vec2(-o.x, o.y)).rgb;
        avg += texture2D(u_texture, uv + vec2(o.x, -o.y)).rgb;
        avg += texture2D(u_texture, uv + vec2(-o.x, -o.y)).rgb;
        avg *= 0.125;
        float dark = smoothstep(0.02, 0.07, luma(avg) - lc);
        vec3 delta = c - avg;
        float red = smoothstep(0.035, 0.11, delta.r - max(delta.g, delta.b));
        float spot = max(dark, red * 0.85);
        c = mix(c, avg, mask * u_blemish * spot * 0.85);
      }
      if (abs(u_skinTone) > 0.001) {
        vec3 target = u_skinTone > 0.0
          ? c * vec3(1.035, 1.005, 0.965)
          : c * vec3(0.975, 1.0, 1.025);
        c = mix(c, target, mask * abs(u_skinTone) * 0.7 * (1.0 - lips * 0.45));
      }
      lc = luma(c);
    }
  }

  /* 5. Preset matrix (gamma), then white balance. */
  c = clamp(u_color * c + u_offset, 0.0, 1.0);
  vec3 wb = whiteBalance();

  /*
   * 6. Exposure and tonal work.
   *
   * Linear path: decode once, white-balance, expose, apply a luminance
   * shoulder to values above 1, tone-map in linear, then encode once. The
   * legacy path keeps the original gamma-space order exactly.
   */
#ifdef AURUM_LINEAR
  c = toLinear(c) * wb;
  c *= pow(2.0, u_exposure);
  float L = max(luma(c), 0.000001);
  if (L > 1.0) {
    // Compress only the excess above 1, preserving hue and never clipping.
    c *= (1.0 - (1.0 - 1.0 / L) * 0.35) / L;
  }
  c = toneLinear(c);
  c = toSrgb(c);
#else
  c *= wb;
  c *= pow(2.0, u_exposure);
#endif

  /* 7. Perceptual brightness and contrast. */
  c += u_brightness * 0.22;
  c = (c - 0.5) * max(0.05, 1.0 + u_contrast) + 0.5;
  c = clamp(c, 0.0, 1.0);

  /* 8. Saturation and vibrance, weighted towards muted colours. */
  lc = luma(c);
  c = mix(vec3(lc), c, max(0.0, 1.0 + u_saturation));
  if (abs(u_vibrance) > 0.001) {
    float mx = max(c.r, max(c.g, c.b));
    float mn = min(c.r, min(c.g, c.b));
    float sat = mx - mn;
    float boost = 1.0 + u_vibrance * (1.0 - smoothstep(0.0, 0.55, sat)) * 0.9;
    lc = luma(c);
    c = mix(vec3(lc), c, max(0.0, boost));
  }

  /* 9. Gamma-space tonal path (the linear path already did this above). */
#ifndef AURUM_LINEAR
  c = toneGamma(c);
#endif

  /* 10. Gamma. */
  if (abs(u_gamma) > 0.001) {
    c = pow(c, vec3(1.0 / max(0.2, 1.0 + u_gamma * 0.8)));
  }

  /* 11. RGB curves (master + per-channel packed into one 256x1 LUT). */
  if (u_hasCurve > 0.5) {
    c.r = texture2D(u_curve, vec2(clamp(c.r, 0.0, 1.0), 0.5)).r;
    c.g = texture2D(u_curve, vec2(clamp(c.g, 0.0, 1.0), 0.5)).g;
    c.b = texture2D(u_curve, vec2(clamp(c.b, 0.0, 1.0), 0.5)).b;
  }

  /* 12. 8-band HSL mixer. */
  if (
    abs(u_hsl[0].x) + abs(u_hsl[0].y) + abs(u_hsl[0].z) +
    abs(u_hsl[1].x) + abs(u_hsl[1].y) + abs(u_hsl[1].z) +
    abs(u_hsl[2].x) + abs(u_hsl[2].y) + abs(u_hsl[2].z) +
    abs(u_hsl[3].x) + abs(u_hsl[3].y) + abs(u_hsl[3].z) +
    abs(u_hsl[4].x) + abs(u_hsl[4].y) + abs(u_hsl[4].z) +
    abs(u_hsl[5].x) + abs(u_hsl[5].y) + abs(u_hsl[5].z) +
    abs(u_hsl[6].x) + abs(u_hsl[6].y) + abs(u_hsl[6].z) +
    abs(u_hsl[7].x) + abs(u_hsl[7].y) + abs(u_hsl[7].z) > 0.001
  ) {
    vec3 hsv = rgb2hsv(clamp(c, 0.0, 1.0));
    float hue = hsv.x * 360.0;
    float dh = 0.0;
    float ds = 0.0;
    float dl = 0.0;
    float wsum = 0.0;
    addBand(hue, 0.0, 42.0, u_hsl[0], dh, ds, dl, wsum);
    addBand(hue, 30.0, 36.0, u_hsl[1], dh, ds, dl, wsum);
    addBand(hue, 60.0, 42.0, u_hsl[2], dh, ds, dl, wsum);
    addBand(hue, 120.0, 60.0, u_hsl[3], dh, ds, dl, wsum);
    addBand(hue, 180.0, 54.0, u_hsl[4], dh, ds, dl, wsum);
    addBand(hue, 240.0, 54.0, u_hsl[5], dh, ds, dl, wsum);
    addBand(hue, 285.0, 42.0, u_hsl[6], dh, ds, dl, wsum);
    addBand(hue, 320.0, 42.0, u_hsl[7], dh, ds, dl, wsum);
    if (wsum > 0.001) {
      hsv.x = fract(hsv.x + (dh / max(1.0, wsum)) * 0.0833);
      hsv.y = clamp(hsv.y * (1.0 + (ds / max(1.0, wsum)) * 0.85), 0.0, 1.0);
      hsv.z = clamp(hsv.z * (1.0 + (dl / max(1.0, wsum)) * 0.5), 0.0, 1.0);
      c = hsv2rgb(hsv);
    }
  }

  /* 13. 3D LUT. */
  if (u_lutStrength > 0.001) {
    c = mix(c, sampleLUT(clamp(c, 0.0, 1.0)), u_lutStrength);
  }

  /* 14. Vignette. */
  c = clamp(c, 0.0, 1.0);
  vec2 p = (v_screen - u_vigCenter) / max(u_vigHalf, vec2(0.0001));
  float d = length(vec2(p.x * u_aspect, p.y)) / sqrt(u_aspect * u_aspect + 1.0);
  float v = smoothstep(0.34, 1.0, d) * u_vignette * 0.88;
  c *= (1.0 - v);

  /* 15. Ordered dither before the 8-bit output. */
  if (u_dither > 0.001) {
    float b = bayer4(gl_FragCoord.xy) * 1.0666667 - 0.5;
    c += b * (u_dither / 255.0);
  }
  gl_FragColor = vec4(clamp(c, 0.0, 1.0), texel.a);
}
