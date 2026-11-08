// Copy the host-facing build outputs from dist/ to assets/ so editor.html
// serves the exact files produced by `npm run build`. Run after a build.
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const files = [
  'aurum.esm.js',
  'aurum-ai.esm.js',
  'aurum-ai-engine.esm.js',
  'aurum-beauty.esm.js',
  'aurum-landmarks.esm.js',
  'aurum.css',
];

mkdirSync(path.join(root, 'assets'), { recursive: true });
for (const file of files) {
  const from = path.join(root, 'dist', file);
  if (!existsSync(from)) {
    console.warn(`skip ${file}: not found in dist/ (run npm run build first)`);
    continue;
  }
  copyFileSync(from, path.join(root, 'assets', file));
  console.log(`assets/${file}`);
}
