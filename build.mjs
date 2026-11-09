import { build, transform } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildShaderAssets } from './scripts/build-shaders.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
process.chdir(root);

buildShaderAssets();

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const target = 50 * 1024;
const banner = `/*! ${pkg.name} v${pkg.version} | MIT | headless core + optional iOS dark/gold UI */`;

const shared = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  target: ['es2020'],
  charset: 'utf8',
  legalComments: 'none',
  loader: { '.css': 'text' },
  banner: { js: banner },
  define: { __AURUM_VERSION__: JSON.stringify(pkg.version) },
  logLevel: 'warning',
};

mkdirSync('dist/types', { recursive: true });

console.log(`\nBuilding ${pkg.name} v${pkg.version}...`);
await Promise.all([
  build({ ...shared, format: 'esm', minify: true, outfile: 'dist/aurum.esm.js' }),
  build({ ...shared, format: 'cjs', minify: true, outfile: 'dist/aurum.cjs' }),
  build({
    ...shared,
    format: 'iife',
    globalName: 'Aurum',
    minify: true,
    outfile: 'dist/aurum.min.js',
  }),
  build({
    ...shared,
    entryPoints: ['src/ai/index.ts'],
    banner: {
      js: `/*! ${pkg.name} AI v${pkg.version} | Real-ESRGAN adapter | optional, loads ORT at runtime */`,
    },
    format: 'esm',
    minify: true,
    outfile: 'dist/aurum-ai.esm.js',
  }),
  build({
    ...shared,
    entryPoints: ['src/ai-engine/index.ts'],
    banner: {
      js: `/*! ${pkg.name} AI Engine v${pkg.version} | independent segmentation subsystem | offline-first, loads ORT at runtime */`,
    },
    format: 'esm',
    minify: true,
    outfile: 'dist/aurum-ai-engine.esm.js',
  }),
  build({
    ...shared,
    entryPoints: ['src/ai-retouch/index.ts'],
    banner: {
      js: `/*! ${pkg.name} AI Retouch v${pkg.version} | independent skin retouch subsystem | offline-first, loads ORT at runtime */`,
    },
    format: 'esm',
    minify: true,
    outfile: 'dist/aurum-ai-retouch.esm.js',
  }),
  build({
    ...shared,
    entryPoints: ['src/beauty/index.ts'],
    banner: {
      js: `/*! ${pkg.name} Beauty v${pkg.version} | optional CPU skin/feature mask | ${pkg.license} */`,
    },
    format: 'esm',
    minify: true,
    outfile: 'dist/aurum-beauty.esm.js',
  }),
  build({
    ...shared,
    entryPoints: ['src/landmarks/index.ts'],
    banner: {
      js: `/*! ${pkg.name} Landmarks v${pkg.version} | optional MediaPipe face anchors | ${pkg.license} */`,
    },
    format: 'esm',
    minify: true,
    outfile: 'dist/aurum-landmarks.esm.js',
  }),
]);

// The AI runtime is deliberately not bundled. Copy the two self-contained ORT
// bundles, their WASM/glue files, and the model next to the AI entry point.
const aiDir = 'dist/ai';
mkdirSync(aiDir, { recursive: true });
const ortDir = 'node_modules/onnxruntime-web/dist';
const ortFiles = [
  'ort.webgpu.bundle.min.mjs',
  'ort.wasm.bundle.min.mjs',
  'ort-wasm-simd-threaded.asyncify.mjs',
  'ort-wasm-simd-threaded.asyncify.wasm',
  'ort-wasm-simd-threaded.mjs',
  'ort-wasm-simd-threaded.wasm',
];
for (const file of ortFiles) {
  const from = path.join(ortDir, file);
  if (existsSync(from)) copyFileSync(from, path.join(aiDir, file));
}
const modelFiles = ['realesr-general-x4v3.onnx', 'Real-ESRGAN-x4plus.onnx'];
for (const name of modelFiles) {
  const candidates = [
    path.join('..', 'mng-cloud-work', 'assets', 'ai', name),
    path.join('assets', 'ai', name),
  ];
  const model = candidates.find((file) => existsSync(file));
  if (model) {
    copyFileSync(model, path.join(aiDir, name));
    console.log(`AI model: ${model} -> ${aiDir}/${name}`);
  } else {
    console.warn(`AI model ${name} not found; that quality option will be unavailable.`);
  }
}

const cssSource = readFileSync('src/ui/styles.css', 'utf8');
const css = await transform(cssSource, { loader: 'css', minify: true });
writeFileSync('dist/aurum.css', `${banner}\n${css.code}`);

console.log('Generating declarations...');
execFileSync(
  process.execPath,
  ['node_modules/typescript/bin/tsc', '-p', 'tsconfig.json'],
  { stdio: 'inherit' },
);

const kb = (bytes) => `${(bytes / 1024).toFixed(1).padStart(6)} KB`;
const files = [
  'dist/aurum.esm.js',
  'dist/aurum.cjs',
  'dist/aurum.min.js',
  'dist/aurum-ai.esm.js',
  'dist/aurum-ai-engine.esm.js',
  'dist/aurum-ai-retouch.esm.js',
  'dist/aurum-beauty.esm.js',
  'dist/aurum-landmarks.esm.js',
  'dist/aurum.css',
];
let over = false;
console.log('\nFile sizes');
for (const file of files) {
  const raw = statSync(file).size;
  const gzip = gzipSync(readFileSync(file)).length;
  console.log(`  ${file.padEnd(22)} ${kb(raw)} raw  ${kb(gzip)} gzip`);
  if (file.endsWith('.js') && gzip > target) over = true;
}
console.log(
  `\nBundle size target: < 50.0 KB gzip (advisory) — ${over ? 'over target, build still proceeds' : 'within target'}\n`,
);
