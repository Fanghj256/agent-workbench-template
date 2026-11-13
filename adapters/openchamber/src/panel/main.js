import { connectHost } from '@openchamber/sdk';
import MarkdownIt from 'markdown-it';
import FALLBACK_CONFIG from '../../../../workbench/config.json';
import FALLBACK_INDEX from '../../../../workbench/index.json';

const LIB_ROOT = 'workbench';
const INDEX_PATH = LIB_ROOT + '/index.json';
const REPORTS_PATH = LIB_ROOT + '/reports.json';
const ANNOTATIONS_PATH = LIB_ROOT + '/annotations.json';
const NOTES_DIR = LIB_ROOT + '/_notes';
const LOCAL_BASE = 'http://127.0.0.1:8787/';

// 预览时按扩展页面的相对位置读取仓库根目录下的数据
const PREVIEW_CONFIG = '../../../workbench/config.json';
const PREVIEW_INDEX = '../../../workbench/index.json';
const PREVIEW_REPORTS = '../../../workbench/reports.json';
const PREVIEW_ANNOTATIONS = '../../../workbench/annotations.json';

const host = connectHost();
const md = new MarkdownIt({ html: false, linkify: true, breaks: false });

const TABS = [
  { id: 'today', label: '今日' },
  { id: 'library', label: '资料库' },
  { id: 'reports', label: '报告' },
  { id: 'settings', label: '设置' },
];

const TIME_OPTIONS = [
  { id: 'all', label: '全部时间' },
  { id: '7d', label: '近 7 天' },
  { id: '30d', label: '近 30 天' },
  { id: 'year', label: '本年' },
];

const DEFAULT_CONFIG = FALLBACK_CONFIG && typeof FALLBACK_CONFIG === 'object' ? FALLBACK_CONFIG : {};

const state = {
  tab: 'today',
  primary: 'all',
  secondary: 'all',
  status: 'all',
  time: 'all',
  reportType: 'all',
  search: '',
  selectedId: '',
  editing: false,
  saving: false,
  draft: { summary: '', judgment: '', status: '' },
  config: DEFAULT_CONFIG,
  items: [],
  reports: [],
  docs: [],
  annotations: {},
  generatedAt: '',
  refDate: null,
  loaded: false,
  preview: true,
  statusMessage: '正在读取工作台…',
  contentCache: new Map(),
  currentContent: '',
  contentLoading: false,
  contentError: '',
  directory: '',
  session: null,
  surface: 'panel',
};

const root = document.querySelector('#root');
root.innerHTML = [
  '<div class="app">',
  '  <header class="top">',
  '    <div class="brand">',
  '      <span class="mark" id="brand-mark">W</span>',
  '      <span class="brand-name" id="brand-name">工作台</span>',
  '      <span class="preview-badge" id="preview-badge" hidden>预览</span>',
  '    </div>',
  '    <input id="search" class="search" type="search" placeholder="搜索标题、机构、文号或关键词" aria-label="搜索工作台" title="搜索（/）" />',
  '    <button id="refresh" class="btn ghost" type="button" title="重新读取工作台数据">刷新</button>',
  '    <button id="close" class="btn ghost close" type="button" title="关闭">×</button>',
  '  </header>',
  '  <nav id="tabs" class="tabs" role="tablist" aria-label="工作台视图"></nav>',
  '  <div id="filters" class="filters"></div>',
  '  <main id="main" class="main"></main>',
  '  <footer class="foot">',
  '    <span id="status"></span>',
  '    <span id="meta"></span>',
  '  </footer>',
  '</div>',
  '<div id="toast" class="toast" hidden></div>',
].join('\n');

const els = {
  tabs: document.querySelector('#tabs'),
  filters: document.querySelector('#filters'),
  main: document.querySelector('#main'),
  search: document.querySelector('#search'),
  refresh: document.querySelector('#refresh'),
  close: document.querySelector('#close'),
  status: document.querySelector('#status'),
  meta: document.querySelector('#meta'),
  previewBadge: document.querySelector('#preview-badge'),
  brandName: document.querySelector('#brand-name'),
  brandMark: document.querySelector('#brand-mark'),
  toast: document.querySelector('#toast'),
};

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = String(text);
  return node;
}

function t(key, fallback) {
  const labels = state.config && state.config.labels ? state.config.labels : {};
  return labels[key] || fallback;
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function parseDate(value) {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value) {
  return value ? String(value).slice(0, 10) : '—';
}

function formatDateISO(date) {
  if (!date) return '';
  return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
}

function dayDiff(later, earlier) {
  return Math.round((later.getTime() - earlier.getTime()) / 86400000);
}

function daysFromRef(value) {
  const date = parseDate(value);
  if (!date || !state.refDate) return null;
  return dayDiff(state.refDate, date);
}

/* ---------- config ---------- */

function primaryField() {
  return 'level';
}

function secondaryField() {
  return 'type';
}

function primaryLabel() {
  const dimensions = state.config && state.config.dimensions ? state.config.dimensions : {};
  return (dimensions.primary && dimensions.primary.label) || '层级';
}

function secondaryLabel() {
  const dimensions = state.config && state.config.dimensions ? state.config.dimensions : {};
  return (dimensions.secondary && dimensions.secondary.label) || '类型';
}

function statuses() {
  return state.config && Array.isArray(state.config.statuses) ? state.config.statuses : [];
}

function types() {
  return state.config && Array.isArray(state.config.types) ? state.config.types : [];
}

function reportTypes() {
  return state.config && state.config.reports && Array.isArray(state.config.reports.types) ? state.config.reports.types : [];
}

function defaultStatus() {
  const list = statuses();
  return list.length ? list[0].label : '';
}

function toneForStatus(label) {
  const found = statuses().filter((item) => item && item.label === label)[0];
  if (found && found.tone) return found.tone;
  if (label === '已发布') return 'ok';
  if (label === '草稿') return 'warn';
  return 'muted';
}

/* ---------- data mapping ---------- */

function mapItem(raw) {
  return {
    doc_id: String(raw.id),
    title: raw.title || '',
    level: raw.level || '',
    type: raw.kind || '',
    issuer: raw.issuer || '',
    doc_number: raw.doc_number || '',
    publish_date: raw.published_at || '',
    deadline: raw.deadline || '',
    status: raw.status || '',
    priority: Number(raw.priority) || 0,
    themes: Array.isArray(raw.themes) ? raw.themes : [],
    summary: raw.summary || '',
    source_url: raw.source_url || '',
    original_path: raw.original_path || '',
    path: raw.content_path || '',
    content: '',
    period: '',
    subtype: '',
    is_report: false,
  };
}

function mapReport(raw) {
  const status = raw.status === 'draft' ? '草稿' : (raw.status || '已发布');
  return {
    doc_id: String(raw.id),
    title: raw.title || '',
    level: '报告',
    type: '报告',
    issuer: raw.issuer || '',
    doc_number: '',
    publish_date: raw.date || '',
    deadline: '',
    status: status,
    priority: 0,
    themes: Array.isArray(raw.themes) ? raw.themes : [],
    summary: raw.summary || '',
    source_url: raw.source_url || '',
    original_path: raw.original_path || '',
    path: '',
    content: raw.content || '',
    period: raw.period || '',
    subtype: raw.type || '',
    is_report: true,
  };
}

function itemDocs() {
  return state.docs.filter((doc) => !doc.is_report);
}

function reportDocs() {
  return state.docs.filter((doc) => doc.is_report);
}

function docById(id) {
  return state.docs.filter((doc) => doc.doc_id === id)[0] || null;
}

function annotationFor(doc) {
  if (!doc || !Object.prototype.hasOwnProperty.call(state.annotations, doc.doc_id)) return {};
  return state.annotations[doc.doc_id] || {};
}

function docStatus(doc) {
  return annotationFor(doc).status || doc.status || defaultStatus() || '—';
}

function docSummary(doc) {
  const annotation = annotationFor(doc);
  return annotation.summary || doc.summary || '';
}

function docJudgment(doc) {
  const annotation = annotationFor(doc);
  return annotation.judgment || '';
}

/* ---------- filtering ---------- */

function primaryOptions() {
  const seen = [];
  itemDocs().forEach((doc) => {
    const value = doc[primaryField()];
    if (value && seen.indexOf(value) === -1) seen.push(value);
  });
  return seen;
}

function matchesTime(doc) {
  if (state.time === 'all') return true;
  const age = daysFromRef(doc.publish_date);
  if (age === null) return false;
  if (state.time === '7d') return age >= 0 && age <= 7;
  if (state.time === '30d') return age >= 0 && age <= 30;
  if (state.time === 'year') {
    const date = parseDate(doc.publish_date);
    return Boolean(date && state.refDate && date.getFullYear() === state.refDate.getFullYear());
  }
  return true;
}

function matchesDoc(doc) {
  if (state.primary !== 'all' && String(doc[primaryField()] || '') !== state.primary) return false;
  if (state.secondary !== 'all' && String(doc[secondaryField()] || '') !== state.secondary) return false;
  if (state.status !== 'all' && docStatus(doc) !== state.status) return false;
  if (!matchesTime(doc)) return false;
  const query = state.search.trim().toLowerCase();
  if (!query) return true;
  const haystack = [
    doc.title,
    doc.issuer,
    doc.doc_number,
    doc[primaryField()],
    doc[secondaryField()],
    (doc.themes || []).join(' '),
    doc.summary,
    docSummary(doc),
    docJudgment(doc),
  ].join(' ').toLowerCase();
  return haystack.indexOf(query) !== -1;
}

function filteredDocs(docs) {
  return docs.filter(matchesDoc);
}

function matchesReport(doc) {
  if (state.reportType !== 'all' && doc.subtype !== state.reportType) return false;
  const query = state.search.trim().toLowerCase();
  if (!query) return true;
  const haystack = [
    doc.title,
    doc.subtype,
    doc.period,
    doc.summary,
    docSummary(doc),
    docJudgment(doc),
  ].join(' ').toLowerCase();
  return haystack.indexOf(query) !== -1;
}

function filteredReports() {
  return reportDocs().filter(matchesReport);
}

function recentWindowDocs() {
  const days = state.config && state.config.today && Number(state.config.today.recentDays) ? Number(state.config.today.recentDays) : 14;
  return itemDocs().filter((doc) => {
    const age = daysFromRef(doc.publish_date);
    return age !== null && age >= 0 && age <= days;
  });
}

function sortByDate(docs) {
  return docs.slice().sort((a, b) => {
    const byDate = String(b.publish_date || '').localeCompare(String(a.publish_date || ''));
    if (byDate !== 0) return byDate;
    return (Number(b.priority) || 0) - (Number(a.priority) || 0);
  });
}

function sortByPriority(docs) {
  return docs.slice().sort((a, b) => {
    const byPriority = (Number(b.priority) || 0) - (Number(a.priority) || 0);
    if (byPriority !== 0) return byPriority;
    return String(b.publish_date || '').localeCompare(String(a.publish_date || ''));
  });
}

function recentDocs() {
  const recent = recentWindowDocs();
  if (recent.length) return recent;
  return sortByDate(itemDocs()).slice(0, 8);
}

function hasActiveFilters() {
  return state.primary !== 'all' || state.secondary !== 'all' || state.status !== 'all' || state.time !== 'all' || state.reportType !== 'all' || Boolean(state.search.trim());
}

function clearFilters() {
  state.primary = 'all';
  state.secondary = 'all';
  state.status = 'all';
  state.time = 'all';
  state.reportType = 'all';
  state.search = '';
  els.search.value = '';
  renderFilters();
  renderMain();
}

function computeReferenceDate() {
  const setting = state.config && state.config.today ? state.config.today.referenceDate : 'auto';
  if (setting === 'latest') {
    let latest = null;
    itemDocs().forEach((doc) => {
      const date = parseDate(doc.publish_date);
      if (date && (!latest || date > latest)) latest = date;
    });
    if (latest) return latest;
  }
  if (typeof setting === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(setting)) {
    const fixed = parseDate(setting);
    if (fixed) return fixed;
  }
  return startOfToday();
}

/* ---------- chrome ---------- */

function renderTabs() {
  els.tabs.replaceChildren();
  const counts = {
    today: state.loaded ? recentDocs().length : 0,
    library: state.loaded ? itemDocs().length : 0,
    reports: state.loaded ? reportDocs().length : 0,
  };
  for (const tab of TABS) {
    const button = el('button', 'tab' + (state.tab === tab.id ? ' active' : ''));
    button.type = 'button';
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', state.tab === tab.id ? 'true' : 'false');
    button.append(el('span', 'tab-label', tab.label));
    if (counts[tab.id]) button.append(el('span', 'tab-count', counts[tab.id]));
    button.addEventListener('click', () => {
      if (state.tab === tab.id && !state.selectedId) return;
      state.tab = tab.id;
      state.selectedId = '';
      state.editing = false;
      state.saving = false;
      state.currentContent = '';
      state.contentError = '';
      state.contentLoading = false;
      render();
      els.main.scrollTop = 0;
    });
    els.tabs.append(button);
  }
}

function chip(label, active, onClick) {
  const button = el('button', 'chip' + (active ? ' active' : ''), label);
  button.type = 'button';
  button.setAttribute('aria-pressed', active ? 'true' : 'false');
  button.addEventListener('click', onClick);
  return button;
}

function badge(label, tone) {
  return el('span', 'badge badge-' + (tone || 'muted'), label);
}

function selectControl(label, options, value, onChange) {
  const wrap = el('label', 'select-wrap');
  wrap.append(el('span', 'select-label', label));
  const select = el('select', 'select');
  for (const option of options) {
    const item = typeof option === 'string' ? { id: option, label: option } : option;
    const node = el('option', '', item.label);
    node.value = item.id;
    select.append(node);
  }
  select.value = value;
  select.setAttribute('aria-label', label);
  select.addEventListener('change', () => onChange(select.value));
  wrap.append(select);
  return wrap;
}

function countText() {
  if (state.tab === 'reports') return '共 ' + filteredReports().length + ' 份';
  const scope = state.tab === 'today' ? recentDocs() : itemDocs();
  return '共 ' + filteredDocs(scope).length + ' 条';
}

function renderFilters() {
  els.filters.replaceChildren();
  if (!state.loaded || state.tab === 'settings' || state.selectedId) {
    els.filters.hidden = true;
    return;
  }
  els.filters.hidden = false;

  if (state.tab === 'reports') {
    const row = el('div', 'filter-row');
    row.append(el('span', 'filter-label', '报告'));
    row.append(chip('全部类型', state.reportType === 'all', () => {
      state.reportType = 'all';
      renderFilters();
      renderMain();
    }));
    for (const type of reportTypes()) {
      row.append(chip(type, state.reportType === type, () => {
        state.reportType = type;
        renderFilters();
        renderMain();
      }));
    }
    const right = el('div', 'filter-right');
    right.append(el('span', 'filter-count', countText()));
    row.append(right);
    els.filters.append(row);
    return;
  }

  const primaryRow = el('div', 'filter-row');
  primaryRow.append(el('span', 'filter-label', primaryLabel()));
  primaryRow.append(chip('全部', state.primary === 'all', () => {
    state.primary = 'all';
    renderFilters();
    renderMain();
  }));
  for (const value of primaryOptions()) {
    primaryRow.append(chip(value, state.primary === value, () => {
      state.primary = value;
      renderFilters();
      renderMain();
    }));
  }

  const secondaryRow = el('div', 'filter-row');
  secondaryRow.append(el('span', 'filter-label', secondaryLabel()));
  secondaryRow.append(chip('全部', state.secondary === 'all', () => {
    state.secondary = 'all';
    renderFilters();
    renderMain();
  }));
  for (const value of types()) {
    secondaryRow.append(chip(value, state.secondary === value, () => {
      state.secondary = value;
      renderFilters();
      renderMain();
    }));
  }

  const right = el('div', 'filter-right');
  right.append(
    selectControl('状态', [{ id: 'all', label: '全部状态' }].concat(statuses().map((item) => ({ id: item.label, label: item.label }))), state.status, (value) => {
      state.status = value;
      renderFilters();
      renderMain();
    }),
    selectControl('时间', TIME_OPTIONS, state.time, (value) => {
      state.time = value;
      renderFilters();
      renderMain();
    }),
    el('span', 'filter-count', countText()),
  );
  secondaryRow.append(right);
  els.filters.append(primaryRow, secondaryRow);
}

/* ---------- list ---------- */

function emptyState(title) {
  const wrap = el('div', 'empty');
  wrap.append(
    el('div', 'empty-title', title || t('emptyTitle', '没有匹配的条目')),
    el('div', 'empty-sub', t('emptyHint', '调整筛选条件，或清空搜索后再试。')),
  );
  if (hasActiveFilters()) {
    const button = el('button', 'btn small', t('clearFilters', '清空筛选'));
    button.type = 'button';
    button.addEventListener('click', clearFilters);
    wrap.append(button);
  }
  return wrap;
}

function docList(docs, emptyTitle) {
  if (!docs.length) return emptyState(emptyTitle);
  const list = el('div', 'doc-list');
  const head = el('div', 'doc-head');
  for (const label of [primaryLabel(), secondaryLabel(), '日期', '条目 / 摘要', '状态', '机关']) {
    head.append(el('span', '', label));
  }
  list.append(head);

  for (const doc of docs) {
    const row = el('button', 'doc-row');
    row.type = 'button';
    row.dataset.id = doc.doc_id;
    row.append(
      el('span', 'doc-level', doc.level || '—'),
      el('span', 'doc-type', doc.type || '—'),
      el('span', 'doc-date', formatDate(doc.publish_date)),
    );
    const main = el('span', 'doc-main');
    main.append(
      el('span', 'doc-title', doc.title),
      el('span', 'doc-summary', docSummary(doc) || '暂无摘要'),
      el('span', 'doc-mobile-meta', [formatDate(doc.publish_date), doc.level, doc.type, doc.issuer].filter(Boolean).join(' · ')),
    );
    row.append(main, badge(docStatus(doc), toneForStatus(docStatus(doc))), el('span', 'doc-issuer', doc.issuer || '—'));
    row.addEventListener('click', () => openDoc(doc.doc_id));
    list.append(row);
  }
  return list;
}

/* ---------- pages ---------- */

function statBlock(label, value) {
  const block = el('div', 'stat');
  block.append(el('span', 'stat-num', String(value)), el('span', 'stat-label', label));
  return block;
}

function renderToday() {
  const todayConfig = state.config && state.config.today ? state.config.today : {};
  const recentDays = Number(todayConfig.recentDays) || 14;
  const deadlineDays = Number(todayConfig.deadlineDays) || 7;
  const pendingStatuses = Array.isArray(todayConfig.pendingStatuses) && todayConfig.pendingStatuses.length
    ? todayConfig.pendingStatuses
    : [defaultStatus()].filter(Boolean);

  const recentWindow = recentWindowDocs();
  const recent = recentWindow.length ? recentWindow : recentDocs();
  const fallback = recentWindow.length === 0;
  const pending = itemDocs().filter((doc) => pendingStatuses.indexOf(docStatus(doc)) !== -1);
  const deadlines = itemDocs().filter((doc) => {
    const deadline = parseDate(doc.deadline);
    if (!deadline || !state.refDate) return false;
    const days = dayDiff(deadline, state.refDate);
    return days >= 0 && days <= deadlineDays;
  });

  const wrap = el('div', 'page');
  const head = el('div', 'page-head');
  head.append(
    el('h1', 'page-title', TABS[0].label),
    el('span', 'page-note', fallback
      ? '最近更新 · 显示 ' + recent.length + ' 条'
      : (state.refDate ? formatDateISO(state.refDate) : '') + ' 为基准 · 近 ' + recentDays + ' 天'),
  );
  wrap.append(head);

  const stats = el('div', 'stats');
  stats.append(
    statBlock('近 ' + recentDays + ' 天更新', recentWindow.length),
    statBlock(pendingStatuses.join(' / ') || '待处理', pending.length),
    statBlock(deadlineDays + ' 天内截止', deadlines.length),
  );
  wrap.append(stats);

  const focus = sortByPriority(filteredDocs(recent)).slice(0, Number(todayConfig.focusCount) || 3);
  if (focus.length) {
    const section = el('section', 'section');
    const sectionHead = el('div', 'section-head');
    sectionHead.append(
      el('h2', 'section-title', '重点关注'),
      el('span', 'section-note', fallback ? '按优先级排序' : '按优先级排序，点开可编辑摘要'),
    );
    section.append(sectionHead);
    const grid = el('div', 'highlights');
    for (const doc of focus) {
      const card = el('button', 'highlight');
      card.type = 'button';
      const top = el('span', 'highlight-top');
      top.append(
        el('span', 'highlight-meta', [doc.level, doc.type, formatDate(doc.publish_date)].filter(Boolean).join(' · ')),
        badge(docStatus(doc), toneForStatus(docStatus(doc))),
      );
      card.append(top, el('span', 'highlight-title', doc.title), el('span', 'highlight-summary', docSummary(doc) || '暂无摘要'));
      card.addEventListener('click', () => openDoc(doc.doc_id));
      grid.append(card);
    }
    section.append(grid);
    wrap.append(section);
  }

  const feed = el('section', 'section');
  const feedHead = el('div', 'section-head');
  const feedDocs = sortByDate(filteredDocs(recent));
  feedHead.append(
    el('h2', 'section-title', '动态'),
    el('span', 'section-note', fallback ? '最近 ' + feedDocs.length + ' 条' : feedDocs.length + ' 条 · 近 ' + recentDays + ' 天'),
  );
  feed.append(feedHead, docList(feedDocs, fallback ? '最近没有匹配的条目' : '近 ' + recentDays + ' 天没有匹配的条目'));
  wrap.append(feed);
  return wrap;
}

function renderLibrary() {
  const docs = filteredDocs(itemDocs());
  const wrap = el('div', 'page');
  const head = el('div', 'page-head');
  head.append(
    el('h1', 'page-title', TABS[1].label),
    el('span', 'page-note', '共 ' + docs.length + ' 条' + (state.generatedAt ? ' · 数据日期 ' + state.generatedAt : '')),
  );
  wrap.append(head, docList(docs));
  return wrap;
}

function renderReports() {
  const docs = filteredReports();
  const wrap = el('div', 'page');
  const head = el('div', 'page-head');
  head.append(
    el('h1', 'page-title', TABS[2].label),
    el('span', 'page-note', '共 ' + docs.length + ' 份 · ' + LIB_ROOT + '/reports.json'),
  );
  wrap.append(head, docList(docs, '报告目录里还没有内容'));
  return wrap;
}

function settingCard(title, rows, actions) {
  const card = el('div', 'setting-card');
  card.append(el('h3', '', title));
  for (const row of rows) {
    const line = el('div', 'setting-row');
    line.append(el('span', 'setting-key', row[0]), el('span', 'setting-value', row[1]));
    card.append(line);
  }
  if (actions && actions.length) {
    const bar = el('div', 'setting-actions');
    for (const action of actions) bar.append(action);
    card.append(bar);
  }
  return card;
}

function settingsButton(label, onClick) {
  const button = el('button', 'btn small', label);
  button.type = 'button';
  button.addEventListener('click', onClick);
  return button;
}

function renderSettings() {
  const config = state.config || {};
  const directory = state.directory || '项目根';
  const libraryPath = directory === '项目根' ? LIB_ROOT : directory + '/' + LIB_ROOT;
  const wrap = el('div', 'page settings');
  const head = el('div', 'page-head');
  head.append(el('h1', 'page-title', TABS[3].label), el('span', 'page-note', '数据位置、本地服务和 Agent 工具'));
  wrap.append(head);

  wrap.append(settingCard('工作台', [
    ['标题', config.title || '工作台'],
    ['说明', config.description || '—'],
    ['数据目录', libraryPath + '/'],
    ['数据版本', config.schema || 'workbench-config/v1'],
    ['内容', itemDocs().length + ' 条 / ' + reportDocs().length + ' 份报告'],
    ['批注', Object.keys(state.annotations).length + ' 条'],
    ['基准日期', state.refDate ? formatDateISO(state.refDate) : '—'],
  ], [
    settingsButton('重新读取', () => void loadData()),
    settingsButton('复制数据目录', () => void copyText(LIB_ROOT)),
  ]));

  wrap.append(settingCard('数据文件', [
    ['配置', LIB_ROOT + '/config.json'],
    ['索引', LIB_ROOT + '/index.json'],
    ['批注', LIB_ROOT + '/annotations.json'],
    ['报告', LIB_ROOT + '/reports.json'],
    ['正文', LIB_ROOT + '/items/<id>/content.md'],
    ['批注副本', LIB_ROOT + '/_notes/<id>.md'],
  ], [
    settingsButton('复制启动命令', () => void copyText('node server/server.mjs')),
  ]));

  wrap.append(settingCard('本地原件', [
    ['服务地址', LOCAL_BASE],
    ['启动方式', '在模板仓库根目录运行 node server/server.mjs'],
    ['显示条件', '条目带有 original_path 时才显示“本地原件”'],
    ['说明', 'PDF/HTML 通过本机服务打开；未启动时链接无法访问。'],
  ], [
    settingsButton('复制服务地址', () => void copyText(LOCAL_BASE)),
  ]));

  wrap.append(settingCard('Agent 工具', [
    ['工作台', 'workbench_list / workbench_read / workbench_write'],
    ['资料库', 'library_search / library_read'],
    ['写入目标', LIB_ROOT + '/annotations.json 与 ' + LIB_ROOT + '/_notes/<id>.md'],
  ]));

  wrap.append(settingCard('安装位置', [
    ['项目根', '模板仓库根目录'],
    ['扩展目录', 'adapters/openchamber'],
    ['数据目录', LIB_ROOT + '/'],
    ['插件路径', 'plugin/'],
  ]));

  wrap.append(settingCard('快捷键', [
    ['搜索', '/'],
    ['清空搜索 / 返回', 'Esc'],
    ['保存批注', 'Ctrl / Cmd + S'],
  ]));
  return wrap;
}

/* ---------- detail ---------- */

function metaChip(text, mono) {
  return el('span', 'meta-chip' + (mono ? ' mono' : ''), text);
}

function actionButton(label, className, onClick, disabled) {
  const button = el('button', 'btn ' + className, label);
  button.type = 'button';
  button.disabled = Boolean(disabled);
  button.addEventListener('click', onClick);
  return button;
}

function markdownBlock(text, className) {
  const block = el('div', 'prose' + (className ? ' ' + className : ''));
  block.innerHTML = md.render(String(text || ''));
  return block;
}

function stripLeadingTitle(text, title) {
  const source = String(text || '');
  const match = /^\s*#\s+(.+?)\s*(?:\r?\n|$)/.exec(source);
  if (!match) return source;
  if (match[1].trim() !== String(title || '').trim()) return source;
  return source.slice(match[0].length);
}

function renderEditor() {
  const form = el('div', 'edit-form');

  const summaryLabel = el('label', 'edit-field');
  summaryLabel.append(el('span', 'edit-label', t('summary', '摘要')));
  const summary = el('textarea', 'edit-area');
  summary.id = 'edit-summary';
  summary.rows = 4;
  summary.value = state.draft.summary;
  summary.placeholder = '一句话说明这条内容是什么，以及为什么值得看。支持 Markdown。';
  summary.addEventListener('input', () => { state.draft.summary = summary.value; });
  summaryLabel.append(summary);

  const judgmentLabel = el('label', 'edit-field');
  judgmentLabel.append(el('span', 'edit-label', t('judgment', '判断')));
  const judgment = el('textarea', 'edit-area');
  judgment.rows = 3;
  judgment.value = state.draft.judgment;
  judgment.placeholder = '影响、截止时间、下一步动作或需要谁跟进。支持 Markdown。';
  judgment.addEventListener('input', () => { state.draft.judgment = judgment.value; });
  judgmentLabel.append(judgment);

  const statusOptions = statuses().map((item) => ({ id: item.label, label: item.label }));
  if (state.draft.status && !statusOptions.some((item) => item.id === state.draft.status)) {
    statusOptions.unshift({ id: state.draft.status, label: state.draft.status });
  }

  const row = el('div', 'edit-row');
  row.append(
    selectControl('状态', statusOptions, state.draft.status, (value) => {
      state.draft.status = value;
    }),
    el('span', 'edit-hint', '保存到 annotations.json；正文 content.md 不会被修改。'),
  );

  form.append(summaryLabel, judgmentLabel, row);
  return form;
}

function renderDetail(doc) {
  const wrap = el('div', 'detail-wrap');
  const detail = el('div', 'detail');

  const back = el('button', 'back-link', '← 返回');
  back.type = 'button';
  back.addEventListener('click', closeDetail);
  detail.append(back);

  detail.append(el('h1', 'detail-title', doc.title));

  const meta = el('div', 'meta');
  meta.append(
    metaChip(doc.level || '—'),
    metaChip(doc.type || '—'),
    metaChip(formatDate(doc.publish_date), true),
  );
  if (doc.issuer) meta.append(metaChip(doc.issuer));
  if (doc.doc_number) meta.append(metaChip(doc.doc_number, true));
  if (doc.period) meta.append(metaChip(doc.period, true));
  meta.append(badge(docStatus(doc), toneForStatus(docStatus(doc))));
  detail.append(meta);

  const links = el('div', 'detail-links');
  if (doc.source_url) links.append(actionButton('原文链接', 'link-btn', () => void openUrl(doc.source_url)));
  if (doc.original_path) links.append(actionButton('本地原件', 'link-btn', () => void openUrl(localOriginalUrl(doc.original_path))));
  links.append(actionButton('复制 ID', 'link-btn', () => void copyText(doc.doc_id)));
  detail.append(links);

  const note = el('section', 'note-block');
  const noteHead = el('div', 'note-head');
  noteHead.append(el('h2', 'note-title', t('summary', '摘要') + ' / ' + t('judgment', '判断')));
  if (!state.editing) noteHead.append(actionButton('编辑', 'link-btn', enterEdit));
  note.append(noteHead);

  if (state.editing) {
    note.append(renderEditor());
  } else {
    if (docSummary(doc)) note.append(markdownBlock(docSummary(doc)));
    else note.append(el('div', 'note-empty', '还没有摘要。点“编辑”写一条。'));
    if (docJudgment(doc)) {
      note.append(el('h3', 'note-sub', t('judgment', '判断')));
      note.append(markdownBlock(docJudgment(doc)));
    } else {
      note.append(el('div', 'note-empty', '还没有判断。点“编辑”补充影响、截止时间或下一步。'));
    }
  }
  detail.append(note);

  const original = el('section', 'original-block');
  const originalHead = el('div', 'section-head');
  originalHead.append(
    el('h2', 'section-title', doc.is_report ? '报告全文' : '原文'),
    el('span', 'section-note', doc.is_report ? '来自 reports.json，只读' : '来自 content.md，只读'),
  );
  original.append(originalHead);

  if (state.contentLoading) {
    original.append(el('div', 'loading', '正在读取正文…'));
  } else if (state.contentError) {
    const notice = el('div', 'notice');
    notice.append(el('span', 'notice-text', state.contentError));
    notice.append(actionButton('重试', 'btn small', () => void loadDocContent(doc)));
    original.append(notice);
  } else {
    original.append(markdownBlock(stripLeadingTitle(state.currentContent, doc.title), 'doc-body'));
  }
  detail.append(original);
  wrap.append(detail);

  const bar = el('div', 'action-bar');
  bar.append(
    actionButton(state.editing ? '取消' : '编辑', 'btn', () => {
      if (state.editing) cancelEdit();
      else enterEdit();
    }),
    actionButton(state.saving ? '保存中…' : '保存', 'btn primary', () => void saveAnnotation(), !state.editing || state.saving),
    actionButton('让 Agent 分析', 'btn', () => void sendDoc(doc, true, 'analyze')),
    actionButton('放入对话', 'btn ghost', () => void sendDoc(doc, false, 'compose')),
    actionButton('发送', 'btn ghost', () => void sendDoc(doc, true, 'send')),
  );
  wrap.append(bar);
  return wrap;
}

/* ---------- content ---------- */

function localOriginalUrl(path) {
  const clean = String(path || '').replace(/^\/+/, '');
  return LOCAL_BASE + encodeURI(clean);
}

async function readProjectFile(path, previewPath) {
  try {
    const result = await host.readFile(path);
    return { content: result && typeof result === 'object' ? result.content : result, viaHost: true };
  } catch (error) {
    if (!previewPath) throw error;
    const response = await fetch(previewPath, { cache: 'no-store' });
    if (!response.ok) throw error;
    return { content: await response.text(), viaHost: false };
  }
}

async function loadJson(path, previewPath) {
  const result = await readProjectFile(path, previewPath);
  return { value: JSON.parse(result.content), viaHost: result.viaHost };
}

function openDoc(id) {
  const doc = docById(id);
  if (!doc) return;
  state.selectedId = id;
  state.editing = false;
  state.saving = false;
  state.contentError = '';
  els.main.scrollTop = 0;
  const cached = state.contentCache.get(id);
  if (cached !== undefined) {
    state.currentContent = cached;
    state.contentLoading = false;
    render();
    return;
  }
  state.currentContent = '';
  state.contentLoading = true;
  render();
  void loadDocContent(doc);
}

function closeDetail() {
  state.selectedId = '';
  state.editing = false;
  state.saving = false;
  state.currentContent = '';
  state.contentLoading = false;
  state.contentError = '';
  render();
  els.main.scrollTop = 0;
}

async function loadDocContent(doc) {
  if (!doc) return;
  if (state.contentCache.has(doc.doc_id)) {
    state.currentContent = state.contentCache.get(doc.doc_id);
    state.contentLoading = false;
    state.contentError = '';
    renderMain();
    return;
  }
  if (doc.content) {
    state.contentCache.set(doc.doc_id, doc.content);
    state.currentContent = doc.content;
    state.contentLoading = false;
    state.contentError = '';
    renderMain();
    return;
  }
  if (!doc.path) {
    state.currentContent = '';
    state.contentLoading = false;
    state.contentError = '这条内容没有正文文件。';
    renderMain();
    return;
  }
  state.contentLoading = true;
  state.contentError = '';
  renderMain();
  try {
    const result = await readProjectFile(LIB_ROOT + '/' + doc.path, '../../../workbench/' + doc.path);
    state.contentCache.set(doc.doc_id, result.content || '');
    if (state.selectedId === doc.doc_id) {
      state.currentContent = result.content || '';
      state.contentError = '';
    }
  } catch (error) {
    if (state.selectedId === doc.doc_id) {
      state.currentContent = '';
      state.contentError = '无法读取正文：' + (error && error.message ? error.message : error);
    }
  } finally {
    if (state.selectedId === doc.doc_id) {
      state.contentLoading = false;
      renderMain();
    }
  }
}

/* ---------- editing ---------- */

function enterEdit() {
  const doc = docById(state.selectedId);
  if (!doc) return;
  state.draft = {
    summary: docSummary(doc),
    judgment: docJudgment(doc),
    status: docStatus(doc) || defaultStatus(),
  };
  state.editing = true;
  renderMain();
  const area = document.querySelector('#edit-summary');
  if (area) area.focus();
}

function cancelEdit() {
  state.editing = false;
  state.saving = false;
  renderMain();
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
    '链接：' + (doc.source_url || (doc.path ? LIB_ROOT + '/' + doc.path : '—')),
    '',
  ].join('\n');
}

async function saveAnnotation() {
  const doc = docById(state.selectedId);
  if (!doc || !state.editing || state.saving) return;
  const updatedAt = new Date().toISOString();
  const annotation = {
    summary: state.draft.summary.trim(),
    judgment: state.draft.judgment.trim(),
    status: state.draft.status || defaultStatus(),
    updated_at: updatedAt,
  };

  const next = Object.assign(Object.create(null), state.annotations);
  next[doc.doc_id] = annotation;

  if (state.preview) {
    state.annotations = next;
    state.editing = false;
    renderMain();
    toast('预览模式：已更新当前视图，未写入磁盘。');
    return;
  }

  state.saving = true;
  renderMain();
  try {
    const payload = {
      schema: 'workbench-annotations/v1',
      updated_at: updatedAt,
      items: next,
    };
    await host.writeFile(ANNOTATIONS_PATH, JSON.stringify(payload, null, 2));
    await host.writeFile(NOTES_DIR + '/' + noteFileName(doc.doc_id) + '.md', annotationMarkdown(doc, annotation));
    state.annotations = next;
    state.editing = false;
    state.saving = false;
    state.statusMessage = '已保存 ' + doc.doc_id;
    render();
    toast('摘要 / 判断已保存');
  } catch (error) {
    state.saving = false;
    renderMain();
    toast('保存失败：' + (error && error.message ? error.message : error));
  }
}

/* ---------- agent actions ---------- */

function docContext(doc) {
  const lines = [
    '【工作台】' + doc.title,
    'ID：' + doc.doc_id,
    [doc.level, doc.type, formatDate(doc.publish_date), doc.issuer].filter(Boolean).join(' · '),
    '摘要：' + (docSummary(doc) || '暂无'),
    '判断：' + (docJudgment(doc) || '暂无'),
  ];
  if (doc.source_url) lines.push('原文：' + doc.source_url);
  else if (doc.path) lines.push('正文：' + LIB_ROOT + '/' + doc.path);
  return lines.join('\n');
}

async function sendDoc(doc, send, mode) {
  let text = docContext(doc);
  if (mode === 'analyze') {
    text = '请从要点、影响、下一步和时间窗口四个角度分析下面这条内容。\n\n' + text;
  }
  try {
    await host.prompt({ text: text, send: send });
    toast(send ? '已发送到当前会话' : '已放入对话');
  } catch (error) {
    toast('发送失败：' + (error && error.message ? error.message : error));
  }
}

async function openUrl(url) {
  try {
    await host.openUrl(url);
  } catch (error) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

async function copyText(text) {
  try {
    await host.writeClipboard(text);
    toast('已复制');
  } catch (error) {
    try {
      await navigator.clipboard.writeText(text);
      toast('已复制');
    } catch (copyError) {
      toast('复制失败，请手动选择文本。');
    }
  }
}

/* ---------- status / render ---------- */

function renderStatus() {
  els.status.textContent = state.statusMessage;
  els.meta.textContent = state.loaded
    ? itemDocs().length + ' 条 / ' + reportDocs().length + ' 份报告 · ' + (state.generatedAt || '未标注日期')
    : 'workbench';
  els.previewBadge.hidden = !state.preview;
  els.close.hidden = state.surface !== 'dialog';
}

function renderMain() {
  els.main.replaceChildren();
  if (!state.loaded) {
    els.main.append(el('div', 'loading', '正在读取工作台…'));
    return;
  }
  if (state.selectedId) {
    const doc = docById(state.selectedId);
    if (doc) {
      els.main.append(renderDetail(doc));
      return;
    }
    state.selectedId = '';
  }
  if (state.tab === 'today') els.main.append(renderToday());
  else if (state.tab === 'library') els.main.append(renderLibrary());
  else if (state.tab === 'reports') els.main.append(renderReports());
  else els.main.append(renderSettings());
}

function render() {
  renderTabs();
  renderFilters();
  renderMain();
  renderStatus();
}

let toastTimer = 0;
function toast(message) {
  els.toast.textContent = message;
  els.toast.hidden = false;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    els.toast.hidden = true;
  }, 2800);
}

/* ---------- data ---------- */

async function loadData() {
  state.statusMessage = '正在读取工作台…';
  renderStatus();

  const results = await Promise.allSettled([
    loadJson(INDEX_PATH, PREVIEW_INDEX),
    loadJson(REPORTS_PATH, PREVIEW_REPORTS),
    loadJson(ANNOTATIONS_PATH, PREVIEW_ANNOTATIONS),
    loadJson(LIB_ROOT + '/config.json', PREVIEW_CONFIG),
  ]);

  const indexResult = results[0];
  const reportsResult = results[1];
  const annotationsResult = results[2];
  const configResult = results[3];

  let viaHost = false;
  let items = [];
  let generatedAt = '';

  if (indexResult.status === 'fulfilled' && indexResult.value && indexResult.value.value && Array.isArray(indexResult.value.value.items)) {
    items = indexResult.value.value.items
      .filter((item) => item && typeof item.id === 'string' && typeof item.title === 'string')
      .map(mapItem);
    generatedAt = indexResult.value.value.generated_at || '';
    viaHost = indexResult.value.viaHost;
  } else {
    const fallbackItems = FALLBACK_INDEX && Array.isArray(FALLBACK_INDEX.items) ? FALLBACK_INDEX.items : [];
    items = fallbackItems
      .filter((item) => item && typeof item.id === 'string' && typeof item.title === 'string')
      .map(mapItem);
    generatedAt = (FALLBACK_INDEX && FALLBACK_INDEX.generated_at) || '';
  }

  let config = DEFAULT_CONFIG;
  if (configResult.status === 'fulfilled' && configResult.value && configResult.value.value && typeof configResult.value.value === 'object') {
    config = configResult.value.value;
  }

  let reports = [];
  if (reportsResult.status === 'fulfilled' && reportsResult.value && reportsResult.value.value && Array.isArray(reportsResult.value.value.reports)) {
    reports = reportsResult.value.value.reports
      .filter((report) => report && typeof report.id === 'string')
      .map(mapReport);
  }

  const annotations = annotationsResult.status === 'fulfilled'
    && annotationsResult.value
    && annotationsResult.value.value
    && annotationsResult.value.value.items
    && typeof annotationsResult.value.value.items === 'object'
    && !Array.isArray(annotationsResult.value.value.items)
    ? annotationsResult.value.value.items
    : {};

  state.config = config;
  state.items = items;
  state.reports = reports;
  state.docs = items.concat(reports);
  state.annotations = annotations;
  state.generatedAt = generatedAt;
  state.refDate = computeReferenceDate();
  state.loaded = true;
  state.preview = !viaHost;
  state.contentCache.clear();
  state.selectedId = '';
  state.editing = false;
  state.saving = false;
  state.currentContent = '';
  state.contentLoading = false;
  state.contentError = '';
  state.statusMessage = '已读取 ' + items.length + ' 条 / ' + reports.length + ' 份报告';

  document.title = config.title || '工作台';
  els.brandName.textContent = config.title || '工作台';
  els.brandMark.textContent = config.mark || 'W';
  els.search.placeholder = t('searchPlaceholder', '搜索标题、机构、文号或关键词');

  render();
}

/* ---------- events ---------- */

els.search.addEventListener('input', () => {
  state.search = els.search.value;
  if (state.selectedId) {
    state.selectedId = '';
    state.editing = false;
    state.currentContent = '';
    state.contentLoading = false;
    state.contentError = '';
    render();
    return;
  }
  renderFilters();
  renderMain();
});

els.refresh.addEventListener('click', () => void loadData());

els.close.addEventListener('click', () => {
  void host.close().catch(() => undefined);
});

document.addEventListener('keydown', (event) => {
  const modifier = event.ctrlKey || event.metaKey;
  if (modifier && String(event.key).toLowerCase() === 's') {
    event.preventDefault();
    if (state.editing) void saveAnnotation();
    return;
  }

  if (event.key === 'Escape') {
    if (document.activeElement === els.search) {
      state.search = '';
      els.search.value = '';
      renderFilters();
      renderMain();
      els.search.blur();
      return;
    }
    if (state.editing) {
      cancelEdit();
      return;
    }
    if (state.selectedId) {
      closeDetail();
      return;
    }
    if (hasActiveFilters()) clearFilters();
    return;
  }

  const target = event.target;
  const typing = target instanceof HTMLElement
    && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable);
  if (event.key === '/' && !typing) {
    event.preventDefault();
    els.search.focus();
    els.search.select();
  }
});

els.main.addEventListener('click', (event) => {
  const anchor = event.target.closest('a[href]');
  if (!anchor) return;
  const href = anchor.getAttribute('href');
  if (!href || href.charAt(0) === '#') return;
  event.preventDefault();
  if (/^https?:\/\//i.test(href) || href.indexOf(LOCAL_BASE) === 0) {
    void openUrl(href);
  } else {
    toast('暂不打开链接：' + href);
  }
});

host.onReady((ctx) => {
  state.surface = ctx.surface || 'panel';
  state.directory = ctx.directory || '';
  state.session = ctx.session || null;
  document.body.dataset.theme = ctx.theme && ctx.theme.mode === 'dark' ? 'dark' : 'light';
  document.body.dataset.surface = state.surface;
  renderStatus();
  if (state.preview || !state.loaded) void loadData();
});

host.onSession((session) => {
  state.session = session;
  renderStatus();
});

render();
void loadData();
