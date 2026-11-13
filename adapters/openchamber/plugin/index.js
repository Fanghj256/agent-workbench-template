import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const libraryRoot = join(here, '..', '..', '..', 'workbench');
const indexPath = join(libraryRoot, 'index.json');
const reportsPath = join(libraryRoot, 'reports.json');
const annotationsPath = join(libraryRoot, 'annotations.json');
const notesDir = join(libraryRoot, '_notes');
const dataPath = join(here, '..', 'data', 'notes.json');

const PLUGIN_ID = 'agent-workbench-openchamber';

async function readJson(path, fallback) {
  try {
    const text = await readFile(path, 'utf8');
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

async function writeJson(path, value) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

async function loadIndex() {
  const data = await readJson(indexPath, { items: [] });
  return {
    items: Array.isArray(data.items) ? data.items : [],
    generated_at: data.generated_at || '',
  };
}

async function loadReports() {
  const data = await readJson(reportsPath, { reports: [] });
  return Array.isArray(data.reports) ? data.reports : [];
}

async function loadAnnotations() {
  const data = await readJson(annotationsPath, { items: {} });
  const items = data && data.items && typeof data.items === 'object' && !Array.isArray(data.items) ? data.items : {};
  const out = {};
  for (const [id, value] of Object.entries(items)) {
    if (!value || typeof value !== 'object') continue;
    out[id] = {
      summary: typeof value.summary === 'string' ? value.summary : '',
      judgment: typeof value.judgment === 'string' ? value.judgment : '',
      status: typeof value.status === 'string' ? value.status : '',
      updated_at: typeof value.updated_at === 'string' ? value.updated_at : '',
    };
  }
  return out;
}

async function loadNotes() {
  const data = await readJson(dataPath, { notes: [] });
  return { notes: Array.isArray(data.notes) ? data.notes : [] };
}

function itemDoc(item) {
  return {
    doc_id: String(item.id),
    title: item.title || '',
    level: item.level || '',
    type: item.kind || '',
    publish_date: item.published_at || '',
    deadline: item.deadline || '',
    issuer: item.issuer || '',
    doc_number: item.doc_number || '',
    status: item.status || '',
    priority: Number(item.priority) || 0,
    themes: Array.isArray(item.themes) ? item.themes : [],
    summary: item.summary || '',
    source_url: item.source_url || '',
    original_path: item.original_path || '',
    path: item.content_path || '',
    content: '',
    period: '',
    subtype: '',
    is_report: false,
  };
}

function reportDoc(report) {
  return {
    doc_id: String(report.id),
    title: report.title || '',
    level: '报告',
    type: '报告',
    publish_date: report.date || '',
    deadline: '',
    issuer: report.issuer || '',
    doc_number: '',
    status: report.status === 'draft' ? '草稿' : (report.status || '已发布'),
    priority: 0,
    themes: [],
    summary: report.summary || '',
    source_url: report.source_url || '',
    original_path: report.original_path || '',
    path: '',
    content: report.content || '',
    period: report.period || '',
    subtype: report.type || '',
    is_report: true,
  };
}

async function allDocs() {
  const index = await loadIndex();
  const reports = await loadReports();
  return index.items.map(itemDoc).concat(reports.map(reportDoc));
}

function rowFor(doc, annotation) {
  const note = annotation || {};
  return {
    doc_id: doc.doc_id,
    title: doc.title,
    level: doc.level,
    type: doc.type,
    publish_date: doc.publish_date,
    issuer: doc.issuer,
    doc_number: doc.doc_number,
    status: note.status || doc.status,
    summary: note.summary || doc.summary,
    judgment: note.judgment || '',
    updated_at: note.updated_at || '',
    annotated: Boolean(note.summary || note.judgment || note.status),
    path: doc.path,
    is_report: doc.is_report,
  };
}

function safeResolve(relativePath) {
  const rel = String(relativePath || '');
  if (!rel || rel.includes('..')) throw new Error('unsafe path');
  const full = normalize(join(libraryRoot, rel));
  const base = normalize(libraryRoot + sep);
  if (!full.startsWith(base)) throw new Error('unsafe path');
  return full;
}

async function docContent(doc) {
  if (doc.is_report) return doc.content || '';
  if (!doc.path) return '';
  const full = safeResolve(doc.path);
  return readFile(full, 'utf8');
}

function noteFileName(id) {
  const safe = String(id || '').replace(/[\\/:*?"<>|\s]+/g, '_');
  return safe || 'item-' + Date.now();
}

function annotationMarkdown(doc, annotation) {
  return [
    '---',
    'doc_id: ' + doc.doc_id,
    'title: ' + JSON.stringify(doc.title),
    'status: ' + annotation.status,
    'updated_at: ' + annotation.updated_at,
    '---',
    '',
    '# ' + doc.title,
    '',
    '## 摘要',
    '',
    annotation.summary || '',
    '',
    '## 判断',
    '',
    annotation.judgment || '',
    '',
    '链接：' + (doc.source_url || (doc.path ? 'workbench/' + doc.path : '—')),
    '',
  ].join('\n');
}

function scoreDoc(doc, query) {
  const title = String(doc.title || '').toLowerCase();
  const themes = (doc.themes || []).join(' ').toLowerCase();
  const rest = [
    doc.issuer,
    doc.doc_number,
    doc.summary,
    doc.level,
    doc.type,
    doc.subtype,
    doc.period,
  ].join(' ').toLowerCase();
  return (title.includes(query) ? 5 : 0) + (themes.includes(query) ? 2 : 0) + (rest.includes(query) ? 1 : 0);
}

function matchesQuery(doc, query) {
  if (!query) return true;
  const haystack = [
    doc.title,
    doc.issuer,
    doc.doc_number,
    doc.level,
    doc.type,
    doc.subtype,
    doc.period,
    (doc.themes || []).join(' '),
    doc.summary,
  ].join(' ').toLowerCase();
  return haystack.includes(query);
}

export default {
  id: PLUGIN_ID,
  async setup(ctx) {
    await ctx.tool.transform((editor) => {
      editor.namespace({
        name: 'workbench',
        description: 'Agent workbench items, reports, annotations and free notes',
      });

      editor.add({
        name: 'list',
        description: 'List workbench items and reports with annotation state. Returns doc_id, title, level, type, date, status, summary, judgment and updated_at.',
        input: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Optional keyword in title, issuer, summary or type.' },
            status: { type: 'string', description: 'Optional exact status filter.' },
            limit: { type: 'integer', minimum: 1, maximum: 100, description: 'Maximum documents, default 20.' },
          },
          additionalProperties: false,
        },
        execute: async (input) => {
          const docs = await allDocs();
          const annotations = await loadAnnotations();
          const notes = await loadNotes();
          const query = String(input && input.query ? input.query : '').trim().toLowerCase();
          const status = String(input && input.status ? input.status : '').trim();
          let rows = docs.map((doc) => rowFor(doc, annotations[doc.doc_id] || {}));
          if (status) rows = rows.filter((row) => row.status === status);
          if (query) rows = rows.filter((row) => matchesQuery(row, query));
          const limit = Math.min(Math.max(Number(input && input.limit) || 20, 1), 100);
          return {
            content: JSON.stringify({
              total: rows.length,
              returned: Math.min(rows.length, limit),
              documents: rows.slice(0, limit),
              notes: notes.notes.map((note) => ({
                id: note.id,
                title: note.title,
                group: note.group || 'Agent',
                updated: note.updated || '',
              })),
            }, null, 2),
          };
        },
      });

      editor.add({
        name: 'read',
        description: 'Read one workbench item or report by doc_id. Returns metadata, annotation and full Markdown content. Free notes can be read by id or title.',
        input: {
          type: 'object',
          properties: {
            doc_id: { type: 'string', description: 'Stable document id, for example ex-001 or report-001.' },
            title: { type: 'string', description: 'Free note title, exact or partial. Used only when doc_id is omitted.' },
          },
          additionalProperties: false,
        },
        execute: async (input) => {
          const id = String(input && input.doc_id ? input.doc_id : '').trim();
          if (id) {
            const docs = await allDocs();
            const doc = docs.find((item) => item.doc_id === id);
            if (!doc) {
              return { content: 'No workbench document matched that doc_id. Call workbench_list to see available documents.' };
            }
            try {
              const content = await docContent(doc);
              const annotations = await loadAnnotations();
              const annotation = annotations[doc.doc_id] || {};
              return {
                content: JSON.stringify({
                  doc_id: doc.doc_id,
                  title: doc.title,
                  level: doc.level,
                  type: doc.type,
                  publish_date: doc.publish_date,
                  deadline: doc.deadline,
                  issuer: doc.issuer,
                  doc_number: doc.doc_number,
                  status: annotation.status || doc.status,
                  source_url: doc.source_url,
                  original_path: doc.original_path,
                  path: doc.path,
                  summary: annotation.summary || doc.summary,
                  judgment: annotation.judgment || '',
                  updated_at: annotation.updated_at || '',
                  content,
                }, null, 2),
              };
            } catch (error) {
              return { content: 'Failed to read ' + doc.doc_id + ': ' + (error && error.message ? error.message : error) };
            }
          }

          const title = String(input && input.title ? input.title : '').trim();
          const data = await loadNotes();
          const note = data.notes.find((item) => item.id === title || item.title === title)
            || data.notes.find((item) => title && item.title.includes(title));
          if (!note) return { content: 'No document or free note matched. Call workbench_list first.' };
          return {
            content: JSON.stringify({
              id: note.id,
              title: note.title,
              group: note.group || 'Agent',
              updated: note.updated || '',
              content: note.content || '',
            }, null, 2),
          };
        },
      });

      editor.add({
        name: 'write',
        description: 'Update the summary, judgment or status of a workbench document. Writes workbench/annotations.json and workbench/_notes/<id>.md. With title and content instead of a known doc_id, saves a free note in the extension data directory.',
        input: {
          type: 'object',
          properties: {
            doc_id: { type: 'string', description: 'Document id to annotate. Omit when creating a free note.' },
            title: { type: 'string', description: 'Free note title, or fallback title for an unknown document id.' },
            summary: { type: 'string', description: 'Summary text. Markdown is allowed.' },
            judgment: { type: 'string', description: 'Judgment text. Markdown is allowed.' },
            status: { type: 'string', description: 'Status label from workbench/config.json.' },
            content: { type: 'string', description: 'Free note content. Used only when doc_id does not match a document.' },
            group: { type: 'string', description: 'Free note group, default Agent.' },
          },
          additionalProperties: false,
        },
        execute: async (input) => {
          const docId = String(input && input.doc_id ? input.doc_id : '').trim();
          const docs = await allDocs();
          const doc = docId ? docs.find((item) => item.doc_id === docId) : null;

          if (doc) {
            const annotations = await loadAnnotations();
            const previous = annotations[doc.doc_id] || {};
            const updatedAt = new Date().toISOString();
            const annotation = {
              summary: typeof input.summary === 'string' ? input.summary.trim() : (previous.summary || ''),
              judgment: typeof input.judgment === 'string' ? input.judgment.trim() : (previous.judgment || ''),
              status: typeof input.status === 'string' && input.status ? input.status : (previous.status || doc.status || ''),
              updated_at: updatedAt,
            };
            annotations[doc.doc_id] = annotation;
            await writeJson(annotationsPath, {
              schema: 'workbench-annotations/v1',
              updated_at: updatedAt,
              items: annotations,
            });
            await mkdir(notesDir, { recursive: true });
            await writeFile(join(notesDir, noteFileName(doc.doc_id) + '.md'), annotationMarkdown(doc, annotation), 'utf8');
            return { content: 'Updated ' + doc.doc_id + ': ' + doc.title };
          }

          const content = input && typeof input.content === 'string' ? input.content : '';
          const title = String(input && input.title ? input.title : '').trim();
          if (!title || !content) {
            return { content: 'Unknown doc_id. To create a free note, pass title and content.' };
          }
          const data = await loadNotes();
          const existing = data.notes.find((item) => item.id === docId || item.title === title);
          const now = new Date().toISOString().slice(0, 10);
          if (existing) {
            existing.title = title;
            existing.content = content;
            existing.updated = now;
            if (input.group) existing.group = input.group;
            await writeJson(dataPath, { schema: 'workbench-notes/v1', notes: data.notes });
            return { content: 'Updated note ' + existing.id + ': ' + existing.title };
          }
          const note = {
            id: docId || 'note-' + Date.now(),
            title,
            group: input && input.group ? input.group : 'Agent',
            updated: now,
            content,
          };
          data.notes.push(note);
          await writeJson(dataPath, { schema: 'workbench-notes/v1', notes: data.notes });
          return { content: 'Created note ' + note.id + ': ' + note.title };
        },
      });

      editor.add({
        name: 'library_search',
        description: 'Search the project workbench by keyword, level and type. Returns doc_id, title, level, type, date, issuer, status, summary and path.',
        input: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Keyword in title, issuer, doc number, theme or summary.' },
            level: { type: 'string', description: 'Optional exact level filter.' },
            type: { type: 'string', description: 'Optional exact type filter. Use 报告 for reports.' },
            limit: { type: 'integer', minimum: 1, maximum: 50, description: 'Maximum results, default 10.' },
          },
          additionalProperties: false,
        },
        execute: async (input) => {
          const docs = await allDocs();
          const annotations = await loadAnnotations();
          const query = String(input && input.query ? input.query : '').trim().toLowerCase();
          const level = String(input && input.level ? input.level : '').trim();
          const type = String(input && input.type ? input.type : '').trim();

          let rows = docs.filter((doc) => {
            if (level && doc.level !== level) return false;
            if (type) {
              if (type === '报告') return doc.is_report;
              return !doc.is_report && doc.type === type;
            }
            return true;
          });
          if (query) {
            rows = rows.filter((doc) => matchesQuery(doc, query));
            rows = rows.sort((a, b) => scoreDoc(b, query) - scoreDoc(a, query)
              || String(b.publish_date || '').localeCompare(String(a.publish_date || '')));
          } else {
            rows = rows.sort((a, b) => String(b.publish_date || '').localeCompare(String(a.publish_date || '')));
          }
          const limit = Math.min(Math.max(Number(input && input.limit) || 10, 1), 50);
          return {
            content: JSON.stringify({
              total: rows.length,
              returned: Math.min(rows.length, limit),
              documents: rows.slice(0, limit).map((doc) => rowFor(doc, annotations[doc.doc_id] || {})),
            }, null, 2),
          };
        },
      });

      editor.add({
        name: 'library_read',
        description: 'Read one workbench document by doc_id. Returns metadata, annotation and the full Markdown content. Reports return their stored content.',
        input: {
          type: 'object',
          properties: {
            doc_id: { type: 'string', description: 'Stable document id, for example ex-001 or report-001.' },
          },
          required: ['doc_id'],
          additionalProperties: false,
        },
        execute: async (input) => {
          const id = String(input && input.doc_id ? input.doc_id : '').trim();
          const docs = await allDocs();
          const doc = docs.find((item) => item.doc_id === id);
          if (!doc) {
            return { content: 'No workbench document matched that doc_id. Call workbench_library_search first.' };
          }
          try {
            const content = await docContent(doc);
            const annotations = await loadAnnotations();
            const annotation = annotations[doc.doc_id] || {};
            return {
              content: JSON.stringify({
                doc_id: doc.doc_id,
                title: doc.title,
                level: doc.level,
                type: doc.type,
                publish_date: doc.publish_date,
                deadline: doc.deadline,
                issuer: doc.issuer,
                doc_number: doc.doc_number,
                status: annotation.status || doc.status,
                source_url: doc.source_url,
                original_path: doc.original_path,
                path: doc.path,
                period: doc.period,
                summary: annotation.summary || doc.summary,
                judgment: annotation.judgment || '',
                updated_at: annotation.updated_at || '',
                content,
              }, null, 2),
            };
          } catch (error) {
            return { content: 'Failed to read ' + doc.doc_id + ': ' + (error && error.message ? error.message : error) };
          }
        },
      });
    });
  },
};
