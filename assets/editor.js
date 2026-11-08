import { trustedScriptUrl } from './trusted-types.js';

const cfg = JSON.parse(document.getElementById('editor-config')?.textContent || '{}');
// Debug A/B switch: ?colorspace=srgb renders with the legacy gamma pipeline,
// ?colorspace=linear forces the hybrid linear-light one, anything else keeps
// the device-aware default. It only affects rendering, never the saved state.
const colorspaceParam = new URLSearchParams(location.search).get('colorspace');
const colorSpace =
  colorspaceParam === 'srgb' || colorspaceParam === 'linear' ? colorspaceParam : 'auto';
// editor.php appends the bundle mtime so a new aurum.esm.js is never served stale.
const { AurumEditor, registerAIAdapter } = await import(trustedScriptUrl(`./assets/aurum.esm.js?v=${encodeURIComponent(cfg.assetVer || '1')}`));
const boot = document.getElementById('editorBoot');

let heicNote = null;
function setHeicNote(visible) {
  if (!cfg.heic) return;
  if (!heicNote) {
    heicNote = document.createElement('div');
    heicNote.setAttribute('role', 'status');
    heicNote.style.cssText =
      'position:fixed;left:50%;bottom:calc(18px + env(safe-area-inset-bottom));z-index:80;' +
      'transform:translateX(-50%);max-width:calc(100vw - 32px);padding:10px 15px;border-radius:999px;' +
      'background:rgba(24,24,28,.96);border:1px solid rgba(243,199,123,.34);color:#f4f2ec;' +
      'font:600 11.5px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;' +
      'box-shadow:0 12px 40px rgba(0,0,0,.55);text-align:center;';
    heicNote.textContent = 'Đang chuyển ảnh sang HEIC trên máy chủ… ảnh lớn có thể mất vài phút.';
    document.body.appendChild(heicNote);
  }
  heicNote.hidden = !visible;
}

async function uploadEdit(blob, mode) {
  const form = new FormData();
  form.append('csrf', cfg.csrf);
  form.append('id', String(cfg.id));
  form.append('mode', mode);
  form.append('file', blob, cfg.uploadName);
  setHeicNote(true);
  let response;
  try {
    response = await fetch(cfg.saveUrl, {
      method: 'POST',
      body: form,
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
    });
  } catch (error) {
    setHeicNote(false);
    throw new Error('Mất kết nối khi lưu ảnh. Vui lòng thử lại.');
  }
  let data = null;
  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }
  if (!response.ok || !data || data.ok !== true) {
    setHeicNote(false);
    throw new Error((data && data.message) || 'Máy chủ không lưu được ảnh đã chỉnh sửa.');
  }
  // Return to a fresh library load so the new thumbnail and metadata are
  // visible immediately. The viewer reopens the edited item (or the copy).
  const savedId = Number(data.id) || cfg.id;
  const params = new URLSearchParams({ edited: String(savedId) });
  if (mode === 'copy') params.set('mode', 'copy');
  location.replace(`${cfg.returnUrl}?${params.toString()}`);
}

function chooseAIModel(balanced, high, highReason) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Chọn chất lượng AI');
    overlay.style.cssText = [
      'position:fixed;inset:0;z-index:90;display:flex;align-items:flex-end;justify-content:center;',
      'padding:16px;background:rgba(8,8,10,.68);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);',
      'touch-action:manipulation;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;',
    ].join('');

    const card = document.createElement('div');
    card.style.cssText = [
      'width:min(430px,100%);max-height:calc(100dvh - 32px);overflow:auto;padding:18px;border-radius:22px;',
      'background:linear-gradient(180deg,#1c1c21,#111114);border:1px solid rgba(243,199,123,.26);',
      'box-shadow:0 24px 80px rgba(0,0,0,.62);color:#f4f2ec;',
      'font:13px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;',
      'touch-action:manipulation;-webkit-user-select:none;user-select:none;',
    ].join('');

    const title = document.createElement('div');
    title.textContent = 'AI 4× · Chọn chất lượng';
    title.style.cssText = 'font-size:16px;font-weight:750;letter-spacing:.1px;margin-bottom:3px;';

    const sub = document.createElement('div');
    sub.textContent =
      'Ảnh sẽ được thay bằng bản 4×. Khung cắt và lịch sử chỉnh sửa được đặt lại; thanh màu và bộ lọc vẫn giữ.';
    sub.style.cssText = 'font-size:11.5px;line-height:1.5;color:#a7a3b0;margin-bottom:12px;';

    const makeButton = (id, plan, titleText, subtitleText, recommended, disabledReason) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.style.cssText = [
        'display:block;width:100%;text-align:left;margin:0 0 8px;padding:12px 14px;border-radius:16px;',
        'border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.055);color:inherit;',
        'font:inherit;cursor:pointer;touch-action:manipulation;-webkit-user-select:none;user-select:none;',
      ].join('');
      if (disabledReason) {
        button.disabled = true;
        button.style.opacity = '.5';
        button.style.cursor = 'not-allowed';
      }
      const head = document.createElement('div');
      head.style.cssText =
        'display:flex;align-items:center;justify-content:space-between;gap:8px;font-weight:700;';
      const name = document.createElement('span');
      name.textContent = titleText;
      head.append(name);
      if (recommended) {
        const badge = document.createElement('span');
        badge.textContent = 'Khuyến nghị';
        badge.style.cssText =
          'font-size:9px;font-weight:750;letter-spacing:.3px;text-transform:uppercase;color:#2a1c06;' +
          'background:#f3c77b;border-radius:999px;padding:2px 7px;';
        head.append(badge);
      }
      const desc = document.createElement('div');
      desc.textContent = subtitleText;
      desc.style.cssText = 'font-size:10.5px;line-height:1.45;color:#aaa6b2;margin-top:3px;';
      const meta = document.createElement('div');
      const mp = (plan.outputWidth * plan.outputHeight) / 1e6;
      const down = plan.downscaled ? ` · thu về ${plan.inputWidth}×${plan.inputHeight}` : '';
      meta.textContent =
        `${plan.outputWidth}×${plan.outputHeight} (${mp.toFixed(1)} MP) · ` +
        `tile ${plan.tileSize}px · ${plan.backend.toUpperCase()}${down}`;
      meta.style.cssText = 'font-size:10px;line-height:1.45;color:#f3c77b;margin-top:5px;';
      button.append(head, desc, meta);
      if (disabledReason) {
        const warn = document.createElement('div');
        warn.textContent = disabledReason;
        warn.style.cssText = 'font-size:10px;line-height:1.45;color:#ffb4b4;margin-top:4px;';
        button.append(warn);
      } else if (!plan.fits) {
        const warn = document.createElement('div');
        warn.textContent = 'Có thể thiếu bộ nhớ trên thiết bị này.';
        warn.style.cssText = 'font-size:10px;color:#ff9a9a;margin-top:4px;';
        button.append(warn);
      }
      if (!disabledReason) {
        button.addEventListener('click', () => {
          cleanup();
          resolve(id);
        });
      }
      return button;
    };

    const balancedButton = makeButton(
      'balanced',
      balanced,
      'Cân bằng',
      'realesr-general-x4v3 · 4,9 MB · nhanh, hợp iPhone',
      true,
    );
    card.append(title, sub, balancedButton);
    if (high) {
      card.append(
        makeButton(
          'high',
          high,
          'Chất lượng cao',
          'Real-ESRGAN x4plus · 67 MB · chi tiết hơn, chậm hơn nhiều',
          false,
          highReason,
        ),
      );
    }

    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.textContent = 'Hủy';
    cancel.style.cssText =
      'display:block;width:100%;height:38px;margin-top:2px;border:0;border-radius:12px;' +
      'background:transparent;color:#8f8c98;font:600 12px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;' +
      'cursor:pointer;touch-action:manipulation;';
    cancel.addEventListener('click', () => {
      cleanup();
      resolve(null);
    });
    card.append(cancel);

    const cleanup = () => {
      overlay.remove();
      document.removeEventListener('keydown', onKey);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') {
        cleanup();
        resolve(null);
      }
    };
    document.addEventListener('keydown', onKey);
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        cleanup();
        resolve(null);
      }
    });
    overlay.append(card);
    document.body.append(overlay);
    requestAnimationFrame(() => balancedButton.focus());
  });
}

async function runAI(editor, { signal, report }) {
  report(-1, 'Đang kiểm tra thiết bị…');
  const ai = await import(trustedScriptUrl(`./assets/aurum-ai.esm.js?v=${encodeURIComponent(cfg.aiVer || '1')}`));
  const profile = await ai.probeAIClient();
  const size = editor.source();
  const balanced = ai.planRealESRGAN({
    width: size.width,
    height: size.height,
    profile,
    model: 'balanced',
  });
  const high = cfg.aiHigh
    ? ai.planRealESRGAN({ width: size.width, height: size.height, profile, model: 'high' })
    : null;
  // x4plus on single-threaded WASM blocks the main thread for minutes per tile
  // and cannot even process the Cancel button. WebGPU is asynchronous and fast;
  // without it the 67 MB model is not a usable option, so say so up front.
  const highReason =
    high && profile.backend !== 'webgpu'
      ? 'Cần WebGPU. Trình duyệt này chỉ có WASM nên model 67 MB sẽ rất chậm và treo giao diện.'
      : '';
  report(-1, 'Chọn mức chất lượng AI…');
  const choice = await chooseAIModel(balanced, high, highReason);
  if (!choice) {
    const cancelled = new Error('AI cancelled');
    cancelled.name = 'AbortError';
    throw cancelled;
  }
  const plan = choice === 'high' && high && !highReason ? high : balanced;
  report(-1, ai.describeRealESRGANPlan(plan));

  const asset = (name, version) =>
    new URL(`./ai/${name}?v=${encodeURIComponent(version || cfg.aiVer || '1')}`, import.meta.url).href;
  const factory = ai.createRealESRGANFactory({
    modelUrl: asset(plan.modelFile, plan.model === 'high' ? cfg.aiHighVer : cfg.aiModelVer),
    modelSizeMB: plan.modelSizeMB,
    runtime: {
      webgpu: asset('ort.webgpu.bundle.min.mjs', cfg.aiVer),
      wasm: asset('ort.wasm.bundle.min.mjs', cfg.aiVer),
    },
    backend: plan.backend,
    profile,
    onStatus: (message) => report(-1, message),
  });
  registerAIAdapter(factory);
  await editor.runAI(plan.id, {
    tileSize: plan.tileSize,
    halo: plan.halo,
    scale: plan.scale,
    maxInputPixels: plan.inputWidth * plan.inputHeight,
    maxOutputPixels: plan.maxOutputPixels,
    signal,
    onProgress: (progress) => report(progress),
    onStage: (stage, done, total) => {
      if (stage === 'tile' && done != null && total != null) {
        report(done / total, `Đang xử lý vùng ${done}/${total}…`);
      } else if (stage === 'resize') {
        report(-1, 'Đang thu nhỏ ảnh cho vừa giới hạn thiết bị…');
      } else if (stage === 'load') {
        report(-1, 'Đang tải model AI…');
      } else if (stage === 'done') {
        report(1, 'Đang tạo bản xem trước…');
      }
    },
  });
}

// Optional Beauty: a small ES module that builds a skin/feature mask on the
// CPU. It loads lazily, builds off the render path, and only when a portrait
// slider actually needs it. Without it the core keeps its procedural mask, so
// old devices and blocked CDNs degrade instead of failing.
let beautySeq = 0;
let beautyTimer = 0;
let beautyModule = null;
let beautyBuiltFor = null;

function needsBeautyMask() {
  const adjust = editor.getState().adjust;
  return (
    (adjust.smoothSkin || 0) > 0 ||
    (adjust.blemish || 0) > 0 ||
    Math.abs(adjust.skinTone || 0) > 0
  );
}

function scheduleBeautyMask() {
  if (!cfg.beautyVer || !needsBeautyMask()) return;
  const source = editor.sourceBitmap();
  if (!source || source === beautyBuiltFor) return;
  clearTimeout(beautyTimer);
  beautyTimer = setTimeout(() => {
    // Never build inside requestAnimationFrame; idle time keeps preview smooth.
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => buildBeautyMask(source), { timeout: 2500 });
    } else {
      setTimeout(() => buildBeautyMask(source), 60);
    }
  }, 300);
}

async function buildBeautyMask(source) {
  const seq = ++beautySeq;
  try {
    beautyModule =
      beautyModule ||
      import(trustedScriptUrl(`./assets/aurum-beauty.esm.js?v=${encodeURIComponent(cfg.beautyVer)}`));
    const beauty = await beautyModule;
    if (seq !== beautySeq || editor.sourceBitmap() !== source) return;
    const mask = beauty.buildBeautyMask(source, {
      faces: Array.isArray(cfg.faces) ? cfg.faces : [],
      maxSize: 512,
      feather: 2,
    });
    if (seq !== beautySeq || editor.sourceBitmap() !== source) return;
    editor.setBeautyMask(mask);
    beautyBuiltFor = source;
  } catch (error) {
    beautyModule = null;
    // Optional by design: the shader mask still works without it.
    console.warn('Beauty mask unavailable; using the procedural mask.', error);
  }
}

// Optional landmark refinement: only face geometry needs it, so a portrait
// edit that never touches those sliders pays nothing. MediaPipe is lazy,
// self-hosted and local-only; any failure leaves the server boxes in place.
let landmarkSeq = 0;
let landmarkTimer = 0;
let landmarkModule = null;
let landmarkBuiltFor = null;

function needsFaceLandmarks() {
  if (!cfg.landmarks || !Array.isArray(cfg.faces) || !cfg.faces.length) return false;
  const adjust = editor.getState().adjust;
  return (
    Math.abs(adjust.faceSlim || 0) > 0 ||
    Math.abs(adjust.jawline || 0) > 0 ||
    Math.abs(adjust.chin || 0) > 0 ||
    Math.abs(adjust.eyeSize || 0) > 0 ||
    Math.abs(adjust.noseSize || 0) > 0 ||
    Math.abs(adjust.mouthSize || 0) > 0
  );
}

function scheduleFaceLandmarks() {
  if (!needsFaceLandmarks()) {
    clearTimeout(landmarkTimer);
    return;
  }
  const source = editor.sourceBitmap();
  if (!source || source === landmarkBuiltFor) return;
  clearTimeout(landmarkTimer);
  landmarkTimer = setTimeout(() => {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => refineFaceLandmarks(source), { timeout: 3000 });
    } else {
      setTimeout(() => refineFaceLandmarks(source), 80);
    }
  }, 350);
}

async function refineFaceLandmarks(source) {
  const seq = ++landmarkSeq;
  const config = cfg.landmarks;
  if (!config) return;
  try {
    landmarkModule =
      landmarkModule ||
      import(trustedScriptUrl(`./assets/aurum-landmarks.esm.js?v=${encodeURIComponent(config.ver || '1')}`));
    const landmarks = await landmarkModule;
    if (seq !== landmarkSeq || editor.sourceBitmap() !== source) return;
    const anchors = await landmarks.detectFaceAnchors(source, {
      moduleUrl: config.moduleUrl,
      modelUrl: config.modelUrl,
      wasm: config.wasm,
      nosimd: config.nosimd || undefined,
      maxSize: 960,
      numFaces: 4,
    });
    // Free the WASM heap as soon as the still image has been measured. The
    // module stays loaded, so a new base bitmap only re-runs detection.
    landmarks.closeFaceLandmarker();
    if (seq !== landmarkSeq || editor.sourceBitmap() !== source) return;
    // Remember an empty result too: the server may have boxes that MediaPipe
    // cannot see (profile, occlusion), and re-running the model on every
    // slider change would only burn CPU. A new bitmap retries.
    landmarkBuiltFor = source;
    if (anchors.length) editor.setFaceAnchors(anchors);
    else editor.clearFaceAnchors();
  } catch (error) {
    if (landmarkModule) {
      landmarkModule.then((landmarks) => landmarks.closeFaceLandmarker()).catch(() => {});
    }
    landmarkModule = null;
    if (seq === landmarkSeq && editor.sourceBitmap() === source) {
      // Remember the failed source so dragging the sliders does not retry a
      // blocked/failed WASM load on every change. A new base bitmap retries.
      landmarkBuiltFor = source;
      editor.clearFaceAnchors();
    }
    console.warn('Face landmarks unavailable; using the server face boxes.', error);
  }
}

const editor = new AurumEditor({
  container: '#editor',
  image: cfg.mediaUrl,
  fileName: cfg.stem,
  colorSpace,
  locale: 'vi',
  title: 'Chỉnh sửa ảnh',
  startTab: 'adjust',
  exportTypes: [cfg.exportType],
  aiAction: cfg.ai
    ? {
        label: 'AI 4×',
        title: 'Phóng to và làm nét bằng AI (Real-ESRGAN)',
        run: runAI,
      }
    : undefined,
  onSave: (blob) => uploadEdit(blob, 'overwrite'),
  onSaveCopy: (blob) => uploadEdit(blob, 'copy'),
  onClose: () => {
    if (!editor.canUndo() || window.confirm('Bỏ các thay đổi và quay lại ảnh?')) {
      location.href = cfg.viewUrl || `${cfg.returnUrl}?view=${encodeURIComponent(cfg.id)}`;
    }
  },
});

// Server-side YuNet boxes let the portrait sliders target real faces without
// shipping a model to the browser. They are optional; an empty list is normal.
if (Array.isArray(cfg.faces) && cfg.faces.length) {
  editor.setFaces(cfg.faces);
}

editor.on('ready', () => {
  if (boot) boot.hidden = true;
  // A new base bitmap (initial load, AI result or AI revert) invalidates the
  // previous mask and anchors; rebuild them lazily if the sliders need them.
  beautySeq += 1;
  beautyBuiltFor = null;
  landmarkSeq += 1;
  landmarkBuiltFor = null;
  editor.clearFaceAnchors();
  scheduleBeautyMask();
  scheduleFaceLandmarks();
});
editor.on('change', () => {
  scheduleBeautyMask();
  scheduleFaceLandmarks();
});
editor.on('error', () => {
  if (!boot) return;
  boot.textContent = 'Không mở được ảnh gốc. Hãy quay lại thư viện và thử lại.';
  boot.hidden = false;
});

// Release the MediaPipe WASM heap when the page goes away. Detection already
// closes it after each still image; this covers a queued load.
window.addEventListener('pagehide', () => {
  landmarkSeq += 1;
  if (landmarkModule) {
    landmarkModule
      .then((landmarks) => landmarks.closeFaceLandmarker())
      .catch(() => {});
  }
});

if (editor.isReady && boot) boot.hidden = true;

window.aurum = editor;
