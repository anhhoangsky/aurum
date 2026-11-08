import { AurumEditor, registerAIAdapter } from '../dist/aurum.esm.js';
import {
  createRealESRGANFactory,
  planRealESRGAN,
  probeAIClient,
} from '../dist/aurum-ai.esm.js';

const result = document.querySelector('#result');
const resultImage = document.querySelector('#result-img');
const resultMeta = document.querySelector('#result-meta');
const resultLink = document.querySelector('#result-download');
const resultClose = document.querySelector('#result-close');

let resultUrl = '';

function showResult(blob, name) {
  if (resultUrl) URL.revokeObjectURL(resultUrl);
  resultUrl = URL.createObjectURL(blob);
  resultImage.src = resultUrl;
  resultLink.href = resultUrl;
  resultLink.download = name;
  const kb = blob.size < 1024 * 1024 ? `${(blob.size / 1024).toFixed(0)} KB` : `${(blob.size / 1048576).toFixed(2)} MB`;
  resultImage.onload = () => {
    resultMeta.textContent = `${name} · ${resultImage.naturalWidth} × ${resultImage.naturalHeight} px · ${kb}`;
  };
  result.hidden = false;
  resultClose.focus();
}

function hideResult() {
  result.hidden = true;
  resultImage.removeAttribute('src');
  if (resultUrl) {
    URL.revokeObjectURL(resultUrl);
    resultUrl = '';
  }
}

resultClose.addEventListener('click', hideResult);
result.addEventListener('click', (event) => {
  if (event.target === result) hideResult();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !result.hidden) hideResult();
});

const editor = new AurumEditor({
  container: '#editor',
  image: './sample-landscape.jpg',
  fileName: 'aurum-demo',
  locale: 'vi',
  startTab: 'crop',
  onSave: showResult,
  aiAction: {
    label: 'AI 4×',
    title: 'Phóng to và làm nét bằng AI (Real-ESRGAN)',
    async run(editor, { signal, report }) {
      report(-1, 'Đang kiểm tra thiết bị…');
      const profile = await probeAIClient();
      const size = editor.source();
      const plan = planRealESRGAN({ width: size.width, height: size.height, profile });
      report(
        -1,
        plan.downscaled
          ? `Ảnh lớn: thu về ${plan.inputWidth}×${plan.inputHeight} trước khi xử lý`
          : `${plan.tileCount} vùng · tile ${plan.tileSize}px · ${plan.backend.toUpperCase()}`,
      );
      const factory = createRealESRGANFactory({
        modelUrl: new URL('../dist/ai/realesr-general-x4v3.onnx', location.href).href,
        runtime: {
          webgpu: new URL('../dist/ai/ort.webgpu.bundle.min.mjs', location.href).href,
          wasm: new URL('../dist/ai/ort.wasm.bundle.min.mjs', location.href).href,
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
        maxInputPixels: plan.maxInputPixels,
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
    },
  },
});

window.aurum = editor;

const samples = {
  landscape: './sample-landscape.jpg',
  portrait: './sample-portrait.jpg',
};

document.querySelectorAll('[data-sample]').forEach((button) => {
  button.addEventListener('click', () => {
    const source = samples[button.dataset.sample];
    if (!source) return;
    editor.load(source).catch(() => {});
  });
});
