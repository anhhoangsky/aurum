/*
 * Face geometry is a UV-space inverse warp, so the preview and every export
 * tile evaluate exactly the same displacement. Server face boxes are enough
 * for the coarse face/jaw/chin sliders; eye/nose/mouth use face-relative
 * anchors until the optional landmark adapter supplies precise points.
 * Positive values: slim face/jaw, lengthen chin, enlarge eyes/nose/mouth.
 */
vec2 warpFace(vec2 uv) {
#ifdef AURUM_LIQUIFY
  /* Free liquify runs first: its field is a source-UV displacement, so the
     same dab moves the same detail in the preview and every export tile. */
  if (u_liquifyShift > 0.00001) {
    vec2 pushed = (texture2D(u_liquify, uv).rg * 255.0 - 128.0) * (u_liquifyShift / 127.0);
    uv = clamp(uv + pushed, 0.0, 1.0);
  }
#endif
  if (
    abs(u_faceSlim) + abs(u_jawline) + abs(u_chin) +
    abs(u_eyeSize) + abs(u_noseSize) + abs(u_mouthSize) < 0.001
  ) return uv;
  for (int i = 0; i < 4; i++) {
    if (i >= u_faceCount) break;
    // u_faces packs [cx, cy, 0.62*w, 0.72*h], so recover the box half-size.
    vec4 f = u_faces[i];
    vec2 halfSize = max(f.zw / vec2(1.24, 1.44), vec2(0.0001));
    vec2 center = f.xy;
    vec2 l = (uv - center) / halfSize;
    float ell = clamp(1.0 - dot(l, l), 0.0, 1.0);
    if (ell <= 0.0001) continue;
    float soft = ell * ell;

    /*
     * Feature anchors default to face-relative positions. When the optional
     * landmark pass has run, a 4x4 RGBA8 texture replaces them with measured
     * eye/nose/mouth points and radii. The branch is uniform across the draw,
     * so devices without landmarks pay only for the default constants.
     */
    vec2 eyeL = vec2(-0.34, -0.18);
    vec2 eyeR = vec2(0.34, -0.18);
    vec2 nose = vec2(0.0, 0.10);
    vec2 mouth = vec2(0.0, 0.40);
    vec2 eyeLR = vec2(0.22, 0.16);
    vec2 eyeRR = vec2(0.22, 0.16);
    vec2 noseR = vec2(0.20, 0.24);
    vec2 mouthR = vec2(0.30, 0.16);
    if (u_hasAnchors > 0.5) {
      float ay = (float(i) + 0.5) * 0.25;
      vec4 a0 = texture2D(u_anchors, vec2(0.125, ay));
      vec4 a1 = texture2D(u_anchors, vec2(0.375, ay));
      vec4 a2 = texture2D(u_anchors, vec2(0.625, ay));
      vec4 a3 = texture2D(u_anchors, vec2(0.875, ay));
      eyeL = a0.xy * 2.0 - 1.0;
      eyeR = a0.zw * 2.0 - 1.0;
      nose = a1.xy * 2.0 - 1.0;
      mouth = a1.zw * 2.0 - 1.0;
      eyeLR = max(a2.xy * 0.6, vec2(0.02));
      eyeRR = max(a2.zw * 0.6, vec2(0.02));
      noseR = max(a3.xy * 0.6, vec2(0.02));
      mouthR = max(a3.zw * 0.6, vec2(0.02));
    }

    // Horizontal squeeze: zero at the centre and at the face edge, strongest
    // across the cheeks. Jawline weights the lower half more.
    float squeeze =
      u_faceSlim * 0.16 +
      u_jawline * 0.14 * smoothstep(-0.05, 0.75, l.y);
    uv.x += squeeze * l.x * soft * halfSize.x;

    // Chin: the lower centre samples slightly above, so the chin visually
    // extends downwards without pulling in the background at the jaw edge.
    float chinBand = smoothstep(0.0, 0.65, l.y) * exp(-l.x * l.x * 3.0);
    uv.y -= u_chin * 0.14 * chinBand * ell * halfSize.y;

    if (abs(u_eyeSize) > 0.001) {
      vec2 dL = (l - eyeL) / eyeLR;
      vec2 dR = (l - eyeR) / eyeRR;
      float fL = clamp(1.0 - dot(dL, dL), 0.0, 1.0);
      float fR = clamp(1.0 - dot(dR, dR), 0.0, 1.0);
      fL *= fL;
      fR *= fR;
      uv -= (uv - (center + eyeL * halfSize)) * u_eyeSize * 0.28 * fL;
      uv -= (uv - (center + eyeR * halfSize)) * u_eyeSize * 0.28 * fR;
    }

    if (abs(u_noseSize) > 0.001) {
      vec2 dN = (l - nose) / noseR;
      float fN = clamp(1.0 - dot(dN, dN), 0.0, 1.0);
      fN *= fN;
      uv -= (uv - (center + nose * halfSize)) * u_noseSize * 0.26 * fN;
    }

    if (abs(u_mouthSize) > 0.001) {
      vec2 dM = (l - mouth) / mouthR;
      float fM = clamp(1.0 - dot(dM, dM), 0.0, 1.0);
      fM *= fM;
      uv -= (uv - (center + mouth * halfSize)) * u_mouthSize * 0.24 * fM;
    }
  }
  return clamp(uv, 0.0, 1.0);
}
