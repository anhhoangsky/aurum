# aurum

Aurum is a self-contained, browser-native image editor: a gold, liquid-glass
UI over a headless core (crop, rotate, flip, curves, HSL, LUT presets, and
export to JPEG/PNG/WebP through the browser's own encoders).

## Layout

```
assets/
  aurum.esm.js           the engine (core + UI) — headless core with an
                         optional iOS dark/gold chrome; exports
                         { AurumEditor, registerAIAdapter, ensureStyles, UI_CSS, ... }
  editor.js              standalone host bridge: reads #editor-config,
                         boots the engine, wires the save/upload flow
  aurum.css              the editor chrome styles (`.au-*`)
  aurum-ai.esm.js        optional AI adapter (ONNX Runtime backend)
  aurum-beauty.esm.js    optional CPU skin/feature mask builder (lazy)
  aurum-landmarks.esm.js optional Face Landmarker module (lazy)
editor.html              static host page (auth-free demo harness)
```

## Running

Serve the repo statically and open `editor.html`:

```
python3 -m http.server 8000
# open http://localhost:8000/editor.html
```

The host page reads its config from the
`<script type="application/json" id="editor-config">` block; edit
`mediaUrl` to load your image and `saveUrl` to point at a backend.
A floating **"Ảnh demo"** panel (top-left) picks from bundled sample
photos in `demo/`, or use `?src=<url>` to load an arbitrary image.
The demo harness installs the Trusted Types shims
(`assets/demo-shim.js`) separately so the engine works under a
`require-trusted-types-for 'script'` CSP.

## Demo

![[aurum editor — liquid glass](https://anhhoangsky.github.io/aurum/editor)]

## Configuration contract

The bridge expects this JSON on `#editor-config`:

| key          | meaning |
| ---          | --- |
| `id`         | item identifier echoed back on save |
| `csrf`       | csrf token included in the upload form |
| `saveUrl`    | POST endpoint accepting `FormData { csrf, id, mode, file }`; returns `{ ok: true, id }` |
| `returnUrl`  | where the page goes after a save (in a full app) |
| `viewUrl`    | where "close" goes back to |
| `mediaUrl`   | source image URL (serve the full-resolution original here) |
| `name` / `stem` / `uploadName` | file naming for export |
| `exportType` | MIME to export (`image/jpeg` / `image/png` / `image/webp`) |
| `heic`       | true when the source is HEIC/HEIF (exporter note explains the server round-trip) |
| `width` / `height` | source dimensions |
| `faces`      | optional server-side face boxes (`{x,y,w,h,confidence}`) steering the portrait sliders |
| `ai` / `aiHigh` | availability of the AI upscale module + ONNX models |
| `landmarks`  | optional Face Landmarker module/model URLs (MediaPipe fileset), else server boxes only |
| `*Ver`       | asset versioning for cache-busting |

`saveUrl` receives `mode: "overwrite"` or `"copy"`. This is the exact
contract the MNG Cloud PHP app historically used; the native
`POST /api/v1/items/{id}/edit` route accepts the same multipart shape
(with an `x-csrf-token` header instead of the form csrf field).

## Optional modules

- **AI upscale** (`aurum-ai.esm.js` + ONNX models): offer an "AI 4×" action
  when `ai` is true and `aiVer` points at the real module.
- **Beauty mask**: loaded lazily when a portrait slider needs it; the
  procedural mask in the core is the fallback.
- **Landmarks**: needs the self-hosted MediaPipe fileset
  (`vision_bundle.js`, `face_landmarker.task`, `simd/vision_wasm_internal.*`,
  `nosimd/vision_wasm_nosimd_internal.*`); when absent, server boxes only.

## License

MIT — see `LICENSE` (the engine ships as `aurum-image-editor v1.0.0`).
