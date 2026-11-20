import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// core/app.js 与适配器是两套宿主实现。下面这些纯工具函数是逐字复制的，
// 任何一边改动都必须同步，否则两边的日期、文案和清筛选行为会悄悄分叉。
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const SHARED = ['clearFilters', 'dayDiff', 'formatDate', 'formatDateISO', 'metaChip', 'pad'];

function read(path) {
  return readFileSync(join(ROOT, path), 'utf8');
}

function functionBody(source, name) {
  const startRe = new RegExp(
    '^([ \\t]*)(?:async )?function ' + name + '\\s*\\(',
    'm'
  );
  const match = startRe.exec(source);
  if (!match) return '';
  const start = match.index;
  const indent = match[1];
  const end = source.indexOf('\n' + indent + '}', start);
  if (end < 0) return '';
  return source
    .slice(start, end + indent.length + 2)
    .replace(/\s+/g, ' ')
    .trim();
}

const core = read('core/app.js');
const adapter = read('adapters/openchamber/src/panel/main.js');
const problems = [];

for (const name of SHARED) {
  const a = functionBody(core, name);
  const b = functionBody(adapter, name);
  if (!a || !b) {
    problems.push(`${name}: ${!a ? 'core ' : ''}${!b ? 'adapter ' : ''}缺少这个函数`);
    continue;
  }
  if (a !== b) problems.push(`${name}: 两份实现已经不一致`);
}

if (problems.length) {
  console.error('check:parity 失败：');
  for (const item of problems) console.error('- ' + item);
  console.error('这些函数被 core 和 OpenChamber 适配器共用，改一边必须同步另一边。');
  process.exit(1);
}

console.log(`check:parity 通过：${SHARED.length} 个共享工具函数一致。`);