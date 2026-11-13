/*
 * Agent Workbench Template
 * Plain browser JS: state -> render. No framework, no build step.
 *
 * The app only knows the host interface in host.js. It never imports a
 * host-specific SDK and never writes files directly.
 */
(function () {
  'use strict';

  var host = window.WorkbenchHost.resolve();
  var markdown = window.WorkbenchMarkdown;

  var TIME_OPTIONS = [
    { id: 'all', label: '全部时间' },
    { id: '7d', label: '近 7 天' },
    { id: '30d', label: '近 30 天' },
    { id: 'year', label: '今年' }
  ];

  var state = {
    tab: 'today',
    primary: 'all',
    secondary: 'all',
    status: 'all',
    time: 'all',
    reportType: 'all',
    search: '',
    selected: null,
    editing: false,
    saving: false,
    draft: { summary: '', judgment: '', status: '' },
    config: null,
    items: [],
    reports: [],
    annotations: {},
    generatedAt: '',
    refDate: null,
    cache: new Map(),
    content: { id: '', loading: false, error: '', text: '' },
    statusMessage: '正在读取工作台…',
    ready: false,
    error: '',
    pendingFocus: ''
  };

  var els = {};
  var toastTimer = 0;
  var searchTimer = 0;

  /* ---------- small helpers ---------- */

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function t(key, fallback) {
    var labels = state.config && state.config.labels ? state.config.labels : {};
    return labels[key] || fallback;
  }

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function startOfToday() {
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  function parseDate(value) {
    if (!value) return null;
    var match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));
    if (!match) return null;
    var date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function formatDate(value) {
    return value ? String(value).slice(0, 10) : '—';
  }

  function dayDiff(later, earlier) {
    return Math.round((later.getTime() - earlier.getTime()) / 86400000);
  }

  function daysFromRef(value) {
    var date = parseDate(value);
    if (!date || !state.refDate) return null;
    return dayDiff(state.refDate, date);
  }

  function computeReferenceDate() {
    var setting = state.config && state.config.today ? state.config.today.referenceDate : 'auto';

    if (setting === 'latest') {
      var latest = null;
      state.items.forEach(function (item) {
        var date = parseDate(item.published_at);
        if (date && (!latest || date > latest)) latest = date;
      });
      if (latest) return latest;
    }

    if (typeof setting === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(setting)) {
      var fixed = parseDate(setting);
      if (fixed) return fixed;
    }

    return startOfToday();
  }

  function primaryField() {
    return (state.config && state.config.dimensions && state.config.dimensions.primary
      && state.config.dimensions.primary.field) || 'level';
  }

  function secondaryField() {
    return (state.config && state.config.dimensions && state.config.dimensions.secondary
      && state.config.dimensions.secondary.field) || 'kind';
  }

  function primaryLabel() {
    return (state.config && state.config.dimensions && state.config.dimensions.primary
      && state.config.dimensions.primary.label) || '层级';
  }

  function secondaryLabel() {
    return (state.config && state.config.dimensions && state.config.dimensions.secondary
      && state.config.dimensions.secondary.label) || '类型';
  }

  function statuses() {
    return (state.config && Array.isArray(state.config.statuses)) ? state.config.statuses : [];
  }

  function types() {
    return (state.config && Array.isArray(state.config.types)) ? state.config.types : [];
  }

  function reportTypes() {
    return (state.config && state.config.reports && Array.isArray(state.config.reports.types))
      ? state.config.reports.types
      : [];
  }

  function defaultStatus() {
    var list = statuses();
    return list.length ? list[0].label : '';
  }

  function toneForStatus(label) {
    var found = statuses().filter(function (item) {
      return item && item.label === label;
    })[0];
    return found && found.tone ? found.tone : 'muted';
  }

  function annotationFor(item) {
    if (!item || !Object.prototype.hasOwnProperty.call(state.annotations, item.id)) return {};
    return state.annotations[item.id] || {};
  }

  function itemStatus(item) {
    return annotationFor(item).status || item.status || defaultStatus();
  }

  function itemSummary(item) {
    var annotation = annotationFor(item);
    return annotation.summary || item.summary || '';
  }

  function itemJudgment(item) {
    return annotationFor(item).judgment || '';
  }

  function itemById(id) {
    return state.items.filter(function (item) { return item.id === id; })[0] || null;
  }

  function reportById(id) {
    return state.reports.filter(function (report) { return report.id === id; })[0] || null;
  }

  /* ---------- filtering ---------- */

  function recentWindowItems() {
    var days = (state.config && state.config.today && Number(state.config.today.recentDays)) || 14;
    return state.items.filter(function (item) {
      var age = daysFromRef(item.published_at);
      return age !== null && age >= 0 && age <= days;
    });
  }

  function recentItems() {
    var recent = recentWindowItems();
    if (recent.length) return recent;

    return state.items.slice().sort(function (a, b) {
      return String(b.published_at || '').localeCompare(String(a.published_at || ''));
    }).slice(0, 8);
  }

  function matchesTime(item) {
    if (state.time === 'all') return true;
    var date = parseDate(item.published_at);
    if (!date) return false;
    var age = daysFromRef(item.published_at);
    if (state.time === '7d') return age !== null && age <= 7;
    if (state.time === '30d') return age !== null && age <= 30;
    if (state.time === 'year') {
      return Boolean(state.refDate) && date.getFullYear() === state.refDate.getFullYear();
    }
    return true;
  }

  function matchesItem(item) {
    if (state.primary !== 'all' && String(item[primaryField()] || '') !== state.primary) return false;
    if (state.secondary !== 'all' && String(item[secondaryField()] || '') !== state.secondary) return false;
    if (state.status !== 'all' && itemStatus(item) !== state.status) return false;
    if (!matchesTime(item)) return false;

    var query = state.search.trim().toLowerCase();
    if (!query) return true;

    var haystack = [
      item.title,
      item.issuer,
      item.doc_number,
      item[primaryField()],
      item[secondaryField()],
      (item.themes || []).join(' '),
      item.summary,
      itemSummary(item),
      itemJudgment(item)
    ].join(' ').toLowerCase();

    return haystack.indexOf(query) !== -1;
  }

  function currentScope() {
    return state.tab === 'today' ? recentItems() : state.items;
  }

  function filteredItems(scope) {
    var source = scope || currentScope();
    return source.filter(matchesItem);
  }

  function filteredReports() {
    var query = state.search.trim().toLowerCase();
    return state.reports.filter(function (report) {
      if (state.reportType !== 'all' && report.type !== state.reportType) return false;
      if (!query) return true;
      var haystack = [
        report.title,
        report.type,
        report.period,
        report.summary,
        report.content
      ].join(' ').toLowerCase();
      return haystack.indexOf(query) !== -1;
    });
  }

  function hasActiveFilters() {
    return state.primary !== 'all'
      || state.secondary !== 'all'
      || state.status !== 'all'
      || state.time !== 'all'
      || state.reportType !== 'all'
      || state.search.trim() !== '';
  }

  function primaryOptions() {
    var field = primaryField();
    var seen = [];
    state.items.forEach(function (item) {
      var value = item[field];
      if (value && seen.indexOf(value) === -1) seen.push(value);
    });
    return seen;
  }

  function sortByPriority(items) {
    return items.slice().sort(function (a, b) {
      var priorityA = Number(a.priority) || 0;
      var priorityB = Number(b.priority) || 0;
      if (priorityB !== priorityA) return priorityB - priorityA;
      return String(b.published_at || '').localeCompare(String(a.published_at || ''));
    });
  }

  function sortByDate(items) {
    return items.slice().sort(function (a, b) {
      var byDate = String(b.published_at || '').localeCompare(String(a.published_at || ''));
      if (byDate !== 0) return byDate;
      return (Number(b.priority) || 0) - (Number(a.priority) || 0);
    });
  }

  /* ---------- chrome ---------- */

  function renderTabs() {
    var active = state.tab;
    var counts = {
      today: state.ready ? recentItems().length : 0,
      library: state.ready ? state.items.length : 0,
      reports: state.ready ? state.reports.length : 0
    };

    var labels = [
      { id: 'today', label: t('today', '今日') },
      { id: 'library', label: t('library', '资料库') },
      { id: 'reports', label: t('reports', '报告') },
      { id: 'settings', label: t('settings', '设置') }
    ];

    var scroll = els.tabs.scrollLeft;
    els.tabs.replaceChildren();

    if (state.error && !state.ready) {
      return;
    }

    labels.forEach(function (tab) {
      var button = el('button', 'tab' + (active === tab.id ? ' active' : ''));
      button.type = 'button';
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-selected', active === tab.id ? 'true' : 'false');
      button.setAttribute('aria-controls', 'main');
      button.dataset.tab = tab.id;
      button.append(el('span', 'tab-label', tab.label));
      if (counts[tab.id]) button.append(el('span', 'tab-count', String(counts[tab.id])));
      button.addEventListener('click', function () {
        switchTab(tab.id);
      });
      els.tabs.append(button);
    });

    els.tabs.scrollLeft = scroll;
  }

  function chip(label, active, onClick) {
    var button = el('button', 'chip' + (active ? ' active' : ''), label);
    button.type = 'button';
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
    button.addEventListener('click', onClick);
    return button;
  }

  function selectControl(labelText, options, value, onChange) {
    var wrap = el('label', 'select-wrap');
    wrap.append(el('span', 'select-label', labelText));
    var select = el('select', 'select');
    options.forEach(function (option) {
      var node = el('option', '', option.label);
      node.value = option.id;
      select.append(node);
    });
    select.value = value;
    select.setAttribute('aria-label', labelText);
    select.addEventListener('change', function () {
      onChange(select.value);
    });
    wrap.append(select);
    return wrap;
  }

  function countText() {
    if (state.tab === 'reports') return '共 ' + filteredReports().length + ' 份';
    return '共 ' + filteredItems().length + ' 条';
  }

  function updateFilterCount() {
    var node = document.getElementById('filter-count');
    if (node) node.textContent = countText();
  }

  function renderFilters() {
    if (!state.ready || state.selected || state.tab === 'settings') {
      els.filters.hidden = true;
      els.filters.replaceChildren();
      return;
    }

    els.filters.hidden = false;
    var previousScroll = Array.prototype.map.call(
      els.filters.querySelectorAll('.filter-row'),
      function (row) { return row.scrollLeft; }
    );

    els.filters.replaceChildren();

    if (state.tab === 'reports') {
      var reportRow = el('div', 'filter-row');
      reportRow.append(el('span', 'filter-label', secondaryLabel()));
      reportRow.append(chip('全部类型', state.reportType === 'all', function () {
        state.reportType = 'all';
        renderFilters();
        renderMain();
      }));
      reportTypes().forEach(function (type) {
        reportRow.append(chip(type, state.reportType === type, function () {
          state.reportType = type;
          renderFilters();
          renderMain();
        }));
      });
      reportRow.append(el('span', 'filter-right', ''));
      reportRow.lastChild.append(el('span', 'filter-count', '共 ' + filteredReports().length + ' 份'));
      els.filters.append(reportRow);
      return;
    }

    var primaryRow = el('div', 'filter-row');
    primaryRow.append(el('span', 'filter-label', primaryLabel()));
    primaryRow.append(chip('全部', state.primary === 'all', function () {
      state.primary = 'all';
      renderFilters();
      renderMain();
    }));
    primaryOptions().forEach(function (value) {
      primaryRow.append(chip(value, state.primary === value, function () {
        state.primary = value;
        renderFilters();
        renderMain();
      }));
    });

    var secondaryRow = el('div', 'filter-row');
    secondaryRow.append(el('span', 'filter-label', secondaryLabel()));
    secondaryRow.append(chip('全部', state.secondary === 'all', function () {
      state.secondary = 'all';
      renderFilters();
      renderMain();
    }));
    types().forEach(function (type) {
      secondaryRow.append(chip(type, state.secondary === type, function () {
        state.secondary = type;
        renderFilters();
        renderMain();
      }));
    });

    var right = el('div', 'filter-right');
    right.append(
      selectControl('状态', [{ id: 'all', label: '全部状态' }].concat(
        statuses().map(function (item) { return { id: item.label, label: item.label }; })
      ), state.status, function (value) {
        state.status = value;
        renderFilters();
        renderMain();
      }),
      selectControl('时间', TIME_OPTIONS, state.time, function (value) {
        state.time = value;
        renderFilters();
        renderMain();
      }),
      el('span', 'filter-count', countText())
    );
    right.querySelector('.filter-count').id = 'filter-count';
    secondaryRow.append(right);

    els.filters.append(primaryRow, secondaryRow);

    Array.prototype.forEach.call(els.filters.querySelectorAll('.filter-row'), function (row, index) {
      if (previousScroll[index]) row.scrollLeft = previousScroll[index];
    });
  }

  function renderStatus() {
    els.status.textContent = state.statusMessage;
    var right = state.ready
      ? state.items.length + ' 条 · ' + state.reports.length + ' 份报告 · ' + host.name
      : 'host: ' + host.name;
    els.meta.textContent = right;
    els.main.setAttribute('aria-busy', state.ready ? 'false' : 'true');
  }

  /* ---------- list building ---------- */

  function statusBadge(label) {
    return el('span', 'badge badge-' + toneForStatus(label), label);
  }

  function emptyState() {
    var wrap = el('div', 'empty');
    wrap.append(
      el('div', 'empty-title', t('emptyTitle', '没有匹配的条目')),
      el('div', 'empty-hint', t('emptyHint', '调整筛选条件，或清空搜索后再试。'))
    );
    if (hasActiveFilters()) {
      var clear = el('button', 'btn small', t('clearFilters', '清空筛选'));
      clear.type = 'button';
      clear.addEventListener('click', clearFilters);
      wrap.append(clear);
    }
    return wrap;
  }

  function renderList(items, emptyTitle) {
    if (!items.length) {
      return emptyTitle ? (function () {
        var wrap = emptyState();
        wrap.querySelector('.empty-title').textContent = emptyTitle;
        return wrap;
      })() : emptyState();
    }

    var list = el('div', 'list');

    var head = el('div', 'list-head');
    ['日期', primaryLabel(), secondaryLabel(), '标题 / 摘要', '状态', '机构'].forEach(function (label) {
      head.append(el('span', '', label));
    });
    list.append(head);

    items.forEach(function (item) {
      var row = el('button', 'list-row');
      row.type = 'button';
      row.dataset.id = item.id;
      row.append(
        el('span', 'list-date', formatDate(item.published_at)),
        el('span', 'list-level', item[primaryField()] || '—'),
        el('span', 'list-kind', item[secondaryField()] || '—')
      );

      var main = el('span', 'list-main');
      main.append(
        el('span', 'list-title', item.title),
        el('span', 'list-summary', itemSummary(item) || '暂无摘要'),
        el('span', 'list-mobile-meta', [
          formatDate(item.published_at),
          item[primaryField()],
          item[secondaryField()],
          item.issuer
        ].filter(Boolean).join(' · '))
      );
      row.append(main, statusBadge(itemStatus(item)), el('span', 'list-issuer', item.issuer || '—'));

      row.addEventListener('click', function () {
        openItem(item.id);
      });
      list.append(row);
    });

    return list;
  }

  function renderReportList(reports) {
    if (!reports.length) return emptyState();

    var list = el('div', 'list');
    var head = el('div', 'list-head report-row');
    ['日期', '类型', '标题 / 摘要'].forEach(function (label) {
      head.append(el('span', '', label));
    });
    list.append(head);

    reports.forEach(function (report) {
      var row = el('button', 'list-row report-row');
      row.type = 'button';
      row.append(
        el('span', 'list-date', formatDate(report.date)),
        el('span', 'list-kind', report.type || '—')
      );
      var main = el('span', 'list-main');
      main.append(
        el('span', 'list-title', report.title),
        el('span', 'list-summary', report.summary || '暂无摘要'),
        el('span', 'list-mobile-meta', [
          formatDate(report.date),
          report.type,
          report.period
        ].filter(Boolean).join(' · '))
      );
      row.append(main);
      row.addEventListener('click', function () {
        openReport(report.id);
      });
      list.append(row);
    });

    return list;
  }

  /* ---------- pages ---------- */

  function renderToday() {
    var config = state.config || {};
    var todayConfig = config.today || {};
    var recentDays = Number(todayConfig.recentDays) || 14;
    var deadlineDays = Number(todayConfig.deadlineDays) || 7;
    var pendingStatuses = Array.isArray(todayConfig.pendingStatuses) && todayConfig.pendingStatuses.length
      ? todayConfig.pendingStatuses
      : [defaultStatus()].filter(Boolean);

    var recentWindow = recentWindowItems();
    var recent = recentWindow.length ? recentWindow : recentItems();
    var fallback = recentWindow.length === 0;
    var pending = state.items.filter(function (item) {
      return pendingStatuses.indexOf(itemStatus(item)) !== -1;
    });
    var deadlines = state.items.filter(function (item) {
      var deadline = parseDate(item.deadline);
      if (!deadline || !state.refDate) return false;
      var days = dayDiff(deadline, state.refDate);
      return days >= 0 && days <= deadlineDays;
    });

    var wrap = el('div', 'page');

    var head = el('div', 'page-head');
    head.append(
      el('h1', 'page-title', t('today', '今日')),
      el('span', 'page-note', fallback
        ? '近 ' + recentDays + ' 天无新增 · 显示最近 ' + recent.length + ' 条'
        : [
          todayConfig.referenceDate === 'latest'
            ? '以 ' + formatDateISO(state.refDate) + ' 为基准'
            : '截至今天',
          '近 ' + recentDays + ' 天'
        ].join(' · '))
    );
    wrap.append(head);

    var stats = el('div', 'stats');
    [
      ['近 ' + recentDays + ' 天新增', recentWindow.length],
      [pendingStatuses.join(' / ') || '待处理', pending.length],
      [deadlineDays + ' 天内截止', deadlines.length]
    ].forEach(function (entry) {
      var stat = el('div', 'stat');
      stat.append(el('span', 'stat-num', String(entry[1])), el('span', 'stat-label', entry[0]));
      stats.append(stat);
    });
    wrap.append(stats);

    var focus = sortByPriority(filteredItems(recent)).slice(0, Number(todayConfig.focusCount) || 3);
    if (focus.length) {
      var focusSection = el('section', 'section');
      var focusHead = el('div', 'section-head');
      focusHead.append(
        el('h2', 'section-title', '重点'),
        el('span', 'section-note', fallback
          ? '最近更新，按优先级排序'
          : '按优先级和日期排序，点开可编辑摘要')
      );
      focusSection.append(focusHead);

      var grid = el('div', 'focus-grid');
      focus.forEach(function (item) {
        var card = el('button', 'focus');
        card.type = 'button';

        var meta = el('span', 'focus-meta');
        meta.append(
          el('span', '', [
            item[primaryField()],
            item[secondaryField()],
            formatDate(item.published_at)
          ].filter(Boolean).join(' · ')),
          statusBadge(itemStatus(item))
        );
        card.append(
          meta,
          el('span', 'focus-title', item.title),
          el('span', 'focus-summary', itemSummary(item) || '暂无摘要')
        );
        card.addEventListener('click', function () {
          openItem(item.id);
        });
        grid.append(card);
      });
      focusSection.append(grid);
      wrap.append(focusSection);
    }

    var feedSection = el('section', 'section');
    var feedHead = el('div', 'section-head');
    var feedItems = sortByDate(filteredItems(recent));
    feedHead.append(
      el('h2', 'section-title', '动态'),
      el('span', 'section-note', fallback
        ? '最近 ' + feedItems.length + ' 条'
        : feedItems.length + ' 条 · 近 ' + recentDays + ' 天')
    );
    feedSection.append(feedHead, renderList(feedItems, fallback
      ? '最近条目里没有匹配的结果'
      : '近 ' + recentDays + ' 天没有匹配的条目'));
    wrap.append(feedSection);

    return wrap;
  }

  function formatDateISO(date) {
    if (!date) return '';
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
  }

  function renderLibrary() {
    var items = filteredItems(state.items);
    var wrap = el('div', 'page');
    var head = el('div', 'page-head');
    head.append(
      el('h1', 'page-title', t('library', '资料库')),
      el('span', 'page-note', '共 ' + items.length + ' 条'
        + (state.generatedAt ? ' · 数据生成于 ' + state.generatedAt : ''))
    );
    wrap.append(head, renderList(items));
    return wrap;
  }

  function renderReports() {
    var reports = filteredReports();
    var wrap = el('div', 'page');
    var head = el('div', 'page-head');
    head.append(
      el('h1', 'page-title', t('reports', '报告')),
      el('span', 'page-note', '共 ' + reports.length + ' 份')
    );
    wrap.append(head, renderReportList(reports));
    return wrap;
  }

  function settingsSection(title, rows, actions) {
    var section = el('section', 'settings-section');
    section.append(el('h2', 'settings-title', title));

    var list = el('dl', 'settings-rows');
    rows.forEach(function (row) {
      list.append(el('dt', 'settings-key', row[0]));
      var value = el('dd', 'settings-value' + (row[2] ? ' mono' : ''), row[1]);
      list.append(value);
    });
    section.append(list);

    if (actions && actions.length) {
      var bar = el('div', 'settings-actions');
      actions.forEach(function (action) { bar.append(action); });
      section.append(bar);
    }

    return section;
  }

  function settingsButton(label, onClick) {
    var button = el('button', 'btn small', label);
    button.type = 'button';
    button.addEventListener('click', onClick);
    return button;
  }

  function renderSettings() {
    var config = state.config || {};
    var wrap = el('div', 'page settings');
    var head = el('div', 'page-head');
    head.append(
      el('h1', 'page-title', t('settings', '设置')),
      el('span', 'page-note', '数据位置、宿主能力与快捷键')
    );
    wrap.append(head);

    wrap.append(settingsSection('工作台', [
      ['标题', config.title || '—'],
      ['说明', config.description || '—'],
      ['数据 schema', config.schema || '—', true],
      ['数据目录', config.libraryRoot || 'workbench', true],
      ['内容', state.items.length + ' 条 / ' + state.reports.length + ' 份报告'],
      ['批注', Object.keys(state.annotations).length + ' 条'],
      ['基准日期', state.refDate ? formatDateISO(state.refDate) : '—', true]
    ], [
      settingsButton('重新读取', function () { void loadData(); }),
      settingsButton('复制数据目录', function () {
        void copyAndToast(config.libraryRoot || 'workbench', '已复制数据目录');
      })
    ]));

    wrap.append(settingsSection('数据文件', [
      ['配置', (config.libraryRoot || 'workbench') + '/config.json', true],
      ['索引', (config.libraryRoot || 'workbench') + '/index.json', true],
      ['批注', (config.libraryRoot || 'workbench') + '/annotations.json', true],
      ['报告', (config.libraryRoot || 'workbench') + '/reports.json', true],
      ['正文', 'items/<id>/content.md（只读）', true]
    ], [
      settingsButton('复制启动命令', function () {
        void copyAndToast('node server/server.mjs', '已复制启动命令');
      })
    ]));

    var capabilities = host.capabilities || {};
    var hostLine = el('div', 'host-line');
    hostLine.append(el('span', 'host-pill', host.name || 'unknown'));
    hostLine.append(el('span', '', capabilities.chat
      ? '会话宿主：可用'
      : '会话宿主：不可用，分析/发送会降级为复制'));
    var hostSection = settingsSection('宿主', [
      ['名称', host.name || 'unknown', true],
      ['会话', capabilities.chat ? '支持' : '不支持（降级为复制）'],
      ['文件读写', capabilities.files ? '支持' : '由适配器 / 服务端决定'],
      ['剪贴板', capabilities.clipboard === false ? '不支持' : '支持']
    ], []);
    hostSection.append(hostLine);
    wrap.append(hostSection);

    wrap.append(settingsSection('快捷键', [
      ['搜索', '/'],
      ['清空搜索 / 返回', 'Esc'],
      ['保存批注', 'Ctrl / Cmd + S']
    ], []));

    var next = el('div', 'settings-section');
    next.append(
      el('h2', 'settings-title', '下一步'),
      el('p', 'page-intro', '读 docs/design-principles.md 了解 7 个部件；读 docs/data-contract.md 改数据；读 docs/customization.md 把标签、字段和 Tab 换成你的领域。')
    );
    wrap.append(next);

    return wrap;
  }

  /* ---------- detail ---------- */

  function metaChip(text, mono) {
    return el('span', 'meta-chip' + (mono ? ' mono' : ''), text);
  }

  function actionButton(label, className, onClick, disabled) {
    var button = el('button', 'btn ' + className, label);
    button.type = 'button';
    button.disabled = Boolean(disabled);
    button.addEventListener('click', onClick);
    return button;
  }

  function markdownBlock(text, className) {
    var block = el('div', 'prose' + (className ? ' ' + className : ''));
    markdown.renderInto(block, text);
    return block;
  }

  // The page already shows the title; drop a matching leading H1 from the
  // rendered source so the detail does not show the same heading twice.
  function stripLeadingTitle(text, title) {
    var source = String(text || '');
    var match = /^\s*#\s+(.+?)\s*(?:\r?\n|$)/.exec(source);
    if (!match) return source;
    if (match[1].trim() !== String(title || '').trim()) return source;
    return source.slice(match[0].length);
  }

  function renderItemDetail(item) {
    var wrap = el('div', 'detail-wrap');
    var detail = el('div', 'detail');

    var back = el('button', 'back-link', '← 返回');
    back.type = 'button';
    back.addEventListener('click', closeDetail);
    detail.append(back);

    var title = el('h1', 'detail-title', item.title);
    title.tabIndex = -1;
    detail.append(title);

    var meta = el('div', 'meta');
    meta.append(
      metaChip(item[primaryField()] || '—'),
      metaChip(item[secondaryField()] || '—'),
      metaChip(formatDate(item.published_at), true)
    );
    if (item.issuer) meta.append(metaChip(item.issuer));
    if (item.doc_number) meta.append(metaChip(item.doc_number, true));
    meta.append(statusBadge(itemStatus(item)));
    detail.append(meta);

    var links = el('div', 'detail-links');
    if (item.source_url) {
      links.append(actionButton('原文链接', 'link-btn', function () {
        void openExternal(item.source_url);
      }));
    }
    links.append(actionButton('复制 ID', 'link-btn', function () {
      void copyAndToast(item.id, '已复制 ID');
    }));
    detail.append(links);

    var note = el('section', 'note-block');
    var noteHead = el('div', 'note-head');
    noteHead.append(el('h2', 'note-title', t('summary', '摘要') + ' / ' + t('judgment', '判断')));
    if (!state.editing) {
      var editLink = actionButton('编辑', 'link-btn', enterEdit);
      noteHead.append(editLink);
    }
    note.append(noteHead);

    if (state.editing) {
      note.append(renderEditor(item));
    } else {
      var summary = itemSummary(item);
      if (summary) {
        note.append(markdownBlock(summary));
      } else {
        note.append(el('div', 'note-empty', '还没有摘要。点“编辑”写一条。'));
      }

      if (itemJudgment(item)) {
        note.append(el('h3', 'note-sub', t('judgment', '判断')));
        note.append(markdownBlock(itemJudgment(item)));
      } else {
        note.append(el('div', 'note-empty', '还没有判断。点“编辑”补充影响、截止时间或下一步。'));
      }
    }
    detail.append(note);

    var original = el('section', 'original-block');
    var originalHead = el('div', 'section-head');
    originalHead.append(
      el('h2', 'section-title', t('source', '原文')),
      el('span', 'section-note original-note', '来自 content.md，只读')
    );
    original.append(originalHead);

    if (state.content.loading) {
      original.append(el('div', 'loading-inline', '正在读取正文…'));
    } else if (state.content.error) {
      var error = el('div', 'error-box');
      error.append(
        el('strong', '', '正文读取失败'),
        el('span', '', state.content.error)
      );
      var retry = actionButton('重试', 'btn small', function () {
        void loadItemContent(item.id);
      });
      error.append(retry);
      original.append(error);
    } else {
      original.append(markdownBlock(stripLeadingTitle(state.content.text, item.title), 'doc-body'));
    }
    detail.append(original);
    wrap.append(detail);

    var bar = el('div', 'action-bar');
    bar.append(
      actionButton(state.editing ? '取消' : '编辑', 'btn', function () {
        if (state.editing) cancelEdit();
        else enterEdit();
      }),
      actionButton(state.saving ? '保存中…' : '保存', 'btn primary', function () {
        void saveAnnotation();
      }, !state.editing || state.saving),
      actionButton('让 Agent 分析', 'btn', function () {
        void sendItemToAgent(item, 'analyze');
      }),
      actionButton('放入对话', 'btn ghost', function () {
        void sendItemToAgent(item, 'compose');
      }),
      actionButton('发送', 'btn ghost', function () {
        void sendItemToAgent(item, 'send');
      }),
      el('span', 'action-note', state.editing ? 'Ctrl / Cmd + S 保存' : '原文只读')
    );
    wrap.append(bar);
    return wrap;
  }

  function renderEditor() {
    var form = el('div', 'edit-form');

    var summaryLabel = el('label', 'edit-field');
    summaryLabel.append(el('span', 'edit-label', t('summary', '摘要')));
    var summary = el('textarea', 'edit-area');
    summary.id = 'edit-summary';
    summary.rows = 4;
    summary.value = state.draft.summary;
    summary.placeholder = '一句话说清这条内容是什么，以及为什么值得看。支持 Markdown。';
    summary.addEventListener('input', function () {
      state.draft.summary = summary.value;
    });
    summaryLabel.append(summary);

    var judgmentLabel = el('label', 'edit-field');
    judgmentLabel.append(el('span', 'edit-label', t('judgment', '判断')));
    var judgment = el('textarea', 'edit-area');
    judgment.rows = 3;
    judgment.value = state.draft.judgment;
    judgment.placeholder = '影响、截止时间、下一步动作、谁来做。支持 Markdown。';
    judgment.addEventListener('input', function () {
      state.draft.judgment = judgment.value;
    });
    judgmentLabel.append(judgment);

    var row = el('div', 'edit-row');
    row.append(
      selectControl('状态', statuses().map(function (item) {
        return { id: item.label, label: item.label };
      }), state.draft.status, function (value) {
        state.draft.status = value;
      }),
      el('span', 'edit-hint', '保存到 annotations.json；原文 content.md 不会被修改。')
    );

    form.append(summaryLabel, judgmentLabel, row);
    return form;
  }

  function renderReportDetail(report) {
    var wrap = el('div', 'detail-wrap');
    var detail = el('div', 'detail');

    var back = el('button', 'back-link', '← 返回');
    back.type = 'button';
    back.addEventListener('click', closeDetail);
    detail.append(back);

    var title = el('h1', 'detail-title', report.title);
    title.tabIndex = -1;
    detail.append(title);

    var meta = el('div', 'meta');
    meta.append(metaChip(report.type || '报告'));
    if (report.period) meta.append(metaChip(report.period, true));
    meta.append(metaChip(formatDate(report.date), true));
    detail.append(meta);

    if (report.summary) {
      var note = el('section', 'note-block');
      note.append(el('h2', 'note-title', '摘要'), markdownBlock(report.summary));
      detail.append(note);
    }

    var original = el('section', 'original-block');
    original.append(el('h2', 'section-title', '全文'));
    original.append(markdownBlock(
      stripLeadingTitle(report.content || report.summary || '', report.title),
      'doc-body'
    ));
    detail.append(original);
    wrap.append(detail);

    var bar = el('div', 'action-bar');
    bar.append(
      actionButton('复制全文', 'btn', function () {
        void copyAndToast(report.content || '', '已复制报告全文');
      }),
      actionButton('发送', 'btn ghost', function () {
        void sendReport(report);
      }),
      el('span', 'action-note', '报告为只读')
    );
    wrap.append(bar);
    return wrap;
  }

  /* ---------- main render ---------- */

  function focusPending() {
    if (!state.pendingFocus) return;
    var selector = state.pendingFocus === 'summary' ? '#edit-summary' : '.detail-title';
    var node = els.main.querySelector(selector);
    if (node) {
      node.focus({ preventScroll: false });
      if (node.setSelectionRange && state.pendingFocus === 'summary') {
        var length = node.value.length;
        node.setSelectionRange(length, length);
      }
    }
    state.pendingFocus = '';
  }

  function renderMain() {
    els.main.replaceChildren();

    if (state.error && !state.ready) {
      var error = el('div', 'page');
      var box = el('div', 'error-box');
      box.append(el('strong', '', '工作台没有加载成功'), el('span', '', state.error));
      var retry = actionButton('重试', 'btn small', function () { void loadData(); });
      box.append(retry);
      error.append(box);
      els.main.append(error);
      els.main.setAttribute('aria-busy', 'false');
      return;
    }

    if (!state.ready) {
      els.main.append(el('div', 'loading-page', '正在读取工作台数据…'));
      els.main.setAttribute('aria-busy', 'true');
      return;
    }

    if (state.selected) {
      if (state.selected.type === 'item') {
        var item = itemById(state.selected.id);
        if (item) {
          els.main.append(renderItemDetail(item));
          els.main.setAttribute('aria-busy', 'false');
          focusPending();
          return;
        }
      } else if (state.selected.type === 'report') {
        var report = reportById(state.selected.id);
        if (report) {
          els.main.append(renderReportDetail(report));
          els.main.setAttribute('aria-busy', 'false');
          focusPending();
          return;
        }
      }
      state.selected = null;
    }

    if (state.tab === 'today') els.main.append(renderToday());
    else if (state.tab === 'library') els.main.append(renderLibrary());
    else if (state.tab === 'reports') els.main.append(renderReports());
    else els.main.append(renderSettings());

    els.main.setAttribute('aria-busy', 'false');
    focusPending();
  }

  function renderAll() {
    renderTabs();
    renderFilters();
    renderMain();
    renderStatus();
  }

  /* ---------- navigation ---------- */

  function resetContent() {
    state.content = { id: '', loading: false, error: '', text: '' };
  }

  function switchTab(tab) {
    if (state.tab === tab && !state.selected) return;
    state.tab = tab;
    state.selected = null;
    state.editing = false;
    state.saving = false;
    resetContent();
    renderAll();
    els.main.scrollTop = 0;
  }

  function openItem(id) {
    var item = itemById(id);
    if (!item) return;

    state.selected = { type: 'item', id: id };
    state.editing = false;
    state.saving = false;
    state.pendingFocus = 'title';

    var cached = state.cache.get(id);
    state.content = cached !== undefined
      ? { id: id, loading: false, error: '', text: cached }
      : { id: id, loading: true, error: '', text: '' };

    renderAll();
    els.main.scrollTop = 0;

    if (cached === undefined) void loadItemContent(id);
  }

  function openReport(id) {
    var report = reportById(id);
    if (!report) return;

    state.selected = { type: 'report', id: id };
    state.editing = false;
    state.saving = false;
    state.pendingFocus = 'title';
    resetContent();
    renderAll();
    els.main.scrollTop = 0;
  }

  function closeDetail() {
    state.selected = null;
    state.editing = false;
    state.saving = false;
    resetContent();
    renderAll();
    els.main.scrollTop = 0;
  }

  async function loadItemContent(id) {
    state.content = { id: id, loading: true, error: '', text: '' };
    renderMain();

    try {
      var result = await host.loadItem(id);
      state.cache.set(id, result && result.content ? result.content : '');
      if (isSelectedItem(id)) {
        state.content = { id: id, loading: false, error: '', text: result && result.content ? result.content : '' };
        renderMain();
      }
    } catch (error) {
      if (isSelectedItem(id)) {
        state.content = {
          id: id,
          loading: false,
          error: error && error.message ? error.message : String(error),
          text: ''
        };
        renderMain();
      }
    }
  }

  function isSelectedItem(id) {
    return Boolean(state.selected && state.selected.type === 'item' && state.selected.id === id);
  }

  /* ---------- editing ---------- */

  function enterEdit() {
    if (!state.selected || state.selected.type !== 'item') return;
    var item = itemById(state.selected.id);
    if (!item) return;

    state.draft = {
      summary: itemSummary(item),
      judgment: itemJudgment(item),
      status: itemStatus(item) || defaultStatus()
    };
    state.editing = true;
    state.pendingFocus = 'summary';
    renderMain();
  }

  function cancelEdit() {
    state.editing = false;
    state.saving = false;
    state.pendingFocus = 'title';
    renderMain();
  }

  async function saveAnnotation() {
    if (!state.editing || state.saving || !state.selected || state.selected.type !== 'item') return;
    var item = itemById(state.selected.id);
    if (!item) return;

    var updatedAt = new Date().toISOString();
    var annotation = {
      summary: state.draft.summary.trim(),
      judgment: state.draft.judgment.trim(),
      status: state.draft.status || defaultStatus(),
      updated_at: updatedAt
    };

    var next = Object.assign(Object.create(null), state.annotations);
    next[item.id] = annotation;

    var payload = {
      schema: 'workbench-annotations/v1',
      updated_at: updatedAt,
      items: next
    };

    state.saving = true;
    renderMain();

    try {
      await host.saveAnnotations(payload);
      state.annotations = next;
      state.editing = false;
      state.saving = false;
      state.statusMessage = '已保存 ' + item.id + ' 的批注';
      renderAll();
      toast('已保存到 annotations.json');
    } catch (error) {
      state.saving = false;
      renderMain();
      toast('保存失败：' + (error && error.message ? error.message : error));
    }
  }

  /* ---------- agent actions ---------- */

  function itemContext(item) {
    var lines = [
      '【工作台】' + item.title,
      'id：' + item.id,
      [item[primaryField()], item[secondaryField()], formatDate(item.published_at), item.issuer]
        .filter(Boolean).join(' · '),
      '摘要：' + (itemSummary(item) || '（暂无）'),
      '判断：' + (itemJudgment(item) || '（暂无）')
    ];
    if (item.source_url) lines.push('原文：' + item.source_url);
    else if (item.content_path) lines.push('正文：' + item.content_path);
    return lines.join('\n');
  }

  async function sendItemToAgent(item, mode) {
    var text = itemContext(item);
    if (mode === 'analyze') {
      text = '请从要点、影响、下一步动作和时间窗口四个角度分析下面这条内容。\n\n' + text;
    }

    try {
      var result = await host.sendToAgent({ text: text, mode: mode });
      if (!result) {
        toast('宿主没有返回结果，请检查适配器。');
      } else if (result.delivered) {
        toast(mode === 'compose' ? '已放入当前对话' : '已发送到当前会话');
      } else if (result.note) {
        toast(result.note);
      } else {
        toast('已复制到剪贴板');
      }
    } catch (error) {
      toast('操作失败：' + (error && error.message ? error.message : error));
    }
  }

  async function sendReport(report) {
    var text = '【工作台报告】' + report.title + '\n\n' + (report.content || report.summary || '');
    try {
      var result = await host.sendToAgent({ text: text, mode: 'send' });
      if (!result) {
        toast('宿主没有返回结果，请检查适配器。');
      } else if (result.delivered) {
        toast('已发送到当前会话');
      } else {
        toast(result.note || '已复制到剪贴板');
      }
    } catch (error) {
      toast('操作失败：' + (error && error.message ? error.message : error));
    }
  }

  async function openExternal(url) {
    try {
      await host.openExternal(url);
    } catch (error) {
      toast('打开链接失败：' + (error && error.message ? error.message : error));
    }
  }

  async function copyAndToast(text, message) {
    try {
      await host.copyText(text);
      toast(message || '已复制');
    } catch (error) {
      toast('复制失败：' + (error && error.message ? error.message : error));
    }
  }

  /* ---------- data ---------- */

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

  async function loadData() {
    state.statusMessage = '正在读取工作台…';
    state.error = '';
    renderStatus();

    try {
      var context = await host.ready();
      els.close.hidden = !(context && context.surface === 'dialog');
      if (context && context.theme === 'dark') {
        document.body.dataset.theme = 'dark';
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.body.dataset.theme = 'light';
        document.documentElement.style.colorScheme = 'light';
      }

      var results = await Promise.allSettled([
        host.loadConfig(),
        host.loadIndex(),
        host.loadAnnotations(),
        host.loadReports()
      ]);

      if (results[0].status !== 'fulfilled') throw results[0].reason;
      if (results[1].status !== 'fulfilled') throw results[1].reason;

      var config = results[0].value;
      var index = results[1].value;
      var annotations = results[2].status === 'fulfilled' ? results[2].value : null;
      var reports = results[3].status === 'fulfilled' ? results[3].value : null;

      if (results[2].status === 'rejected') {
        console.warn('[workbench] annotations could not be loaded:', results[2].reason);
      }
      if (results[3].status === 'rejected') {
        console.warn('[workbench] reports could not be loaded:', results[3].reason);
      }

      if (!config || typeof config !== 'object') {
        throw new Error('config.json 格式不正确：需要一个 JSON 对象。');
      }
      if (!index || !Array.isArray(index.items)) {
        throw new Error('index.json 格式不正确：缺少 items 数组。');
      }

      state.config = config;
      state.items = index.items.filter(function (item) {
        return item && typeof item.id === 'string' && typeof item.title === 'string';
      });
      state.annotations = annotations
        && annotations.items
        && typeof annotations.items === 'object'
        && !Array.isArray(annotations.items)
        ? annotations.items
        : {};
      state.reports = reports && Array.isArray(reports.reports) ? reports.reports : [];
      state.generatedAt = index.generated_at || '';
      state.cache.clear();
      state.refDate = computeReferenceDate();
      state.ready = true;
      state.error = '';

      document.title = config.title || '工作台';
      els.brandName.textContent = config.title || '工作台';
      els.brandMark.textContent = config.mark || 'W';
      els.search.placeholder = t('searchPlaceholder', '搜索标题、机构、文号或关键词');

      state.statusMessage = '已读取 ' + state.items.length + ' 条 · ' + state.reports.length + ' 份报告';
      state.selected = null;
      state.editing = false;
      state.saving = false;
      resetContent();

      renderAll();
    } catch (error) {
      state.ready = false;
      state.error = error && error.message ? error.message : String(error);
      state.statusMessage = '读取失败';
      renderAll();
    }
  }

  /* ---------- events ---------- */

  function isTyping(target) {
    if (!target) return false;
    var tag = target.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
  }

  function clearSearch() {
    state.search = '';
    els.search.value = '';
    renderMain();
    updateFilterCount();
  }

  function bindEvents() {
    els.search.addEventListener('input', function () {
      state.search = els.search.value;

      if (state.selected) {
        state.selected = null;
        state.editing = false;
        resetContent();
        renderAll();
        return;
      }

      window.clearTimeout(searchTimer);
      searchTimer = window.setTimeout(function () {
        renderMain();
        updateFilterCount();
      }, 80);
    });

    els.reload.addEventListener('click', function () {
      void loadData();
    });

    els.close.addEventListener('click', function () {
      Promise.resolve().then(function () {
        return host.close();
      }).catch(function () {
        /* host may not provide a close action */
      });
    });

    document.addEventListener('keydown', function (event) {
      var modifier = event.ctrlKey || event.metaKey;

      if (modifier && String(event.key).toLowerCase() === 's') {
        event.preventDefault();
        if (state.editing) void saveAnnotation();
        return;
      }

      if (event.key === 'Escape') {
        if (document.activeElement === els.search) {
          if (els.search.value) {
            clearSearch();
          } else {
            els.search.blur();
          }
          return;
        }
        if (state.editing) {
          cancelEdit();
          return;
        }
        if (state.selected) {
          closeDetail();
          return;
        }
        if (hasActiveFilters()) {
          clearFilters();
        }
        return;
      }

      if (event.key === '/' && !isTyping(event.target)) {
        event.preventDefault();
        els.search.focus();
        els.search.select();
      }
    });

    els.main.addEventListener('click', function (event) {
      var anchor = event.target.closest('a[href]');
      if (!anchor) return;
      var href = anchor.getAttribute('href');
      if (!href || href.charAt(0) === '#') return;
      event.preventDefault();

      if (/^https?:\/\//i.test(href)) {
        void openExternal(href);
      } else {
        toast('本地链接：' + href);
      }
    });
  }

  var toastNode = null;

  function toast(message) {
    window.clearTimeout(toastTimer);
    toastNode.textContent = message;
    toastNode.hidden = false;
    toastTimer = window.setTimeout(function () {
      toastNode.hidden = true;
    }, 2800);
  }

  /* ---------- boot ---------- */

  function init() {
    els.tabs = document.getElementById('tabs');
    els.filters = document.getElementById('filters');
    els.main = document.getElementById('main');
    els.search = document.getElementById('search');
    els.reload = document.getElementById('reload');
    els.close = document.getElementById('close');
    els.status = document.getElementById('status');
    els.meta = document.getElementById('meta');
    els.brandName = document.getElementById('brand-name');
    els.brandMark = document.getElementById('brand-mark');
    toastNode = document.getElementById('toast');

    bindEvents();
    renderAll();
    void loadData();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

