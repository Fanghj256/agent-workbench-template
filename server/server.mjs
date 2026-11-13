#!/usr/bin/env node
/*
 * Agent Workbench Template — zero-dependency server.
 *
 *   node server/server.mjs
 *   PORT=9000 node server/server.mjs
 *   WORKBENCH_CORS=1 node server/server.mjs   # only for a separate adapter origin
 *
 * Serves core/ as static files and workbench/ through a small JSON API.
 * Binds to 127.0.0.1 by default. There is no authentication: do not expose it
 * to a network you do not control.
 */

import http from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const CORE_DIR = path.join(ROOT, 'core');
const WORKBENCH_DIR = path.join(ROOT, 'workbench');

const CONFIG_PATH = path.join(WORKBENCH_DIR, 'config.json');
const INDEX_PATH = path.join(WORKBENCH_DIR, 'index.json');
const ANNOTATIONS_PATH = path.join(WORKBENCH_DIR, 'annotations.json');
const REPORTS_PATH = path.join(WORKBENCH_DIR, 'reports.json');

const MAX_BODY_BYTES = 1024 * 1024;
const ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$/;
const BLOCKED_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8'
};

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

function fail(status, message) {
  return new HttpError(status, message);
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

async function readJson(file) {
  const text = await fs.readFile(file, 'utf8');
  return JSON.parse(text.replace(/^\uFEFF/, ''));
}

function baseHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    // frame-ancestors is intentionally omitted: an adapter may embed the panel.
    'Content-Security-Policy': [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "img-src 'self' data: https:",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self'",
      "connect-src 'self'",
      "form-action 'none'"
    ].join('; ')
  };
}

function setCors(res) {
  if (process.env.WORKBENCH_CORS !== '1') return;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    ...baseHeaders(),
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
    'Cache-Control': 'no-store'
  });
  res.end(payload);
}

function sendText(res, status, text) {
  const payload = String(text);
  res.writeHead(status, {
    ...baseHeaders(),
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
    'Cache-Control': 'no-store'
  });
  res.end(payload);
}

function methodNotAllowed(res, allow) {
  res.setHeader('Allow', allow.join(', '));
  sendJson(res, 405, {
    error: 'method_not_allowed',
    message: '该接口只支持 ' + allow.join(' / ') + '。'
  });
}

async function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    let tooLarge = false;

    req.on('data', (chunk) => {
      if (tooLarge) return;
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        tooLarge = true;
        reject(fail(413, '请求体超过 1 MB 限制。'));
        return;
      }
      chunks.push(chunk);
    });

    req.on('end', () => {
      if (!tooLarge) resolve(Buffer.concat(chunks).toString('utf8'));
    });

    req.on('error', (error) => {
      if (!tooLarge) reject(error);
    });
  });
}

function readText(value, field, maxLength) {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string') {
    throw fail(400, field + ' 必须是字符串。');
  }
  if (value.length > maxLength) {
    throw fail(400, field + ' 超过 ' + maxLength + ' 个字符。');
  }
  return value;
}

function normalizeAnnotations(input) {
  if (!isPlainObject(input)) {
    throw fail(400, '请求体必须是 JSON 对象。');
  }
  if (!isPlainObject(input.items)) {
    throw fail(400, 'items 必须是以条目 id 为键的对象。');
  }

  const entries = Object.entries(input.items);
  if (entries.length > 2000) {
    throw fail(400, '批注条目数量超过 2000 条限制。');
  }

  const now = new Date().toISOString();
  const items = {};

  for (const [id, value] of entries) {
    if (!ID_PATTERN.test(id) || BLOCKED_KEYS.has(id)) {
      throw fail(400, '非法条目 id：' + id);
    }
    if (!isPlainObject(value)) {
      throw fail(400, '条目 ' + id + ' 的批注必须是对象。');
    }

    items[id] = {
      summary: readText(value.summary, 'summary', 20000),
      judgment: readText(value.judgment, 'judgment', 20000),
      status: readText(value.status, 'status', 80),
      updated_at: readText(value.updated_at, 'updated_at', 80) || now
    };
  }

  return {
    schema: 'workbench-annotations/v1',
    updated_at: now,
    items
  };
}

let writeQueue = Promise.resolve();

function queueWrite(task) {
  const next = writeQueue.then(task, task);
  writeQueue = next.catch(() => undefined);
  return next;
}

async function writeAnnotations(payload) {
  const json = JSON.stringify(payload, null, 2) + '\n';
  const tmp = path.join(
    WORKBENCH_DIR,
    '.annotations.' + process.pid + '.' + Date.now() + '.tmp'
  );

  await fs.writeFile(tmp, json, 'utf8');

  try {
    await fs.copyFile(ANNOTATIONS_PATH, ANNOTATIONS_PATH + '.bak');
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn('[workbench] could not write annotations backup:', error.message);
    }
  }

  await fs.rename(tmp, ANNOTATIONS_PATH);
}

async function handleAnnotations(req, res) {
  if (req.method === 'GET') {
    try {
      const data = await readJson(ANNOTATIONS_PATH);
      sendJson(res, 200, data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        sendJson(res, 200, {
          schema: 'workbench-annotations/v1',
          updated_at: '',
          items: {}
        });
        return;
      }
      throw error;
    }
    return;
  }

  if (req.method === 'PUT') {
    const contentType = String(req.headers['content-type'] || '').toLowerCase();
    if (!contentType.startsWith('application/json')) {
      throw fail(415, 'PUT /api/annotations 需要 Content-Type: application/json。');
    }

    const raw = await readBody(req);
    let input;
    try {
      input = JSON.parse(raw.replace(/^\uFEFF/, ''));
    } catch {
      throw fail(400, '请求体不是合法 JSON。');
    }

    const normalized = normalizeAnnotations(input);
    await queueWrite(() => writeAnnotations(normalized));

    sendJson(res, 200, {
      ok: true,
      updated_at: normalized.updated_at,
      count: Object.keys(normalized.items).length
    });
    return;
  }

  methodNotAllowed(res, ['GET', 'PUT']);
}

async function handleItem(req, res, rawId) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    methodNotAllowed(res, ['GET', 'HEAD']);
    return;
  }

  let id;
  try {
    id = decodeURIComponent(rawId);
  } catch {
    throw fail(400, '条目 id 编码不正确。');
  }

  if (!ID_PATTERN.test(id)) {
    throw fail(400, '条目 id 格式不正确。');
  }

  const index = await readJson(INDEX_PATH);
  const items = Array.isArray(index.items) ? index.items : [];
  const item = items.find((candidate) => candidate && candidate.id === id);

  if (!item) {
    throw fail(404, '没有找到条目 ' + id + '。');
  }

  const contentPath = item.content_path || 'items/' + id + '/content.md';
  const absolute = path.resolve(WORKBENCH_DIR, contentPath);
  if (absolute !== WORKBENCH_DIR && !absolute.startsWith(WORKBENCH_DIR + path.sep)) {
    throw fail(400, 'content_path 必须位于 workbench/ 目录内。');
  }

  let content;
  try {
    content = (await fs.readFile(absolute, 'utf8')).replace(/^\uFEFF/, '');
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw fail(404, '条目 ' + id + ' 的 content.md 不存在。');
    }
    throw error;
  }

  sendJson(res, 200, { item, content });
}

async function handleApi(req, res, pathname) {
  if (pathname === '/api/config') {
    if (req.method !== 'GET' && req.method !== 'HEAD') return methodNotAllowed(res, ['GET', 'HEAD']);
    sendJson(res, 200, await readJson(CONFIG_PATH));
    return;
  }

  if (pathname === '/api/index') {
    if (req.method !== 'GET' && req.method !== 'HEAD') return methodNotAllowed(res, ['GET', 'HEAD']);
    sendJson(res, 200, await readJson(INDEX_PATH));
    return;
  }

  if (pathname === '/api/reports') {
    if (req.method !== 'GET' && req.method !== 'HEAD') return methodNotAllowed(res, ['GET', 'HEAD']);
    try {
      sendJson(res, 200, await readJson(REPORTS_PATH));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      sendJson(res, 200, {
        schema: 'workbench-reports/v1',
        generated_at: '',
        reports: []
      });
    }
    return;
  }

  if (pathname === '/api/annotations') {
    await handleAnnotations(req, res);
    return;
  }

  if (pathname.startsWith('/api/item/')) {
    await handleItem(req, res, pathname.slice('/api/item/'.length));
    return;
  }

  sendJson(res, 404, {
    error: 'not_found',
    message: '没有这个 API。可用接口：/api/config、/api/index、/api/annotations、/api/item/:id、/api/reports。'
  });
}

function resolveStaticPath(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    throw fail(400, '路径编码不正确。');
  }

  if (decoded.includes('\0') || decoded.includes('\\')) {
    throw fail(404, 'Not found');
  }

  let relative = decoded.replace(/^\/+/, '');
  if (!relative) relative = 'index.html';
  if (relative.endsWith('/')) relative += 'index.html';

  const segments = relative.split('/');
  if (segments.some((segment) => !segment || segment === '.' || segment === '..' || segment.startsWith('.'))) {
    throw fail(404, 'Not found');
  }

  const absolute = path.resolve(CORE_DIR, relative);
  if (absolute !== CORE_DIR && !absolute.startsWith(CORE_DIR + path.sep)) {
    throw fail(404, 'Not found');
  }

  return absolute;
}

async function serveStatic(req, res, pathname) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    methodNotAllowed(res, ['GET', 'HEAD']);
    return;
  }

  let absolute = resolveStaticPath(pathname);
  let stats;

  try {
    stats = await fs.stat(absolute);
    if (stats.isDirectory()) {
      absolute = path.join(absolute, 'index.html');
      stats = await fs.stat(absolute);
    }
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw fail(404, 'Not found');
  }

  if (!stats.isFile()) {
    throw fail(404, 'Not found');
  }

  const data = await fs.readFile(absolute);
  const extension = path.extname(absolute).toLowerCase();
  const type = MIME_TYPES[extension] || 'application/octet-stream';

  res.writeHead(200, {
    ...baseHeaders(),
    'Content-Type': type,
    'Content-Length': data.length,
    'Cache-Control': 'no-cache'
  });

  if (req.method === 'HEAD') {
    res.end();
    return;
  }

  res.end(data);
}

async function resolvePort() {
  const fromEnv = Number.parseInt(process.env.PORT || '', 10);
  if (Number.isInteger(fromEnv) && fromEnv > 0 && fromEnv < 65536) return fromEnv;

  try {
    const config = await readJson(CONFIG_PATH);
    const fromConfig = Number(config.port);
    if (Number.isInteger(fromConfig) && fromConfig > 0 && fromConfig < 65536) {
      return fromConfig;
    }
  } catch {
    // Fall through to the default.
  }

  return 8787;
}

const HOST = process.env.HOST || '127.0.0.1';
const PORT = await resolvePort();

const server = http.createServer(async (req, res) => {
  setCors(res);

  if (req.method === 'OPTIONS' && process.env.WORKBENCH_CORS === '1') {
    res.writeHead(204, {
      ...baseHeaders(),
      'Access-Control-Max-Age': '600'
    });
    res.end();
    return;
  }

  try {
    const url = new URL(req.url || '/', 'http://' + (req.headers.host || '127.0.0.1'));
    const pathname = url.pathname;

    if (pathname === '/api' || pathname.startsWith('/api/')) {
      await handleApi(req, res, pathname);
      return;
    }

    await serveStatic(req, res, pathname);
  } catch (error) {
    if (res.headersSent) {
      res.destroy();
      return;
    }

    if (error instanceof HttpError) {
      sendJson(res, error.status, {
        error: error.status === 404 ? 'not_found' : 'request_error',
        message: error.message
      });
      return;
    }

    console.error('[workbench] request failed:', error);
    sendJson(res, 500, {
      error: 'internal_error',
      message: '服务器内部错误。请查看终端日志。'
    });
  }
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error('[workbench] port ' + PORT + ' is already in use. Set PORT to another value.');
  } else {
    console.error('[workbench] server error:', error);
  }
  process.exitCode = 1;
});

server.listen(PORT, HOST, () => {
  console.log('');
  console.log('Agent Workbench Template');
  console.log('  http://' + HOST + ':' + PORT);
  console.log('  data: workbench/ (index.json, annotations.json, reports.json, items/)');
  console.log('  stop: Ctrl+C');
  console.log('');
});

process.on('SIGINT', () => {
  console.log('\nStopping…');
  server.close(() => process.exit(0));
});

