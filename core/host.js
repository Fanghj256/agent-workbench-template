/*
 * Host boundary.
 *
 * core/app.js never talks to a specific host directly. It calls this interface:
 *   ready, loadConfig, loadIndex, loadAnnotations, saveAnnotations,
 *   loadItem, loadReports, sendToAgent, openExternal, copyText, close
 *
 * A host adapter (OpenChamber, DSH, OpenCode, a desktop shell, ...) only needs
 * to set window.workbenchHost before this file loads. If nothing is injected,
 * the built-in web adapter talks to server/server.mjs over /api/*.
 */
(function () {
  'use strict';

  var REQUIRED_METHODS = [
    'ready',
    'loadConfig',
    'loadIndex',
    'loadAnnotations',
    'saveAnnotations',
    'loadItem',
    'loadReports',
    'sendToAgent',
    'openExternal',
    'copyText',
    'close'
  ];

  async function requestJson(path, options) {
    var response;
    try {
      response = await fetch(path, Object.assign({ cache: 'no-store' }, options || {}));
    } catch (error) {
      throw new Error('无法连接工作台服务。请确认 server/server.mjs 已启动。');
    }

    var text = await response.text();
    var data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (error) {
        throw new Error('服务返回了无法解析的 JSON（HTTP ' + response.status + '）。');
      }
    }

    if (!response.ok) {
      var message = data && typeof data.message === 'string' && data.message
        ? data.message
        : data && typeof data.error === 'string' && data.error
          ? data.error
          : 'HTTP ' + response.status;
      throw new Error(message);
    }

    return data;
  }

  function fallbackCopy(text) {
    var area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', 'readonly');
    area.style.position = 'fixed';
    area.style.top = '-1000px';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (error) {
      ok = false;
    }
    document.body.removeChild(area);
    if (!ok) throw new Error('浏览器不允许自动复制，请手动选择文本。');
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch (error) {
        // Permission denied or a host webview without clipboard access.
      }
    }
    fallbackCopy(text);
  }

  function createWebHost() {
    return {
      name: 'web',
      capabilities: {
        chat: false,
        files: false,
        clipboard: true,
        externalLinks: true
      },

      async ready() {
        return { surface: 'page' };
      },

      loadConfig: function () {
        return requestJson('/api/config');
      },

      loadIndex: function () {
        return requestJson('/api/index');
      },

      loadAnnotations: function () {
        return requestJson('/api/annotations');
      },

      saveAnnotations: function (payload) {
        return requestJson('/api/annotations', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      },

      loadItem: function (id) {
        return requestJson('/api/item/' + encodeURIComponent(id));
      },

      loadReports: function () {
        return requestJson('/api/reports');
      },

      async sendToAgent(input) {
        await copyText(input.text);
        return {
          delivered: false,
          copied: true,
          note: input.mode === 'send'
            ? 'Web 版没有会话宿主，内容已复制，可粘贴到任意对话。'
            : 'Web 版没有会话宿主，内容已复制到剪贴板。'
        };
      },

      async openExternal(url) {
        if (!/^https?:\/\//i.test(String(url))) {
          throw new Error('只允许打开 http(s) 链接。');
        }
        window.open(url, '_blank', 'noopener,noreferrer');
      },

      copyText: copyText,

      async close() {
        return { closed: false };
      }
    };
  }

  function hasRequiredMethods(candidate) {
    return Boolean(candidate) && REQUIRED_METHODS.every(function (name) {
      return typeof candidate[name] === 'function';
    });
  }

  function resolveHost() {
    var injected = window.workbenchHost;
    if (hasRequiredMethods(injected)) return injected;

    if (injected) {
      console.warn(
        '[workbench] window.workbenchHost is missing required methods; using the web adapter.',
        REQUIRED_METHODS.filter(function (name) {
          return typeof injected[name] !== 'function';
        })
      );
    }

    return createWebHost();
  }

  window.WorkbenchHost = {
    resolve: resolveHost,
    createWebHost: createWebHost,
    requiredMethods: REQUIRED_METHODS.slice()
  };
})();

