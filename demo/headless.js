import { createCore } from '../dist/aurum.esm.js';

const stage = document.querySelector('#stage');
const stateEl = document.querySelector('#state');
const sourceEl = document.querySelector('#source');
const outputEl = document.querySelector('#output');
const statusEl = document.querySelector('#status');
const resultEl = document.querySelector('#result');
const resultImg = document.querySelector('#result-img');
const resultLink = document.querySelector('#result-link');
const dropEl = document.querySelector('#drop');

const core = createCore({
  container: stage,
  image: './sample-landscape.jpg',
  background: '#0b0b0e',
});

let resultUrl = '';
let busy = false;

function say(message, error = false) {
  statusEl.textContent = message;
  statusEl.style.color = error ? '#ff8b8b' : '#f3c77b';
}

function refresh() {
  stateEl.textContent = JSON.stringify(core.getState(), null, 2);
  const size = core.getExportSize();
  outputEl.textContent = core.isReady && size.width ? `${size.width} × ${size.height} px` : '—';
}

function showResult(blob, name) {
  if (resultUrl) URL.revokeObjectURL(resultUrl);
  resultUrl = URL.createObjectURL(blob);
  resultImg.src = resultUrl;
  resultLink.href = resultUrl;
  resultLink.download = name;
  resultEl.classList.add('is-open');
}

core.on('ready', ({ width, height }) => {
  sourceEl.textContent = `${width} × ${height} px`;
  refresh();
  say('Ready — drag the image, pinch or use the wheel to zoom.');
});

core.on('change', refresh);

core.on('error', ({ error }) => {
  say(error.message || 'Something went wrong.', true);
});

core.on('export', ({ blob }) => {
  say(`Exported ${(blob.size / 1024).toFixed(0)} KB.`);
});

document.querySelectorAll('[data-act]').forEach((button) => {
  button.addEventListener('click', async () => {
    const action = button.dataset.act;
    if (!core.isReady || busy) return;
    busy = true;
    try {
      if (action === 'square') core.setAspect('1:1');
      if (action === 'wide') core.setAspect('16:9');
      if (action === 'rotate') core.rotateBy(90);
      if (action === 'flip') core.flip('h');
      if (action === 'vivid') core.setFilter('vivid');
      if (action === 'reset') core.reset();
      if (action === 'export') {
        const size = core.getExportSize();
        const blob = await core.export({ type: 'image/png' });
        showResult(blob, `aurum-headless-${size.width}x${size.height}.png`);
      }
      refresh();
    } catch (error) {
      say(error instanceof Error ? error.message : String(error), true);
    } finally {
      busy = false;
    }
  });
});

const picker = document.createElement('input');
picker.type = 'file';
picker.accept = 'image/*';
picker.hidden = true;
picker.addEventListener('change', () => {
  const file = picker.files?.[0];
  picker.value = '';
  if (file) open(file);
});
document.body.appendChild(picker);
dropEl.addEventListener('click', () => picker.click());

function open(source) {
  resultEl.classList.remove('is-open');
  core.load(source).catch(() => undefined);
}

for (const eventName of ['dragenter', 'dragover']) {
  stage.addEventListener(eventName, (event) => {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
  });
}

stage.addEventListener('drop', (event) => {
  event.preventDefault();
  const file = event.dataTransfer?.files?.[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    say('That file is not an image.', true);
    return;
  }
  open(file);
});
