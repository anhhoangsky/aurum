/**
 * Aurum AI Panel — standalone demo (Phase 5).
 *
 * Independent of the editor's WebGL core: this page drives the AI Engine
 * bundle and the headless adapter only. The mask is edited as independent
 * state (own undo stack) and exported as an original-resolution transparent
 * PNG. Nothing here calls a mutating AurumCore/AurumEditor method.
 */
import {
  create,
  previewCheckerboard,
  compositeTransparentPNG,
  brushDab,
  featherMask,
  morphMask,
  invertMask,
} from '../assets/aurum-ai-engine.esm.js';

const $ = (sel) => document.querySelector(sel);
const preview = $('#preview');
const logEl = $('#log');
const runMeta = $('#run-meta');
const modelStatus = $('#model-status');

const RUNTIME = {
  // Pinned ORT Web 1.31.1 from CDN (matches devDependency). For production,
  // self-host these bundles + .wasm files (see build.mjs dist/ai copies):
  // the model weights are still pinned + SHA-256 verified, and inference
  // itself makes no network calls.
  webgpu: 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.31.1/dist/ort.webgpu.min.mjs',
  wasm: 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.31.1/dist/ort.wasm.min.mjs',
};

let ai = null;
let source = null; // ImageBitmap
let sourceW = 0;
let sourceH = 0;
let mask = null; // current editable Mask (original resolution)
let instances = [];
let activeMask = null; // mask being edited (AI result or chosen instance)
let checker = true;
let tool = 'add';
let history = [];
let historyIndex = -1;
const HISTORY_MAX = 30;
let aborter = null;

function log(msg) {
  logEl.textContent += `\n${msg}`;
  logEl.scrollTop = logEl.scrollHeight;
}

function errorText(err) {
  return `${err?.name ?? 'Error'}: ${err?.message ?? err}`;
}

async function ensureAI() {
  if (!ai) {
    log('Tạo AI Engine (probe thiết bị)…');
    ai = await create({
      offline: true,
      quality: 'medium',
      runtime: RUNTIME,
      onStatus: (m) => log(m),
    });
    log(`Engine sẵn sàng — backend ${ai.backend}, quality ${ai.quality}`);
  }
  return ai;
}

function pushHistory() {
  history = history.slice(0, historyIndex + 1);
  history.push(mask ? { ...mask, data: new Float32Array(mask.data) } : null);
  if (history.length > HISTORY_MAX) history.shift();
  historyIndex = history.length - 1;
  updateUndoButtons();
}

function applyHistory(index) {
  historyIndex = index;
  const entry = history[historyIndex];
  mask = entry ? { ...entry, data: new Float32Array(entry.data) } : null;
  if (activeMask) activeMask = entry ? { ...entry, data: new Float32Array(entry.data) } : null;
  render();
  updateUndoButtons();
}

function updateUndoButtons() {
  $('#undo').disabled = historyIndex <= 0;
  $('#redo').disabled = historyIndex >= history.length - 1;
}

function render() {
  if (!source || !mask) return;
  const canvas = previewCheckerboard(source, mask, { maxSide: 1080 });
  preview.width = canvas.width;
  preview.height = canvas.height;
  preview.getContext('2d').drawImage(canvas, 0, 0);
}

async function bitmapFrom(source) {
  if (typeof source === 'string') {
    const blob = await (await fetch(source)).blob();
    try {
      return await createImageBitmap(blob);
    } catch {
      // iOS Safari / format edge cases: fall back to <img> (drawImage accepts it).
      const url = URL.createObjectURL(blob);
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });
    }
  }
  return source;
}

async function loadImage(urlOrBitmap) {
  const bitmap = await bitmapFrom(urlOrBitmap);
  source = bitmap;
  sourceW = bitmap.width || bitmap.naturalWidth;
  sourceH = bitmap.height || bitmap.naturalHeight;
  if (!sourceW || !sourceH) throw new Error('Ảnh không đọc được (0 kích thước)');
  mask = null;
  activeMask = null;
  instances = [];
  renderInstances();
  // Idle render: draw source plain so first paint is useful.
  const canvas = previewCheckerboard(source, { width: 1, height: 1, data: new Float32Array([1]) }, { maxSide: 1080 });
  preview.width = canvas.width;
  preview.height = canvas.height;
  preview.getContext('2d').drawImage(canvas, 0, 0);
  log(`Đã nạp ảnh ${sourceW}×${sourceH}`);
}

async function refreshModelStatus() {
  const engine = await ensureAI().catch(() => null);
  if (!engine) {
    modelStatus.textContent = 'Không tạo được engine.';
    return;
  }
  const id = $('#model').value;
  const installed = (await engine.getInstalledModels().catch(() => [])).map((m) => m.id);
  const ok = installed.includes(id);
  modelStatus.textContent = ok
    ? `Đã cài: ${id} — inference offline.`
    : `Chưa cài ${id}. Bấm "Cài đặt" một lần (tải từ CDN, kiểm tra SHA-256).`;
  $('#install').disabled = ok;
}

function renderInstances() {
  const box = $('#instances');
  box.innerHTML = '';
  instances.forEach((inst, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = `Người ${i + 1} (${Math.round(inst.confidence * 100)}%)`;
    btn.addEventListener('click', () => {
      activeMask = { width: inst.mask.width, height: inst.mask.height, data: new Float32Array(inst.mask.data) };
      mask = activeMask;
      pushHistory();
      render();
      log(`Đang chỉnh mask: Người ${i + 1}`);
    });
    box.appendChild(btn);
  });
}

// --- sample / file ---
document.querySelectorAll('[data-sample]').forEach((btn) => {
  btn.addEventListener('click', () => loadImage(btn.dataset.sample).catch((e) => log(errorText(e))));
});
$('#file').addEventListener('change', (event) => {
  const file = event.target.files?.[0];
  if (file) loadImage(file).catch((e) => log(errorText(e)));
});

// --- install ---
$('#install').addEventListener('click', async () => {
  const engine = await ensureAI();
  const id = $('#model').value;
  const progress = $('#install-progress');
  progress.hidden = false;
  progress.value = 0;
  log(`Đang cài ${id}… (tải 1 lần, kiểm tra SHA-256)`);
  try {
    const model = await engine.installModel(id, '', undefined);
    progress.value = 100;
    log(`Đã cài ${model.id} ${model.bytes} bytes, sha256 ${model.sha256.slice(0, 16)}…`);
  } catch (err) {
    log(`Cài ${id} thất bại: ${errorText(err)}`);
  } finally {
    progress.hidden = true;
    refreshModelStatus();
  }
});

// --- run ---
$('#run').addEventListener('click', async () => {
  if (!source) {
    log('Chưa có ảnh.');
    return;
  }
  const engine = await ensureAI();
  const id = $('#model').value;
  aborter = new AbortController();
  log(`Đang chạy ${id}…`);
  try {
    const result =
      id === 'modnet-fp16'
        ? await engine.mattePerson(source, { signal: aborter.signal, refineEdges: true })
        : await engine.removeBackground(source, { signal: aborter.signal, refineEdges: true });
    if (!result.success) {
      log(`Chưa chạy được (${result.error?.code}): ${result.error?.message}`);
      runMeta.textContent = '';
      return;
    }
    activeMask = { width: result.masks[0].width, height: result.masks[0].height, data: new Float32Array(result.masks[0].data) };
    mask = activeMask;
    pushHistory();
    render();
    const m = result.metadata;
    runMeta.textContent =
      `${m.modelId} · ${m.backend} · input ${m.inputResolution[0]}×${m.inputResolution[1]} · ` +
      `${m.inferenceTime.toFixed(0)} ms · mask ${mask.width}×${mask.height}`;
    log(`Xong: ${m.inferenceTime.toFixed(0)} ms. Chỉnh cọ trực tiếp trên preview.`);
  } catch (err) {
    log(`Lỗi: ${errorText(err)}`);
  }
});

$('#abort').addEventListener('click', () => {
  aborter?.abort();
  log('Đã huỷ.');
});

$('#people').addEventListener('click', async () => {
  if (!source) {
    log('Chưa có ảnh. (Tìm người cần cấu hình MediaPipe selfie — xem docs.)');
    return;
  }
  const engine = await ensureAI();
  log('Tìm từng người…');
  try {
    const result = await engine.segmentPeople(source, { minArea: 256 });
    if (!result.success) {
      log(`Chưa có instance (${result.error?.code}): ${result.error?.message}`);
      return;
    }
    instances = result.instances;
    renderInstances();
    runMeta.textContent = `Phát hiện ${instances.length} người · ${result.metadata.inferenceTime.toFixed(0)} ms`;
    log(`${instances.length} người. Bấm nút từng người để chọn mask.`);
    if (instances[0]) {
      activeMask = { width: instances[0].mask.width, height: instances[0].mask.height, data: new Float32Array(instances[0].mask.data) };
      mask = activeMask;
      pushHistory();
      render();
    }
  } catch (err) {
    log(`Lỗi: ${errorText(err)}`);
  }
});

// --- mask tools ---
$('#tool-add').addEventListener('click', () => {
  tool = 'add';
  $('#tool-add').setAttribute('aria-pressed', 'true');
  $('#tool-erase').setAttribute('aria-pressed', 'false');
});
$('#tool-erase').addEventListener('click', () => {
  tool = 'erase';
  $('#tool-erase').setAttribute('aria-pressed', 'true');
  $('#tool-add').setAttribute('aria-pressed', 'false');
});
$('#brush').addEventListener('input', (e) => ($('#brush-val').textContent = e.target.value));
$('#feather').addEventListener('input', (e) => ($('#feather-val').textContent = e.target.value));
$('#expand').addEventListener('input', (e) => ($('#expand-val').textContent = e.target.value));

function applyStyled() {
  if (!activeMask) return;
  const feather = Number($('#feather').value);
  const expand = Number($('#expand').value);
  let next = activeMask;
  if (expand !== 0) next = morphMask(next, Math.abs(expand), expand > 0 ? 'expand' : 'contract');
  if (feather !== 0) next = featherMask(next, feather);
  mask = next;
  pushHistory();
  render();
}
$('#feather').addEventListener('change', applyStyled);
$('#expand').addEventListener('change', applyStyled);

$('#invert').addEventListener('click', () => {
  if (!activeMask) return;
  mask = invertMask(activeMask);
  activeMask = mask;
  pushHistory();
  render();
});
$('#undo').addEventListener('click', () => applyHistory(historyIndex - 1));
$('#redo').addEventListener('click', () => applyHistory(historyIndex + 1));
$('#check-toggle').addEventListener('click', (e) => {
  checker = !checker;
  e.currentTarget.textContent = `Nền caro: ${checker ? 'bật' : 'tắt'}`;
  e.currentTarget.setAttribute('aria-pressed', String(checker));
  render();
});

// Brush painting on preview canvas
let painting = false;
let strokeStarted = false;
preview.addEventListener('pointerdown', (event) => {
  if (!activeMask) return;
  painting = true;
  strokeStarted = false;
  preview.setPointerCapture(event.pointerId);
});
preview.addEventListener('pointermove', (event) => {
  if (!painting || !activeMask) return;
  const brush = Number($('#brush').value);
  const rect = preview.getBoundingClientRect();
  const fx = (event.clientX - rect.left) / rect.width;
  const fy = (event.clientY - rect.top) / rect.height;
  const mx = fx * activeMask.width;
  const my = fy * activeMask.height;
  const radius = ((brush / rect.width) / 2) * activeMask.width;
  if (!strokeStarted) {
    // Snapshot for undo before the stroke mutates the mask.
    history = history.slice(0, historyIndex + 1);
    history.push(mask ? { ...mask, data: new Float32Array(mask.data) } : null);
    strokeStarted = true;
  }
  const next = brushDab(activeMask, mx, my, Math.max(1, radius), 0.35, tool === 'add' ? 'add' : 'subtract');
  activeMask = next;
  mask = next;
  history[history.length - 1] = { ...mask, data: new Float32Array(mask.data) };
  historyIndex = history.length - 1;
  render();
});
preview.addEventListener('pointerup', () => {
  if (painting) updateUndoButtons();
  painting = false;
});

// --- export ---
$('#export').addEventListener('click', async () => {
  if (!source || !mask) {
    log('Chưa có mask để xuất.');
    return;
  }
  log('Đang xuất PNG độ phân giải gốc…');
  try {
    const blob = await compositeTransparentPNG(source, mask);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aurum-ai.png';
    a.click();
    log(`Đã xuất ${sourceW}×${sourceH} · ${(blob.size / 1024).toFixed(0)} KB`);
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  } catch (err) {
    log(`Xuất thất bại: ${errorText(err)}`);
  }
});

// --- boot: image first (engine probe must not block painting) ---
log('Panel AI sẵn sàng. Chọn ảnh mẫu hoặc tải ảnh lên.');
loadImage(new URL('../test-assets/portrait.jpg', location.href).href)
  .then(() => refreshModelStatus())
  .catch((e) => log(`Nạp ảnh thất bại: ${errorText(e)}`));
ensureAI().catch((e) => log(`Tạo engine thất bại: ${errorText(e)}`));
