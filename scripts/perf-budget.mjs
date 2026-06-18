import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { brotliCompressSync, constants, gzipSync } from 'node:zlib';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const budgets = [
  {
    file: 'ui/usuzumi.min.css',
    raw: 220_000,
    gzip: 42_000,
    brotli: 30_000
  },
  {
    file: 'ui/usuzumi.min.js',
    raw: 320_000,
    gzip: 95_000,
    brotli: 72_000
  },
  {
    file: 'ui/usuzumi-core.min.js',
    raw: 150_000,
    gzip: 45_000,
    brotli: 32_000
  },
  {
    file: 'ui/usuzumi-highlight.min.js',
    raw: 220_000,
    gzip: 75_000,
    brotli: 55_000
  }
];

function compressedSizes(buffer) {
  return {
    raw: buffer.length,
    gzip: gzipSync(buffer, { level: 9 }).length,
    brotli: brotliCompressSync(buffer, {
      params: {
        [constants.BROTLI_PARAM_QUALITY]: 11
      }
    }).length
  };
}

function formatBytes(value) {
  return `${(value / 1024).toFixed(1)} KiB`;
}

const failures = [];

for (const budget of budgets) {
  const filePath = path.join(root, budget.file);
  if (!existsSync(filePath)) {
    failures.push(`${budget.file}: missing generated asset`);
    continue;
  }

  const sizes = compressedSizes(readFileSync(filePath));
  const summary = [
    `raw ${formatBytes(sizes.raw)}/${formatBytes(budget.raw)}`,
    `gzip ${formatBytes(sizes.gzip)}/${formatBytes(budget.gzip)}`,
    `brotli ${formatBytes(sizes.brotli)}/${formatBytes(budget.brotli)}`
  ].join(', ');
  console.log(`${budget.file}: ${summary}`);

  for (const key of ['raw', 'gzip', 'brotli']) {
    if (sizes[key] > budget[key]) {
      failures.push(`${budget.file}: ${key} ${formatBytes(sizes[key])} exceeds ${formatBytes(budget[key])}`);
    }
  }
}

if (failures.length) {
  console.error(`Performance budget failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Performance budgets passed.');
