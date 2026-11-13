/*
 * Markdown boundary.
 * Uses the vendored markdown-it build (MIT) when present, with raw HTML disabled.
 * The fallback only escapes text, so a missing vendor file never turns into an XSS sink.
 */
(function () {
  'use strict';

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function createRenderer() {
    var factory = window.markdownit;
    if (typeof factory !== 'function') {
      console.warn('[workbench] markdown-it was not found; using plain-text fallback.');
      return {
        render: function (text) {
          var body = escapeHtml(text || '').replace(/\r?\n/g, '<br>');
          return '<p>' + body + '</p>';
        }
      };
    }

    var md = factory({
      html: false,
      linkify: true,
      breaks: false,
      typographer: false
    });

    var defaultLinkOpen = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

    md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
      tokens[idx].attrSet('rel', 'noopener noreferrer');
      return defaultLinkOpen(tokens, idx, options, env, self);
    };

    return md;
  }

  var renderer = createRenderer();

  function render(text) {
    return renderer.render(String(text == null ? '' : text));
  }

  function renderInto(element, text) {
    if (!element) return;
    element.innerHTML = render(text);

    element.querySelectorAll('table').forEach(function (table) {
      var parent = table.parentElement;
      if (parent && parent.classList.contains('table-scroll')) return;
      var wrap = document.createElement('div');
      wrap.className = 'table-scroll';
      table.parentNode.insertBefore(wrap, table);
      wrap.appendChild(table);
    });

    element.querySelectorAll('img').forEach(function (image) {
      image.loading = 'lazy';
      image.referrerPolicy = 'no-referrer';
    });
  }

  window.WorkbenchMarkdown = {
    create: createRenderer,
    render: render,
    renderInto: renderInto,
    escapeHtml: escapeHtml
  };
})();

