# Aurum architecture

Aurum is split into a headless engine (`src/core`) and an optional UI (`src/ui`). The engine knows nothing about DOM chrome, labels or export sheets; the UI is a thin observer that calls public core methods.

```
src/
  index.ts            public exports + createCore/createEditor
  core/
    types.ts          state, events, geometry and option types
    state.ts          defaults, normalisation, clamping
    math.ts           frame, image geometry, bounds, crop quad
    color.ts          colour matrices, presets, CSS fallback, thumbnails
    capabilities.ts   WebGL probe, precision/tier detection, colour-space policy
    transfer.ts       exact sRGB ⇄ linear transfer functions
    history.ts        bounded undo/redo with coalescing
    gestures.ts       pointer, pinch, wheel, double-tap, spring settle
    renderer.ts       WebGL preview/export, Canvas2D preview/export
    core.ts           orchestration, loading, state API, export API
    shader/
      index.ts        variant keys and shaderVariantFor()
      generated.ts    build-generated vertex/fragment sources (do not edit)
      modules/        common, geometry, detail, color, portrait,
                      creative, output, main, fallback, vertex
  beauty/
    mask.ts           optional CPU skin/feature mask builder
    index.ts          standalone ESM entry (dist/aurum-beauty.esm.js)
  landmarks/
    math.ts           478-point mesh -> padded face box + feature anchors/radii
    mediapipe.ts      lazy self-hosted MediaPipe loader, SIMD fallback, queue
    index.ts          standalone ESM entry (dist/aurum-landmarks.esm.js)
  ui/
    ui.ts             dark/gold editor chrome and interactions
    styles.css        component styles (also shipped as dist/aurum.css)
    styles.ts         one-time CSS injection and UI_CSS export
    icons.ts          inline SVG icons
demo/
  index.html          full UI demo
  headless.html       core-only demo
  sample-*.jpg        test images
build.mjs             ESM/CJS/IIFE + optional AI/Beauty/Landmark builds, CSS, advisory size report
scripts/
  build-shaders.mjs   build-time GLSL module compiler + dist/shaders snapshots
```

## Data flow

```
pointer / wheel ──► GestureController ──► core.applyTransform()
                                            │
                    state changes ──────────┤
                                            ▼
                                     scheduleRender (rAF)
                                            │
                                            ▼
                                  Renderer.render(PreviewSpec)
                                            │
                         ┌──────────────────┴──────────────────┐
                         ▼                                     ▼
                  WebGL preview                         Canvas2D preview
                         │                                     │
                         └──────────────┬──────────────────────┘
                                        ▼
                                  rAF frame painted
```

State mutations are synchronous; rendering is coalesced to one paint per animation frame. The UI listens for `change`, `history` and `render` events and updates only what moved (the crop frame uses a CSS transform; it is not re-laid-out every frame).

## Coordinate systems

There are four spaces. Keeping them distinct is the key to correct crop and export behaviour.

1. **Viewport CSS pixels.** `viewport()` returns the stage's `clientWidth/clientHeight`. The crop frame is centred in this space with a padding of 5.5% of the shorter side (clamped 10–30 px).
2. **Local image units.** The unzoomed, unrotated image quad is −1…1 on both axes. `offsetX/offsetY` are normalised pan offsets in this space. Rotation is applied to the local point when converting to screen space.
3. **Screen/quad space.** `imageGeometry()` computes `sx`, `sy`, the signed half-width/height of the image after cover scale, zoom and flips:
   ```
   cover = max(viewport.width / srcWidth, viewport.height / srcHeight)
   sx    = (srcWidth  * cover * zoom) / 2 * (flipH ? -1 : 1)
   sy    = (srcHeight * cover * zoom) / 2 * (flipV ? -1 : 1)
   ```
4. **Source pixels.** Only `cropQuad()` converts screen crop corners back to source coordinates. This is used at export time, never per frame.

### Crop frame

`frameRect()` picks a ratio:

- `free` uses `crop.ratio`, clamped 0.2…8
- fixed presets use their literal ratio
- `screen` uses the viewport ratio

It then fits the largest padded frame and scales it by `crop.scale` (0.2…1). The frame is centred, so gestures move the image under a stable frame.

### Minimum zoom

`minimumZoom()` inverse-rotates each frame corner into image space and solves for the zoom at which both axes still cover the frame:

```
zoomX = max |local.x| / (srcWidth  * cover / 2)
zoomY = max |local.y| / (srcHeight * cover / 2)
min   = max(0.2, zoomX, zoomY)
```

This works for arbitrary rotation because it tests the actual rotated frame corners. `ensureCoverage()` clamps the current zoom into `[min, maxZoom]` and clamps pan offsets so every frame corner stays on the image. It runs after load, rotation, aspect changes, resize and state import.

### Pan clamping

`clampOffset()` converts each frame corner into image-local coordinates, divides by `sx/sy`, and intersects the allowed offset intervals:

```
allowed = [corner/sx - 1, corner/sx + 1]  (intersected over all 4 corners)
```

If the image is smaller than the frame on an axis (only possible during an elastic gesture), the interval collapses to its midpoint so the image stays centred.

## Rendering

### WebGL preview

The renderer creates a WebGL 1 context with `premultipliedAlpha: false`, `antialias: false` and `preserveDrawingBuffer: false`. It uploads the preview bitmap once (`setBitmap` marks the texture dirty) and draws a unit quad.

The quad positions and UVs share one convention:

- Clip space: `x=-1` left, `y=+1` top.
- UV: `(0,0)` is the image's top-left row, `(1,1)` bottom-right.
- `UNPACK_FLIP_Y_WEBGL` is **not** used. Chromium ignores it for `ImageBitmap`, which would otherwise mismatch `<img>`/canvas sources.

The preview matrix maps local image units to clip space:

```
[ cos*sx / halfW,  -sin*sx / halfH,  0 ]
[ -sin*sy / halfW, -cos*sy / halfH,  0 ]
[ tx / halfW,      -ty / halfH,      1 ]
```

The negative Y terms both flip the unit quad from GL's bottom-left origin to the top-left image convention and keep rotation visually clockwise. `tx/ty` are pixel offsets from the stage centre, not absolute positions.

The fragment pipeline is produced by the build-time shader compiler described below. It applies the 3×3 preset matrix, an optional linear-light block (white balance, exposure, luminance shoulder and tone mapping), then the perceptual adjustments, curve/HSL/LUT and a radial vignette using the output aspect ratio. `toLinear()`/`toSrgb()` use the exact IEC sRGB transfer functions and run once per pixel. Preview and export link the same variant and pass the same uniforms, so colour and vignette match. On `mediump` or low-tier devices the renderer selects the legacy gamma variant instead; `setColorSpace()` lets callers force either path. A 4×4 Bayer dither can be enabled before the 8-bit output.

### Modular shader compiler

`src/core/shader/modules/*.glsl` is the source of truth. `scripts/build-shaders.mjs` concatenates the modules, injects the feature defines, strips comments and indentation, and writes `src/core/shader/generated.ts`; `build.mjs` calls it before esbuild, so `npm run build` cannot ship a stale shader. The runtime never parses GLSL modules; it links the generated strings on demand.

The compiler emits eight full variants plus one minimal fallback:

| Key | `AURUM_LINEAR` | `AURUM_BEAUTY_MASK` | `AURUM_LIQUIFY` |
| --- | :-: | :-: | :-: |
| `base` | — | — | — |
| `base-linear` | ✓ | — | — |
| `base-liquify` | — | — | ✓ |
| `base-linear-liquify` | ✓ | — | ✓ |
| `beauty-gamma` | — | ✓ | — |
| `beauty-gamma-liquify` | — | ✓ | ✓ |
| `beauty` | ✓ | ✓ | — |
| `beauty-liquify` | ✓ | ✓ | ✓ |
| `fallback` | minimal colour + vignette | | |

`shaderVariantFor(linear, mask, liquify)` in `shader/index.ts` maps the per-draw state to a key. `GLState.programs` caches one linked program per key; `ensureProgram()` compiles lazily, reuses the cache, and stores a failed key as `null` so it is not recompiled every frame. The shader uses explicit attribute locations `0` positions, `1` UV and `2` warp vector, so no `getAttribLocation()` lookups are needed. Landmark anchors are deliberately **not** a variant: the 4×4 anchor texture and `u_hasAnchors` uniform branch change per image, not per build, so multiplying variants would add programs without removing a branch.

At init the renderer links `base` first and keeps it as the fallback program; if `base` itself fails it links the minimal `fallback`. If any other variant fails, `ensureProgram()` logs the variant and driver log once and returns that prebuilt fallback program. The UI keeps rendering either way.

The compiler also writes readable snapshots to `dist/shaders/<variant>.glsl` and `dist/shaders/manifest.json` with key, define flags, byte size and SHA-256. Those files are build artifacts for review and regression fixtures; only `dist/aurum.esm.js` (which embeds `generated.ts`) is deployed. The nine sources are ~120.6 KB raw but compress to ~5.8 KB gzip inside the core because they share most modules.

### Optional Beauty mask

`src/beauty/mask.ts` is compiled to a standalone `dist/aurum-beauty.esm.js` and never enters the core bundle. `buildBeautyMask(source, { faces, maxSize, feather })`:

1. Draws the source into a bounded 2D canvas (512–640 px is enough).
2. Samples cheeks and forehead inside each face box to learn the subject's actual Cb/Cr chroma.
3. Classifies pixels against that reference; outside faces it falls back to a conservative fixed window.
4. Derives feature protection from face-relative ellipses plus a relative luminance threshold: eyes, brows, fringe, side hair, beard and lips (`B` channel).
5. Feathers the channels with a separable box blur.

The mask is uploaded as texture unit 3 and sampled in source-image UV space, so crop, rotation and full-resolution tile export all reuse one mask. The shader uses `R` for smoothing/tone, `G` as protection and `B` to soften lip tone changes. Without a mask it keeps the procedural YCbCr + face-ellipse weight, so the core is unchanged on devices that never load the module.

Skin smoothing and blemish rings are defined in UV space rather than texture pixels. That keeps a 1080 px preview visually identical to a 4000 px export and avoids tile seams; blemish removal averages across the spot edge with plain taps, while smoothing keeps edge-aware weights so real facial detail survives.

### Face geometry and free liquify

`warpFace()` is an analytic inverse warp at the top of the fragment shader. It maps the destination UV back to a source UV, so texture and mask are sampled at the displaced point without a mesh or a second pass. Six uniforms drive it: `u_faceSlim`, `u_jawline`, `u_chin`, `u_eyeSize`, `u_noseSize`, `u_mouthSize`. Anchors are derived from the existing `u_faces` ellipses, which pack `[cx, cy, 0.62*w, 0.72*h]`; the shader recovers the half-size with `f.zw / vec2(1.24, 1.44)`. A face shape outside its ellipse is untouched because the falloff reaches exactly zero.

Free liquify runs before the face warp in the same function. `buildLiquifyField()` accumulates source-UV dabs into one RGBA8 texture, 64 px wide and 24–128 px tall:

- `R/G` encode `128 + value / shift * 127`; `128` is exact zero, so untouched texels do not drift.
- `shift` is the actual maximum, capped at 0.09 UV; `radius` is capped at 0.35 UV; the dab array is capped at 640.
- The field is uploaded as texture unit 4. It is rebuilt only when the dab array or source dimensions change.
- `core.sourcePointAt()` and `core.screenPointAt()` handle result-mode view, rotation, flips and perspective, so the brush ring and the painted stroke agree with the visible photo.

Because both preview and export call the same shader with the same UV-space field, a stroke is resolution-independent and tile-safe.

### Optional landmark anchors

`src/landmarks/math.ts` turns a 478-point MediaPipe mesh into one `FaceAnchor`: a tightly padded face box plus measured eye, nose and mouth positions and radii. It rejects short meshes, sorts faces by box area, and never mutates the input. `src/landmarks/mediapipe.ts` owns the only network/model boundary:

1. Dynamically imports the self-hosted `vision_bundle.js` (ESM, not `.mjs`, so strict MIME servers work).
2. Chooses the SIMD or no-SIMD loader through `FilesetResolver.isSimdSupported(false)`.
3. Runs `FaceLandmarker` in `IMAGE` mode with the CPU delegate, after downscaling the still image to at most 960 px and requesting up to four faces.
4. Serialises detection through a queue, aborts stale work, closes the MediaPipe instance after each image to free the WASM heap, and keeps the module cached for the next image.

The core packs the anchors into a **4×4 RGBA8 texture** on unit 5 instead of adding uniform arrays. One texture row belongs to one face:

| Texel | `R/G` | `B/A` |
| --- | --- | --- |
| 0 | left eye `x/y` | right eye `x/y` |
| 1 | nose `x/y` | mouth `x/y` |
| 2 | left eye radius `x/y` | right eye radius `x/y` |
| 3 | nose radius `x/y` | mouth radius `x/y` |

Positions encode local −1…1 into 0…1; radii encode 0…0.6 into 0…1. The shader samples the nearest texel with `u_hasAnchors`; when it is zero, the face-relative defaults remain compiled in. `setFaceAnchors(null)` restores the server boxes and those defaults, so the core is fully functional without the Landmark bundle.

The fileset is self-hosted under `/assets/landmarks/`: `vision_bundle.js`, `face_landmarker.task`, and `simd/` + optional `nosimd/` loader/binary pairs. Production CSP must allow same-origin scripts, same-origin fetch and `wasm-unsafe-eval`; single-thread WASM does not require COOP/COEP. CSP `connect-src 'self'` also blocks MediaPipe's optional Google telemetry POST, so no usage data leaves the origin.

### Canvas2D fallback

If WebGL context creation fails, the renderer draws to a 2D context:

```
ctx.translate(centre)
ctx.rotate(radians)
ctx.scale(sx, sy)
ctx.drawImage(bitmap, -1, -1, 2, 2)   // unit quad
```

Flips are folded into `sx/sy`. CSS filters approximate the colour matrix, and `vignette2D()` draws the same radial gradient. This path is used for preview and export on devices without WebGL.

### DPR and sizing

`resize()` clamps DPR to 3 and sizes the backing store to `cssSize × dpr`. The CSS size stays 100% of the stage. All geometry uses CSS pixels; the shader viewport uses device pixels. `ResizeObserver` (or `window.resize`) triggers re-fit and re-render.

### Texture limits

Export uploads the original bitmap to a GL texture. If the longest side exceeds `min(8192, MAX_TEXTURE_SIZE)`, `scaledTexture()` downscales it on a 2D canvas first. The output size is then capped by `maxExport`, so memory stays bounded.

### Context loss

The renderer cancels `webglcontextlost` so the browser is allowed to restore the context. While the context is lost, rendering pauses. On `webglcontextrestored` it recreates the program cache, buffer and textures, then redraws the last preview spec. It never calls `getContext('2d')` on a canvas that already owns a WebGL context, since that call would return `null`.

## Export pipeline

```
state ──► currentFrame + cropQuad ──► natural size
                                         │
                     k = min(1, maxExport/max(w,h))
                                         │
                     ┌───────────────────┴───────────────────┐
                     ▼                                       ▼
              WebGL export                            Canvas2D export
       (same shader, full texture)              (affine inverse of quad)
                     └───────────────────┬───────────────────┘
                                         ▼
                                 canvas.toBlob(type, quality)
                                         │
                              verify blob.type === requested
                                         │
                                   emit('export')
```

The export canvas is independent of the preview canvas, so it can exceed the viewport and DPR. The full-resolution source is used, not the preview. `getExportSize()` runs the same geometry without touching pixels.

`getImageData()` exports PNG, decodes it with `createImageBitmap`, copies it into a 2D canvas and returns `getImageData()`. This keeps the result identical to the exported file at the cost of one encode/decode round-trip.

## Gestures and spring physics

`GestureController` uses Pointer Events with pointer capture:

- 1 pointer = pan
- 2 pointers = pinch around their midpoint
- `pointerup` with no movement and within 320 ms of the previous tap = double-tap
- wheel = zoom around the cursor
- `touch-action: none` and `preventDefault()` keep browser scrolling out of the way

During a drag/pinch, bounds are elastic:

```
shown = clamped + (raw - clamped) * 0.24
```

This lets the image overshoot slightly. On release, `settle()` animates zoom and offsets to the clamped target with a critically-ish damped spring:

```
accel = (goal - value) * 220 - velocity * 26
```

The spring is capped at 380–420 ms and each animation carries a monotonic id. An interrupted animation's pending `requestAnimationFrame` callback exits when its id no longer matches, preventing two loops from stepping the same state.

Double-taps and wheel releases settle to **exact clamped offsets**, so the final frame is fully covered even after an overshoot. Pinch and wheel gestures use the elastic target while the fingers/scroll are active.

## History

`History` stores deep-cloned snapshots in a bounded array (60 by default). `push(state, key)` replaces the top entry when the same non-empty key arrives within 900 ms; slider drags therefore produce one undo step, not hundreds. Structural changes (`rotate`, `flip`, `aspect`, filters) use distinct keys so they do not merge into slider drags, and each new key adds a step. Undo/redo clones on the way out so external mutations cannot corrupt the stack.

## UI layer

`AurumEditor` extends `AurumCore` and mounts:

- two-row header (Cancel/Save; undo/redo and rotate/flip) in Liquid Glass
- crop overlay (grid, four corners, four edge handles, focusable frame) built once and moved via CSS transform
- empty state with file picker and drag-and-drop
- transparent three-row dock: ratio/rotation mode, ratio chips or the rotation tick rail, and the tab bar
- Adjust and Filter panes reuse the same three-row pattern; the filter strip and adjustment parameter chips scroll horizontally
- export sheet with format, tick-style quality control, metadata and focus trap
- status toast

The tick control is a custom `role="slider"` rather than a native range input: vertical ticks are evenly spaced, the selected tick is taller and gold, and fast drags leave a short CSS wave behind the selection. Pointer, touch and keyboard input share one value path; tick changes request `navigator.vibrate(3)` when available. The crop frame accepts pointer drags on its eight handles and arrow-key resizing when focused.

The UI never touches the canvas or renderer directly. It reacts to core events and calls public methods. `destroy()` disconnects observers, removes listeners, closes owned bitmaps, deletes GL resources and removes the root node.

Styles are plain CSS with custom properties. They are injected once into `<head>` (guarded by `style[data-aurum]`) unless `injectStyles: false`. A standalone `dist/aurum.css` is generated from the same file.

## Performance notes

Measured in headless Chromium on a desktop class machine at a 396×653 viewport, DPR 1:

- sustained pan at zoom 2.5: **~78 frames**, mean frame time **9.97 ms**, p95 **10.2 ms**, max **20 ms** (~100 FPS in that environment)
- draw count ≈ frame count; the rAF scheduler does not render while idle
- texture upload happens once per loaded image
- filter thumbnails are generated once per image (7 × 128 px)
- the crop frame is moved with `translate3d`/width/height rather than re-laying out the overlay
- styles use `backdrop-filter` for the glass panel; browsers without it fall back to the opaque background
- landmark detection never runs in the render path: it is debounced (350 ms), scheduled in idle time, performed on a ≤960 px canvas, and the WASM instance is closed after each still image

Typical costs per frame: one draw call, one program bind from the variant cache, and a small set of uniform updates. The texture is only re-uploaded when the image changes, not while panning or zooming.

## Testing checklist

The current build was verified in a real Chromium tab with synthetic pointer events and pixel checks:

- preview and frame at 396×653 and 1200×800
- crop ratios free, 1:1, 4:3, 16:9, screen; rotations 0/30/45/90/135/180/−90
- all export corners opaque (alpha 255) across 35 rotation × aspect combinations
- pan overshoot and spring return to the clamped offset
- pinch in/out and wheel zoom, min/max clamping, double-tap in/out anchoring
- WebGL vs Canvas2D export: identical pixels for an identity-colour quadrant fixture (mean diff 0, max diff 0)
- Canvas2D preview fallback with WebGL disabled: correct orientation and adjustments
- JPEG quality 0.92 vs 0.20 (58 KB vs 11 KB on the sample), WebP, PNG, DataURL, File, ImageData
- `maxExport` 500 → 500×375 output; source preview longest side ≤ 1080
- export type mismatch rejection, missing-image error, 404 load error
- empty state → drag-enter → drop → ready; non-image toast
- undo/redo and JSON state round-trip
- keyboard tab navigation, modal focus trap, `Escape` + focus return
- headless demo: crop 1:1 → rotate 90° → Vivid → PNG export, 950×950 output matching `getExportSize()`; mobile layout stacks without overlap
- WebGL context loss (`WEBGL_lose_context`): rendering pauses, the context restores, and the last preview redraws
- colour pipeline (`test-color.html`): neutral sRGB vs linear pixel-identical; 65 unique codes on a 64-step ramp; preview vs export PSNR ∞ in result mode; dither shrinks the longest flat run from 14 px to 8 px
- beauty mask (`test-beauty.html`): cheek `R=255`, eye `G=255`, lips `B=255`, background `R=0`; neutral output with a mask is pixel-identical to no mask; texture variance ≈4.20 (flat) vs ≈9.00 (preserve); blemish luma 74.4 → 118.8; preview vs export with mask PSNR ∞
- face shape (`test-face.html`): neutral with face box PSNR ∞; all six sliders 24.95 dB; outside-face diff 0.000; inside-face diff 6.75; preview vs export PSNR ∞; eye anchor diff 0.000
- shaders (`test-shader.html`): all nine variants compile and link in WebGL1; feature-equivalent variants (`base-linear` vs `beauty` with mask off, `beauty` vs `beauty-liquify` with a zero dab, and the base/linear liquify pairs) are PSNR ∞; legacy single-shader parity is PSNR ∞ except gamma+liquify at 102.32 dB with max 1 LSB; the minimal fallback renders non-blank. `test-shader-fallback.html` forces a `beauty` compile failure and then a failure of every full variant: each logs the warning and falls back, and both exports remain non-blank with distinct hashes
- landmark geometry (`test-landmarks.html`): neutral with anchors PSNR ∞; anchored shape 25.23 dB; outside-face diff 0.000; inside-face diff 6.12; preview vs export PSNR ∞; eye anchor diff 0.000; cleared anchors vs server fallback PSNR ∞; short mesh rejected
- live landmarks (`test-landmarks-live.html`): self-hosted MediaPipe detects one face in ~2.4–3.0 s on the portrait fixture, returns the padded box and anchors, and the core accepts them; only the expected XNNPACK info line appears
- production CSP (temporary smoke page on `/mng-cloud`, removed after the run): every JS file returned `application/javascript`, the binary returned `application/wasm`, and the `.task` model returned `application/octet-stream`; WASM compiled under `script-src 'self' 'wasm-unsafe-eval'`; the Google telemetry POST was blocked by `connect-src 'self'`
- free liquify (`test-liquify.html`): 64×64 field, dab cap 640, outside-brush diff 0.000, preview vs export PSNR ∞, undo/clear PSNR ∞; UI (`test-liquify-ui.html`): pointer creates 11 dabs, stroke 31.32 dB, undo PSNR ∞, leaving the tab clears the mode
- no console errors in the demo flow

Manual device checks still worth doing on hardware: iOS Safari notch/safe-area insets, rubber-band feel on a real touchscreen, and WebP encoder availability on older Safari.
