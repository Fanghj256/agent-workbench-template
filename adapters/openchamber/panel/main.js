(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // node_modules/@openchamber/sdk/dist/api-version.js
  var OPENCHAMBER_SDK_CHANNEL = "openchamber.sdk";
  var OPENCHAMBER_SDK_API_VERSION = 1;

  // node_modules/@openchamber/sdk/dist/scrollbar-style.js
  var GUEST_SCROLLING_ATTRIBUTE = "data-oc-scrolling";
  var GUEST_SCROLLBAR_CSS = `
:root {
  /* Quiet at rest like the app's own thumbs; hover gives a clear grab target. */
  --oc-scrollbar-thumb: color-mix(in srgb, var(--oc-muted, currentColor) 18%, transparent);
  --oc-scrollbar-thumb-hover: color-mix(in srgb, var(--oc-muted, currentColor) 36%, transparent);
  scrollbar-gutter: stable;
}
* {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}
:hover, [${GUEST_SCROLLING_ATTRIBUTE}] {
  scrollbar-color: var(--oc-scrollbar-thumb) transparent;
}
/* Chromium's standard scrollbar properties otherwise override its pseudo-elements. */
@supports selector(::-webkit-scrollbar) {
  *, :hover, [${GUEST_SCROLLING_ATTRIBUTE}] { scrollbar-width: auto; scrollbar-color: auto; }
  ::-webkit-scrollbar { width: 6px; height: 6px; background: transparent; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 999px;
    min-width: 24px;
    min-height: 24px;
  }
  :hover::-webkit-scrollbar-thumb, [${GUEST_SCROLLING_ATTRIBUTE}]::-webkit-scrollbar-thumb { background: var(--oc-scrollbar-thumb); }
  ::-webkit-scrollbar-thumb:hover { background: var(--oc-scrollbar-thumb-hover); }
  ::-webkit-scrollbar-corner { background: transparent; }
  ::-webkit-scrollbar-button { display: none; width: 0; height: 0; }
}
@media (forced-colors: active) {
  *, :hover, [${GUEST_SCROLLING_ATTRIBUTE}] { scrollbar-color: auto; }
  ::-webkit-scrollbar-thumb, ::-webkit-scrollbar-thumb:hover { background: CanvasText; }
}
`;
  function installGuestScrollbarActivity(doc) {
    const root2 = doc.documentElement;
    if (root2.hasAttribute("data-oc-scrollbar-activity"))
      return;
    root2.setAttribute("data-oc-scrollbar-activity", "");
    const timers = /* @__PURE__ */ new WeakMap();
    doc.addEventListener("scroll", (event) => {
      const target = event.target === doc ? root2 : event.target;
      if (!(target instanceof Element))
        return;
      if (!target.hasAttribute("data-oc-scrolling"))
        target.setAttribute("data-oc-scrolling", "");
      const pending = timers.get(target);
      if (pending !== void 0)
        clearTimeout(pending);
      timers.set(target, setTimeout(() => {
        timers.delete(target);
        target.removeAttribute("data-oc-scrolling");
      }, 1e3));
    }, { capture: true, passive: true });
  }
  var GUEST_SCROLLBAR_SCRIPT = `(${installGuestScrollbarActivity.toString()})(document);`;

  // node_modules/@openchamber/sdk/dist/workspace.js
  var GUEST_STORAGE_KEY_MAX = 128;
  var GUEST_STORAGE_VALUE_BYTES = 65536;

  // node_modules/@openchamber/sdk/dist/shells.js
  var GUEST_SHELL_ID_MAX = 128;
  var GUEST_SHELL_OUTPUT_TAIL_MAX = 65536;

  // node_modules/@openchamber/sdk/dist/status-controls.js
  var GUEST_STATUS_CONTROLS_MAX = 4;
  var GUEST_STATUS_CONTROL_ID = /^[a-z][a-z0-9-]{0,39}$/;
  var GUEST_STATUS_CONTROL_LABEL_MAX = 60;
  var GUEST_STATUS_CONTROL_OPTIONS_MAX = 16;
  var GUEST_STATUS_CONTROL_VALUE_MAX = 80;
  var isControlObject = (value) => Object(value) === value && !Array.isArray(value);
  var hasOnlyKeys = (value, keys) => Object.keys(value).every((key) => keys.includes(key));
  var isLabel = (value) => String(value) === value && value.length >= 1 && value.length <= GUEST_STATUS_CONTROL_LABEL_MAX;
  var isValue = (value) => String(value) === value && value.length >= 1 && value.length <= GUEST_STATUS_CONTROL_VALUE_MAX;
  var isGuestStatusControls = (controls) => {
    if (!Array.isArray(controls) || controls.length > GUEST_STATUS_CONTROLS_MAX)
      return false;
    const ids = /* @__PURE__ */ new Set();
    for (const control of controls) {
      if (!isControlObject(control) || !GUEST_STATUS_CONTROL_ID.test(control.id) || !isLabel(control.label))
        return false;
      if (control.disabled !== void 0 && control.disabled !== true && control.disabled !== false)
        return false;
      if (ids.has(control.id))
        return false;
      ids.add(control.id);
      if (control.kind === "button") {
        if (!hasOnlyKeys(control, ["kind", "id", "label", "disabled"]))
          return false;
        continue;
      }
      if (control.kind !== "select" || !hasOnlyKeys(control, ["kind", "id", "label", "value", "options", "disabled"]))
        return false;
      if (!isValue(control.value) || !Array.isArray(control.options) || control.options.length < 1 || control.options.length > GUEST_STATUS_CONTROL_OPTIONS_MAX)
        return false;
      const values = /* @__PURE__ */ new Set();
      for (const option of control.options) {
        if (!isControlObject(option) || !hasOnlyKeys(option, ["value", "label"]) || !isValue(option.value) || !isLabel(option.label) || values.has(option.value))
          return false;
        values.add(option.value);
      }
      if (!values.has(control.value))
        return false;
    }
    return true;
  };

  // node_modules/@openchamber/sdk/dist/manifest.js
  var GUEST_PROVIDER_LOGO_BYTES_MAX = 1024 * 1024;
  var TRACKER_URL_TOKENS = ["{id}", "{segment}", "{segments+}"];
  var TRACKER_URL_TOKEN_SET = new Set(TRACKER_URL_TOKENS);

  // node_modules/@openchamber/sdk/dist/session-events.js
  var GUEST_SESSION_EVENT_TYPES = [
    "turn-finished",
    "turn-failed",
    "permission-asked",
    "question-asked",
    "turn-started",
    "session-created",
    "session-archived",
    "session-deleted"
  ];
  var SESSION_EVENTS_IDLE_MS = 10 * 6e4;
  var EVENT_TYPES = new Set(GUEST_SESSION_EVENT_TYPES);

  // node_modules/@openchamber/sdk/dist/service-host.js
  var SERVICE_SCHEDULE_IDLE_MS = 10 * 6e4;
  var MENTIONS_IDLE_MS = 10 * 6e4;

  // node_modules/@openchamber/sdk/dist/file-editor.js
  var GUEST_FILE_EDITOR_CONTENT_MAX = 2e7;
  var GUEST_FILE_EDITOR_VERSION_MAX = 256;
  var fileEditorPayloadSize = (value) => "bytes" in value ? value.bytes.byteLength : value.content.length;
  var sameFileEditorDocument = (left, right) => {
    if (left.path !== right.path || left.readOnly !== right.readOnly)
      return false;
    if (left.encoding === "text" || right.encoding === "text") {
      return left.encoding === "text" && right.encoding === "text" && left.content === right.content;
    }
    if (left.bytes.byteLength !== right.bytes.byteLength)
      return false;
    for (let index = 0; index < left.bytes.byteLength; index += 1) {
      if (left.bytes[index] !== right.bytes[index])
        return false;
    }
    return true;
  };

  // node_modules/@openchamber/sdk/dist/popover.js
  var GUEST_POPOVER_ID = /^[A-Za-z0-9_-]{1,80}$/;
  var GUEST_POPOVER_COORDINATE_MAX = 1e5;
  var GUEST_POPOVER_WIDTH_MIN = 160;
  var GUEST_POPOVER_WIDTH_MAX = 640;
  var GUEST_POPOVER_HEIGHT_MIN = 48;
  var GUEST_POPOVER_HEIGHT_MAX = 480;
  var GUEST_POPOVER_DATA_MAX = 16e3;
  var GUEST_POPOVER_DATA_DEPTH_MAX = 32;
  var GUEST_POPOVER_SIDES = ["left", "right", "top", "bottom"];
  var hasBoundedJsonTree = (value, depth = 0, budget = { remaining: GUEST_POPOVER_DATA_MAX }) => {
    if (--budget.remaining < 0 || depth >= GUEST_POPOVER_DATA_DEPTH_MAX)
      return false;
    if (value === null)
      return true;
    const children = Array.isArray(value) ? value : Object(value) === value ? Object.values(value) : [];
    for (const item of children) {
      if (!hasBoundedJsonTree(item, depth + 1, budget))
        return false;
    }
    return true;
  };
  var isFiniteJson = (value) => {
    if (value === null || value === true || value === false)
      return true;
    if (Array.isArray(value))
      return Object.keys(value).every((key) => /^(0|[1-9]\d*)$/.test(key) && Number(key) < value.length) && value.every(isFiniteJson);
    if (Object(value) === value) {
      const prototype = Object.getPrototypeOf(value);
      return (prototype === null || prototype === Object.prototype) && Object.values(value).every(isFiniteJson);
    }
    return String(value) === value || Number.isFinite(value);
  };
  var isGuestPopoverRequest = (request) => {
    try {
      if (String(request.id) !== request.id || !GUEST_POPOVER_ID.test(request.id) || !Number.isFinite(request.anchor.x) || Math.abs(request.anchor.x) > GUEST_POPOVER_COORDINATE_MAX || !Number.isFinite(request.anchor.y) || Math.abs(request.anchor.y) > GUEST_POPOVER_COORDINATE_MAX || !Number.isFinite(request.anchor.width) || !Number.isFinite(request.anchor.height) || request.anchor.width <= 0 || request.anchor.height <= 0 || request.anchor.width > GUEST_POPOVER_COORDINATE_MAX || request.anchor.height > GUEST_POPOVER_COORDINATE_MAX || !Number.isInteger(request.width) || request.width < GUEST_POPOVER_WIDTH_MIN || request.width > GUEST_POPOVER_WIDTH_MAX || !Number.isInteger(request.height) || request.height < GUEST_POPOVER_HEIGHT_MIN || request.height > GUEST_POPOVER_HEIGHT_MAX || request.side !== void 0 && !GUEST_POPOVER_SIDES.includes(request.side) || request.focus !== void 0 && request.focus !== true && request.focus !== false || !hasBoundedJsonTree(request.data) || !isFiniteJson(request.data))
        return false;
      return JSON.stringify(request.data).length <= GUEST_POPOVER_DATA_MAX;
    } catch {
      return false;
    }
  };

  // node_modules/@openchamber/sdk/dist/contract.js
  var GUEST_BLOCK_ANSWER_MAX = 2e3;
  var GUEST_FILE_STAT_KINDS = ["file", "directory", "other", "missing"];
  var isStartSessionResult = (value) => Boolean(value && "sessionId" in value);
  var isPromptResult = (value) => Boolean(value && "sent" in value && !("sessionId" in value));
  var GUEST_COMMIT_SHA = /^[0-9a-f]{7,64}$/i;
  var isGuestCommitSha = (value) => GUEST_COMMIT_SHA.test(value);
  var GUEST_TOAST_MAX = 500;
  var GUEST_CLIPBOARD_TEXT_MAX = 32e3;
  var GUEST_COMPOSE_TEXT_MAX = 16e3;
  var GUEST_ATTACH_ID_MAX = 128;
  var GUEST_ATTACH_TITLE_MAX = 200;
  var GUEST_ATTACH_URL_MAX = 2e3;
  var GUEST_ATTACH_TEXT_MAX = 16e3;
  var GUEST_ATTACH_AUTHOR_MAX = 80;
  var GUEST_ATTACH_BRANCH_MAX = 200;
  var GUEST_ATTACH_DATA_MAX = 16e3;
  var GUEST_REQUEST_PATH_MAX = 2e3;
  var GUEST_REQUEST_TIMEOUT_MS = 2e4;
  var GUEST_FILE_PATH_MAX = 1024;
  var GUEST_FILE_CONTENT_MAX = 2e6;
  var GUEST_GENERATE_PROMPT_MAX = 64e3;
  var GUEST_GENERATE_SYSTEM_MAX = 8e3;
  var GUEST_GENERATE_OUTPUT_TOKENS_MAX = 4e3;
  var GUEST_GENERATE_TIMEOUT_MS = 96e4;
  var GUEST_GENERATE_LATE_KEEP_MS = 60 * 6e4;
  var GUEST_BADGE_MAX = 999;
  var GUEST_FRAME_HEIGHT_MAX = 1e4;
  var GUEST_RESOLVE_ERROR_MAX = 500;
  var HOST_REQUEST_ERROR_CODES = [
    "HOST_UNAVAILABLE",
    "HOST_TIMEOUT",
    "HOST_REJECTED",
    "DISCONNECTED",
    "DISABLED",
    "BAD_PATH",
    "NO_INTEGRATION",
    "NO_SERVICE",
    "SERVICE_FAILED",
    "REQUEST_FAILED",
    "RESPONSE_TOO_LARGE",
    "NO_SESSION",
    "SESSION_BUSY",
    "NOT_GRANTED",
    "NO_DIRECTORY",
    "NOT_FOUND",
    "FILE_TOO_LARGE",
    "DENIED",
    "NO_MODEL",
    "MODEL_FAILED",
    "UNSUPPORTED"
  ];
  var SERVICE_STATUS_VALUES = ["stopped", "starting", "ready", "failed"];
  var hostRequestErrorCodeSet = new Set(HOST_REQUEST_ERROR_CODES);
  var isHostRequestErrorCode = (value) => hostRequestErrorCodeSet.has(value);
  var resolveHostRequestErrorCode = (value) => value && isHostRequestErrorCode(value) ? value : "HOST_REJECTED";
  var isJsonValue = (value) => {
    if (value === void 0)
      return false;
    if (value === null || value === true || value === false)
      return true;
    if (String(value) === value)
      return true;
    if (Number(value) === value)
      return Number.isFinite(value);
    if (Array.isArray(value))
      return value.every(isJsonValue);
    if (Object(value) === value)
      return Object.values(value).every(isJsonValue);
    return false;
  };
  var isAttachData = (value) => isJsonValue(value) && JSON.stringify(value).length <= GUEST_ATTACH_DATA_MAX;
  var clampBranch = (value) => value?.trim().slice(0, GUEST_ATTACH_BRANCH_MAX) ?? "";
  var clampAttachRequest = (request) => {
    const id = request.id.trim().slice(0, GUEST_ATTACH_ID_MAX);
    const title = request.title.trim().slice(0, GUEST_ATTACH_TITLE_MAX);
    const url = request.url.trim().slice(0, GUEST_ATTACH_URL_MAX);
    const text2 = request.text?.trim().slice(0, GUEST_ATTACH_TEXT_MAX);
    const author = request.author?.trim().slice(0, GUEST_ATTACH_AUTHOR_MAX);
    const kind = request.kind === "pull" ? "pull" : "issue";
    const next = {
      providerId: request.providerId.trim(),
      id,
      title: title || id,
      url,
      kind
    };
    if (text2) {
      next.text = text2;
    }
    if (author) {
      next.author = author;
    }
    if (kind === "pull") {
      const head = clampBranch(request.branches?.head);
      const base2 = clampBranch(request.branches?.base);
      if (head && base2) {
        next.branches = { head, base: base2 };
      }
    }
    if (isAttachData(request.data)) {
      next.data = request.data;
    }
    return next;
  };
  var clampStartSessionRequest = (request) => {
    const next = clampAttachRequest(request);
    if (request.projectId)
      next.projectId = request.projectId;
    if (request.navigation)
      next.navigation = request.navigation;
    if (request.worktree) {
      next.worktree = request.worktree;
    }
    return next;
  };
  var clampPromptRequest = (request) => {
    const next = {
      text: request.text.trim().slice(0, GUEST_COMPOSE_TEXT_MAX)
    };
    if (request.send) {
      next.send = true;
    }
    return next;
  };
  var clampBadgeCount = (count) => {
    if (count === null || !Number.isFinite(count))
      return null;
    return Math.min(GUEST_BADGE_MAX, Math.max(0, Math.round(count)));
  };
  var clampFrameHeight = (height) => {
    if (!Number.isFinite(height))
      return 0;
    return Math.min(GUEST_FRAME_HEIGHT_MAX, Math.max(0, Math.ceil(height)));
  };
  var isGuestFilePath = (value) => value.length > 0 && value.length <= GUEST_FILE_PATH_MAX && !value.includes("\0") && !value.includes("\\");
  var isGuestRequestPath = (value) => {
    if (!value.startsWith("/") || value.includes("\0") || value.includes("\\") || value.includes("://")) {
      return false;
    }
    if (value.length > GUEST_REQUEST_PATH_MAX) {
      return false;
    }
    const segments = value.split("/");
    return !segments.some((segment) => segment === "." || segment === "..");
  };
  var serviceStatusSet = new Set(SERVICE_STATUS_VALUES);
  var isServiceStatusResult = (value) => Boolean(value && "status" in value && serviceStatusSet.has(String(value.status)) && !("body" in value));
  var isGuestRequestResult = (value) => Boolean(value && "status" in value && "body" in value && Number.isInteger(value.status));
  var isFileReadResult = (value) => Boolean(value && "content" in value && String(value.content) === value.content);
  var isFileWriteResult = (value) => Boolean(value && "written" in value && value.written === true);
  var isFileListResult = (value) => Boolean(value && "entries" in value && Array.isArray(value.entries));
  var fileStatKindSet = new Set(GUEST_FILE_STAT_KINDS);
  var isFileStatResult = (value) => Boolean(value && "kind" in value && "size" in value && fileStatKindSet.has(String(value.kind)) && Number.isFinite(value.size));
  var isGenerateResult = (value) => Boolean(value && "text" in value && String(value.text) === value.text && !("status" in value));
  var HOST_PUSH_TYPES = /* @__PURE__ */ new Set([
    "workspace",
    "shells",
    "ready",
    "directory",
    "session",
    "connection",
    "settings",
    "session-lifecycle",
    "item",
    "resolve",
    "action",
    "service-event",
    "status-control-event",
    "popover-closed",
    "file-open",
    "file-snapshot",
    "file-saved",
    "generate-late"
  ]);
  var asWireRecord = (data) => Object(data) === data ? data : null;
  var isNonEmptyString = (value) => String(value) === value && value.length > 0;
  var readResultMessage = (wire) => {
    if (!isNonEmptyString(wire.id))
      return null;
    if (wire.ok === true) {
      const message = {
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "result",
        id: wire.id,
        ok: true
      };
      if (Object(wire.payload) === wire.payload) {
        message.payload = wire.payload;
      }
      return message;
    }
    if (wire.ok === false && isNonEmptyString(wire.error)) {
      return {
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "result",
        id: wire.id,
        ok: false,
        error: wire.error,
        code: resolveHostRequestErrorCode(isNonEmptyString(wire.code) ? wire.code : void 0)
      };
    }
    return null;
  };
  var readHostMessage = (data) => {
    const wire = asWireRecord(data);
    if (!wire || wire.channel !== OPENCHAMBER_SDK_CHANNEL || wire.v !== OPENCHAMBER_SDK_API_VERSION)
      return null;
    if (wire.type === "result")
      return readResultMessage(wire);
    if (!HOST_PUSH_TYPES.has(String(wire.type)) || Object(wire.payload) !== wire.payload)
      return null;
    return wire;
  };

  // node_modules/@openchamber/sdk/dist/host.js
  var isKeyEvent = (event) => "key" in event && "metaKey" in event && "ctrlKey" in event;
  var isSaveShortcut = (event) => (event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === "s";
  var HostRequestError = class extends Error {
    code;
    constructor(code2, message) {
      super(message);
      this.name = "HostRequestError";
      this.code = code2;
    }
  };
  var rejectBadPath = () => Promise.reject(new HostRequestError("BAD_PATH", 'Request path must start with "/" and stay on the declared origin.'));
  var rejectBadFilePath = () => Promise.reject(new HostRequestError("BAD_PATH", `File path must be 1 to ${GUEST_FILE_PATH_MAX} characters without NUL or backslash.`));
  var deviceStorageScope = (options) => {
    if (options === void 0)
      return void 0;
    if (Object(options) !== options || Array.isArray(options) || options.scope !== void 0 && options.scope !== "instance" && options.scope !== "device") {
      throw new HostRequestError("HOST_REJECTED", 'Storage scope must be "instance" or "device".');
    }
    return options.scope === "device" ? "device" : void 0;
  };
  var nextId = (n) => {
    n.value += 1;
    return `oc-${n.value}`;
  };
  var connectHost = (options = {}) => {
    const target = options.target ?? ("window" in globalThis ? window : null);
    if (!target) {
      throw new HostRequestError("HOST_UNAVAILABLE", "No window. connectHost runs in a browser frame.");
    }
    const acceptSource = options.acceptSource ?? ((source) => source === target.parent);
    const requestTimeoutMs = options.requestTimeoutMs ?? GUEST_REQUEST_TIMEOUT_MS;
    const readyListeners = /* @__PURE__ */ new Set();
    const directoryListeners = /* @__PURE__ */ new Set();
    const sessionListeners = /* @__PURE__ */ new Set();
    const lifecycleListeners = /* @__PURE__ */ new Set();
    const connectionListeners = /* @__PURE__ */ new Set();
    const settingsListeners = /* @__PURE__ */ new Set();
    const itemListeners = /* @__PURE__ */ new Set();
    const blockListeners = /* @__PURE__ */ new Set();
    const serviceEventListeners = /* @__PURE__ */ new Set();
    const statusControlListeners = /* @__PURE__ */ new Set();
    const popoverClosedListeners = /* @__PURE__ */ new Set();
    const lateGenerateListeners = /* @__PURE__ */ new Set();
    const unclaimedLateGenerate = [];
    let resolveHandler = null;
    let actionHandler = null;
    const fileOpenListeners = /* @__PURE__ */ new Set();
    const fileSavedListeners = /* @__PURE__ */ new Set();
    let fileSnapshotHandler = null;
    let lastFile = null;
    let saveShortcutInstalled = false;
    const pending = /* @__PURE__ */ new Map();
    const workspaceListeners = /* @__PURE__ */ new Map();
    const shellsListeners = /* @__PURE__ */ new Map();
    let disposed = false;
    const ids = { value: 0 };
    let lastReady = null;
    let lastLifecycle = null;
    let popoverPointerActive = false;
    let popoverFocusActive = false;
    let popoverActivityReported = null;
    const lifecycleFromSession = (session) => {
      if (!session)
        return null;
      return {
        sessionId: session.id,
        phase: session.busy ? "started" : "completed"
      };
    };
    const post = (message) => {
      target.parent.postMessage(message, "*");
    };
    const listenForLateGenerate = () => {
      if (disposed || target.parent === target || lateGenerateListeners.size === 0 || lastReady?.features?.lateGenerateResults !== true)
        return;
      post({ channel: OPENCHAMBER_SDK_CHANNEL, v: OPENCHAMBER_SDK_API_VERSION, type: "generate-late-listen" });
    };
    const emit = (listeners, value) => {
      for (const listener of listeners) {
        try {
          listener(value);
        } catch (error2) {
          console.error(error2);
        }
      }
    };
    const onMessage = (event) => {
      if (!(event instanceof MessageEvent))
        return;
      if (!acceptSource(event.source))
        return;
      const message = readHostMessage(event.data);
      if (!message)
        return;
      if (message.type === "workspace") {
        const listener = workspaceListeners.get(message.payload.subscriptionId);
        if (listener)
          emit([listener], message.payload.snapshot);
        return;
      }
      if (message.type === "shells") {
        const listener = shellsListeners.get(message.payload.subscriptionId);
        if (listener)
          emit([listener], message.payload.snapshot);
        return;
      }
      if (message.type === "ready") {
        lastReady = message.payload;
        lastLifecycle = lifecycleFromSession(message.payload.session);
        emit(readyListeners, message.payload);
        emit(directoryListeners, message.payload.directory);
        emit(sessionListeners, message.payload.session);
        if (lastLifecycle) {
          emit(lifecycleListeners, lastLifecycle);
        }
        emit(connectionListeners, message.payload.connection);
        emit(settingsListeners, message.payload.settings);
        emit(itemListeners, message.payload.item);
        if (message.payload.block)
          emit(blockListeners, message.payload.block);
        listenForLateGenerate();
        return;
      }
      if (message.type === "service-event") {
        emit(serviceEventListeners, message.payload);
        return;
      }
      if (message.type === "generate-late") {
        if (lateGenerateListeners.size === 0)
          unclaimedLateGenerate.push(message.payload);
        else
          emit(lateGenerateListeners, message.payload);
        return;
      }
      if (message.type === "directory") {
        if (lastReady) {
          lastReady = { ...lastReady, directory: message.payload.directory };
        }
        emit(directoryListeners, message.payload.directory);
        return;
      }
      if (message.type === "session") {
        if (lastReady) {
          lastReady = { ...lastReady, session: message.payload.session };
        }
        if (!message.payload.session) {
          lastLifecycle = null;
        } else if (lastLifecycle?.sessionId !== message.payload.session.id) {
          lastLifecycle = lifecycleFromSession(message.payload.session);
        }
        emit(sessionListeners, message.payload.session);
        return;
      }
      if (message.type === "session-lifecycle") {
        lastLifecycle = message.payload;
        emit(lifecycleListeners, message.payload);
        return;
      }
      if (message.type === "connection") {
        if (lastReady) {
          lastReady = { ...lastReady, connection: message.payload.connection };
        }
        emit(connectionListeners, message.payload.connection);
        return;
      }
      if (message.type === "settings") {
        if (lastReady) {
          lastReady = { ...lastReady, settings: message.payload.settings };
        }
        emit(settingsListeners, message.payload.settings);
        return;
      }
      if (message.type === "item") {
        if (lastReady) {
          lastReady = { ...lastReady, item: message.payload.item };
        }
        emit(itemListeners, message.payload.item);
        return;
      }
      if (message.type === "status-control-event") {
        emit(statusControlListeners, message.payload);
        return;
      }
      if (message.type === "popover-closed") {
        emit(popoverClosedListeners, message.payload);
        return;
      }
      if (message.type === "action") {
        const answer = (payload) => {
          if (!disposed)
            post({
              channel: OPENCHAMBER_SDK_CHANNEL,
              v: OPENCHAMBER_SDK_API_VERSION,
              type: "action-result",
              id: message.id,
              payload
            });
        };
        const handler = actionHandler;
        if (!handler) {
          answer({ ok: false, error: "This extension does not handle background actions." });
          return;
        }
        Promise.resolve().then(() => handler(message.payload)).then(() => answer({ ok: true }), (error2) => {
          const text2 = (error2 instanceof Error ? error2.message : String(error2)).trim();
          answer({ ok: false, error: (text2 || "Action failed.").slice(0, GUEST_RESOLVE_ERROR_MAX) });
        });
        return;
      }
      if (message.type === "file-open") {
        const next = message.payload;
        if (lastFile && sameFileEditorDocument(lastFile, next))
          return;
        lastFile = next;
        emit(fileOpenListeners, message.payload);
        return;
      }
      if (message.type === "file-saved") {
        emit(fileSavedListeners, message.payload.version);
        return;
      }
      if (message.type === "file-snapshot") {
        const answer = (payload) => {
          if (!disposed)
            post({
              channel: OPENCHAMBER_SDK_CHANNEL,
              v: OPENCHAMBER_SDK_API_VERSION,
              type: "file-snapshot-result",
              id: message.id,
              payload
            });
        };
        const fail = (text2) => answer({ error: (text2.trim() || "Could not read the edited file.").slice(0, GUEST_RESOLVE_ERROR_MAX) });
        const handler = fileSnapshotHandler;
        if (!handler) {
          fail("This extension does not edit files.");
          return;
        }
        Promise.resolve().then(() => handler(message.payload.purpose)).then((snapshot) => {
          if (fileEditorPayloadSize(snapshot) > GUEST_FILE_EDITOR_CONTENT_MAX) {
            fail(`The file is over ${GUEST_FILE_EDITOR_CONTENT_MAX} ${"bytes" in snapshot ? "bytes" : "characters"}.`);
            return;
          }
          if (snapshot.version.length > GUEST_FILE_EDITOR_VERSION_MAX) {
            fail(`The snapshot version is over ${GUEST_FILE_EDITOR_VERSION_MAX} characters.`);
            return;
          }
          answer({ snapshot: "bytes" in snapshot ? { bytes: snapshot.bytes, version: snapshot.version } : { content: snapshot.content, version: snapshot.version } });
        }, (error2) => fail(error2 instanceof Error ? error2.message : String(error2)));
        return;
      }
      if (message.type === "resolve") {
        const answer = (payload) => {
          post({
            channel: OPENCHAMBER_SDK_CHANNEL,
            v: OPENCHAMBER_SDK_API_VERSION,
            type: "resolve-result",
            id: message.id,
            payload
          });
        };
        const handler = resolveHandler;
        if (!handler) {
          answer({ error: "This extension does not resolve commands." });
          return;
        }
        Promise.resolve().then(() => handler(message.payload)).then((item) => answer({ item: item ? clampAttachRequest(item) : null }), (error2) => {
          const text2 = (error2 instanceof Error ? error2.message : String(error2)).trim();
          answer({ error: (text2 || "Command failed.").slice(0, GUEST_RESOLVE_ERROR_MAX) });
        });
        return;
      }
      const waiter = pending.get(message.id);
      if (!waiter)
        return;
      clearTimeout(waiter.timer);
      pending.delete(message.id);
      if (message.ok) {
        waiter.resolve(message.payload);
        return;
      }
      waiter.reject(new HostRequestError(message.code, message.error));
    };
    target.addEventListener("message", onMessage);
    post({
      channel: OPENCHAMBER_SDK_CHANNEL,
      v: OPENCHAMBER_SDK_API_VERSION,
      type: "hello"
    });
    const send = (message, timeoutMs = requestTimeoutMs) => {
      if (disposed || target.parent === target) {
        return Promise.reject(new HostRequestError("HOST_UNAVAILABLE", "No host frame. This page is not in an iframe."));
      }
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          pending.delete(message.id);
          reject(new HostRequestError("HOST_TIMEOUT", "Host did not answer in time."));
        }, timeoutMs);
        pending.set(message.id, { resolve, reject, timer });
        post(message);
      });
    };
    const request = (message) => send(message).then(() => void 0);
    const envelope = { channel: OPENCHAMBER_SDK_CHANNEL, v: OPENCHAMBER_SDK_API_VERSION };
    const notify = (message) => {
      if (!disposed && target.parent !== target)
        post(message);
    };
    const requestFileSave = () => notify({ ...envelope, type: "file-save" });
    const onSaveShortcut = (event) => {
      if (!isKeyEvent(event) || !isSaveShortcut(event))
        return;
      event.preventDefault();
      requestFileSave();
    };
    const onPopoverEscape = (event) => {
      if (!isKeyEvent(event) || event.key !== "Escape" || lastReady?.surface !== "popover" || !lastReady.popover)
        return;
      event.preventDefault();
      void closePopover(lastReady.popover.id, "escape").catch(() => void 0);
    };
    const reportPopoverActivity = () => {
      const popover = lastReady?.surface === "popover" ? lastReady.popover : void 0;
      if (!popover)
        return;
      const active = popoverPointerActive || popoverFocusActive;
      if (popoverActivityReported === active)
        return;
      popoverActivityReported = active;
      void setPopoverAnchorActive(popover.id, active).catch(() => void 0);
    };
    const onPopoverPointerOver = () => {
      if (lastReady?.surface !== "popover" || popoverPointerActive)
        return;
      popoverPointerActive = true;
      reportPopoverActivity();
    };
    const onPopoverPointerOut = (event) => {
      if (lastReady?.surface !== "popover" || event.relatedTarget !== null || !popoverPointerActive)
        return;
      popoverPointerActive = false;
      reportPopoverActivity();
    };
    const onPopoverFocus = () => {
      if (lastReady?.surface !== "popover" || popoverFocusActive)
        return;
      popoverFocusActive = true;
      reportPopoverActivity();
    };
    const onPopoverBlur = () => {
      if (lastReady?.surface !== "popover" || !popoverFocusActive)
        return;
      popoverFocusActive = false;
      reportPopoverActivity();
    };
    const requireIdentity = (value, maximum = 1024) => {
      if (!value.trim() || value.length > maximum)
        throw new HostRequestError("HOST_REJECTED", `Identity must contain 1 to ${maximum} characters.`);
    };
    const readWorkspace = async (query) => {
      if (query.kind !== "projects")
        requireIdentity(query.projectId);
      const result = await send({ ...envelope, type: "workspace-read", id: nextId(ids), payload: query });
      if (!result || !("kind" in result) || !("state" in result) || result.kind !== query.kind) {
        throw new HostRequestError("HOST_REJECTED", "Host did not return workspace data.");
      }
      return result;
    };
    const subscribeWorkspace = async (query, listener) => {
      if (query.kind !== "projects")
        requireIdentity(query.projectId);
      const subscriptionId = nextId(ids);
      workspaceListeners.set(subscriptionId, listener);
      try {
        await request({ ...envelope, type: "workspace-subscribe", id: nextId(ids), payload: { subscriptionId, query } });
      } catch (error2) {
        workspaceListeners.delete(subscriptionId);
        if (!disposed)
          post({ ...envelope, type: "workspace-unsubscribe", id: nextId(ids), payload: { subscriptionId } });
        throw error2;
      }
      return () => {
        if (!workspaceListeners.delete(subscriptionId) || disposed)
          return;
        post({ ...envelope, type: "workspace-unsubscribe", id: nextId(ids), payload: { subscriptionId } });
      };
    };
    const subscribeShells = async (scope, listener) => {
      if (scope.kind === "session")
        requireIdentity(scope.sessionId);
      if (scope.kind === "project")
        requireIdentity(scope.projectId);
      const subscriptionId = nextId(ids);
      shellsListeners.set(subscriptionId, listener);
      try {
        await request({ ...envelope, type: "shells-subscribe", id: nextId(ids), payload: { subscriptionId, scope } });
      } catch (error2) {
        shellsListeners.delete(subscriptionId);
        if (!disposed)
          post({ ...envelope, type: "shells-unsubscribe", id: nextId(ids), payload: { subscriptionId } });
        throw error2;
      }
      return () => {
        if (!shellsListeners.delete(subscriptionId) || disposed)
          return;
        post({ ...envelope, type: "shells-unsubscribe", id: nextId(ids), payload: { subscriptionId } });
      };
    };
    const storage = async (payload) => {
      if ("key" in payload && (payload.key.length === 0 || payload.key.length > GUEST_STORAGE_KEY_MAX)) {
        throw new HostRequestError("HOST_REJECTED", "Storage key must contain 1 to 128 characters.");
      }
      if (payload.op === "set" && !isJsonValue(payload.value)) {
        throw new HostRequestError("HOST_REJECTED", "Storage values must be JSON.");
      }
      if (payload.op === "set" && new TextEncoder().encode(JSON.stringify(payload.value)).length > GUEST_STORAGE_VALUE_BYTES) {
        throw new HostRequestError("HOST_REJECTED", "Storage value exceeds 64 KiB.");
      }
      if (payload.scope === "device" && lastReady?.features?.deviceStorage !== true) {
        throw new HostRequestError("UNSUPPORTED", "This host does not support device storage.");
      }
      const result = await send({ ...envelope, type: "storage", id: nextId(ids), payload });
      if (!result || !("storage" in result) || result.op !== payload.op)
        throw new HostRequestError("HOST_REJECTED", "Host did not return storage data.");
      return result;
    };
    const closePopover = (id, reason) => lastReady?.features?.popovers !== true && !(lastReady?.surface === "popover" && lastReady.popover?.id === id) ? Promise.reject(new HostRequestError("UNSUPPORTED", "This host does not support popovers.")) : request({ ...envelope, type: "popover-close", id: nextId(ids), payload: reason ? { id, reason } : { id } });
    const setPopoverAnchorActive = (id, active) => lastReady?.features?.popovers !== true && !(lastReady?.surface === "popover" && lastReady.popover?.id === id) ? Promise.reject(new HostRequestError("UNSUPPORTED", "This host does not support popovers.")) : request({ ...envelope, type: "popover-anchor", id: nextId(ids), payload: { id, active } });
    target.addEventListener("keydown", onPopoverEscape, true);
    target.addEventListener("pointerover", onPopoverPointerOver);
    target.addEventListener("pointermove", onPopoverPointerOver);
    target.addEventListener("pointerout", onPopoverPointerOut);
    target.addEventListener("focus", onPopoverFocus);
    target.addEventListener("blur", onPopoverBlur);
    return {
      onAction: (handler) => {
        actionHandler = handler;
        return () => {
          if (actionHandler === handler)
            actionHandler = null;
        };
      },
      listProjects: async () => {
        const result = await readWorkspace({ kind: "projects" });
        if (result.kind !== "projects")
          throw new HostRequestError("HOST_REJECTED", "Expected projects.");
        return result;
      },
      listWorktrees: async (projectId) => {
        const result = await readWorkspace({ kind: "worktrees", projectId });
        if (result.kind !== "worktrees")
          throw new HostRequestError("HOST_REJECTED", "Expected worktrees.");
        return result;
      },
      listSessions: async (projectId) => {
        const result = await readWorkspace({ kind: "sessions", projectId });
        if (result.kind !== "sessions")
          throw new HostRequestError("HOST_REJECTED", "Expected sessions.");
        return result;
      },
      onProjects: (listener) => subscribeWorkspace({ kind: "projects" }, (snapshot) => {
        if (snapshot.kind === "projects")
          listener(snapshot);
      }),
      onWorktrees: (projectId, listener) => subscribeWorkspace({ kind: "worktrees", projectId }, (snapshot) => {
        if (snapshot.kind === "worktrees")
          listener(snapshot);
      }),
      onSessions: (projectId, listener) => subscribeWorkspace({ kind: "sessions", projectId }, (snapshot) => {
        if (snapshot.kind === "sessions")
          listener(snapshot);
      }),
      onRunningShells: (scope, listener) => subscribeShells(scope, listener),
      readShellOutput: async (shellId, options2) => {
        requireIdentity(shellId, GUEST_SHELL_ID_MAX);
        const cursor = options2?.cursor;
        if (cursor !== void 0 && (!Number.isInteger(cursor) || cursor < 0)) {
          throw new HostRequestError("HOST_REJECTED", "Shell output cursor must be a non-negative integer.");
        }
        const tailBytes = options2?.tailBytes;
        if (tailBytes !== void 0 && (!Number.isInteger(tailBytes) || tailBytes < 1 || tailBytes > GUEST_SHELL_OUTPUT_TAIL_MAX)) {
          throw new HostRequestError("HOST_REJECTED", `Shell output tailBytes must be an integer between 1 and ${GUEST_SHELL_OUTPUT_TAIL_MAX}.`);
        }
        const result = await send({ ...envelope, type: "shell-output", id: nextId(ids), payload: { shellId, cursor, tailBytes } });
        const output = result;
        if (!output || typeof output.output !== "string" || !Number.isFinite(output.cursor)) {
          throw new HostRequestError("HOST_REJECTED", "Host did not return shell output.");
        }
        return output;
      },
      stopShell: async (shellId) => {
        requireIdentity(shellId, GUEST_SHELL_ID_MAX);
        const result = await send({ ...envelope, type: "shell-stop", id: nextId(ids), payload: { shellId } });
        if (result?.stopped !== true)
          throw new HostRequestError("HOST_REJECTED", "Host did not stop the shell.");
        return { stopped: true };
      },
      openSession: async (sessionId) => {
        requireIdentity(sessionId);
        await request({ ...envelope, type: "open-session", id: nextId(ids), payload: { sessionId } });
      },
      storage: {
        get: async (key, options2) => {
          const scope = deviceStorageScope(options2);
          const payload = { op: "get", key };
          if (scope)
            payload.scope = scope;
          const result = await storage(payload);
          return result.op === "get" && result.found ? result.value : void 0;
        },
        set: async (key, value, options2) => {
          const scope = deviceStorageScope(options2);
          const payload = { op: "set", key, value };
          if (scope)
            payload.scope = scope;
          await storage(payload);
        },
        delete: async (key, options2) => {
          const scope = deviceStorageScope(options2);
          const payload = { op: "delete", key };
          if (scope)
            payload.scope = scope;
          await storage(payload);
        },
        keys: async (options2) => {
          const scope = deviceStorageScope(options2);
          const payload = { op: "keys" };
          if (scope)
            payload.scope = scope;
          const result = await storage(payload);
          if (result.op !== "keys")
            throw new HostRequestError("HOST_REJECTED", "Expected storage keys.");
          return result.keys;
        }
      },
      onReady: (listener) => {
        readyListeners.add(listener);
        if (lastReady)
          listener(lastReady);
        return () => {
          readyListeners.delete(listener);
        };
      },
      onDirectory: (listener) => {
        directoryListeners.add(listener);
        if (lastReady)
          listener(lastReady.directory);
        return () => {
          directoryListeners.delete(listener);
        };
      },
      onSession: (listener) => {
        sessionListeners.add(listener);
        if (lastReady)
          listener(lastReady.session);
        return () => {
          sessionListeners.delete(listener);
        };
      },
      onSessionLifecycle: (listener) => {
        lifecycleListeners.add(listener);
        if (lastLifecycle)
          listener(lastLifecycle);
        return () => {
          lifecycleListeners.delete(listener);
        };
      },
      onConnection: (listener) => {
        connectionListeners.add(listener);
        if (lastReady)
          listener(lastReady.connection);
        return () => {
          connectionListeners.delete(listener);
        };
      },
      onSettings: (listener) => {
        settingsListeners.add(listener);
        if (lastReady)
          listener(lastReady.settings);
        return () => {
          settingsListeners.delete(listener);
        };
      },
      onItem: (listener) => {
        itemListeners.add(listener);
        if (lastReady)
          listener(lastReady.item);
        return () => {
          itemListeners.delete(listener);
        };
      },
      onBlock: (listener) => {
        blockListeners.add(listener);
        if (lastReady?.block)
          listener(lastReady.block);
        return () => {
          blockListeners.delete(listener);
        };
      },
      onServiceEvent: (listener) => {
        serviceEventListeners.add(listener);
        return () => {
          serviceEventListeners.delete(listener);
        };
      },
      onStatusControl: (listener) => {
        statusControlListeners.add(listener);
        return () => {
          statusControlListeners.delete(listener);
        };
      },
      onPopoverClosed: (listener) => {
        popoverClosedListeners.add(listener);
        return () => {
          popoverClosedListeners.delete(listener);
        };
      },
      setStatusControls: (controls) => {
        if (lastReady?.features?.statusControls !== true) {
          return Promise.reject(new HostRequestError("UNSUPPORTED", "This host does not support status controls."));
        }
        if (!isGuestStatusControls(controls)) {
          return Promise.reject(new HostRequestError("HOST_REJECTED", "Status controls must have unique bounded ids and valid selected options."));
        }
        return request({ ...envelope, type: "status-controls", id: nextId(ids), payload: { controls } });
      },
      openPopover: (payload) => {
        if (lastReady?.features?.popovers !== true) {
          return Promise.reject(new HostRequestError("UNSUPPORTED", "This host does not support popovers."));
        }
        if (!isGuestPopoverRequest(payload)) {
          return Promise.reject(new HostRequestError("HOST_REJECTED", "Popover requests need bounded geometry and JSON data."));
        }
        return request({ ...envelope, type: "popover-open", id: nextId(ids), payload });
      },
      closePopover,
      setPopoverAnchorActive,
      onResolve: (handler) => {
        resolveHandler = handler;
        return () => {
          if (resolveHandler === handler)
            resolveHandler = null;
        };
      },
      toast: (payload) => {
        const message = payload.message.trim();
        if (!message || message.length > GUEST_TOAST_MAX) {
          return Promise.reject(new HostRequestError("HOST_REJECTED", `Toast message must contain 1 to ${GUEST_TOAST_MAX} characters.`));
        }
        if (payload.copy && payload.copy !== true && (!payload.copy.text.length || payload.copy.text.length > GUEST_CLIPBOARD_TEXT_MAX)) {
          return Promise.reject(new HostRequestError("HOST_REJECTED", `Toast copy text must contain 1 to ${GUEST_CLIPBOARD_TEXT_MAX} characters.`));
        }
        return request({
          channel: OPENCHAMBER_SDK_CHANNEL,
          v: OPENCHAMBER_SDK_API_VERSION,
          type: "toast",
          id: nextId(ids),
          payload: { ...payload, message }
        });
      },
      openUrl: (url) => request({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "open-url",
        id: nextId(ids),
        payload: { url }
      }),
      openCommit: (sha) => isGuestCommitSha(sha) ? request({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "open-commit",
        id: nextId(ids),
        payload: { sha }
      }) : Promise.reject(new HostRequestError("HOST_REJECTED", "Commit id must be 7 to 64 hex characters.")),
      answerBlock: (text2) => request({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "block-answer",
        id: nextId(ids),
        payload: { text: text2.trim().slice(0, GUEST_BLOCK_ANSWER_MAX) }
      }),
      openSurface: (surfaceId) => request({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "open-surface",
        id: nextId(ids),
        payload: { surfaceId }
      }),
      writeClipboard: (text2) => request({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "clipboard-write",
        id: nextId(ids),
        payload: { text: text2 }
      }),
      compose: (payload) => request({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "compose",
        id: nextId(ids),
        payload
      }),
      attach: (payload) => request({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "attach",
        id: nextId(ids),
        payload: clampAttachRequest(payload)
      }),
      startSession: async (payload) => {
        if (payload.projectId !== void 0)
          requireIdentity(payload.projectId);
        const worktree = payload.worktree;
        if (worktree && worktree !== true) {
          if (worktree.kind === "existing")
            requireIdentity(worktree.directory);
          else {
            if (worktree.name !== void 0)
              requireIdentity(worktree.name, 200);
            if (worktree.baseBranch !== void 0)
              requireIdentity(worktree.baseBranch, 200);
          }
        }
        const result = await send({
          channel: OPENCHAMBER_SDK_CHANNEL,
          v: OPENCHAMBER_SDK_API_VERSION,
          type: "start-session",
          id: nextId(ids),
          payload: clampStartSessionRequest(payload)
        }, options.requestTimeoutMs ?? 18e4);
        if (!isStartSessionResult(result)) {
          throw new HostRequestError("HOST_REJECTED", "Host did not return a session.");
        }
        return result;
      },
      prompt: (payload) => send({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "prompt",
        id: nextId(ids),
        payload: clampPromptRequest(payload)
      }).then((result) => {
        if (!isPromptResult(result)) {
          throw new HostRequestError("HOST_REJECTED", "Host did not return a prompt result.");
        }
        return result;
      }),
      sessionLink: (payload) => request({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "session-link",
        id: nextId(ids),
        payload: clampAttachRequest(payload)
      }),
      close: () => request({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "close",
        id: nextId(ids)
      }),
      oauthStart: () => request({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "oauth-start",
        id: nextId(ids)
      }),
      oauthDisconnect: () => request({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "oauth-disconnect",
        id: nextId(ids)
      }),
      request: (payload) => (isGuestRequestPath(payload.path) ? send({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "request",
        id: nextId(ids),
        payload
      }) : rejectBadPath()).then((result) => {
        if (!isGuestRequestResult(result)) {
          throw new HostRequestError("HOST_REJECTED", "Host request result was empty.");
        }
        return result;
      }),
      serviceRequest: (payload) => (isGuestRequestPath(payload.path) ? send({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "service-request",
        id: nextId(ids),
        payload
      }) : rejectBadPath()).then((result) => {
        if (!isGuestRequestResult(result)) {
          throw new HostRequestError("HOST_REJECTED", "Host service request result was empty.");
        }
        return result;
      }),
      serviceStatus: () => send({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "service-status",
        id: nextId(ids)
      }).then((result) => {
        if (!isServiceStatusResult(result)) {
          throw new HostRequestError("HOST_REJECTED", "Host did not return service status.");
        }
        return result;
      }),
      readFile: (path) => (isGuestFilePath(path) ? send({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "file-read",
        id: nextId(ids),
        payload: { path }
      }) : rejectBadFilePath()).then((result) => {
        if (!isFileReadResult(result)) {
          throw new HostRequestError("HOST_REJECTED", "Host did not return file content.");
        }
        return result;
      }),
      writeFile: (path, content) => {
        if (!isGuestFilePath(path)) {
          return rejectBadFilePath();
        }
        if (content.length > GUEST_FILE_CONTENT_MAX) {
          return Promise.reject(new HostRequestError("FILE_TOO_LARGE", `Content is over ${GUEST_FILE_CONTENT_MAX} characters.`));
        }
        return send({
          channel: OPENCHAMBER_SDK_CHANNEL,
          v: OPENCHAMBER_SDK_API_VERSION,
          type: "file-write",
          id: nextId(ids),
          payload: { path, content }
        }).then((result) => {
          if (!isFileWriteResult(result)) {
            throw new HostRequestError("HOST_REJECTED", "Host did not confirm the write.");
          }
          return result;
        });
      },
      listDir: (path) => (isGuestFilePath(path) ? send({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "file-list",
        id: nextId(ids),
        payload: { path }
      }) : rejectBadFilePath()).then((result) => {
        if (!isFileListResult(result)) {
          throw new HostRequestError("HOST_REJECTED", "Host did not return directory entries.");
        }
        return result;
      }),
      stat: (path) => (isGuestFilePath(path) ? send({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "file-stat",
        id: nextId(ids),
        payload: { path }
      }) : rejectBadFilePath()).then((result) => {
        if (!isFileStatResult(result)) {
          throw new HostRequestError("HOST_REJECTED", "Host did not return file status.");
        }
        return result;
      }),
      generate: (input) => {
        const prompt = input.prompt.trim();
        const system = input.system?.trim();
        if (prompt.length === 0 || prompt.length > GUEST_GENERATE_PROMPT_MAX) {
          return Promise.reject(new HostRequestError("HOST_REJECTED", `Prompt must be 1 to ${GUEST_GENERATE_PROMPT_MAX} characters.`));
        }
        if (system !== void 0 && (system.length === 0 || system.length > GUEST_GENERATE_SYSTEM_MAX)) {
          return Promise.reject(new HostRequestError("HOST_REJECTED", `System prompt must be 1 to ${GUEST_GENERATE_SYSTEM_MAX} characters.`));
        }
        const maxOutputTokens = input.maxOutputTokens === void 0 ? void 0 : Math.min(GUEST_GENERATE_OUTPUT_TOKENS_MAX, Math.max(1, Math.floor(input.maxOutputTokens)));
        if (maxOutputTokens !== void 0 && !Number.isFinite(maxOutputTokens)) {
          return Promise.reject(new HostRequestError("HOST_REJECTED", "maxOutputTokens must be a number."));
        }
        const payload = { prompt };
        if (system !== void 0)
          payload.system = system;
        if (maxOutputTokens !== void 0)
          payload.maxOutputTokens = maxOutputTokens;
        return send({
          channel: OPENCHAMBER_SDK_CHANNEL,
          v: OPENCHAMBER_SDK_API_VERSION,
          type: "generate",
          id: nextId(ids),
          payload
        }, options.requestTimeoutMs ?? GUEST_GENERATE_TIMEOUT_MS).then((result) => {
          if (!isGenerateResult(result)) {
            throw new HostRequestError("HOST_REJECTED", "Host did not return generated text.");
          }
          return result;
        });
      },
      onLateGenerateResult: (listener) => {
        lateGenerateListeners.add(listener);
        for (const result of unclaimedLateGenerate.splice(0))
          emit([listener], result);
        listenForLateGenerate();
        return () => {
          lateGenerateListeners.delete(listener);
        };
      },
      setBadge: (count) => request({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "badge",
        id: nextId(ids),
        payload: { count: clampBadgeCount(count) }
      }),
      setHeight: (height) => request({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "resize",
        id: nextId(ids),
        payload: { height: clampFrameHeight(height) }
      }),
      onFileOpen: (listener) => {
        fileOpenListeners.add(listener);
        if (!saveShortcutInstalled) {
          saveShortcutInstalled = true;
          target.addEventListener("keydown", onSaveShortcut, true);
        }
        if (lastFile)
          listener(lastFile);
        return () => {
          fileOpenListeners.delete(listener);
        };
      },
      onFileSnapshot: (handler) => {
        fileSnapshotHandler = handler;
        return () => {
          if (fileSnapshotHandler === handler)
            fileSnapshotHandler = null;
        };
      },
      onFileSaved: (listener) => {
        fileSavedListeners.add(listener);
        return () => {
          fileSavedListeners.delete(listener);
        };
      },
      reportFileChange: (change) => notify({ ...envelope, type: "file-change", payload: { dirty: change.dirty, edited: change.edited } }),
      requestFileSave,
      reportFileUnsupported: () => notify({ ...envelope, type: "file-unsupported" }),
      dispose: () => {
        for (const subscriptionId of workspaceListeners.keys()) {
          post({ ...envelope, type: "workspace-unsubscribe", id: nextId(ids), payload: { subscriptionId } });
        }
        workspaceListeners.clear();
        for (const subscriptionId of shellsListeners.keys()) {
          post({ ...envelope, type: "shells-unsubscribe", id: nextId(ids), payload: { subscriptionId } });
        }
        shellsListeners.clear();
        disposed = true;
        resolveHandler = null;
        actionHandler = null;
        fileSnapshotHandler = null;
        fileOpenListeners.clear();
        fileSavedListeners.clear();
        if (saveShortcutInstalled)
          target.removeEventListener("keydown", onSaveShortcut, true);
        target.removeEventListener("message", onMessage);
        target.removeEventListener("keydown", onPopoverEscape, true);
        target.removeEventListener("pointerover", onPopoverPointerOver);
        target.removeEventListener("pointermove", onPopoverPointerOver);
        target.removeEventListener("pointerout", onPopoverPointerOut);
        target.removeEventListener("focus", onPopoverFocus);
        target.removeEventListener("blur", onPopoverBlur);
        for (const waiter of pending.values()) {
          clearTimeout(waiter.timer);
          waiter.reject(new HostRequestError("HOST_UNAVAILABLE", "Host client was disposed."));
        }
        pending.clear();
        readyListeners.clear();
        directoryListeners.clear();
        sessionListeners.clear();
        lifecycleListeners.clear();
        connectionListeners.clear();
        settingsListeners.clear();
        itemListeners.clear();
        blockListeners.clear();
        serviceEventListeners.clear();
        statusControlListeners.clear();
        popoverClosedListeners.clear();
        lateGenerateListeners.clear();
        unclaimedLateGenerate.length = 0;
      }
    };
  };

  // node_modules/@openchamber/sdk/dist/service-providers.js
  var BROWSER_CONTROL_ACTIONS = [
    "browser.open",
    "browser.snapshot",
    "browser.click",
    "browser.type",
    "browser.select",
    "browser.scroll",
    "browser.back",
    "browser.forward",
    "browser.inspect",
    "browser.capture",
    "browser.resize",
    "browser.close"
  ];
  var BROWSER_PROVIDER_IDLE_MS = 10 * 6e4;
  var CONTROL_ACTIONS = new Set(BROWSER_CONTROL_ACTIONS);
  var SOURCE_CONTROL_PROVIDER_IDLE_MS = 10 * 6e4;
  var NOTIFICATIONS_PROVIDER_IDLE_MS = 10 * 6e4;
  var TRACKER_PROVIDER_IDLE_MS = 10 * 6e4;
  var QUOTA_PROVIDER_IDLE_MS = 10 * 6e4;

  // node_modules/@openchamber/sdk/dist/service-surface.js
  var SURFACE_CONTROLLERS = ["none", "agent", "user"];
  var CONTROLLERS = new Set(SURFACE_CONTROLLERS);

  // node_modules/mdurl/index.mjs
  var mdurl_exports = {};
  __export(mdurl_exports, {
    decode: () => decode_default,
    encode: () => encode_default,
    format: () => format,
    parse: () => parse_default
  });

  // node_modules/mdurl/lib/decode.mjs
  var decodeCache = {};
  function getDecodeCache(exclude) {
    let cache = decodeCache[exclude];
    if (cache) {
      return cache;
    }
    cache = decodeCache[exclude] = [];
    for (let i = 0; i < 128; i++) {
      const ch = String.fromCharCode(i);
      cache.push(ch);
    }
    for (let i = 0; i < exclude.length; i++) {
      const ch = exclude.charCodeAt(i);
      cache[ch] = "%" + ("0" + ch.toString(16).toUpperCase()).slice(-2);
    }
    return cache;
  }
  function decode(string, exclude) {
    if (typeof exclude !== "string") {
      exclude = decode.defaultChars;
    }
    const cache = getDecodeCache(exclude);
    return string.replace(/(%[a-f0-9]{2})+/gi, function(seq) {
      let result = "";
      for (let i = 0, l = seq.length; i < l; i += 3) {
        const b1 = parseInt(seq.slice(i + 1, i + 3), 16);
        if (b1 < 128) {
          result += cache[b1];
          continue;
        }
        if ((b1 & 224) === 192 && i + 3 < l) {
          const b2 = parseInt(seq.slice(i + 4, i + 6), 16);
          if ((b2 & 192) === 128) {
            const chr = b1 << 6 & 1984 | b2 & 63;
            if (chr < 128) {
              result += "\uFFFD\uFFFD";
            } else {
              result += String.fromCharCode(chr);
            }
            i += 3;
            continue;
          }
        }
        if ((b1 & 240) === 224 && i + 6 < l) {
          const b2 = parseInt(seq.slice(i + 4, i + 6), 16);
          const b3 = parseInt(seq.slice(i + 7, i + 9), 16);
          if ((b2 & 192) === 128 && (b3 & 192) === 128) {
            const chr = b1 << 12 & 61440 | b2 << 6 & 4032 | b3 & 63;
            if (chr < 2048 || chr >= 55296 && chr <= 57343) {
              result += "\uFFFD\uFFFD\uFFFD";
            } else {
              result += String.fromCharCode(chr);
            }
            i += 6;
            continue;
          }
        }
        if ((b1 & 248) === 240 && i + 9 < l) {
          const b2 = parseInt(seq.slice(i + 4, i + 6), 16);
          const b3 = parseInt(seq.slice(i + 7, i + 9), 16);
          const b4 = parseInt(seq.slice(i + 10, i + 12), 16);
          if ((b2 & 192) === 128 && (b3 & 192) === 128 && (b4 & 192) === 128) {
            let chr = b1 << 18 & 1835008 | b2 << 12 & 258048 | b3 << 6 & 4032 | b4 & 63;
            if (chr < 65536 || chr > 1114111) {
              result += "\uFFFD\uFFFD\uFFFD\uFFFD";
            } else {
              chr -= 65536;
              result += String.fromCharCode(55296 + (chr >> 10), 56320 + (chr & 1023));
            }
            i += 9;
            continue;
          }
        }
        result += "\uFFFD";
      }
      return result;
    });
  }
  decode.defaultChars = ";/?:@&=+$,#";
  decode.componentChars = "";
  var decode_default = decode;

  // node_modules/mdurl/lib/encode.mjs
  var encodeCache = {};
  function getEncodeCache(exclude) {
    let cache = encodeCache[exclude];
    if (cache) {
      return cache;
    }
    cache = encodeCache[exclude] = [];
    for (let i = 0; i < 128; i++) {
      const ch = String.fromCharCode(i);
      if (/^[0-9a-z]$/i.test(ch)) {
        cache.push(ch);
      } else {
        cache.push("%" + ("0" + i.toString(16).toUpperCase()).slice(-2));
      }
    }
    for (let i = 0; i < exclude.length; i++) {
      cache[exclude.charCodeAt(i)] = exclude[i];
    }
    return cache;
  }
  function encode(string, exclude, keepEscaped) {
    if (typeof exclude !== "string") {
      keepEscaped = exclude;
      exclude = encode.defaultChars;
    }
    if (typeof keepEscaped === "undefined") {
      keepEscaped = true;
    }
    const cache = getEncodeCache(exclude);
    let result = "";
    for (let i = 0, l = string.length; i < l; i++) {
      const code2 = string.charCodeAt(i);
      if (keepEscaped && code2 === 37 && i + 2 < l) {
        if (/^[0-9a-f]{2}$/i.test(string.slice(i + 1, i + 3))) {
          result += string.slice(i, i + 3);
          i += 2;
          continue;
        }
      }
      if (code2 < 128) {
        result += cache[code2];
        continue;
      }
      if (code2 >= 55296 && code2 <= 57343) {
        if (code2 >= 55296 && code2 <= 56319 && i + 1 < l) {
          const nextCode = string.charCodeAt(i + 1);
          if (nextCode >= 56320 && nextCode <= 57343) {
            result += encodeURIComponent(string[i] + string[i + 1]);
            i++;
            continue;
          }
        }
        result += "%EF%BF%BD";
        continue;
      }
      result += encodeURIComponent(string[i]);
    }
    return result;
  }
  encode.defaultChars = ";/?:@&=+$,-_.!~*'()#";
  encode.componentChars = "-_.!~*'()";
  var encode_default = encode;

  // node_modules/mdurl/lib/format.mjs
  function format(url) {
    let result = "";
    result += url.protocol || "";
    result += url.slashes ? "//" : "";
    result += url.auth ? url.auth + "@" : "";
    if (url.hostname && url.hostname.indexOf(":") !== -1) {
      result += "[" + url.hostname + "]";
    } else {
      result += url.hostname || "";
    }
    result += url.port ? ":" + url.port : "";
    result += url.pathname || "";
    result += url.search || "";
    result += url.hash || "";
    return result;
  }

  // node_modules/mdurl/lib/parse.mjs
  function Url() {
    this.protocol = null;
    this.slashes = null;
    this.auth = null;
    this.port = null;
    this.hostname = null;
    this.hash = null;
    this.search = null;
    this.pathname = null;
  }
  var protocolPattern = /^([a-z0-9.+-]+:)/i;
  var portPattern = /:[0-9]*$/;
  var simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/;
  var delims = ["<", ">", '"', "`", " ", "\r", "\n", "	"];
  var unwise = ["{", "}", "|", "\\", "^", "`"].concat(delims);
  var autoEscape = ["'"].concat(unwise);
  var nonHostChars = ["%", "/", "?", ";", "#"].concat(autoEscape);
  var hostEndingChars = ["/", "?", "#"];
  var hostnameMaxLen = 255;
  var hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/;
  var hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/;
  var hostlessProtocol = {
    javascript: true,
    "javascript:": true
  };
  var slashedProtocol = {
    http: true,
    https: true,
    ftp: true,
    gopher: true,
    file: true,
    "http:": true,
    "https:": true,
    "ftp:": true,
    "gopher:": true,
    "file:": true
  };
  function urlParse(url, slashesDenoteHost) {
    if (url && url instanceof Url) return url;
    const u = new Url();
    u.parse(url, slashesDenoteHost);
    return u;
  }
  Url.prototype.parse = function(url, slashesDenoteHost) {
    let lowerProto, hec, slashes;
    let rest = url;
    rest = rest.trim();
    if (!slashesDenoteHost && url.split("#").length === 1) {
      const simplePath = simplePathPattern.exec(rest);
      if (simplePath) {
        this.pathname = simplePath[1];
        if (simplePath[2]) {
          this.search = simplePath[2];
        }
        return this;
      }
    }
    let proto = protocolPattern.exec(rest);
    if (proto) {
      proto = proto[0];
      lowerProto = proto.toLowerCase();
      this.protocol = proto;
      rest = rest.substr(proto.length);
    }
    if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
      slashes = rest.substr(0, 2) === "//";
      if (slashes && !(proto && hostlessProtocol[proto])) {
        rest = rest.substr(2);
        this.slashes = true;
      }
    }
    if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {
      let hostEnd = -1;
      for (let i = 0; i < hostEndingChars.length; i++) {
        hec = rest.indexOf(hostEndingChars[i]);
        if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
          hostEnd = hec;
        }
      }
      let auth, atSign;
      if (hostEnd === -1) {
        atSign = rest.lastIndexOf("@");
      } else {
        atSign = rest.lastIndexOf("@", hostEnd);
      }
      if (atSign !== -1) {
        auth = rest.slice(0, atSign);
        rest = rest.slice(atSign + 1);
        this.auth = auth;
      }
      hostEnd = -1;
      for (let i = 0; i < nonHostChars.length; i++) {
        hec = rest.indexOf(nonHostChars[i]);
        if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
          hostEnd = hec;
        }
      }
      if (hostEnd === -1) {
        hostEnd = rest.length;
      }
      if (rest[hostEnd - 1] === ":") {
        hostEnd--;
      }
      const host2 = rest.slice(0, hostEnd);
      rest = rest.slice(hostEnd);
      this.parseHost(host2);
      this.hostname = this.hostname || "";
      const ipv6Hostname = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
      if (!ipv6Hostname) {
        const hostparts = this.hostname.split(/\./);
        for (let i = 0, l = hostparts.length; i < l; i++) {
          const part = hostparts[i];
          if (!part) {
            continue;
          }
          if (!part.match(hostnamePartPattern)) {
            let newpart = "";
            for (let j = 0, k = part.length; j < k; j++) {
              if (part.charCodeAt(j) > 127) {
                newpart += "x";
              } else {
                newpart += part[j];
              }
            }
            if (!newpart.match(hostnamePartPattern)) {
              const validParts = hostparts.slice(0, i);
              const notHost = hostparts.slice(i + 1);
              const bit = part.match(hostnamePartStart);
              if (bit) {
                validParts.push(bit[1]);
                notHost.unshift(bit[2]);
              }
              if (notHost.length) {
                rest = notHost.join(".") + rest;
              }
              this.hostname = validParts.join(".");
              break;
            }
          }
        }
      }
      if (this.hostname.length > hostnameMaxLen) {
        this.hostname = "";
      }
      if (ipv6Hostname) {
        this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      }
    }
    const hash = rest.indexOf("#");
    if (hash !== -1) {
      this.hash = rest.substr(hash);
      rest = rest.slice(0, hash);
    }
    const qm = rest.indexOf("?");
    if (qm !== -1) {
      this.search = rest.substr(qm);
      rest = rest.slice(0, qm);
    }
    if (rest) {
      this.pathname = rest;
    }
    if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
      this.pathname = "";
    }
    return this;
  };
  Url.prototype.parseHost = function(host2) {
    let port = portPattern.exec(host2);
    if (port) {
      port = port[0];
      if (port !== ":") {
        this.port = port.substr(1);
      }
      host2 = host2.substr(0, host2.length - port.length);
    }
    if (host2) {
      this.hostname = host2;
    }
  };
  var parse_default = urlParse;

  // node_modules/uc.micro/build/index.mjs
  var build_exports = {};
  __export(build_exports, {
    Any: () => Any,
    Cc: () => Cc,
    Cf: () => Cf,
    P: () => P,
    S: () => S,
    Z: () => Z
  });
  var Any = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
  var Cc = /[\0-\x1F\x7F-\x9F]/;
  var Cf = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u0890\u0891\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD80D[\uDC30-\uDC3F]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/;
  var P = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B4E\u1B4F\u1B5A-\u1B60\u1B7D-\u1B7F\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDD6E\uDEAD\uDED0\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9\uDFD4\uDFD5\uDFD7\uDFD8]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09\uDFE1]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDD6D-\uDD6F\uDE97-\uDE9A\uDFE2]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD839\uDDFF|\uD83A[\uDD5E\uDD5F]/;
  var S = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u0888\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20C1\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2429\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E5\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDCF\uFDFC-\uFDFF\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD803[\uDD8E\uDD8F\uDED1-\uDED8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD833[\uDC00-\uDCEF\uDCFA-\uDCFC\uDD00-\uDEB3\uDEBA-\uDED0\uDEE0-\uDEF0\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED8\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0-\uDCBB\uDCC0\uDCC1\uDCD0-\uDCD8\uDD00-\uDE57\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE8A\uDE8E-\uDEC6\uDEC8\uDECD-\uDEDC\uDEDF-\uDEEA\uDEEF-\uDEF8\uDF00-\uDF92\uDF94-\uDFEF\uDFFA]/;
  var Z = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/;

  // node_modules/entities/dist/decode-codepoint.js
  var c1 = [
    8364,
    0,
    8218,
    402,
    8222,
    8230,
    8224,
    8225,
    710,
    8240,
    352,
    8249,
    338,
    0,
    381,
    0,
    0,
    8216,
    8217,
    8220,
    8221,
    8226,
    8211,
    8212,
    732,
    8482,
    353,
    8250,
    339,
    0,
    382,
    376
  ];
  function isInvalidCodePoint(codePoint) {
    return codePoint === 0 || codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111;
  }
  function replaceCodePoint(codePoint) {
    if (isInvalidCodePoint(codePoint)) {
      return 65533;
    }
    if (codePoint >= 128 && codePoint <= 159) {
      return c1[codePoint - 128] || codePoint;
    }
    return codePoint;
  }
  function codePointToString(codePoint) {
    return codePoint - 1 >>> 0 < 127 || codePoint - 160 >>> 0 < 55136 ? String.fromCharCode(codePoint) : String.fromCodePoint(replaceCodePoint(codePoint));
  }

  // node_modules/entities/dist/internal/decode-shared.js
  var BASE91_INVERSE = /* @__PURE__ */ (() => {
    const table2 = new Uint8Array(127);
    let code2 = 0;
    for (let char = 33; char <= 126; char++) {
      if (char !== 34 && char !== 36 && char !== 92) {
        table2[char] = code2++;
      }
    }
    return table2;
  })();
  function decodeTrieDict(input, resultLength, atomCount, dict1AtomCount, ngramCount, dictSize) {
    const base2 = 91;
    const inputLength = input.length;
    const twoCharBias = dictSize * (base2 - 1);
    let pos = 0;
    const readSlotCode = () => {
      const c12 = BASE91_INVERSE[input.charCodeAt(pos++)];
      return c12 < dictSize ? c12 : c12 * base2 - twoCharBias + BASE91_INVERSE[input.charCodeAt(pos++)];
    };
    const dict2AtomCount = atomCount - dict1AtomCount;
    const slotCount = atomCount + ngramCount;
    const single = new Int32Array(slotCount);
    single.fill(-1, dict1AtomCount, dictSize);
    single.fill(-1, dictSize + dict2AtomCount, slotCount);
    const start = new Int32Array(slotCount);
    const length = new Int32Array(slotCount);
    function decodeDelta(count, off) {
      let previous = 0;
      let slot = off;
      const end = off + count;
      while (slot < end) {
        const code2 = BASE91_INVERSE[input.charCodeAt(pos++)];
        if (code2 < 89) {
          previous += code2;
          single[slot++] = previous;
        } else if (code2 === 89) {
          let runLength = BASE91_INVERSE[input.charCodeAt(pos++)] + 2;
          while (runLength--)
            single[slot++] = ++previous;
        } else {
          const next = BASE91_INVERSE[input.charCodeAt(pos++)];
          previous += 89 + // eslint-disable-next-line unicorn/prefer-minimal-ternary -- branches read a different number of side-effecting input bytes
          (next < 90 ? next * base2 + BASE91_INVERSE[input.charCodeAt(pos++)] : BASE91_INVERSE[input.charCodeAt(pos++)] * 8281 + BASE91_INVERSE[input.charCodeAt(pos++)] * base2 + BASE91_INVERSE[input.charCodeAt(pos++)]);
          single[slot++] = previous;
        }
      }
    }
    decodeDelta(dict1AtomCount, 0);
    decodeDelta(dict2AtomCount, dictSize);
    const references = new Int32Array(ngramCount * 2);
    let poolSize = 0;
    let ngramIndex = 0;
    function readNgramReferences(count, startSlot) {
      for (let index = 0; index < count; index++) {
        const slot = startSlot + index;
        const a = readSlotCode();
        const b = readSlotCode();
        references[ngramIndex * 2] = a;
        references[ngramIndex * 2 + 1] = b;
        ngramIndex += 1;
        start[slot] = poolSize;
        const entryLength = (single[a] < 0 ? length[a] : 1) + (single[b] < 0 ? length[b] : 1);
        length[slot] = entryLength;
        poolSize += entryLength;
      }
    }
    readNgramReferences(ngramCount - dictSize + dict1AtomCount, dictSize + dict2AtomCount);
    readNgramReferences(dictSize - dict1AtomCount, dict1AtomCount);
    const pool = new Uint16Array(poolSize);
    let write = 0;
    for (let index = 0; index < ngramIndex; index++) {
      for (let half = 0; half < 2; half++) {
        const source = references[index * 2 + half];
        const value = single[source];
        if (value < 0) {
          let read = start[source];
          const readEnd = read + length[source];
          while (read < readEnd)
            pool[write++] = pool[read++];
        } else {
          pool[write++] = value;
        }
      }
    }
    const out = new Uint16Array(resultLength);
    let outIndex = 0;
    while (pos < inputLength) {
      let slot = BASE91_INVERSE[input.charCodeAt(pos++)];
      if (slot >= dictSize) {
        slot = slot * base2 - twoCharBias + BASE91_INVERSE[input.charCodeAt(pos++)];
      }
      const value = single[slot];
      if (value < 0) {
        let read = start[slot];
        const readEnd = read + length[slot];
        while (read < readEnd)
          out[outIndex++] = pool[read++];
      } else {
        out[outIndex++] = value;
      }
    }
    return out;
  }

  // node_modules/entities/dist/generated/decode-data-html.js
  var htmlDecodeTree = /* @__PURE__ */ decodeTrieDict("!}.&u%}'&}*'~!6*)%&,~!J~!J~%L~y<~!R,~~%Lu~~#GD~~#|)1#%}^%}2%+#.##%##%}&%##%'#%##&%#%#'%#&#%#&#'#%%#&#%##%#)%''%&%#%#'%#%%#%%}%%%#%#&(23#%%#&-%0%('1#(##%#'##+%'*.:1}#%#6-+(%'%%#%%%}#L'2351&('%}&/N'(0(/*-%(%%}#'+&T%7.2}#&%&#%#36/5##%&%%#&#%%#))2%%##%&&'0~!#*+&'%1~!%).'3q?&%'1~!.##%6(~!+%%%(Gw'rT~!E#<nA%#jZ~!H%(~!42##~!*31&~!G%U~#)5~#`3~!J~!Z~%]~%Y~%C~!q~!u~#kz~%#~!6'~!D~!U~!?~#T~!c%~!G#'~%7|~!G~!J~!G&~#pb~(Df}#%}*&}#%##%##%##&#-}&'#'&%#.++}%mI,#,@&(}*%}*'%&##&#%##%}&0}#.},U},%}+%}&%}#%##&}B%(}(%}+%)})%##%#&}&%##%&}<%}>%#%&}*%}(%}9%}/%})%}*%}*%}?&}&%}3%}&*#%})%#%#)}#&#-#+*%E%%'%'#%}#*V##&##I}#&&##%&%#&&Qf%%))w/0+&%#(#.%-''''++++7}>%4'',##1,#%#&%##&#'##&#*#9)%&%}#*}%,#+P(%A&%#'&##wSD',9E00#y#@}(+}&%&>~!#~!X}#*}(&&}(&}(,%}%&#+&}#&}I%#%}%)#(},'%#*}4%%#%}(''}#/##(##),%-##%%)#&}(.}&%#&}%%}*&#%},&&}&%}#%*'#%})%}D&}&%}-&}6&#&}-,%}#%})-(~+`~,=?~I9'9%~!,#%})%})%}@%}?%}(~!?~#<~#pP~#BG~#=1#%K+~#?#~%;)~#A~#mF1~#A'~'X%'~#lR~#N~'N~#r~#m#-~#i'?%#'%~#B%##%,%#~#_%#0%~#]732~,w~2+#:&#%&'0%&>%}#>##F+)#%&&#(+_}4&}-%}(&}@&}O7Fdf0@+/v4}&WU##&/0#&'('B#%}.%}'+#%}#%%&#&%#%##+#&#)#6#'#.},%}c%},%#%##%&#&%#&~#>'*-.%##%##%}#%%}%'~#)D1}#%*&~#_%%'(~#S2%'.}#~#=##*'*-%}&'%'##&&~'E%.#&~#M4}%%##&'%#~#O1##%&#'+~#<B%##%%'%+~#;#@%}#&%#&&%#(~#H1}'%'##&&~#?A}&'~#D#%32}'&&&&~#[}'(#%}'~#;C})&}%%#%~#=&%,3}%'(#%%~#^'#&&)#%'~#Y%-~#d-%'~#^%%&#&&&}#~#b~2t*&'~&(~&@~0%~e~3}%*''0})&}+~!9##-}#%-hD*)1fC#%/&/fB#40~!+#)*4~!+~!K'&:~!/*7~!.#~!H~!L':~%x&~!H#~!*~%1~!I#~!+A~#p'~!F~~#-#~,,(~.Z~!V~%;'B'mq-W~!N~%I%#&&#&}#%},%%}'%}+X#%}#&}(%}'%}<%}#%}%%'}'%}:~![)9@~%>~#UA%-%##&~!C%~!-.9:~!1~!-^2/:a~!y,D*J#-5)/4~%23,~#G~!L1~!0X3`~!2+~!!0-~&E~!W~!o,>Y&]~%cZx_&~#O*9#A#'#+I'%#)~!0B*-5A+-((F&*M#)(-7-5+'-3a5Vi~!Y~!?+[)%3),ERHm~!+:D,VG.+)?fB%%*(%)'(#&80%1'8`K8?`+'Z#&O&'H5#*9)A%%5&3))0%39+.*7#()&&*=4@**L)<'_&*+..;(#*+)./&0#3)%')-8(4ixD(&.}%,('aI:,)%,k2231T)I'#/-W7,/'Q#.'Y24+h')37</31&83##&0#),H(?'&?/1##%#&&#%''-%&&&#(&''&#.-'%#%%(,')*'&#&#'##%(%(#%('#&##%%%%('%#%#%%#%#&%##h>w+v<ayvyvcg.uuhKr}g/v|g>u9i[~>g5uI~=RvdwEg;v/g;uk!!TTSx]@RT!U!#!@VBRUU!'UTe-d0c`e&gSdicedFcrdTaqb.kYcAohdYd@a3e+d}dMdtd.aJ#bqcK`dle/e.e'dwdPdodddjbEb}ogd^ofdpduc6j?l%d{drdqc)d7bacOdQ%T#Y)X.sR[yH>6Vyv3[xwLu>vo'!*.[yBacahoj>6Rew3[xqdZa#!a&#^(X-[yG>6Vyu3[xvg3sEr|g.u/Ri9db0T#^(Xa)!-[y;>6Vylg4wKs{JwNZt3@3r=c4Z([xlg;wKt!cpq's@v7A'*a(a+!-a#[y<3Dt?3Dt'>6Vym3[xmg9rxsNJwLZt4~?r?db1T#`-!(Xa,!0[yS>6Vz%NuQs.g4wKtnJwNZtS@3r>c4Z([y%g;wKtrdga8!a(!#&T*Y-Xa#!a0<or[yc3Dtq>6Vz43[y3JwNZtf@3s!Ju}!%Dti:pm3c_%X#tjB5pkd6q!r]u?voC'*-a.a2!0a&a+[yI3DtI3Ds~3DtH>6Vyw3[xx;:s#~<5pKJwNZtE@3r~d`a)!a2T#a.(!+U.X1[yT3Dt`3Dtv>6Vz&3[y&g9rxwzcxstPu.<rAJwLZtT~?r@dZa%!a.&^*Za(/Reu[ya>6Vz23[y1g3sEr}wkg{NuQRg{ci(U#5@b`~,cg#U(2WnH5wugcRh7dX#T(Y,a'Ta!!a,[yZ<]mj>6Vz,3[y+Pv#5ReZKu+=,%!H}7ABwkaS?Rh:BcW(X#<]mrj:ubv/ARekdg%!(!a.*Ta(Y.X1!#sP>Rl*Dt6[y>>6Vyo3Wf*jOvuumvuRgRJuq*!:9<B@bX~3jVv&v@s@5Re[d/rQt{uAvo&a&a*)a2!,0Wf!3Dt0=Bs'>6Re}3[xy~<5s%JwJZt1~Gs)c;&!#2sJkNuXvzq7rxu,Re8dka4!a8(aEZ+a@Y.X1Xa)[yd=Bs(3DtP>6Vz53[y4cX#X&Re:avRe9~<5s&JwJZtQ~Gs*i^rzvdRg+Jv{%!2sbB@bX}kdga,!Za?&^*T1/!a'Dt+[y6>6Vyf3Wf%g/u;s4hGu6?Rh-JvZ,!c%#&RoX54Rivj7uyvf8RgTKvZB%*!2sGh<vu5Rgq<=C::9bb~#dZ#T&Ta6Y.X*Dt>[y93Wf)coZ(T,6VyifluvRgC@95@B@bX~/hFu34cC#T,k/unq8w8Q5RkUklwQuzunq8w8Q5Rk8d/rJu?v8w9)-&!a0a;a&aIWejg3sEr/h1s<DtDJvyZqY5aws3Jvy!&Wei~Hr1:au5@Bag>23E~5c:Z&bX};kKv?w&unuVu5Rjc;>bs)#~@:Rh.=ay<a]C;b`}Vd6s/t{uAvoaxa()!a,a7%-a#a2Dt,[yF2Wo[>6Vyt3[xuNuPRi&NuPwpi#RoWh?vf8Ri%Jv]!%Ri:KvxD!.'2WeAjZu`q9rxu,Re7woeAg-unLq(qA_/*2Wg_g3u5q^9:4E}/jTrxrzv=Wkkd~0UX#^^Xa-a1a5T&a=U1a'*aEa]!a*aPaA-adok[y54Rn>;:p3~Dp5g9rpsFNvZqjg3uJp4~<5p0Pw;5qlJwNZt*@3p1Pw:5p/Ou!5p2JvG'!6Vye=<qnJvh_[xhg3v,Rh3kOwOw-sDuev/Re^dha[a%!%!a+#Ta7)-5TaCaO!aka!a)sf[yb2>Rl!9ARiq5E}Qg=ucRkBE|oJrJ_@Wk~@Wk{JrJ_@Wk|@WkyJrJ_@Wk}@WkzJvO_[y2g-vMRmiKuYC!)&>Ri;>Ri<@3RkNc](X#@9Rk=g5vuRmhKvDB!+'=]meg3u4Rmgd)#Y'Vz3CARmfd`a+!%T'!+#Ta1Ta6TaM-sTDt9[yA9sYd'%Y#s[[xpj:ueunaXRgEjRq,v-vuqdd2'`#6Rev<32@5>:2<E}5xIo9a*X#Y(;5RePJvD_g>vyRgNj8w)v8<wggs:RgXiZt|vjx,hSq3ah!-(~@:Ro/Ou!5RhWj^v(pyw8unRhUdx-UY#^Ua.a3a70!)%UX1TaDa)'omRiRRhE[y:3Dsz=Br,>6Vyj3[xkg6ruwjcqsrPw;5r*Ku]D'Zt-@3r(~?r.i[vwv]dU1a--U#`a4(g/vsRhPOu!5RhLj:rmu9Wo!~@:wdh@g/vsRiTjXuvvNr}:RhBj^v(pyw8unRn]dz1UYa'a+^Y(!aETZalaRY.Ta?a4[yDJw1!#qLsW>6Vyrfzq-pLflpwRe|Js>%!Dt@3Dt&Jvy_[xs~HrnjMuwpsw'RecKu+D#'!t<~Grl~?rjg5u-x,gwp{ah!-(~@:Rg~Ou!5Rh'jXuvvNr}:Rh#cW#X/c;&!#2sLi[v7u7RgpJv)(!iLrxu,Re6j7v@s@5Se[e7d`aW!Za(a`T.a#!a3!&aDa-!9)Dt_=6s+3[x~~DR|h~DS6avhGun5RkZj3w)v-]mkKunB!&*]kb97R|i<ARk<c:Z(6Vy}Juh'!wziMRoS:F|vkLuauJv5vtvQRh1d='T+Y#VyO~DR|jcF#T'7R|g97R|kJv3'!ay<Rj,Jvh&!:ReXcsa6*a+#a#_aIRf9aLRf?c,Z&Rf5Rf7c.Z&Rf;Rf>cQ#%T'p-Rf8Rf=ct#%'(*!,p,Rf4p+Rf6Rf:Rf<d~'Ua%U*^UYa(!a,-!#a4YaTalaEX0a8a<Weo3Dt/3Dsx=Br93Wen~Dr;~<5p<JwNZt2@3p=Pw:5p;Ou!5r3c7&!#:p>3Ds}KvGB)_6Vyk2sM=<r7x'eovA(!hFu1ARf}cV#X&@r5j6rvwQa^Rf3c=Za'wkghJv__g;unRggA53B9=b^}%j6uduo5Jq;!(hIv%2Re`Ou4ARe_e%a#^^^Xa&!a*a2!&a6YaP!*ad!#a:aE/5Rn?[y@>6Vyp;:pE~DrY~<5pBJwNZt8@3pCh=rt3rWPw:5pAJup_[xoNuPpF9c!#'45pD5ARn)d8#X'X*3@rU72s]h>v<<sSjJpqvewOJq/(!hNw'5ReBk0s2u3w/w'5ReE5@Jq.!a+JQ!&WeU23d(#Y&RjG5]jBk!u7w&u0udARjEe#+^^^Ub#!a2/a`Z(agT1!a-a;|@TaG!aS[yV=Re~fow'RguNuPRe?bz#'>RoUWeL>:Cbb|?JwPZtVg6ruRmzJvD'!6Vz(g/vmRh~Jvy_[y(g9voRgyx*cy(#2>Ri2B9b]~9kIw9u7rluJu3Rg]dI#a%UY'@=p%CAx.gQZ&RhwwygtRm{x5g_Z'+ABqR9Woa=Bp&dV#^*Xa'!&@o{g4v]Rk;Jv{!%Rk[wkkiA5RkiwwfUB=x,fUuqC&*!>RfTg8v0RfV~ARfSd;rJsAuAv9wR'ae+/aO!a@aza/a#[yQ@Wg!2Wemg3sEr0JvB_g>uvReWg2v+Re=KupB_+[y!2AbY~-~Hr2AJwD!(h<~El>h<~El?Kun@+_:9b`}Kg-v/Ri3g;vtwyk_9]k_d=&T#*U.6qh@Ab`|K9:H|CJv[!&3Dtex'fDwC%!Rf[9WlMd[(^X,!a%Z06Vz!@WgBg=v~Rgvg,QRe@awd,#Y+jTv|Q~EfWj]uNr|~FRfXdy#Y&^Ua%!aO.!(a)Ua;=!a@aKap!a-,a!Ta]a[rSa]p?[y82sK=Bq~;:p:~<5p8Pw:5p7d'#Y'Wf(;RnRi[u4w&RgJJvG'!6Vyh=<r#ijuuv/sIKuYD'ZtG@3p9~Gr&d2#`(g<vtRgFj`u5w&rqpxRf2CJuY!+:wfnTOu!5Rg}jNs1ucv&RfwJvA!&3@q|BDcC#T,k/unq8w8Q5RkTklwQuzunq8w8Q5Rk9dga#!a'!a=#a0!:+Tb*b@aO.a4!aba8aFJv^}?!VyR~Dr<g;u%Rn.~<5p[x'e`wNZtR@3p]Pw:5pZhNvjBp.woe_g5u-r4JwF!%DtO3:ooc7&!#:p^3DtpLuGw(!+%)Dtk6Vz#2sd=<r8d'#Y([y#<x3gJt`w@!)%}MRiowzikRij=]ilxAf3,U(#B2Rf#g0v-Rm[ck{`U#]giKv3>)!&6Ri154s,KuGB_%@r68r:dJ|t`#X(9<E|u2@H|rx3gJu?w'!+'1Nu7Reg4=H~+9<wxgY95Rm]xLggZ-`(X}U2:Ri4h<uOawRmsJv__5@bb{jbV~3dka#a'a]!,#a+U=a>b6a3b%!/aKa/)!arwve^VyJ;:pR~DpTg3uJpS~<5pOPw;5qmPw:5pNOu!5pQJvG'!6Vyx=<qoJvA!{~Jup!%@qk7Rn/KvyD!}''[xz;>wkh'?Rh,x8gyt`w5D!&),(SgyccRgztJ@3pPB5p#d'(Y#<]mmifubw&RgoJvE&!82s^JvF&!8Rf,ADb]~;x=h'rNu]vK!,%'*0RnORh)4Rh*AqQg-vaRnNg;wHwkh'ba~4cE#Ta*x3gctyw@'!+%RnFRnD<4Rn@hFvK5RnCxWg[#`&a0Ua()`1Rm75Rg[c]%X#qi8Rg^NvdRj>BwzgZauwji7Rm6A4wgg]d1#&(*,.0a#Rm;Rm<Rm=Rm>Rm?Rm@RmARmBe%#^^^Xaea?aC/b+(,!a+a#!a/!>a&Ta<aKbD!2wphBRnk[yPw}hE|.=Br-3Dtm>6Vy~g6urRf.x,hPrNav!%'RnqRo%Ro#Nu;q[Pw;5r+JwNZtM@3r)d'#Y'Weh;xChL#`&RnmRnoKu}>%(!Rne~Bs-;2wjcussJv+'!aYSO}6@B<5?ba~8LrNvj!.%*ROwungw~ng~:9;Ri^>wtnig;wHRnixDh@|(UZ.x1h@|)!#:2<H|*xHn]#-UX'3Ro)z=iT}6ARns=Bwsn_wpnaRncw]aR(#UXa&Ua*a/=]iPd'#Y&Ro'WnXf{QRm2hNvj]nZd`'T~&1`{|`#9b]{}c:'!#Wl{>@=be}]?cl{{U#:5Abb}Jds#^YaF!a*b4a#a3aPa>&Tb!bH!*a_!Eau?/a&RjY<]gj>6Vz*;:pe~DrZg,QRj1JwNZtX@wihspcJvZ&!VyX9WmOJu|!|N2WmHJvh&!]ht~Bpbcn&T(!#RmQ<s7Nu;padH#X'`+WmJ@>RmKCARhnKup=!)&Wf+:RhqNuPpf9c!#'45pd5AwghpARn(Ls@w!%,)!RmP@Wfe<E|IJva!&WmNg8vsRmLd`*.`#Y'Xa!axRn*]hrA8Rhug5s@rXg8u!RmMd8#X'X*3@rV72smdI*#UY&RmICARho~GsgxVgd)Ta'U-Y&Xa!T#RnEWnA@Wffg1uDRi0hFvK5RnBxGnG&#`%owp)@wsf+bX}Ze-*1!a*^^^Ua|!#a.aq&Ya2!a>.a6!a:aO`aJDtL[y`@Wg#>6Vz12@wzoYRoZNuPRi!NuPRhzg=ucRi,@=b`{Yg=ucRi-ACJvB!&Sh[ebSh]ebi`wUuFRm4Jw2_[y0JvB!.<Ju(!&SoG}6Shd}6<Ju(!&SoH}6She}6Kur@._g5vHRieJvx!{L2G{Kx6gd'T#?Rh82Wi5cZ#X(g1w)Rm5dW-Y(Ta#!a)!#aYa=wnfE=su2>>bU{0j9udv:<svj8uQv-7RgHdE%#^'sq9sp=>Bb_{TJv`!&g/r|snj6v(us5d,#Y(56H}[978H}]Jw5!&g1rushJvB!+j;v{u5?zDhd}6}bj;v{u5?zDhe}6}ce*#`(^^^a[aea!=!a6a*aoXb1a.!aAbL!b>,b'aL!aV@Wf|2Wlg3[y/JwNZt^@3piPw:5pgJunZou3@rsJva&!Vy_g<v~Rm#JvG'!6Vz0=<r{Ju{%!:pj@WfsiXuJu3Rm:JvZ&!WfA~Bph@c4Z&Dtwax5rubx(#:awRk1@d,#Y&RfjRfid1#,Y(@Wfp2Wlrg5s@ryKu[@!,'=]ig9wlk?Rk>g5u-rqJvy'!@9RkQcH(T#=>Ri~@<wkj(Wj(KuZB*!&<7rw@9RkRcH(T#=>Ri}@<wkj)Wj)dg(Ta2Xa9X#`-!a*CARhg@@=I}d9x;c~#X%so=<sj>2@@=aybb}XjWv0Q~EfEj3vLv;<d,#Y(56H}`978H}_dgaPaFa'a/!#a3Y0a_a;a|!1(a7-[yE3[xt;:pJNvZrrg3uJrvJwNZt=@3pIh=rt3rxPw:5pGOu!5rpJvG'!6Vys=<rz@c4Z&Dt(ax5rtJvZ!&~BpH@wsfNg-vaRlNci*U#=<wei<F}a5@Jq.!a*JQ!%@qZ23d(#Y&RjH5]jCk!u7w&u0udARjFd/prq=tyvpaEa(a:.!a1aZ(@@=I}:9wpd%=<sX55w_h}@@=I{t=ay<aU@@=I}T=ay<2@@=I})?C9:9au@9Cb]}DP~=x-fAZ(2Wl1=ay<aU@@=I}>5@d##Y+jTv|vV~EfFj]uNpn~FRfGdgaK!Z2&!a8a-Tb({E!acTbM*!a(DtY[yYd'%Y#sl[y*hHvh>Re5x2c{Z}.j4uCvcawRiMd+#X+_x&d!},<5RkX;2Hzw@x,gavfB-!{CcF&T#Roe;RodwWbBg5urRgaKvHC*_6Vz+<4opieuew&Rmq@d]&Y)X,T#X0Rh}<BqP=4qS9:ReMg/ujReNJw0!/<Jui%!bd{kawwnemRelAxUa?a3#*.&UX(Ya+a/RhvRnQ<o}9Wmtd-#Y&RgSRmw9;Rmxay=Rmyg-vaRmuxEhSrNu,v-voC!%(aR.a(a7+1Ro1>Ro5CE{A9b]{@;5x#eO{:g;urRi+KrNA!%(Ro3>Ro79;Ri_Ku@>{;&!x%gX|{KunA_+g5QRj/g3u5Rj#g>uERj%wio/xRhS&!,!#^1U}wba{8>>@=be}qC@:D5ba{7Ku+A&!}x?ba}t>>@=be}se(aA^^^Uat!b0#{pa+awUazbGa#aLb9bgaWac'a5TbS=Br!d1#`%scp_Jvl!#rT>Re0JvX&!VyN=H{Fcm#U&:pY=ReaJv2&!]h0=]nUJvG'!6Vy|=<r%JrM_=]h2@Wlud'#)U'Wf'b]{i=]h/Jvh!&~BpWg=v]RnMx+ny#'Nu;pVwjnu=]nwxJnx,T#`&Reqwjnt=]nvieu9vrRjLLuYwP(#+!th@wih5pX~Gr'g5v/Rh4KunA'!-CARnP@wwiN:Rm_9x'cvw>!|l=<saKvAA!0&3@q}>w^e1bp#&Re2Re3BDx7gH#T|f5H|eKuZ>!%(:qNAH{]Jv6!+3B2B9=b^{X<5<B92:E{ZLvhwA(a;a%!igQuyRmad+#Y}m@3Rh5d8#X'X*:AqUAHzmaxwbh<aXRnVcF}RT#Nw&cj#U(BWnug/vsRntdka)(a3+.Zb7aYYan1!bVa@Xa}[y^@b[{G=H{+hFu73Rj&Pv#5ReQcK%T#sig1v{Rj'Ku+D#'!t]~Grm~?rkKuMB!01d5#`'Vy.ta3Dtu~Hroc8#'{^45s85AwZbP&!#Rn!wghxWn#KvEA!)&2RlA2RlBx:h|#(T,=]j09Wobz>x]z/@awRoTd+#Y(az]hFhCrm4d,#Y+jTv|Q~EfMj]uNr|~FRfOdCa!Xa9_X#@<plJvf!%b`{(9;Rgwc;.!#2x7cw#T|UDb]|T5Ju={(!=@E{&Jv)&!Ab`{'awJvf!~*>>@=be{#KuY>!+&4Ezyi[ugv&RjIdea+T)#UXa&T-T&a!Rh9auRmW=]kLg5vuRn+g3u4Rn-Ow6ARn,hHus5xNk?#UX(U~)/g8v0RkD~AwkkF?Ri.OuNBwkkA?Ri/d|a2`a*^UYa.!aBTZaTa'Xa;!(!2!-a#b2[yC>6Vyq3[xr2Wi?g1rusVh%s?DtF~<5rbJs;%!DtBfswKtCj[uvuSsEu3RgVx3o:u+wN'*Zt;@3rd~Grh~?rfg8w)Lq)qE&-a%!>bI|`jWv0vV~EfCjTv|vV~Ef@j]uNpn~FRfBcK#T']gWNu7x,k7q4ai(0!hHv8<RhmkMu9vrsBuev/RhlCJvB!,g<v{wchh~@:Rhji[vrv{wchi~@:RhkdS&a5UY#Ta!RgPwwiI5BwciI~@:Rh`x'iJvj'!5]iJPu8Bwch]~@:Rhach)U#h3rp]gLh@t|Ax,hTq3ah!-(~@:Ro0Ou!5RhXj^v(pyw8unRhVd|)`,^UYas!a?/a2Z'a^Ta{Tb7Ta(a#!a,Wf&9sZ3DtAadamov=Bqt3[xig8vsRm~>waiL2b`{QJv*_Ouv2qgj<v]v2BqfdR'X*X#Y-@3qr~Gqv~?p6hHv-]glPup5Lq+q?_%*b_{qF{n9b^{rOu4ARhpKvCD!+&~Bqp:5Dbb}nwoiKl&unuTuBv]v+ueunaXRf0=Jvh!0nKufu8v1w&w7q%w&uHrz:Rgnj5w,uxDJq/(!hNw'5ReCk0s2u3w/w'5ReFd>Za&!*UaA=<wkgsRnSJv^!%Refifw3vyRgOKu_B'!,<]gkiiu:w&Rh<=C@a^<B57@2F{[<B5@aW:=3away9A5aW=<B=C@a^<B57@2F{Ie-#`(^^^bCara.b8aza6!/bZ,!adTbnTbOb+aFaS!aAT9@Wf~2Wli3Dtl2@d,#Y&RfnRfmJwJZtN~GqyJva&!VyMg<v~Rm%iXuJu3Rm9Jv[_=]ih9wlkDRkCd1#`(@Wg>2Wls3cH#T(@<Rj*=>Ri|b~'#23s9h<~El.d'#Y&Dtxi^rzvdRl#d*#U%(o|B2s`hJwSaxRmDKv4B&!1:Rmdd5#`'Vx}to~Hq{x'f1v3(!BA5ba|bJv_&!Wfug1v]ReIdO+U/Y#&G}-8wze=Rh{g1v]ReHg/uQRf/by#)ibQwERl/cH#T(@<Rj+=>Ri{cNu+vlax-!(#a0qa9<Rii2;;bU{H;x<i=&X#Rk`<4wwi=C9H~8xAI(Y#<azRi@45wXI<B9;5bb~7dL(X#Xa(+!aL6Vy{g5QqOau:5au2@ay547EzbxOcU(UX-T#Ta#:Cbb|A?wjh/b_|SOw6ARgtihr}u7Rhy<d1#T)X1@@=I|~=ay<2@@=aybb}Sj3vLv;<d,#Y(56H}A978H}@dGpvs@uAu`vcw9*!aFa+ai%(b!aXa8.a?a[ozWey=sU2@G}Nch&U#Rf_WexKu+D#'!t:~Gr`~?r^j]uNr|~FRg*j^psurwJt|RmcKv)@&!)7Rkv~Br[@wxfO:Rl3co#U'6Rezj_q#vIuavjRltwzeyh@vr5JqD0!>aY?C9:9au@9Cb]}9cl#U*5;5<H||jbuus1ucv&Rfvg1v~d/pppzqFr^a--a~!aMat1(hFv;Wiz@@=Izoj5uuv-7Rix~Cw`fk2WlVcZ#X,k)u3vWs@u2]ktg;wEx'fBq(_2Wg/jTv|vV~EfoJv]!15x'hzqG!(P~EfU~CRl_j6v(us5x4i-#T(2WmZ?C2F|d>Kq<aj1!*jTqIsBv=Wl`~Cw`fi2WlWj`v0u*~>RlR=c>Z,k#u3vWs@u2]kr<c1Z+jTqIsBv=Wla~Cw`fm2WlXdmb3!a{(arZa`bkTa%TbQTa-a9+c'!aM!/[yL=Bqug.w'RifhFvyDRj.g>vgwyk^9]k^Jv3_@WfbAARkhJw2_[x|JvB_wkoIRoKwkoJRoLd'(Y#<]gm=<9<H|yd'%_X#skDtb3awwqkgNulRkgdB#^',9:p'hJwSaxRmEBwVb8@4=H|qLu+w50&!)@3qs~?pU>Awwn;;Rn=c:Z'ARn<=<qwKvC@!/&~BqqJv6!&]eVb^z^xRge'/a%+^`#Sge}6<4Rn3=]n0Pw2>Rn8Jw0!&>Rn:>Rn6cY#a7+!a&=<wkaNw~h3z_c5Z{=wjh#=]nLKv^D!&)Vyz=bW|swYb<WetcG#T(2wxa@qVx@gD#Y&b^|V5JwG&!5bb|pg/w&RgD@x=kHs=uAvn!a%%/'+RmSRh694Ro`g-vaRmRhHv-]mlxCcS#`&ba~.5cD#Ta)P~=d,#Y(56H{>978H{Dd_#{2^Y%_+qbbb{6g3sERhsbU{?dfa.,`a(Xa<!aiX#(55RiG54RiHcI#T'WiU3RiVNvdwtfcRlKNvdd,#Y&RlHRlExQgf.1*^T'X#Sgf}6Wn4=]hfPrk>Rn7Jw0!&>Rn5>Rn9Lunw?&a2!,5<oq@@wqfdRlJj5Q~=d,#Y(~ARfcOuN]fdDKw;ay(}i!547E}j?cI#T(@5bV}iCbV}hdv(^^Tb?a40,b##Tbo!a*bR!a<b|a/!aKai!aU[yK=]o^g:v>ReGJwPZtK<7Rh+h<~El,Pv#5ReR@awwxjCg,ulRjDJv6&!]j!z?aQeeg>w=Sh<eeJw;!&axEzOg,Qosc!#*:wkeJ]eJ>x'h-u(!%Ro.w~h.zPdNZ(X,Ya![x{;9ReY;wkgxRiF:x?ap#Y&RmUg<s2Rkod]+UY0TZ'!a&A9sw<=bczLNvuw{gqzNhJwSaxRmCKuLay!#&s_Rf-55b^{uJvZa!!c%#(55Ri654wmiu5RiuawLu,vp!+}^%b_}Y9;wkgxba}o>A9:=b^}zKuh=a''!3awRk3c*'!#aHRk6c+Z&Rk5Rk4Jv)&!awRjSawd9*`#0?C2@EzMj8u<uJ5RmbjQrquJu3x,k>uq@_+=ayb^|W~ARkEOuN]k@7dhzV^X/X&a-#zRzSb`zXcJzTT#2WkVKvDBzW!%FzY9;5bbzWjQrquJu3Jw3%!b`zU=ayb^zQd:#X(T-a!6Vyywxh}=b]{Jg=u1RiAdGp~qHtzv!w(wA+a+a;<!aJaYai'anasb(=azRmV:Cbb{MLq2vb!%')RjuRjrRjtRjqx3jnqCw3!%')Rk(Rk+Rk&Rk)Lq2vb!%')Rj{RjxRjzRjwLq2vb!%')RjsRjpRjfRjex3jcqCw3!%')Rk'Rk*RjkRjl9<CbbzfOu4ARhxLq2vb!%')RjyRjvRjhRjgx=joq*uKvb!%')+-Rk.Rk%Rj~Rk-Rk#Rj}x=jdq*uKvb!%')+-Rk,Rk!Rj|RjmRjjRjidAq&qKs@uAv8Aa.'*-a@a&0!aM@a5[y73Dsy3Ds|3Dt):wxgI2sHJwJZt.~Gqxwsf0ikrzt}Rl0Jvy_[xj~HqzKv_A|D!&WfP8axRoVcf,U#k(v]v+ueunaXRf1Ju}'!g8u#Ri=jQw!sCunLprq>!,')~<5qeGzq9F{W=c##%s5au:5aU3CBE|;d4#X(D!a&6Vygx(b;#(=]ed?C2F{N<capoq2r[a&!aPa9,'Pw;5s:@@=I|,55w_h|@@=IzcP~=x'fCqB_2Wl2>aU@@=I|1OuNBc1Z+jTqIsBv=Wlc~Cw`fl2WlZ~AcTa%!Z+jTqIsBv=Wlb~Cw`fh2WlYk+uNqJsBv=WlSg,u3dca3#UXaMYa)TaB-=cM|7T#<bI}l5@B932:aV2G{BOuNBJq:|M!5Ezt=<B=C@a^<B57@2F{v>cB{/T#=ay<bI{3Jv6!a.6BKq0ah&+!5E}HP~Ef{978BaU@@=Iza<7d#.Y#978BaU@@=IzH~AJq0!(@@=IzG978BaU@@=IzFe,aU*Y&^^^bvJb,b:bFad!a,c2Ta>aL.bo6!a#CbTa'T#Re{2Wlh2@G{yg6t~Ro_NvdRfticuRQRllJv3&!x&c|zs@Jw3!%RflwpfkRlpKuL;%(!Re<@G|C2GzdhIvuBwgjAg-u0RjAKQB%!(GzZ@G|5NuuRl7d='T+Y#Vy[g<v~Rm!==G|>JvA!)@wma=]m1ifuaw&RmnLs@vT'!|/+[y,g:v>ReTJw1!#qX=x!eC{bLu+wT&)ZtZauq_~Graci&U#F|89:r_Lupvq!.)&2RlG8RfaC=x!eF{_h?rpWlmd&'!#X|&]k::xJey#`'T|+<E|&2@H|%dE#(^,g;u.RiEg6vjRiC9xCkA{O|zY#g=ucRmXKs0@!&*@G|m@awRknJuh!,3d(}gY}eJvj!%Rm):Jw3!%Rm+Rm-Ls0w(&!a(a#@b[|6cZ#X'7RkxWgAOu4ARn'dH'U#Y*Vz-Wm'CARm}d]*#a%^a*T'aK!a<9bV{PC=p*Jw4!&SgxcbB5r]idw(wBRmF7xFkt#&`(Rm/Rm8E|!JuY_9:Rl5=wrgr2:bbxd@xXfB(a*#T+!.X0X1Ta/a'T&RlDRfL>RlyARl9b[z[>RfZ:RlL:RfRwlg/ARl;9;RlxKv,A/!%7s69<74=BA5ba{-8Bde#`a<XaKYa1,a'P~=wxfB2bZ}}?C972@@=I}r8@55B9;5bb}G978B2@@=aybb}3j3vLv;<Jw3&!>Rfk=ayb^}4~Ad1#`*@@=aybb{w2@>==<bbz]dx+UY#^UaF!a9!bB'Ya1.!ajXa#%olRhD[y=3Dt#Ov5BrHKuMB%!(Rf^Wep~HrJwkiQjKr|~FRg)Ku+D#'!t5~GrF~?rDdV)UY,Z/_7RkuG{<~BrBg,rlsO:235B@bX}|d?a1!#`(6Vyn5@d##Y+jTv|vV~EfIj]uNpn~FRfH7Lq2vb1!a9-978BaU@@=Iz9978BbU}#~AJq0!(@@=Iz8978BaU@@=Iz7~AJQ|}!978BbU}!JvkaK!AdUa21-U#`a+(g/vsRn~Ou!5RPj:rmu9WhOjXuvvNr}:RhAj^v(pyw8unRn[kPr}p|u7vwv]RiSBd;pppzq@qHQa?(b.!a.a`@.|xa(hFv;Wiyj5uuv-7Riw~Cw`fg2WlU978BbU|wOuNBJqG!(P~EfD~CRlQcZ#X,k)u3vWs@u2]ksg;wEx'f@q1_2Wg.j]uNpn~FRfqJv]!15x'h{qG!(@@=IzK~CRl^j6v(us5x4i,#T(2WmY?C2F{1>Kq<aj1!*jTqIsBv=Wld~Cw`fj2Wl[j`v0u*~>RlT=c>Z,k#u3vWs@u2]kq<c1Z+jTqIsBv=Wle~Cw`fn2Wl]dn1#c(a(b^a2!b/bAT(bj!aDa7bu,a_a{c0!2T0g:v>ReD2@G{42@G{5~DpM~<5rc=Bx6i>{RT#RnI@zCx]y]z:2Jv[!zr5Awyk]9]k]dD(Y+X#6Vz.g=wKtgwhaCwgmTWj2Lu,w%_+/[y-B;b^xeg3u3Rj-2@bX{*KrJ<!+'@Wg(g?QRlC@Jv`!%b[zIwsfII}8JQ_@w|kW|=Jv(%!AqcOuNBJvEzh!bYzjLs@wP#(0!oy@>RkdJwMZtc3Dtd@BcG#T'9bWxg2@2Fznd*#Y+;2x'c}w<zizixNgwa#Z'U+!/!a'!a+w~g~z6wcn{Rn}wcnzRn|5Rh%=]nJg5vuRmvNvdRlvcprJu}w*az*a#!%.a.'Bot9qT]kj@Wg'ay2Gzv@Jv`!%b[zEwsfHI}1;ck#Ux`<Cbbx_Lu+w!a&0*!wko*wwo,So,}6Juqxf!E}PigQuyRm`d3(`#8>Rn%:A5B;bZ~%KvhCa!a2!x>k7#Uxb@b{#xaRk7Jw0!)>wwhlShl}6>wwhmShm}6CJvB!.x'hhvj{!!5Bwkhhbaz}x'hivjz~!5Bwkhibaz|xEhTrNu,v-vpD!a%&/)a3a.,%Ro2t[CE{)@3re9b]{%wjo09:rgc:Z&Ro6=<riifuaw&RmoKrNA!%(Ro4>Ro89;Ri`dSaL'UYzxZb)7Rka3xRhT&!,!#^1U}vbaz{>>@=be}yC@:D5bazzKu+A&!}{?ba}y>>@=be}wxBh[t`u~vJvr!%a!a()a,a0a4RoC=]o;Ju(!%RoGRhdwjh`=]oAg>w#Ro?g5vuRo=NvdRl|Ku]C.!&;RoEJvB!%RoORoMBx'h[v+_?w~h`}~5?w~hd~!xKh]oiptu-utv.vp!#%&a30a@a'a+(a/aOp(o~p!RoDJu(!%RoHRhewjha=]oBNvdRl}g>w#Ro@g5vuRo>c[#X']o<CauRoRAd-#Y':RkpauRoQKu]C.!&;RoFJvB!%RoNRoPBx'h]v+_?w~ha}t5?w~he}ue!/UbhYacXaW^Tc&a;b:a-c/#b&aja1(!cL+!bKbt!bmcRc9aIc?8[yW3Dtt94Rg`Jv}!&SiRMzBhEebShEMNuPRe>x7gL#TzuwjirRipc<Z&>on;>z=h-MSh.Mwqczx'a7vj&!>Re4@=ResJt__NuPRi*NuPRi)j]uNr|~FRfzKrJ>_+@Wfy@Wf]2WocKrJ<!+'@Wg%g/QRl@@Jv`!&awRl<wsfFIzgLu(w*!.*&ShBMwvhIRhI9;RhNx1hK'!#Sn]Mx1hK~0!#:2<H~7cNu+w7D*'1ZtW>Rn1~?rOc:Z&Rn2=<rQ<7wjh&=BSnLMc]#X(6Vz)w[b=a!U#9wzgMc3#&(RgMRitRis<x,gKt`ax!&+SioM=BSilMc3#&(RgKRinRimKurB,!&SiQMzBhDebShDM6BJQ!(P~Efx978B2@@=I}WLrJw!!,a*&@G}O@9wkibRid@@x'fKwC!&SlDMSfLMjUv~Q~EfKKv3@a+!(hFv-]mpx/hYZ(C5RiWz<o/MwkhY?So/M@x,gbvfB*&!SgEM:SoeeehFu3:Rgbda(,^TZa)X/7Sg[eb:2RgI~BrMC@wgkc:wwkcRerx3h(uUvK!&*,SnOM4Sh*MArRg;wHRh(x=h;rJvPwI!a4',a'0@Wg&=BSh/Mg>w=Rh=g3w*wwgGRgGcW(X#;Sg}M2Gzk@Jv`!&awRl=wsfGIz`dKZ*T'Y-:RhR7RhQg5u-p`j6v(us5d,#Y+~Awkia?RicOuNBwkibba}Ld6p~tyu_vbAa'a+!a/'a3aEa8a!>Sh,ebJv{!&Sh@ebSaReb9;SgwebNuPRi(NvdRl)NuPRi'hHu^<Rm^Jvv_@Wl(g;u1Si/ebKu'B&!*Sh?eb@Wl'z@aPeb95Si.ebcpputyvjB)!,&a+0a%ShAMWeK@G}C@WfJ9;RhMwvhH9w{ia}ix,hJvRA1(!zAn[MRhHx1hJ~*!#hFv(BSn[MBJQ!(@@=I~'978B2@@=I}2db.Ua<'X}+T#a0XaG2G}E;wkg|wuh!Rh!x,hZu,@)!&So0MVy)C5RiXACJvB!&5RiY5RiZg8w)cG}*T#2@bU}=KsA>(!a.3wkhZba~(x,h^u(A!&(SoCMRhb5Bz=h[eb?w~hb~6x,h_u(A!&(SoDMRhc5Bz=h]eb?w~hc~6e)aA1T#T,^^^c-bMb&blcPaP(a/!0!bA=b5c@a(!bfbrc#2afwmhARnjwchORnp2Wlf3DtsNvdRl-2@wpa<]m0bx(#:awRk2@Jw3!%RfhwpfgRlnKQB%!(G{V@G|'NuuRl6d='T+Y#VyUg<v~Rl~==G|<Jv+'!aYShC}6@B<5?ba~8@Jw3'!g2QRljhLrpWlOd+#Y'g.w'rIg>w*wgj@g-u0Rj@Lu+wT&)ZtUauq]~GrGci&U#F|39:rELrNvj!.%*RhCwunfw~nf~:9;Ri]>wtnhg;wHRnhx3hDs@v~!/+'@Wfr@9RkSNu&Rlo=@<5GzoKs0@_+@Wl+@awRkmJuh!-3d(}pY#qWJvj!%Rm(:Jw3!%Rm,Rm*de&!1U-U#`)Re;@G|.@9Ri82@wjfvRlq=@<5GzpLvOvr!).&2RlF8Rf`C=x!eE{.Jw3_g2QRlkhLrpWlPde(!#U{s,UXa*Ta'[y'g:v>ReS;x0PZ&RnlRnn~HrKJw1}f!=x!eB|2w]aP(#Xa&a*Ta.Ua2a7=]iOd'#Y&Ro&WnWg;u.RiDg6vjRiBNvdRlzhNvj]nYJuW_2Wm3x)kFze{9d])!a.!,Y01!#&aC!a3RndC=ox~BrC@2b^{pg,rlse7x'ksuq!%Rm.E{xidw(wBRmGx9o+)X#wwo-So-}69:Rl4@xSf@a#XZ'X)X,Ta(/ARl8b[xc>RfY:RlI:RfQwlg.ARl:9;Rlwdn'#^XafaQa1X1TaHTa)@b[{zcZ#X'7RkwWg@Ou4ARn&x)kG#{,g7u/RkGdH'U#Y*Vz'Wm&CARm|bx#(A]gUbUzJj9Q~=d,#Y(56H}l978H{U7d,0#U*2>ABb_xZ978BbU{e~AJQ{g!978BbU{hxMh?ad{oUYZ.x1h?{l!#:2<H{mx3n[t{vl!,&a%3Ro(z=iS}6ARnr=Bwsn^wvn`Rnbd`*T}B0!#^X'BG{c9b]{a>>@=be}F?JvS!&BG{d7BG}(Bde#`a1X,Ya@!a'P~=wxf@2bZ}I56B2@@=aybb}08@55B9;5bb}<j3vLv;<Jw3&!>Rfg=ayb^}&OuNBKuLA!)a!P~=x#fD{f2@>==<bbzl?C972@@=Ix^d6rSu,v7w*C(0a)a6#B+a%!sQ[y?3Dt%3[xn~<5rLOu!5p@Ku+D#'!t7~GrP~?rNKvlaya7'!h+v-5qMg=t|cd,U#5AAaa5Abb{S@52B5@a[@52B5Gx[iXueu;d<#`a(!/549C;ag>23ExY5@Dah89b^~689Jv)!~2b[~1Lv'w(%*!a#bX|aPrmawRe]keu7uhv-q6rxu,q`xTo]/a5aU!bNaDXbi!b-!ao!b<bwA!#5@B932:aV2G|:d-)Y#hJrL>RhG<7@C5<H|_=Cau:5aj5@B932:bJ|ng>vIbs)#?C2F|9jPv0w.vISh-MKvUaz(.!9ABbb|[5;5<H|Eg>unwfh;9:4E|YjQsBt|vjx'hYq3!(?C2F|J:2<BaY?C2F|GOu!5x,g|p{ah!-(?C2F|c9:4E|OjXuvvNr}:Rh&i[w*t|cd+U#jJvsu)vsSn~Mkfrmu9p}u7vwv]So!McW#Xa!ax5@A5aY:5;5<H|>kJv~vYrquJu3x4ib#T)2@SmZM?C2F|Bj:rmu9@xPhI(a*a#U#`a3-5Abb|L~@:RhK9:4E|0@52B5G|#C::aY?C2F|-:2<BaY?C2F|.5Jvk!a)javYrquJu3x4ia#T)2@SmYM?C2F|HAxPhH(!a#U#`a*-5Abb|4~@:RhJ9:4E|R@52B5G|F:2<BaY?C2F|Sc^#Xa2j=Qq5CJvB!-g<v{z;hhM?C2F|Zi[vrv{z;hiM?C2F|XKsA>!a)-g<v{z;h[eb?C2F|]i[vrv{z;h]eb?C2F|^iZu.vix,hZq3ah!.(?C2F|QOu!5ShXM:2<BaY?C2F|P", 13494, 2713, 49, 25, 61);

  // node_modules/entities/dist/internal/bin-trie-flags.js
  var BinTrieFlags;
  (function(BinTrieFlags2) {
    BinTrieFlags2[BinTrieFlags2["VALUE_LENGTH"] = 49152] = "VALUE_LENGTH";
    BinTrieFlags2[BinTrieFlags2["FLAG13"] = 8192] = "FLAG13";
    BinTrieFlags2[BinTrieFlags2["BRANCH_LENGTH"] = 8064] = "BRANCH_LENGTH";
    BinTrieFlags2[BinTrieFlags2["JUMP_TABLE"] = 127] = "JUMP_TABLE";
    BinTrieFlags2[BinTrieFlags2["VALUE_MASK"] = 8191] = "VALUE_MASK";
  })(BinTrieFlags || (BinTrieFlags = {}));

  // node_modules/entities/dist/decode.js
  var CharCodes;
  (function(CharCodes2) {
    CharCodes2[CharCodes2["AMP"] = 38] = "AMP";
    CharCodes2[CharCodes2["NUM"] = 35] = "NUM";
    CharCodes2[CharCodes2["SEMI"] = 59] = "SEMI";
    CharCodes2[CharCodes2["EQUALS"] = 61] = "EQUALS";
    CharCodes2[CharCodes2["ZERO"] = 48] = "ZERO";
    CharCodes2[CharCodes2["NINE"] = 57] = "NINE";
    CharCodes2[CharCodes2["LOWER_A"] = 97] = "LOWER_A";
    CharCodes2[CharCodes2["LOWER_X"] = 120] = "LOWER_X";
  })(CharCodes || (CharCodes = {}));
  var TO_LOWER_BIT = 32;
  var CONSUMED_SHIFT = 21;
  var CODE_POINT_MASK = 2097151;
  var CONSUMED_OVERFLOW = 2047;
  var longNumericConsumed = 0;
  function unpackConsumed(packed) {
    const consumed = packed >>> CONSUMED_SHIFT;
    return consumed === CONSUMED_OVERFLOW ? longNumericConsumed : consumed;
  }
  function isNumber(code2) {
    return code2 - CharCodes.ZERO >>> 0 <= 9;
  }
  function isHexadecimalCharacter(code2) {
    return (code2 | TO_LOWER_BIT) - CharCodes.LOWER_A >>> 0 <= 5;
  }
  function isAlpha(code2) {
    return (code2 | TO_LOWER_BIT) - CharCodes.LOWER_A >>> 0 <= 25;
  }
  function isEntityInAttributeInvalidEnd(code2) {
    return code2 === CharCodes.EQUALS || isAlpha(code2) || isNumber(code2);
  }
  var EntityDecoderState;
  (function(EntityDecoderState2) {
    EntityDecoderState2[EntityDecoderState2["EntityStart"] = 0] = "EntityStart";
    EntityDecoderState2[EntityDecoderState2["NumericStart"] = 1] = "NumericStart";
    EntityDecoderState2[EntityDecoderState2["NumericDecimal"] = 2] = "NumericDecimal";
    EntityDecoderState2[EntityDecoderState2["NumericHex"] = 3] = "NumericHex";
    EntityDecoderState2[EntityDecoderState2["NamedEntity"] = 4] = "NamedEntity";
  })(EntityDecoderState || (EntityDecoderState = {}));
  var DecodingMode;
  (function(DecodingMode2) {
    DecodingMode2[DecodingMode2["Legacy"] = 0] = "Legacy";
    DecodingMode2[DecodingMode2["Strict"] = 1] = "Strict";
    DecodingMode2[DecodingMode2["Attribute"] = 2] = "Attribute";
  })(DecodingMode || (DecodingMode = {}));
  function determineBranch(decodeTree, current, nodeIndex, char) {
    const branchCount = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
    const jumpOffset = current & BinTrieFlags.JUMP_TABLE;
    if (jumpOffset) {
      if (branchCount === 0) {
        return char === jumpOffset ? nodeIndex : -1;
      }
      const slot = char - jumpOffset;
      if (slot >>> 0 >= branchCount)
        return -1;
      const stored = decodeTree[nodeIndex + slot];
      return stored === 0 ? -1 : nodeIndex + branchCount + stored - 1 & 65535;
    }
    if (branchCount === 0)
      return -1;
    const packedKeySlots = branchCount + 1 >> 1;
    const branchEnd = nodeIndex + packedKeySlots + branchCount;
    for (let index = 0; index < branchCount; index++) {
      const packed = decodeTree[nodeIndex + (index >> 1)];
      const key = packed >> ((index & 1) << 3) & 255;
      if (key === char) {
        const pointerIndex = nodeIndex + packedKeySlots + index;
        return branchEnd + decodeTree[pointerIndex] & 65535;
      }
      if (key > char)
        return -1;
    }
    return -1;
  }
  function readTrieValue(decodeTree, nodeIndex, valueLength) {
    if (valueLength === 1) {
      return String.fromCharCode(decodeTree[nodeIndex] & BinTrieFlags.VALUE_MASK);
    }
    if (valueLength === 2) {
      return String.fromCharCode(decodeTree[nodeIndex + 1]);
    }
    return String.fromCharCode(decodeTree[nodeIndex + 1], decodeTree[nodeIndex + 2]);
  }
  function parseNumericEntity(input, numberStart, inputLength) {
    let offset = numberStart + 1;
    let cp = 0;
    let digitStart = offset;
    if (offset < inputLength && (input.charCodeAt(offset) | TO_LOWER_BIT) === CharCodes.LOWER_X) {
      offset += 1;
      digitStart = offset;
      while (offset < inputLength) {
        const char = input.charCodeAt(offset);
        if (isNumber(char)) {
          cp = cp * 16 + (char - CharCodes.ZERO);
        } else if (isHexadecimalCharacter(char)) {
          cp = cp * 16 + ((char | TO_LOWER_BIT) - CharCodes.LOWER_A + 10);
        } else {
          break;
        }
        offset += 1;
      }
    } else {
      while (offset < inputLength) {
        const digit = input.charCodeAt(offset) - CharCodes.ZERO;
        if (digit >>> 0 > 9)
          break;
        cp = cp * 10 + digit;
        offset += 1;
      }
    }
    if (offset === digitStart)
      return 0;
    if (offset < inputLength && input.charCodeAt(offset) === CharCodes.SEMI) {
      offset += 1;
    }
    if (cp > 1114111)
      cp = 1114112;
    let consumed = offset - numberStart;
    if (consumed >= CONSUMED_OVERFLOW) {
      longNumericConsumed = consumed;
      consumed = CONSUMED_OVERFLOW;
    }
    return consumed << CONSUMED_SHIFT | cp;
  }
  function decodeWithTrie(input, isStrict, isAttribute) {
    const decodeTree = htmlDecodeTree;
    let offset = input.indexOf("&");
    if (offset < 0)
      return input;
    const inputLength = input.length;
    let chunkStart = 0;
    let result = "";
    const root2 = decodeTree[0];
    const rootJumpOffset = root2 & BinTrieFlags.JUMP_TABLE;
    const rootBranchCount = (root2 & BinTrieFlags.BRANCH_LENGTH) >> 7;
    do {
      const entityStart = offset + 1;
      const firstChar = input.charCodeAt(entityStart);
      let consumed;
      let value;
      if (firstChar === CharCodes.NUM) {
        const packed = parseNumericEntity(input, entityStart, inputLength);
        consumed = unpackConsumed(packed);
        if (isStrict && consumed > 0 && input.charCodeAt(entityStart + consumed - 1) !== CharCodes.SEMI) {
          consumed = 0;
        }
        value = consumed === 0 ? "" : codePointToString(packed & CODE_POINT_MASK);
      } else if (isAlpha(firstChar)) {
        consumed = 0;
        value = "";
        const rootSlotIndex = firstChar - rootJumpOffset;
        let nodeIndex;
        if (rootSlotIndex >>> 0 < rootBranchCount) {
          const stored = decodeTree[1 + rootSlotIndex];
          nodeIndex = stored === 0 ? -1 : rootBranchCount + stored & 65535;
        } else {
          nodeIndex = -1;
        }
        let bestNodeIndex = 0;
        let bestValueLength = 0;
        let current = nodeIndex < 0 ? 0 : decodeTree[nodeIndex];
        let index = entityStart + 1;
        trie: while (index < inputLength) {
          while (
            // Value-less, non-run node with a nonzero jump offset.
            (current & (BinTrieFlags.VALUE_LENGTH | BinTrieFlags.FLAG13)) === 0 && (current & BinTrieFlags.JUMP_TABLE) !== 0
          ) {
            const jumpOffset = current & BinTrieFlags.JUMP_TABLE;
            const branchCount = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
            if (branchCount === 0) {
              if (input.charCodeAt(index) !== jumpOffset)
                break trie;
              nodeIndex += 1;
            } else {
              const slot = input.charCodeAt(index) - jumpOffset;
              if (slot >>> 0 >= branchCount)
                break trie;
              const stored = decodeTree[nodeIndex + 1 + slot];
              if (stored === 0)
                break trie;
              nodeIndex = nodeIndex + branchCount + stored & 65535;
            }
            current = decodeTree[nodeIndex];
            index += 1;
            if (index >= inputLength)
              break trie;
          }
          if ((current & (BinTrieFlags.VALUE_LENGTH | BinTrieFlags.FLAG13)) === BinTrieFlags.FLAG13) {
            const runLength = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
            if (input.charCodeAt(index) !== (current & BinTrieFlags.JUMP_TABLE)) {
              break;
            }
            index += 1;
            const remaining = runLength - 1;
            let wordIndex = nodeIndex + 1;
            let charIndexInPacked = 0;
            for (; charIndexInPacked + 1 < remaining; charIndexInPacked += 2) {
              const packed = decodeTree[wordIndex];
              if (input.charCodeAt(index) !== (packed & 255))
                break trie;
              index += 1;
              if (input.charCodeAt(index) !== (packed >> 8 & 255))
                break trie;
              index += 1;
              wordIndex += 1;
            }
            if (charIndexInPacked < remaining) {
              if (input.charCodeAt(index) !== (decodeTree[wordIndex] & 255))
                break;
              index += 1;
            }
            nodeIndex += 1 + (runLength >> 1);
            current = decodeTree[nodeIndex];
            continue;
          }
          const valueLength = current >>> 14;
          const char = input.charCodeAt(index);
          if (valueLength !== 0) {
            if (char === CharCodes.SEMI) {
              consumed = index - entityStart + 1;
              value = valueLength === 1 ? String.fromCharCode(current & BinTrieFlags.VALUE_MASK) : readTrieValue(decodeTree, nodeIndex, valueLength);
              break;
            }
            if (!isStrict && (current & BinTrieFlags.FLAG13) === 0) {
              consumed = index - entityStart;
              bestNodeIndex = nodeIndex;
              bestValueLength = valueLength;
            }
            if (valueLength === 1)
              break;
          }
          const next = determineBranch(decodeTree, current, nodeIndex + (valueLength || 1), char);
          if (next < 0)
            break;
          nodeIndex = next;
          current = decodeTree[nodeIndex];
          index += 1;
        }
        if (value === "") {
          const finalVL = current >>> 14;
          if (finalVL !== 0 && !isStrict && (current & BinTrieFlags.FLAG13) === 0) {
            consumed = index - entityStart;
            bestNodeIndex = nodeIndex;
            bestValueLength = finalVL;
          }
          if (consumed > 0) {
            value = readTrieValue(decodeTree, bestNodeIndex, bestValueLength);
          }
        }
      } else {
        consumed = 0;
        value = "";
      }
      if (consumed === 0 || isAttribute && firstChar !== CharCodes.NUM && input.charCodeAt(entityStart + consumed - 1) !== CharCodes.SEMI && entityStart + consumed < inputLength && isEntityInAttributeInvalidEnd(input.charCodeAt(entityStart + consumed))) {
        offset = entityStart;
      } else {
        if (chunkStart < offset) {
          result += input.slice(chunkStart, offset);
        }
        result += value;
        offset = chunkStart = entityStart + consumed;
      }
      if (input.charCodeAt(offset) !== CharCodes.AMP) {
        offset = input.indexOf("&", offset);
      }
    } while (offset >= 0);
    return result + input.slice(chunkStart);
  }
  function decodeHTMLStrict(htmlString) {
    return decodeWithTrie(htmlString, true, false);
  }

  // node_modules/entities/dist/index.js
  var EntityLevel;
  (function(EntityLevel2) {
    EntityLevel2[EntityLevel2["XML"] = 0] = "XML";
    EntityLevel2[EntityLevel2["HTML"] = 1] = "HTML";
  })(EntityLevel || (EntityLevel = {}));
  var EncodingMode;
  (function(EncodingMode2) {
    EncodingMode2[EncodingMode2["UTF8"] = 0] = "UTF8";
    EncodingMode2[EncodingMode2["ASCII"] = 1] = "ASCII";
    EncodingMode2[EncodingMode2["Extensive"] = 2] = "Extensive";
    EncodingMode2[EncodingMode2["Attribute"] = 3] = "Attribute";
    EncodingMode2[EncodingMode2["Text"] = 4] = "Text";
  })(EncodingMode || (EncodingMode = {}));

  // node_modules/linkify-it/build/index.mjs
  var REBuilder = class {
    src_Any = Any.source;
    src_Cc = Cc.source;
    src_Z = Z.source;
    src_P = P.source;
    src_ZPCc = [
      this.src_Z,
      this.src_P,
      this.src_Cc
    ].join("|");
    src_ZCc = [this.src_Z, this.src_Cc].join("|");
    cache = {};
    opts = {
      maxLength: 1e4,
      urlAuth: false,
      schema_names: []
    };
    constructor(opts = {}) {
      this.opts = {
        ...this.opts,
        ...opts
      };
    }
    set(opts = {}) {
      this.opts = {
        ...this.opts,
        ...opts
      };
      this.cache = {};
      return this;
    }
    escapeRE(str) {
      return str.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
    }
    nestedPairRE(open, close, depth = 4) {
      const openRE = this.escapeRE(open);
      const closeRE = this.escapeRE(close);
      const atom = `(?:(?!${this.src_ZCc}|${openRE}|${closeRE}).)`;
      let pair = `${openRE}${atom}{0,1000}${closeRE}`;
      for (let level = 2; level <= depth; level++) pair = `${openRE}(?:${atom}|${pair}){0,1000}${closeRE}`;
      return pair;
    }
    get_text_separators() {
      return this.cache.text_separators ??= /[><\uff5c]/;
    }
    get_pseudo_letter() {
      return this.cache.src_pseudo_letter ??= new RegExp(`(?:(?!${this.get_text_separators().source}|${this.src_ZPCc})${this.src_Any})`);
    }
    get_ipv4_addr() {
      return this.cache.src_ip4 ??= /* @__PURE__ */ new RegExp("(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])[.]){3}(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])");
    }
    get_ipv6_addr() {
      const h16 = "[0-9A-Fa-f]{1,4}";
      const ls32 = `(?:(?:${h16}:${h16})|${this.get_ipv4_addr().source})`;
      return this.cache.src_ip6_addr ??= new RegExp(`(?:(?:${h16}:){6}${ls32}|::(?:${h16}:){5}${ls32}|(?:${h16})?::(?:${h16}:){4}${ls32}|(?:(?:${h16}:){0,1}${h16})?::(?:${h16}:){3}${ls32}|(?:(?:${h16}:){0,2}${h16})?::(?:${h16}:){2}${ls32}|(?:(?:${h16}:){0,3}${h16})?::${h16}:${ls32}|(?:(?:${h16}:){0,4}${h16})?::${ls32}|(?:(?:${h16}:){0,5}${h16})?::${h16}|(?:(?:${h16}:){0,6}${h16})?::)`);
    }
    get_ipv6_url_host() {
      return this.cache.src_ip6_host ??= new RegExp(`\\[${this.get_ipv6_addr().source}\\]`);
    }
    get_ipv6_mail_host() {
      return this.cache.src_ipv6_mail_host ??= new RegExp(`\\[IPv6:${this.get_ipv6_addr().source}\\]`);
    }
    get_auth() {
      return this.cache.src_auth ??= new RegExp(`(?:(?:(?!${this.src_ZCc}|[@/\\[\\]()]).){1,50}@)?`);
    }
    get_port() {
      return this.cache.src_port ??= /* @__PURE__ */ new RegExp("(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?");
    }
    get_host_terminator() {
      return this.cache.src_host_terminator ??= new RegExp(`(?=$|${this.get_text_separators().source}|${this.src_ZPCc})(?!${this.opts["---"] ? "-(?!--)|" : "-|"}_|:\\d|\\.-|\\.(?!$|${this.src_ZPCc}))`);
    }
    get_path_terminator() {
      return this.cache.src_path_terminator ??= new RegExp(`${this.src_ZPCc}|${this.get_text_separators().source}`);
    }
    get_path() {
      return this.cache.src_path ??= new RegExp(`(?:[/?#](?:${this.nestedPairRE("[", "]")}|${this.nestedPairRE("(", ")")}|${this.nestedPairRE("{", "}")}|\\"(?:(?!${this.src_ZCc}|["]).){1,100}\\"|\\'(?:(?!${this.src_ZCc}|[']).){1,100}\\'|\\'(?=${this.get_pseudo_letter().source}|[-])|\\.{2,20}[:]?[a-zA-Z0-9%/&]|\\.(?!${this.src_ZCc}|[.]|$)|` + (this.opts["---"] ? "\\-(?!--(?:[^-]|$))(?:-{0,19})|" : "\\-{1,20}|") + `,(?!${this.src_ZCc}|$)|;(?!${this.src_ZCc}|$)|\\!{1,20}(?!${this.src_ZCc}|[!]|$)|\\?(?!${this.src_ZCc}|[?]|$)|` + this.get_path_extra().source + `[\\\\/:%@#&=_~*]|(?!${this.get_path_terminator().source}).){1,${this.opts.maxLength}}|\\/)?`);
    }
    get_mail_name() {
      return this.cache.src_mail_name ??= /* @__PURE__ */ new RegExp("[-!#$%&'*+/=?^_`{|}~a-zA-Z0-9](?:[-!#$%&'*+/=?^_`{|}~a-zA-Z0-9]|[.](?=[-!#$%&'*+/=?^_`{|}~a-zA-Z0-9])){0,63}");
    }
    get_xn() {
      return this.cache.src_xn ??= /* @__PURE__ */ new RegExp("xn--[a-z0-9\\-]{1,59}");
    }
    get_tld() {
      if (this.cache.tld) return this.cache.tld;
      const tlds_src = [...new Set(this.opts.tlds || [])].sort().reverse().join("|");
      this.cache.tld = new RegExp(`${tlds_src || "$#none#$"}|${this.get_xn().source}`);
      return this.cache.tld;
    }
    get_domain_root() {
      return this.cache.src_domain_root ??= new RegExp("(?:" + this.get_xn().source + `|${this.get_pseudo_letter().source}{1,63})`);
    }
    get_domain() {
      return this.cache.src_domain ??= new RegExp("(?:" + this.get_xn().source + `|(?:${this.get_pseudo_letter().source})|(?:${this.get_pseudo_letter().source}(?:-|${this.get_pseudo_letter().source}){0,61}${this.get_pseudo_letter().source}))`);
    }
    get_url_host_port() {
      return this.cache.url_host_port ??= new RegExp("(?:" + this.get_ipv6_url_host().source + `|(?:(?:(?:${this.get_domain().source})\\.){0,10}${this.get_domain().source}))` + this.get_port().source + this.get_host_terminator().source);
    }
    get_fuzzy_url_host_port() {
      return this.cache.fuzzy_url_host_port ??= new RegExp("(?:" + (this.opts.fuzzyIP ? this.get_ipv4_addr().source + "|" : "") + `(?:(?:(?:${this.get_domain().source})\\.){1,10}(?:${this.get_tld().source})))` + this.get_host_terminator().source);
    }
    get_mail_host() {
      return this.cache.src_mail_host ??= new RegExp("(?:" + this.get_ipv6_mail_host().source + `|(?:(?:(?:${this.get_domain().source})\\.){0,4}${this.get_domain().source}))` + this.get_host_terminator().source);
    }
    get_fuzzy_mail_host() {
      return this.cache.src_fuzzy_mail_host ??= new RegExp("(?:" + this.get_ipv6_mail_host().source + `|(?:(?:(?:${this.get_domain().source})[.]){1,4}${this.get_domain_root().source}))` + this.get_host_terminator().source);
    }
    get_path_extra() {
      return this.cache.src_path_extra ??= /* @__PURE__ */ new RegExp("");
    }
    get_fuzzy_mail_host_search() {
      return this.cache.mail_fuzzy_host_search ??= new RegExp(`@${this.get_fuzzy_mail_host().source}`, "ig");
    }
    get_fuzzy_link_search() {
      return this.cache.link_fuzzy_search ??= new RegExp(`(^|(?![.:/\\-_@])(?:[$+<=>^\`|\uFF5C]|${this.src_ZPCc}))(?:(?![$+<=>^\`|\uFF5C])${this.get_fuzzy_url_host_port().source}${this.get_path().source})`, "ig");
    }
    get_http_validator() {
      return this.cache.http_validator ??= new RegExp("\\/\\/" + (this.opts.urlAuth ? this.get_auth().source : "") + this.get_url_host_port().source + this.get_path().source, "iy");
    }
    get_relative_proto_validator() {
      return this.cache.relative_proto_validator ??= new RegExp((this.opts.urlAuth ? this.get_auth().source : "") + `(?:localhost|${this.get_ipv6_url_host().source}|(?:(?:${this.get_domain().source})[.]){1,10}${this.get_domain_root().source})` + this.get_port().source + this.get_host_terminator().source + this.get_path().source, "iy");
    }
    get_mail_name_validator() {
      return this.cache.mail_name_validator ??= new RegExp(`(?:^|${this.get_text_separators().source}|"|\\(|${this.src_ZCc})(${this.get_mail_name().source})$`);
    }
    get_mailto_validator() {
      return this.cache.mailto_validator ??= new RegExp(`${this.get_mail_name().source}@${this.get_mail_host().source}`, "iy");
    }
    get_schema_names() {
      return this.cache.schema_names ??= new RegExp((this.opts.schema_names || []).map((name) => this.escapeRE(name)).join("|"));
    }
    get_schema_search() {
      return this.cache.schema_search ??= new RegExp(`(^|(?!_)(?:[><\uFF5C]|${this.src_ZPCc}))(${this.get_schema_names().source})`, "ig");
    }
    get_schema_at_start() {
      return this.cache.schema_at_start ??= new RegExp(`^${this.get_schema_search().source}`, "i");
    }
  };
  var web_schema = {
    validate: (text2, pos, self) => {
      const re = self.re.get_http_validator();
      re.lastIndex = pos;
      const m = re.exec(text2);
      return m ? m[0].length : 0;
    },
    normalize: (match, self) => self.normalize(match)
  };
  var defaultSchemas = {
    "http:": web_schema,
    "https:": web_schema,
    "ftp:": web_schema,
    "//": {
      validate: function(text2, pos, self) {
        const re = self.re.get_relative_proto_validator();
        re.lastIndex = pos;
        const m = re.exec(text2);
        if (m) {
          if (pos >= 3 && text2[pos - 3] === ":") return 0;
          if (pos >= 3 && text2[pos - 3] === "/") return 0;
          return m[0].length;
        }
        return 0;
      },
      normalize: (match, self) => self.normalize(match)
    },
    "mailto:": {
      validate: function(text2, pos, self) {
        const re = self.re.get_mailto_validator();
        re.lastIndex = pos;
        const m = re.exec(text2);
        return m ? m[0].length : 0;
      },
      normalize: (match, self) => self.normalize(match)
    }
  };
  var tlds_2ch = "a:cdefgilmnoqrstuwxz|b:abdefghijmnorstvwyz|c:acdfghiklmnoruvwxyz|d:ejkmoz|e:cegrstu|f:ijkmor|g:abdefghilmnpqrstuwy|h:kmnrtu|i:delmnoqrst|j:emop|k:eghimnprwyz|l:abcikrstuvy|m:acdeghklmnopqrstuvwxyz|n:acefgilopruz|o:m|p:aefghklmnrstwy|q:a|r:eosuw|s:abcdeghijklmnortuvxyz|t:cdfghjklmnortvwz|u:agksyz|v:aceginu|w:fs|y:et|z:amw";
  var tlds_default = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|\u0440\u0444";
  function unpackTlds() {
    const result = tlds_default.split("|");
    tlds_2ch.split("|").forEach((item) => {
      const sep = item.indexOf(":");
      const prefix = item.slice(0, sep);
      for (const suffix of item.slice(sep + 1)) result.push(prefix + suffix);
    });
    return result;
  }
  var defaultOptions = {
    fuzzyLink: false,
    fuzzyEmail: true,
    fuzzyIP: false,
    "---": false,
    tlds: unpackTlds(),
    urlAuth: false,
    maxLength: 1e4
  };
  var Match = class {
    /** Prefix (protocol) for matched string. Empty for fuzzy links. */
    schema;
    /** First position of matched string. */
    index;
    /** Next position after matched string. */
    lastIndex;
    /** Matched string. */
    raw;
    /** Normalized text of matched string. */
    text;
    /** Normalized URL of matched string. */
    url;
    constructor(text2, schema, index, lastIndex) {
      const raw = text2.slice(index, lastIndex);
      this.schema = schema.toLowerCase();
      this.index = index;
      this.lastIndex = lastIndex;
      this.raw = raw;
      this.text = raw;
      this.url = raw;
    }
  };
  var LinkifyIt = class {
    __opts__;
    __schemas__;
    re;
    /**
    * Creates new linkifier instance.
    *
    * By default understands:
    *
    * - `http(s)://...` , `ftp://...`, `mailto:...` & `//...` links
    * - "fuzzy" emails (foo@bar.com).
    *
    * See {@link LinkifyConstructorOptions} for available options.
    *
    * @param options Recognition options.
    *
    * @example
    * ```javascript
    * import { LinkifyIt } from 'linkify-it'
    *
    * const linkify = new LinkifyIt({ fuzzyLink: true })
    *
    * linkify
    *   .tlds(require('tlds'))       // Reload with full TLD list
    *   .tlds('onion', true)         // Add unofficial `.onion` domain
    *   .add('ftp:', null)           // Disable `ftp:` protocol
    *   .set({ fuzzyIP: true })      // Enable IPs in fuzzy links
    *
    * console.log(linkify.test('Site github.com!')) // true
    * console.log(linkify.match('Site github.com!'))
    * ```
    */
    constructor(options = {}) {
      const { rebuilder, ...linkifyOptions } = options;
      this.__opts__ = {
        ...defaultOptions,
        ...linkifyOptions
      };
      this.__schemas__ = { ...defaultSchemas };
      this.re = rebuilder || new REBuilder();
      this.re.set({
        ...this.__opts__,
        schema_names: Object.keys(this.__schemas__)
      });
    }
    /**
    * Add new rule definition.
    *
    * `schema` is a link prefix (usually, protocol name with `:` at the end,
    * `skype:` for example). `linkify-it` makes sure that prefix is not
    * preceded with alphanumeric char and symbols. Only whitespaces and
    * punctuation allowed.
    *
    * `definition` is a rule to check tail after link prefix. To disable an
    * existing rule, pass `null`.
    *
    * @param schema Rule name (fixed pattern prefix).
    * @param definition Schema definition, or `null` to disable the rule.
    *
    * See [twitter mentions example](https://github.com/markdown-it/linkify-it/blob/master/examples/twitter.mjs).
    */
    add(schema, definition = null) {
      if (!definition) delete this.__schemas__[schema];
      else {
        const def = {
          normalize: (match, self) => self.normalize(match),
          ...definition
        };
        this.__schemas__[schema] = def;
      }
      this.re.set({
        ...this.__opts__,
        schema_names: Object.keys(this.__schemas__)
      });
      return this;
    }
    /**
    * Set recognition options for links without schema.
    *
    * @param options Recognition options.
    */
    set(options = {}) {
      this.__opts__ = {
        ...this.__opts__,
        ...options
      };
      this.re.set({
        ...this.__opts__,
        schema_names: Object.keys(this.__schemas__)
      });
      return this;
    }
    /**
    * Searches linkifiable pattern and returns `true` on success or `false` on fail.
    *
    * @param text Text to scan.
    */
    test(text2) {
      if (!text2.length) return false;
      let m, re;
      re = this.re.get_schema_search();
      re.lastIndex = 0;
      while ((m = re.exec(text2)) !== null) if (this.testSchemaAt(text2, m[2], re.lastIndex)) return true;
      if (this.__opts__.fuzzyLink && this.__schemas__["http:"]) {
        re = this.re.get_fuzzy_link_search();
        re.lastIndex = 0;
        if (re.exec(text2) !== null) return true;
      }
      if (this.__opts__.fuzzyEmail && this.__schemas__["mailto:"]) {
        if (text2.indexOf("@") >= 0) {
          const mailHostRe = this.re.get_fuzzy_mail_host_search();
          const mailNameRe = this.re.get_mail_name_validator();
          mailHostRe.lastIndex = 0;
          while ((m = mailHostRe.exec(text2)) !== null) {
            const name = text2.slice(Math.max(0, m.index - 65), m.index);
            if (mailNameRe.test(name)) return true;
          }
        }
      }
      return false;
    }
    /**
    * Similar to {@link LinkifyIt.test} but checks only specific protocol tail exactly
    * at given position. Returns length of found pattern (0 on fail).
    *
    * @param text Text to scan.
    * @param schema Rule (schema) name.
    * @param pos Text offset to check from.
    */
    testSchemaAt(text2, schema, pos) {
      if (!this.__schemas__[schema.toLowerCase()]) return 0;
      return this.__schemas__[schema.toLowerCase()].validate(text2.slice(0, pos + this.__opts__.maxLength), pos, this);
    }
    /**
    * Returns array of found link descriptions or `null` on fail. We strongly
    * recommend to use {@link LinkifyIt.test} first, for best speed.
    *
    * @param text Text to scan.
    */
    match(text2) {
      const result = [];
      const schemaRe = this.re.get_schema_search();
      let fuzzyLinkRe;
      let mailHostRe;
      let mailNameRe;
      let fuzzyLinkCandidate;
      let fuzzyEmailCandidate;
      let schemaPrefix;
      let schemaDone = false;
      let fuzzyLinkDone = false;
      let fuzzyEmailDone = false;
      let pos = 0;
      if (!text2.length) return null;
      schemaRe.lastIndex = 0;
      if (this.__opts__.fuzzyLink && this.__schemas__["http:"]) {
        fuzzyLinkRe = this.re.get_fuzzy_link_search();
        fuzzyLinkRe.lastIndex = 0;
      }
      if (this.__opts__.fuzzyEmail && this.__schemas__["mailto:"]) {
        mailHostRe = this.re.get_fuzzy_mail_host_search();
        mailHostRe.lastIndex = 0;
        mailNameRe = this.re.get_mail_name_validator();
      }
      for (; ; ) {
        const scanFrom = Math.max(pos - 1, 0);
        if (mailHostRe && mailNameRe && !fuzzyEmailDone && (!fuzzyEmailCandidate || fuzzyEmailCandidate.index < pos)) {
          if (mailHostRe.lastIndex < scanFrom) mailHostRe.lastIndex = scanFrom;
          for (; ; ) {
            const m = mailHostRe.exec(text2);
            if (!m) {
              fuzzyEmailDone = true;
              fuzzyEmailCandidate = void 0;
              break;
            }
            const name = mailNameRe.exec(text2.slice(Math.max(0, m.index - 65), m.index));
            if (!name) continue;
            fuzzyEmailCandidate = {
              schema: "mailto:",
              index: m.index - name[1].length,
              lastIndex: m.index + m[0].length
            };
            if (fuzzyEmailCandidate.index >= pos) break;
            if (mailHostRe.lastIndex < scanFrom) mailHostRe.lastIndex = scanFrom;
          }
        }
        if (fuzzyLinkRe && !fuzzyLinkDone && (!fuzzyLinkCandidate || fuzzyLinkCandidate.index < pos)) {
          if (fuzzyLinkRe.lastIndex < scanFrom) fuzzyLinkRe.lastIndex = scanFrom;
          for (; ; ) {
            const m = fuzzyLinkRe.exec(text2);
            if (!m) {
              fuzzyLinkDone = true;
              fuzzyLinkCandidate = void 0;
              break;
            }
            fuzzyLinkCandidate = {
              schema: "",
              index: m.index + m[1].length,
              lastIndex: m.index + m[0].length
            };
            if (fuzzyLinkCandidate.index >= pos) break;
            if (fuzzyLinkRe.lastIndex < scanFrom) fuzzyLinkRe.lastIndex = scanFrom;
          }
        }
        let fuzzyCandidate = fuzzyEmailCandidate;
        if (!fuzzyCandidate || fuzzyLinkCandidate && (fuzzyLinkCandidate.index < fuzzyCandidate.index || fuzzyLinkCandidate.index === fuzzyCandidate.index && fuzzyLinkCandidate.lastIndex > fuzzyCandidate.lastIndex)) fuzzyCandidate = fuzzyLinkCandidate;
        let schemaCandidate;
        if (!schemaDone) for (; ; ) {
          if (!schemaPrefix) {
            if (schemaRe.lastIndex < scanFrom) schemaRe.lastIndex = scanFrom;
            const m = schemaRe.exec(text2);
            if (!m) {
              schemaDone = true;
              break;
            }
            schemaPrefix = {
              schema: m[2],
              index: m.index + m[1].length,
              lastIndex: m.index + m[0].length
            };
          }
          if (schemaPrefix.index < pos) {
            schemaPrefix = void 0;
            continue;
          }
          if (fuzzyCandidate && schemaPrefix.index > fuzzyCandidate.index) break;
          const prefix = schemaPrefix;
          schemaPrefix = void 0;
          const len = this.testSchemaAt(text2, prefix.schema, prefix.lastIndex);
          if (len) {
            schemaCandidate = {
              schema: prefix.schema,
              index: prefix.index,
              lastIndex: prefix.lastIndex + len
            };
            break;
          }
        }
        let candidate = schemaCandidate;
        if (!candidate || fuzzyEmailCandidate && (fuzzyEmailCandidate.index < candidate.index || fuzzyEmailCandidate.index === candidate.index && fuzzyEmailCandidate.lastIndex > candidate.lastIndex)) candidate = fuzzyEmailCandidate;
        if (!candidate || fuzzyLinkCandidate && (fuzzyLinkCandidate.index < candidate.index || fuzzyLinkCandidate.index === candidate.index && fuzzyLinkCandidate.lastIndex > candidate.lastIndex)) candidate = fuzzyLinkCandidate;
        if (!candidate) break;
        if (candidate === fuzzyEmailCandidate) fuzzyEmailCandidate = void 0;
        else if (candidate === fuzzyLinkCandidate) fuzzyLinkCandidate = void 0;
        const match = new Match(text2, candidate.schema, candidate.index, candidate.lastIndex);
        if (match.schema) this.__schemas__[match.schema].normalize(match, this);
        else this.normalize(match);
        result.push(match);
        pos = candidate.lastIndex;
      }
      if (result.length) return result;
      return null;
    }
    /**
    * Returns fully-formed (not fuzzy) link if it starts at the beginning
    * of the string, and null otherwise.
    *
    * @param text Text to scan.
    */
    matchAtStart(text2) {
      if (!text2.length) return null;
      const m = this.re.get_schema_at_start().exec(text2);
      if (!m) return null;
      const len = this.testSchemaAt(text2, m[2], m[0].length);
      if (!len) return null;
      const match = new Match(text2, m[2], m.index + m[1].length, m.index + m[0].length + len);
      this.__schemas__[match.schema].normalize(match, this);
      return match;
    }
    /**
    * Load (or merge) new TLDs list. Those are used for fuzzy links (without
    * prefix) to avoid false positives. By default this algorithm is used:
    *
    * - hostname with any 2-letter root zones are ok.
    * - biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф
    *   are ok.
    * - encoded (`xn--...`) root zones are ok.
    *
    * If list is replaced, then exact match for 2-chars root zones will be checked.
    *
    * @param list List of TLDs.
    * @param keepOld Merge with current list if `true` (`false` by default).
    */
    tlds(list2, keepOld = false) {
      list2 = Array.isArray(list2) ? list2 : [list2];
      if (!keepOld) this.__opts__.tlds = list2;
      else this.__opts__.tlds = this.__opts__.tlds.concat(list2);
      this.re.set({
        ...this.__opts__,
        schema_names: Object.keys(this.__schemas__)
      });
      return this;
    }
    /**
    * Default normalizer (if schema does not define its own).
    *
    * @param match Match to normalize.
    */
    normalize(match) {
      if (!match.schema) match.url = `http://${match.url}`;
      if (match.schema === "mailto:" && !/^mailto:/i.test(match.url)) match.url = `mailto:${match.url}`;
    }
  };

  // node_modules/punycode.js/punycode.es6.js
  var maxInt = 2147483647;
  var base = 36;
  var tMin = 1;
  var tMax = 26;
  var skew = 38;
  var damp = 700;
  var initialBias = 72;
  var initialN = 128;
  var delimiter = "-";
  var regexPunycode = /^xn--/;
  var regexNonASCII = /[^\0-\x7F]/;
  var regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g;
  var errors = {
    "overflow": "Overflow: input needs wider integers to process",
    "not-basic": "Illegal input >= 0x80 (not a basic code point)",
    "invalid-input": "Invalid input"
  };
  var baseMinusTMin = base - tMin;
  var floor = Math.floor;
  var stringFromCharCode = String.fromCharCode;
  function error(type) {
    throw new RangeError(errors[type]);
  }
  function map(array, callback) {
    const result = [];
    let length = array.length;
    while (length--) {
      result[length] = callback(array[length]);
    }
    return result;
  }
  function mapDomain(domain, callback) {
    const parts = domain.split("@");
    let result = "";
    if (parts.length > 1) {
      result = parts[0] + "@";
      domain = parts[1];
    }
    domain = domain.replace(regexSeparators, ".");
    const labels = domain.split(".");
    const encoded = map(labels, callback).join(".");
    return result + encoded;
  }
  function ucs2decode(string) {
    const output = [];
    let counter = 0;
    const length = string.length;
    while (counter < length) {
      const value = string.charCodeAt(counter++);
      if (value >= 55296 && value <= 56319 && counter < length) {
        const extra = string.charCodeAt(counter++);
        if ((extra & 64512) == 56320) {
          output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
        } else {
          output.push(value);
          counter--;
        }
      } else {
        output.push(value);
      }
    }
    return output;
  }
  var ucs2encode = (codePoints) => String.fromCodePoint(...codePoints);
  var basicToDigit = function(codePoint) {
    if (codePoint >= 48 && codePoint < 58) {
      return 26 + (codePoint - 48);
    }
    if (codePoint >= 65 && codePoint < 91) {
      return codePoint - 65;
    }
    if (codePoint >= 97 && codePoint < 123) {
      return codePoint - 97;
    }
    return base;
  };
  var digitToBasic = function(digit, flag) {
    return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
  };
  var adapt = function(delta, numPoints, firstTime) {
    let k = 0;
    delta = firstTime ? floor(delta / damp) : delta >> 1;
    delta += floor(delta / numPoints);
    for (; delta > baseMinusTMin * tMax >> 1; k += base) {
      delta = floor(delta / baseMinusTMin);
    }
    return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
  };
  var decode2 = function(input) {
    const output = [];
    const inputLength = input.length;
    let i = 0;
    let n = initialN;
    let bias = initialBias;
    let basic = input.lastIndexOf(delimiter);
    if (basic < 0) {
      basic = 0;
    }
    for (let j = 0; j < basic; ++j) {
      if (input.charCodeAt(j) >= 128) {
        error("not-basic");
      }
      output.push(input.charCodeAt(j));
    }
    for (let index = basic > 0 ? basic + 1 : 0; index < inputLength; ) {
      const oldi = i;
      for (let w = 1, k = base; ; k += base) {
        if (index >= inputLength) {
          error("invalid-input");
        }
        const digit = basicToDigit(input.charCodeAt(index++));
        if (digit >= base) {
          error("invalid-input");
        }
        if (digit > floor((maxInt - i) / w)) {
          error("overflow");
        }
        i += digit * w;
        const t2 = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
        if (digit < t2) {
          break;
        }
        const baseMinusT = base - t2;
        if (w > floor(maxInt / baseMinusT)) {
          error("overflow");
        }
        w *= baseMinusT;
      }
      const out = output.length + 1;
      bias = adapt(i - oldi, out, oldi == 0);
      if (floor(i / out) > maxInt - n) {
        error("overflow");
      }
      n += floor(i / out);
      i %= out;
      output.splice(i++, 0, n);
    }
    return String.fromCodePoint(...output);
  };
  var encode2 = function(input) {
    const output = [];
    input = ucs2decode(input);
    const inputLength = input.length;
    let n = initialN;
    let delta = 0;
    let bias = initialBias;
    for (const currentValue of input) {
      if (currentValue < 128) {
        output.push(stringFromCharCode(currentValue));
      }
    }
    const basicLength = output.length;
    let handledCPCount = basicLength;
    if (basicLength) {
      output.push(delimiter);
    }
    while (handledCPCount < inputLength) {
      let m = maxInt;
      for (const currentValue of input) {
        if (currentValue >= n && currentValue < m) {
          m = currentValue;
        }
      }
      const handledCPCountPlusOne = handledCPCount + 1;
      if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
        error("overflow");
      }
      delta += (m - n) * handledCPCountPlusOne;
      n = m;
      for (const currentValue of input) {
        if (currentValue < n && ++delta > maxInt) {
          error("overflow");
        }
        if (currentValue === n) {
          let q = delta;
          for (let k = base; ; k += base) {
            const t2 = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
            if (q < t2) {
              break;
            }
            const qMinusT = q - t2;
            const baseMinusT = base - t2;
            output.push(
              stringFromCharCode(digitToBasic(t2 + qMinusT % baseMinusT, 0))
            );
            q = floor(qMinusT / baseMinusT);
          }
          output.push(stringFromCharCode(digitToBasic(q, 0)));
          bias = adapt(delta, handledCPCountPlusOne, handledCPCount === basicLength);
          delta = 0;
          ++handledCPCount;
        }
      }
      ++delta;
      ++n;
    }
    return output.join("");
  };
  var toUnicode = function(input) {
    return mapDomain(input, function(string) {
      return regexPunycode.test(string) ? decode2(string.slice(4).toLowerCase()) : string;
    });
  };
  var toASCII = function(input) {
    return mapDomain(input, function(string) {
      return regexNonASCII.test(string) ? "xn--" + encode2(string) : string;
    });
  };
  var punycode = {
    /**
     * A string representing the current Punycode.js version number.
     * @memberOf punycode
     * @type String
     */
    "version": "2.3.1",
    /**
     * An object of methods to convert from JavaScript's internal character
     * representation (UCS-2) to Unicode code points, and back.
     * @see <https://mathiasbynens.be/notes/javascript-encoding>
     * @memberOf punycode
     * @type Object
     */
    "ucs2": {
      "decode": ucs2decode,
      "encode": ucs2encode
    },
    "decode": decode2,
    "encode": encode2,
    "toASCII": toASCII,
    "toUnicode": toUnicode
  };
  var punycode_es6_default = punycode;

  // node_modules/markdown-it/dist/markdown-it.mjs
  var __defProp2 = Object.defineProperty;
  var __exportAll = (all, no_symbols) => {
    let target = {};
    for (var name in all) __defProp2(target, name, {
      get: all[name],
      enumerable: true
    });
    if (!no_symbols) __defProp2(target, Symbol.toStringTag, { value: "Module" });
    return target;
  };
  var utils_exports = /* @__PURE__ */ __exportAll({
    arrayReplaceAt: () => arrayReplaceAt,
    asciiTrim: () => asciiTrim,
    callable: () => callable,
    escapeHtml: () => escapeHtml,
    escapeRE: () => escapeRE,
    fromCodePoint: () => fromCodePoint,
    isMdAsciiPunct: () => isMdAsciiPunct,
    isPunctChar: () => isPunctChar,
    isPunctCharCode: () => isPunctCharCode,
    isSpace: () => isSpace,
    isValidEntityCode: () => isValidEntityCode,
    isWhiteSpace: () => isWhiteSpace,
    lib: () => lib,
    normalizeReference: () => normalizeReference,
    unescapeAll: () => unescapeAll,
    unescapeMd: () => unescapeMd
  });
  function callable(cls) {
    const wrapper = function(...args) {
      return Reflect.construct(cls, args, new.target && new.target !== wrapper ? new.target : cls);
    };
    Object.defineProperty(wrapper, "name", { value: cls.name });
    Object.setPrototypeOf(wrapper, cls);
    wrapper.prototype = cls.prototype;
    return wrapper;
  }
  function arrayReplaceAt(src, pos, newElements) {
    return [].concat(src.slice(0, pos), newElements, src.slice(pos + 1));
  }
  function isValidEntityCode(c) {
    if (c >= 55296 && c <= 57343) return false;
    if (c >= 64976 && c <= 65007) return false;
    if ((c & 65535) === 65535 || (c & 65535) === 65534) return false;
    if (c >= 0 && c <= 8) return false;
    if (c === 11) return false;
    if (c >= 14 && c <= 31) return false;
    if (c >= 127 && c <= 159) return false;
    if (c > 1114111) return false;
    return true;
  }
  function fromCodePoint(c) {
    if (c > 65535) {
      c -= 65536;
      const surrogate1 = 55296 + (c >> 10);
      const surrogate2 = 56320 + (c & 1023);
      return String.fromCharCode(surrogate1, surrogate2);
    }
    return String.fromCharCode(c);
  }
  var UNESCAPE_MD_RE = /\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g;
  var UNESCAPE_ALL_RE = new RegExp(`${UNESCAPE_MD_RE.source}|${/&([a-z#][a-z0-9]{1,31});/gi.source}`, "gi");
  var DIGITAL_ENTITY_TEST_RE = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i;
  function replaceEntityPattern(match, name) {
    if (name.charCodeAt(0) === 35 && DIGITAL_ENTITY_TEST_RE.test(name)) {
      const code2 = name[1].toLowerCase() === "x" ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
      if (isValidEntityCode(code2)) return fromCodePoint(code2);
      return match;
    }
    const decoded = decodeHTMLStrict(match);
    if (decoded !== match) return decoded;
    return match;
  }
  function unescapeMd(str) {
    if (str.indexOf("\\") < 0) return str;
    return str.replace(UNESCAPE_MD_RE, "$1");
  }
  function unescapeAll(str) {
    if (str.indexOf("\\") < 0 && str.indexOf("&") < 0) return str;
    return str.replace(UNESCAPE_ALL_RE, function(match, escaped, entity2) {
      if (escaped) return escaped;
      return replaceEntityPattern(match, entity2);
    });
  }
  var HTML_ESCAPE_TEST_RE = /[&<>"]/;
  var HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
  var HTML_REPLACEMENTS = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  };
  function replaceUnsafeChar(ch) {
    return HTML_REPLACEMENTS[ch];
  }
  function escapeHtml(str) {
    if (HTML_ESCAPE_TEST_RE.test(str)) return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
    return str;
  }
  var REGEXP_ESCAPE_RE = /[.?*+^$[\]\\(){}|-]/g;
  function escapeRE(str) {
    return str.replace(REGEXP_ESCAPE_RE, "\\$&");
  }
  function isSpace(code2) {
    switch (code2) {
      case 9:
      case 32:
        return true;
    }
    return false;
  }
  function isWhiteSpace(code2) {
    if (code2 >= 8192 && code2 <= 8202) return true;
    switch (code2) {
      case 9:
      case 10:
      case 11:
      case 12:
      case 13:
      case 32:
      case 160:
      case 5760:
      case 8239:
      case 8287:
      case 12288:
        return true;
    }
    return false;
  }
  function isPunctChar(ch) {
    return P.test(ch) || S.test(ch);
  }
  function isPunctCharCode(code2) {
    return isPunctChar(fromCodePoint(code2));
  }
  function isMdAsciiPunct(ch) {
    switch (ch) {
      case 33:
      case 34:
      case 35:
      case 36:
      case 37:
      case 38:
      case 39:
      case 40:
      case 41:
      case 42:
      case 43:
      case 44:
      case 45:
      case 46:
      case 47:
      case 58:
      case 59:
      case 60:
      case 61:
      case 62:
      case 63:
      case 64:
      case 91:
      case 92:
      case 93:
      case 94:
      case 95:
      case 96:
      case 123:
      case 124:
      case 125:
      case 126:
        return true;
      default:
        return false;
    }
  }
  function normalizeReference(str) {
    str = str.trim().replace(/\s+/g, " ");
    return str.toLowerCase().toUpperCase();
  }
  function isAsciiTrimmable(c) {
    return c === 32 || c === 9 || c === 10 || c === 13;
  }
  function asciiTrim(str) {
    let start = 0;
    for (; start < str.length; start++) if (!isAsciiTrimmable(str.charCodeAt(start))) break;
    let end = str.length - 1;
    for (; end >= start; end--) if (!isAsciiTrimmable(str.charCodeAt(end))) break;
    return str.slice(start, end + 1);
  }
  var lib = {
    mdurl: mdurl_exports,
    ucmicro: build_exports
  };
  function parseLinkLabel(state2, start, disableNested) {
    let level, found, marker, prevPos;
    const max = state2.posMax;
    const oldPos = state2.pos;
    state2.pos = start + 1;
    level = 1;
    while (state2.pos < max) {
      marker = state2.src.charCodeAt(state2.pos);
      if (marker === 93) {
        level--;
        if (level === 0) {
          found = true;
          break;
        }
      }
      prevPos = state2.pos;
      state2.md.inline.skipToken(state2);
      if (marker === 91) {
        if (prevPos === state2.pos - 1) level++;
        else if (disableNested) {
          state2.pos = oldPos;
          return -1;
        }
      }
    }
    let labelEnd = -1;
    if (found) labelEnd = state2.pos;
    state2.pos = oldPos;
    return labelEnd;
  }
  function parseLinkDestination(str, start, max) {
    let code2;
    let pos = start;
    const result = {
      ok: false,
      pos: 0,
      str: ""
    };
    if (str.charCodeAt(pos) === 60) {
      pos++;
      while (pos < max) {
        code2 = str.charCodeAt(pos);
        if (code2 === 10) return result;
        if (code2 === 60) return result;
        if (code2 === 62) {
          result.pos = pos + 1;
          result.str = unescapeAll(str.slice(start + 1, pos));
          result.ok = true;
          return result;
        }
        if (code2 === 92 && pos + 1 < max) {
          pos += 2;
          continue;
        }
        pos++;
      }
      return result;
    }
    let level = 0;
    while (pos < max) {
      code2 = str.charCodeAt(pos);
      if (code2 === 32) break;
      if (code2 < 32 || code2 === 127) break;
      if (code2 === 92 && pos + 1 < max) {
        if (str.charCodeAt(pos + 1) === 32) {
          pos++;
          continue;
        }
        pos += 2;
        continue;
      }
      if (code2 === 40) {
        level++;
        if (level > 32) return result;
      }
      if (code2 === 41) {
        if (level === 0) break;
        level--;
      }
      pos++;
    }
    if (start === pos) return result;
    if (level !== 0) return result;
    result.str = unescapeAll(str.slice(start, pos));
    result.pos = pos;
    result.ok = true;
    return result;
  }
  function parseLinkTitle(str, start, max, prev_state) {
    let code2;
    let pos = start;
    const state2 = {
      ok: false,
      can_continue: false,
      pos: 0,
      str: "",
      marker: 0
    };
    if (prev_state) {
      state2.str = prev_state.str;
      state2.marker = prev_state.marker;
    } else {
      if (pos >= max) return state2;
      let marker = str.charCodeAt(pos);
      if (marker !== 34 && marker !== 39 && marker !== 40) return state2;
      start++;
      pos++;
      if (marker === 40) marker = 41;
      state2.marker = marker;
    }
    while (pos < max) {
      code2 = str.charCodeAt(pos);
      if (code2 === state2.marker) {
        state2.pos = pos + 1;
        state2.str += unescapeAll(str.slice(start, pos));
        state2.ok = true;
        return state2;
      } else if (code2 === 40 && state2.marker === 41) return state2;
      else if (code2 === 92 && pos + 1 < max) pos++;
      pos++;
    }
    state2.can_continue = true;
    state2.str += unescapeAll(str.slice(start, pos));
    return state2;
  }
  var helpers_exports = /* @__PURE__ */ __exportAll({
    parseLinkDestination: () => parseLinkDestination,
    parseLinkLabel: () => parseLinkLabel,
    parseLinkTitle: () => parseLinkTitle
  });
  function _typeof(o) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof(o);
  }
  function toPrimitive(t2, r) {
    if ("object" != _typeof(t2) || !t2) return t2;
    var e = t2[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t2, r || "default");
      if ("object" != _typeof(i)) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t2);
  }
  function toPropertyKey(t2) {
    var i = toPrimitive(t2, "string");
    return "symbol" == _typeof(i) ? i : i + "";
  }
  function _defineProperty(e, r, t2) {
    return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
      value: t2,
      enumerable: true,
      configurable: true,
      writable: true
    }) : e[r] = t2, e;
  }
  var Token = class {
    constructor(type, tag, nesting) {
      _defineProperty(
        this,
        /**
        * Source map info. Format: `[ line_begin, line_end ]`
        */
        "map",
        null
      );
      _defineProperty(
        this,
        /**
        * nesting level, the same as `state.level`
        */
        "level",
        0
      );
      _defineProperty(
        this,
        /**
        * An array of child nodes (inline and img tokens)
        */
        "children",
        null
      );
      _defineProperty(
        this,
        /**
        * In a case of self-closing tag (code, html, fence, etc.),
        * it has contents of this tag.
        */
        "content",
        ""
      );
      _defineProperty(
        this,
        /**
        * '*' or '_' for emphasis, fence string for fence, etc.
        */
        "markup",
        ""
      );
      _defineProperty(
        this,
        /**
        * Additional information:
        *
        * - Info string for "fence" tokens
        * - The value "auto" for autolink "link_open" and "link_close" tokens
        * - The string value of the item marker for ordered-list "list_item_open" tokens
        */
        "info",
        ""
      );
      _defineProperty(
        this,
        /**
        * True for block-level tokens, false for inline tokens.
        * Used in renderer to calculate line breaks
        */
        "block",
        false
      );
      _defineProperty(
        this,
        /**
        * If it's true, ignore this element when rendering. Used for tight lists
        * to hide paragraphs.
        */
        "hidden",
        false
      );
      this.type = type;
      this.tag = tag;
      this.attrs = null;
      this.nesting = nesting;
      this.meta = null;
    }
    /**
    * Search attribute index by name.
    */
    attrIndex(name) {
      if (!this.attrs) return -1;
      const attrs = this.attrs;
      for (let i = 0, len = attrs.length; i < len; i++) if (attrs[i][0] === name) return i;
      return -1;
    }
    /**
    * Add `[ name, value ]` attribute to list. Init attrs if necessary
    */
    attrPush(attrData) {
      if (this.attrs) this.attrs.push(attrData);
      else this.attrs = [attrData];
    }
    /**
    * Set `name` attribute to `value`. Override old value if exists.
    */
    attrSet(name, value) {
      const idx = this.attrIndex(name);
      const attrData = [name, value];
      if (idx < 0) this.attrPush(attrData);
      else this.attrs[idx] = attrData;
    }
    /**
    * Get the value of attribute `name`, or null if it does not exist.
    */
    attrGet(name) {
      const idx = this.attrIndex(name);
      let value = null;
      if (idx >= 0) value = this.attrs[idx][1];
      return value;
    }
    /**
    * Join value to existing attribute via space. Or create new attribute if not
    * exists. Useful to operate with token classes.
    */
    attrJoin(name, value) {
      const idx = this.attrIndex(name);
      if (idx < 0) this.attrPush([name, value]);
      else this.attrs[idx][1] = `${this.attrs[idx][1]} ${value}`;
    }
  };
  var Ruler = class {
    constructor() {
      _defineProperty(
        this,
        /** @internal */
        "__rules__",
        []
      );
      _defineProperty(
        this,
        /** @internal */
        "__cache__",
        null
      );
    }
    /** @internal */
    __find__(name) {
      for (let i = 0; i < this.__rules__.length; i++) if (this.__rules__[i].name === name) return i;
      return -1;
    }
    /** @internal */
    __compile__() {
      const chains = /* @__PURE__ */ new Set();
      this.__rules__.forEach((rule) => {
        if (!rule.enabled) return;
        rule.alt.forEach((altName) => {
          if (altName) chains.add(altName);
        });
      });
      this.__cache__ = /* @__PURE__ */ Object.create(null);
      this.__cache__[""] = [];
      this.__rules__.forEach((rule) => {
        if (rule.enabled) this.__cache__[""].push(rule.fn);
      });
      chains.forEach((chain) => {
        this.__cache__[chain] = [];
        this.__rules__.forEach((rule) => {
          if (rule.enabled && rule.alt.indexOf(chain) >= 0) this.__cache__[chain].push(rule.fn);
        });
      });
    }
    /**
    * Replace rule by name with new function & options. Throws error if name not
    * found.
    *
    * @example Replace existing typographer replacement rule with new one
    * ```javascript
    * import MarkdownIt from 'markdown-it'
    * const md = new MarkdownIt()
    *
    * md.core.ruler.at('replacements', function replace(state) {
    *   //...
    * });
    * ```
    */
    at(name, fn, options = {}) {
      const index = this.__find__(name);
      if (index === -1) throw new Error(`Parser rule not found: ${name}`);
      this.__rules__[index].fn = fn;
      this.__rules__[index].alt = options.alt || [];
      this.__cache__ = null;
    }
    /**
    * Add new rule to chain before one with given name. See also
    * {@link Ruler.after}, {@link Ruler.push}.
    *
    * @example
    * ```javascript
    * import MarkdownIt from 'markdown-it'
    * const md = new MarkdownIt()
    *
    * md.block.ruler.before('paragraph', 'my_rule', function replace(state) {
    *   //...
    * });
    * ```
    */
    before(beforeName, ruleName, fn, options = {}) {
      const index = this.__find__(beforeName);
      if (index === -1) throw new Error(`Parser rule not found: ${beforeName}`);
      this.__rules__.splice(index, 0, {
        name: ruleName,
        enabled: true,
        fn,
        alt: options.alt || []
      });
      this.__cache__ = null;
    }
    /**
    * Add new rule to chain after one with given name. See also
    * {@link Ruler.before}, {@link Ruler.push}.
    *
    * @example
    * ```javascript
    * import MarkdownIt from 'markdown-it'
    * const md = new MarkdownIt()
    *
    * md.inline.ruler.after('text', 'my_rule', function replace(state) {
    *   //...
    * });
    * ```
    */
    after(afterName, ruleName, fn, options = {}) {
      const index = this.__find__(afterName);
      if (index === -1) throw new Error(`Parser rule not found: ${afterName}`);
      this.__rules__.splice(index + 1, 0, {
        name: ruleName,
        enabled: true,
        fn,
        alt: options.alt || []
      });
      this.__cache__ = null;
    }
    /**
    * Push new rule to the end of chain. See also
    * {@link Ruler.before}, {@link Ruler.after}.
    *
    * @example
    * ```javascript
    * import MarkdownIt from 'markdown-it'
    * const md = new MarkdownIt()
    *
    * md.core.ruler.push('my_rule', function replace(state) {
    *   //...
    * });
    * ```
    */
    push(ruleName, fn, options = {}) {
      this.__rules__.push({
        name: ruleName,
        enabled: true,
        fn,
        alt: options.alt || []
      });
      this.__cache__ = null;
    }
    /**
    * Enable rules with given names. If any rule name not found - throw Error.
    * Errors can be disabled by second param.
    *
    * See also {@link Ruler.disable}, {@link Ruler.enableOnly}.
    *
    * Returns list of found rule names (if no exception happened).
    */
    enable(list2, ignoreInvalid = false) {
      if (!Array.isArray(list2)) list2 = [list2];
      const result = [];
      list2.forEach((name) => {
        const idx = this.__find__(name);
        if (idx < 0) {
          if (ignoreInvalid) return;
          throw new Error(`Rules manager: invalid rule name ${name}`);
        }
        this.__rules__[idx].enabled = true;
        result.push(name);
      });
      this.__cache__ = null;
      return result;
    }
    /**
    * Enable rules with given names, and disable everything else. If any rule name
    * not found - throw Error. Errors can be disabled by second param.
    *
    * See also {@link Ruler.disable}, {@link Ruler.enable}.
    */
    enableOnly(list2, ignoreInvalid = false) {
      if (!Array.isArray(list2)) list2 = [list2];
      this.__rules__.forEach((rule) => {
        rule.enabled = false;
      });
      this.enable(list2, ignoreInvalid);
    }
    /**
    * Disable rules with given names. If any rule name not found - throw Error.
    * Errors can be disabled by second param.
    *
    * See also {@link Ruler.enable}, {@link Ruler.enableOnly}.
    *
    * Returns list of found rule names (if no exception happened).
    */
    disable(list2, ignoreInvalid = false) {
      if (!Array.isArray(list2)) list2 = [list2];
      const result = [];
      list2.forEach((name) => {
        const idx = this.__find__(name);
        if (idx < 0) {
          if (ignoreInvalid) return;
          throw new Error(`Rules manager: invalid rule name ${name}`);
        }
        this.__rules__[idx].enabled = false;
        result.push(name);
      });
      this.__cache__ = null;
      return result;
    }
    /**
    * Return array of active functions (rules) for given chain name. It analyzes
    * rules configuration, compiles caches if not exists and returns result.
    *
    * Default chain name is `''` (empty string). It can't be skipped. That's
    * done intentionally, to keep signature monomorphic for high speed.
    */
    getRules(chainName) {
      if (!this.__cache__) this.__compile__();
      return this.__cache__[chainName] || [];
    }
  };
  var default_rules = {};
  default_rules.code_inline = function(tokens, idx, options, env, slf) {
    const token = tokens[idx];
    return `<code${slf.renderAttrs(token)}>${escapeHtml(token.content)}</code>`;
  };
  default_rules.code_block = function(tokens, idx, options, env, slf) {
    const token = tokens[idx];
    return `<pre${slf.renderAttrs(token)}><code>${escapeHtml(tokens[idx].content)}</code></pre>
`;
  };
  default_rules.fence = function(tokens, idx, options, env, slf) {
    const token = tokens[idx];
    const info = token.info ? unescapeAll(token.info).trim() : "";
    let langName = "";
    let langAttrs = "";
    if (info) {
      const arr = info.split(/(\s+)/g);
      langName = arr[0];
      langAttrs = arr.slice(2).join("");
    }
    let highlighted;
    if (options.highlight) highlighted = options.highlight(token.content, langName, langAttrs) || escapeHtml(token.content);
    else highlighted = escapeHtml(token.content);
    if (highlighted.indexOf("<pre") === 0) return highlighted + "\n";
    if (info) {
      const i = token.attrIndex("class");
      const tmpAttrs = token.attrs ? token.attrs.slice() : [];
      if (i < 0) tmpAttrs.push(["class", `${options.langPrefix}${langName}`]);
      else {
        tmpAttrs[i] = [tmpAttrs[i][0], tmpAttrs[i][1]];
        tmpAttrs[i][1] += ` ${options.langPrefix}${langName}`;
      }
      const tmpToken = { attrs: tmpAttrs };
      return `<pre><code${slf.renderAttrs(tmpToken)}>${highlighted}</code></pre>
`;
    }
    return `<pre><code${slf.renderAttrs(token)}>${highlighted}</code></pre>
`;
  };
  default_rules.image = function(tokens, idx, options, env, slf) {
    const token = tokens[idx];
    token.attrs[token.attrIndex("alt")][1] = slf.renderInlineAsText(token.children, options, env);
    return slf.renderToken(tokens, idx, options);
  };
  default_rules.hardbreak = function(tokens, idx, options) {
    return options.xhtmlOut ? "<br />\n" : "<br>\n";
  };
  default_rules.softbreak = function(tokens, idx, options) {
    return options.breaks ? options.xhtmlOut ? "<br />\n" : "<br>\n" : "\n";
  };
  default_rules.text = function(tokens, idx) {
    return escapeHtml(tokens[idx].content);
  };
  default_rules.html_block = function(tokens, idx) {
    return tokens[idx].content;
  };
  default_rules.html_inline = function(tokens, idx) {
    return tokens[idx].content;
  };
  var Renderer = class {
    constructor() {
      _defineProperty(
        this,
        /**
        * Contains render rules for tokens. Can be updated and extended.
        *
        * See [source code](https://github.com/markdown-it/markdown-it/blob/master/src/renderer.ts)
        * for more details and examples.
        *
        * @example Custom render rules
        * ```javascript
        * import MarkdownIt from 'markdown-it'
        * const md = new MarkdownIt()
        *
        * md.renderer.rules.strong_open  = function () { return '<b>'; };
        * md.renderer.rules.strong_close = function () { return '</b>'; };
        *
        * const result = md.renderInline(...);
        * ```
        *
        * @example Each rule is called as independent static function with fixed signature
        * ```javascript
        * function my_token_render(tokens, idx, options, env, renderer) {
        *   // ...
        *   return renderedHTML;
        * }
        * ```
        */
        "rules",
        Object.assign({}, default_rules)
      );
    }
    /**
    * Render token attributes to string.
    */
    renderAttrs(token) {
      let i, l, result;
      if (!token.attrs) return "";
      result = "";
      for (i = 0, l = token.attrs.length; i < l; i++) result += ` ${escapeHtml(token.attrs[i][0])}="${escapeHtml(String(token.attrs[i][1]))}"`;
      return result;
    }
    /**
    * Default token renderer. Can be overriden by custom function
    * in {@link Renderer.rules}.
    */
    renderToken(tokens, idx, options) {
      const token = tokens[idx];
      let result = "";
      if (token.hidden) return "";
      let prev = idx - 1;
      while (prev >= 0 && tokens[prev].hidden && tokens[prev].nesting === 0) prev--;
      if (token.block && token.nesting !== -1 && prev >= 0 && tokens[prev].hidden && tokens[prev].nesting === -1) result += "\n";
      result += (token.nesting === -1 ? "</" : "<") + token.tag;
      result += this.renderAttrs(token);
      if (token.nesting === 0 && options.xhtmlOut) result += " /";
      let needLf = false;
      if (token.block) {
        needLf = true;
        if (token.nesting === 1) {
          let next = idx + 1;
          while (next < tokens.length && tokens[next].hidden && tokens[next].nesting === 0) next++;
          if (next < tokens.length) {
            const nextToken = tokens[next];
            if (nextToken.type === "inline" || nextToken.hidden) needLf = false;
            else if (nextToken.nesting === -1 && nextToken.tag === token.tag) needLf = false;
          }
        }
      }
      result += needLf ? ">\n" : ">";
      return result;
    }
    /**
    * The same as {@link Renderer.render}, but for single token of `inline` type.
    */
    renderInline(tokens, options, env) {
      let result = "";
      const rules = this.rules;
      for (let i = 0, len = tokens.length; i < len; i++) {
        const type = tokens[i].type;
        if (typeof rules[type] !== "undefined") result += rules[type](tokens, i, options, env, this);
        else result += this.renderToken(tokens, i, options);
      }
      return result;
    }
    /**
    * Special kludge for image `alt` attributes to conform CommonMark spec.
    * Don't try to use it! Spec requires to show `alt` content with stripped markup,
    * instead of simple escaping.
    */
    renderInlineAsText(tokens, options, env) {
      let result = "";
      for (let i = 0, len = tokens.length; i < len; i++) switch (tokens[i].type) {
        case "text":
        case "code_inline":
          result += tokens[i].content;
          break;
        case "image":
          result += this.renderInlineAsText(tokens[i].children, options, env);
          break;
        case "html_inline":
        case "html_block":
          result += tokens[i].content;
          break;
        case "softbreak":
        case "hardbreak":
          result += "\n";
      }
      return result;
    }
    /**
    * Takes token stream and generates HTML. Probably, you will never need to call
    * this method directly.
    */
    render(tokens, options, env) {
      let result = "";
      const rules = this.rules;
      for (let i = 0, len = tokens.length; i < len; i++) {
        const type = tokens[i].type;
        if (type === "inline") result += this.renderInline(tokens[i].children, options, env);
        else if (typeof rules[type] !== "undefined") result += rules[type](tokens, i, options, env, this);
        else result += this.renderToken(tokens, i, options);
      }
      return result;
    }
  };
  var StateCore = class {
    constructor(src, md2, env) {
      _defineProperty(this, "tokens", []);
      _defineProperty(this, "inlineMode", false);
      _defineProperty(this, "Token", Token);
      this.src = src;
      this.env = env;
      this.md = md2;
    }
  };
  var UNNORMALIZED_NEWLINE_RE = /\r\n?/g;
  var NULL_RE = /\0/g;
  function normalize(state2) {
    let str;
    str = state2.src.replace(UNNORMALIZED_NEWLINE_RE, "\n");
    str = str.replace(NULL_RE, "\uFFFD");
    state2.src = str;
  }
  function block(state2) {
    let token;
    if (state2.inlineMode) {
      token = new state2.Token("inline", "", 0);
      token.content = state2.src;
      token.map = [0, 1];
      token.children = [];
      state2.tokens.push(token);
    } else state2.md.block.parse(state2.src, state2.md, state2.env, state2.tokens);
  }
  function strip_references(state2) {
    const tokens = state2.tokens;
    let last = 0;
    for (let curr = 0; curr < tokens.length; curr++) {
      if (tokens[curr].type === "reference_definition") continue;
      if (curr !== last) tokens[last] = tokens[curr];
      last++;
    }
    if (tokens.length !== last) tokens.length = last;
  }
  function inline(state2) {
    const tokens = state2.tokens;
    for (let i = 0, l = tokens.length; i < l; i++) {
      const tok = tokens[i];
      if (tok.type === "inline") state2.md.inline.parse(tok.content, state2.md, state2.env, tok.children);
    }
  }
  function isLinkOpen$1(str) {
    return /^<a[>\s]/i.test(str);
  }
  function isLinkClose$1(str) {
    return /^<\/a\s*>/i.test(str);
  }
  function linkify$1(state2) {
    const blockTokens = state2.tokens;
    if (!state2.md.options.linkify) return;
    for (let j = 0, l = blockTokens.length; j < l; j++) {
      if (blockTokens[j].type !== "inline" || !state2.md.linkify.test(blockTokens[j].content)) continue;
      const tokens = blockTokens[j].children;
      const replacements = [];
      let htmlLinkLevel = 0;
      for (let i = tokens.length - 1; i >= 0; i--) {
        const currentToken = tokens[i];
        if (currentToken.type === "link_close") {
          i--;
          while (tokens[i].level !== currentToken.level && tokens[i].type !== "link_open") i--;
          continue;
        }
        if (currentToken.type === "html_inline") {
          if (isLinkOpen$1(currentToken.content) && htmlLinkLevel > 0) htmlLinkLevel--;
          if (isLinkClose$1(currentToken.content)) htmlLinkLevel++;
        }
        if (htmlLinkLevel > 0) continue;
        if (currentToken.type === "text" && state2.md.linkify.test(currentToken.content)) {
          const text2 = currentToken.content;
          let links = state2.md.linkify.match(text2);
          const nodes = [];
          let level = currentToken.level;
          let lastPos = 0;
          if (links.length > 0 && links[0].index === 0 && i > 0 && tokens[i - 1].type === "text_special") links = links.slice(1);
          for (let ln = 0; ln < links.length; ln++) {
            const url = links[ln].url;
            const fullUrl = state2.md.normalizeLink(url);
            if (!state2.md.validateLink(fullUrl)) continue;
            let urlText = links[ln].text;
            if (!links[ln].schema) urlText = state2.md.normalizeLinkText(`http://${urlText}`).replace(/^http:\/\//, "");
            else if (links[ln].schema === "mailto:" && !/^mailto:/i.test(urlText)) urlText = state2.md.normalizeLinkText(`mailto:${urlText}`).replace(/^mailto:/, "");
            else urlText = state2.md.normalizeLinkText(urlText);
            const pos = links[ln].index;
            if (pos > lastPos) {
              const token = new state2.Token("text", "", 0);
              token.content = text2.slice(lastPos, pos);
              token.level = level;
              nodes.push(token);
            }
            const token_o = new state2.Token("link_open", "a", 1);
            token_o.attrs = [["href", fullUrl]];
            token_o.level = level++;
            token_o.markup = "linkify";
            token_o.info = "auto";
            nodes.push(token_o);
            const token_t = new state2.Token("text", "", 0);
            token_t.content = urlText;
            token_t.level = level;
            nodes.push(token_t);
            const token_c = new state2.Token("link_close", "a", -1);
            token_c.level = --level;
            token_c.markup = "linkify";
            token_c.info = "auto";
            nodes.push(token_c);
            lastPos = links[ln].lastIndex;
          }
          if (lastPos < text2.length) {
            const token = new state2.Token("text", "", 0);
            token.content = text2.slice(lastPos);
            token.level = level;
            nodes.push(token);
          }
          replacements.push({
            index: i,
            nodes
          });
        }
      }
      if (replacements.length > 0) {
        let newTokensLength = tokens.length;
        for (const replacement of replacements) newTokensLength += replacement.nodes.length - 1;
        const newTokens = new Array(newTokensLength);
        let replacementIndex = 0;
        let newTokenIndex = 0;
        replacements.reverse();
        for (let i = 0; i < tokens.length; i++) {
          const replacement = replacements[replacementIndex];
          if ((replacement === null || replacement === void 0 ? void 0 : replacement.index) === i) {
            for (const node of replacement.nodes) newTokens[newTokenIndex++] = node;
            replacementIndex++;
          } else newTokens[newTokenIndex++] = tokens[i];
        }
        blockTokens[j].children = newTokens;
      }
    }
  }
  var RARE_RE = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/;
  var SCOPED_ABBR_TEST_RE = /\((c|tm|r)\)/i;
  var SCOPED_ABBR_RE = /\((c|tm|r)\)/gi;
  var SCOPED_ABBR = {
    c: "\xA9",
    r: "\xAE",
    tm: "\u2122"
  };
  function replaceFn(match, name) {
    return SCOPED_ABBR[name.toLowerCase()];
  }
  function replace_scoped(inlineTokens) {
    let inside_autolink = 0;
    for (let i = inlineTokens.length - 1; i >= 0; i--) {
      const token = inlineTokens[i];
      if (token.type === "text" && !inside_autolink) token.content = token.content.replace(SCOPED_ABBR_RE, replaceFn);
      if (token.type === "link_open" && token.info === "auto") inside_autolink--;
      if (token.type === "link_close" && token.info === "auto") inside_autolink++;
    }
  }
  function replace_rare(inlineTokens) {
    let inside_autolink = 0;
    for (let i = inlineTokens.length - 1; i >= 0; i--) {
      const token = inlineTokens[i];
      if (token.type === "text" && !inside_autolink) {
        if (RARE_RE.test(token.content)) token.content = token.content.replace(/\+-/g, "\xB1").replace(/\.{2,}/g, "\u2026").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/gm, "$1\u2014").replace(/(^|\s)--(?=\s|$)/gm, "$1\u2013").replace(/(^|[^-\s])--(?=[^-\s]|$)/gm, "$1\u2013");
      }
      if (token.type === "link_open" && token.info === "auto") inside_autolink--;
      if (token.type === "link_close" && token.info === "auto") inside_autolink++;
    }
  }
  function replace(state2) {
    let blkIdx;
    if (!state2.md.options.typographer) return;
    for (blkIdx = state2.tokens.length - 1; blkIdx >= 0; blkIdx--) {
      if (state2.tokens[blkIdx].type !== "inline") continue;
      if (SCOPED_ABBR_TEST_RE.test(state2.tokens[blkIdx].content)) replace_scoped(state2.tokens[blkIdx].children);
      if (RARE_RE.test(state2.tokens[blkIdx].content)) replace_rare(state2.tokens[blkIdx].children);
    }
  }
  var QUOTE_TEST_RE = /['"]/;
  var QUOTE_RE = /['"]/g;
  var APOSTROPHE = "\u2019";
  var MAX_OPENERS = 1e3;
  function truncateStack(stack, heads, length) {
    while (stack.length > length) {
      const item = stack.pop();
      if (item.isSingleQuote) heads.single = item.prevSameQuoteIdx;
      else heads.double = item.prevSameQuoteIdx;
    }
  }
  function addReplacement(replacements, tokenIdx, pos, ch) {
    if (!replacements[tokenIdx]) replacements[tokenIdx] = [];
    replacements[tokenIdx].push({
      pos,
      ch
    });
  }
  function applyReplacements(str, replacements) {
    let result = "";
    let lastPos = 0;
    replacements.sort((a, b) => a.pos - b.pos);
    for (let i = 0; i < replacements.length; i++) {
      const replacement = replacements[i];
      result += str.slice(lastPos, replacement.pos) + replacement.ch;
      lastPos = replacement.pos + 1;
    }
    return result + str.slice(lastPos);
  }
  function process_inlines(tokens, state2) {
    let j;
    const stack = [];
    const heads = {
      single: -1,
      double: -1
    };
    const replacements = {};
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      const thisLevel = tokens[i].level;
      for (j = stack.length - 1; j >= 0; j--) if (stack[j].level <= thisLevel) break;
      truncateStack(stack, heads, j + 1);
      if (token.type !== "text") continue;
      const text2 = token.content;
      let pos = 0;
      const max = text2.length;
      OUTER: while (pos < max) {
        QUOTE_RE.lastIndex = pos;
        const t2 = QUOTE_RE.exec(text2);
        if (!t2) break;
        let canOpen = true;
        let canClose = true;
        pos = t2.index + 1;
        const isSingle = t2[0] === "'";
        let lastChar = 32;
        if (t2.index - 1 >= 0) lastChar = text2.charCodeAt(t2.index - 1);
        else for (j = i - 1; j >= 0; j--) {
          if (tokens[j].type === "softbreak" || tokens[j].type === "hardbreak") break;
          if (!tokens[j].content) continue;
          lastChar = tokens[j].content.charCodeAt(tokens[j].content.length - 1);
          break;
        }
        let nextChar = 32;
        if (pos < max) nextChar = text2.charCodeAt(pos);
        else for (j = i + 1; j < tokens.length; j++) {
          if (tokens[j].type === "softbreak" || tokens[j].type === "hardbreak") break;
          if (!tokens[j].content) continue;
          nextChar = tokens[j].content.charCodeAt(0);
          break;
        }
        const isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctCharCode(lastChar);
        const isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctCharCode(nextChar);
        const isLastWhiteSpace = isWhiteSpace(lastChar);
        const isNextWhiteSpace = isWhiteSpace(nextChar);
        if (isNextWhiteSpace) canOpen = false;
        else if (isNextPunctChar) {
          if (!(isLastWhiteSpace || isLastPunctChar)) canOpen = false;
        }
        if (isLastWhiteSpace) canClose = false;
        else if (isLastPunctChar) {
          if (!(isNextWhiteSpace || isNextPunctChar)) canClose = false;
        }
        if (nextChar === 34 && t2[0] === '"') {
          if (lastChar >= 48 && lastChar <= 57) canClose = canOpen = false;
        }
        if (canOpen && canClose) {
          canOpen = isLastPunctChar;
          canClose = isNextPunctChar;
        }
        if (!canOpen && !canClose) {
          if (isSingle) addReplacement(replacements, i, t2.index, APOSTROPHE);
          continue;
        }
        if (canClose) {
          j = isSingle ? heads.single : heads.double;
          if (j >= 0 && stack[j].level === thisLevel) {
            const item = stack[j];
            let openQuote;
            let closeQuote;
            if (isSingle) {
              openQuote = state2.md.options.quotes[2];
              closeQuote = state2.md.options.quotes[3];
            } else {
              openQuote = state2.md.options.quotes[0];
              closeQuote = state2.md.options.quotes[1];
            }
            addReplacement(replacements, i, t2.index, closeQuote);
            addReplacement(replacements, item.tokenIdx, item.contentPos, openQuote);
            truncateStack(stack, heads, j);
            continue OUTER;
          }
        }
        if (canOpen) {
          if (stack.length >= MAX_OPENERS) return;
          stack.push({
            tokenIdx: i,
            contentPos: t2.index,
            isSingleQuote: isSingle,
            level: thisLevel,
            prevSameQuoteIdx: isSingle ? heads.single : heads.double
          });
          if (isSingle) heads.single = stack.length - 1;
          else heads.double = stack.length - 1;
        } else if (canClose && isSingle) addReplacement(replacements, i, t2.index, APOSTROPHE);
      }
    }
    Object.keys(replacements).forEach(function(tokenIdx) {
      const idx = Number(tokenIdx);
      tokens[idx].content = applyReplacements(tokens[idx].content, replacements[tokenIdx]);
    });
  }
  function smartquotes(state2) {
    if (!state2.md.options.typographer) return;
    for (let blkIdx = state2.tokens.length - 1; blkIdx >= 0; blkIdx--) {
      if (state2.tokens[blkIdx].type !== "inline" || !QUOTE_TEST_RE.test(state2.tokens[blkIdx].content)) continue;
      process_inlines(state2.tokens[blkIdx].children, state2);
    }
  }
  function join_alt(tokens) {
    let curr, last;
    const max = tokens.length;
    for (curr = 0; curr < max; curr++) if (tokens[curr].type === "text_special") tokens[curr].type = "text";
    for (curr = last = 0; curr < max; curr++) if (tokens[curr].type === "text" && curr + 1 < max && tokens[curr + 1].type === "text") tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
    else {
      if (curr !== last) tokens[last] = tokens[curr];
      last++;
    }
    if (curr !== last) tokens.length = last;
  }
  function text_join(state2) {
    let curr, last;
    const blockTokens = state2.tokens;
    const l = blockTokens.length;
    for (let j = 0; j < l; j++) {
      if (blockTokens[j].type !== "inline") continue;
      const tokens = blockTokens[j].children;
      const max = tokens.length;
      for (curr = 0; curr < max; curr++) {
        if (tokens[curr].type === "text_special") tokens[curr].type = "text";
        if (tokens[curr].children) join_alt(tokens[curr].children);
      }
      for (curr = last = 0; curr < max; curr++) if (tokens[curr].type === "text" && curr + 1 < max && tokens[curr + 1].type === "text") tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
      else {
        if (curr !== last) tokens[last] = tokens[curr];
        last++;
      }
      if (curr !== last) tokens.length = last;
    }
  }
  var _rules$2 = [
    ["normalize", normalize],
    ["block", block],
    ["strip_references", strip_references],
    ["inline", inline],
    ["linkify", linkify$1],
    ["replacements", replace],
    ["smartquotes", smartquotes],
    ["text_join", text_join]
  ];
  var ParserCore = class {
    constructor() {
      _defineProperty(
        this,
        /**
        * {@link Ruler} instance. Keep configuration of core rules.
        */
        "ruler",
        new Ruler()
      );
      _defineProperty(this, "State", StateCore);
      for (let i = 0; i < _rules$2.length; i++) this.ruler.push(_rules$2[i][0], _rules$2[i][1]);
    }
    /**
    * Executes core chain rules.
    */
    process(state2) {
      const rules = this.ruler.getRules("");
      for (let i = 0, l = rules.length; i < l; i++) rules[i](state2);
    }
  };
  var StateBlock = class {
    constructor(src, md2, env, tokens) {
      _defineProperty(this, "bMarks", []);
      _defineProperty(this, "eMarks", []);
      _defineProperty(this, "tShift", []);
      _defineProperty(this, "sCount", []);
      _defineProperty(this, "bsCount", []);
      _defineProperty(this, "blkIndent", 0);
      _defineProperty(this, "line", 0);
      _defineProperty(this, "lineMax", 0);
      _defineProperty(this, "tight", false);
      _defineProperty(this, "listIndent", -1);
      _defineProperty(this, "parentType", "root");
      _defineProperty(this, "level", 0);
      _defineProperty(this, "Token", Token);
      this.src = src;
      this.md = md2;
      this.env = env;
      this.tokens = tokens;
      const s = this.src;
      for (let start = 0, pos = 0, indent = 0, offset = 0, len = s.length, indent_found = false; pos < len; pos++) {
        const ch = s.charCodeAt(pos);
        if (!indent_found) {
          if (isSpace(ch)) {
            indent++;
            if (ch === 9) offset += 4 - offset % 4;
            else offset++;
            continue;
          } else indent_found = true;
        }
        if (ch === 10 || pos === len - 1) {
          if (ch !== 10) pos++;
          this.bMarks.push(start);
          this.eMarks.push(pos);
          this.tShift.push(indent);
          this.sCount.push(offset);
          this.bsCount.push(0);
          indent_found = false;
          indent = 0;
          offset = 0;
          start = pos + 1;
        }
      }
      this.bMarks.push(s.length);
      this.eMarks.push(s.length);
      this.tShift.push(0);
      this.sCount.push(0);
      this.bsCount.push(0);
      this.lineMax = this.bMarks.length - 1;
    }
    push(type, tag, nesting) {
      const token = new Token(type, tag, nesting);
      token.block = true;
      if (nesting < 0) this.level--;
      token.level = this.level;
      if (nesting > 0) this.level++;
      this.tokens.push(token);
      return token;
    }
    isEmpty(line) {
      return this.bMarks[line] + this.tShift[line] >= this.eMarks[line];
    }
    skipEmptyLines(from) {
      for (let max = this.lineMax; from < max; from++) if (this.bMarks[from] + this.tShift[from] < this.eMarks[from]) break;
      return from;
    }
    skipSpaces(pos) {
      for (let max = this.src.length; pos < max; pos++) if (!isSpace(this.src.charCodeAt(pos))) break;
      return pos;
    }
    skipSpacesBack(pos, min) {
      if (pos <= min) return pos;
      while (pos > min) if (!isSpace(this.src.charCodeAt(--pos))) return pos + 1;
      return pos;
    }
    skipChars(pos, code2) {
      for (let max = this.src.length; pos < max; pos++) if (this.src.charCodeAt(pos) !== code2) break;
      return pos;
    }
    skipCharsBack(pos, code2, min) {
      if (pos <= min) return pos;
      while (pos > min) if (code2 !== this.src.charCodeAt(--pos)) return pos + 1;
      return pos;
    }
    getLines(begin, end, indent, keepLastLF) {
      if (begin >= end) return "";
      const queue = new Array(end - begin);
      for (let i = 0, line = begin; line < end; line++, i++) {
        let lineIndent = 0;
        const lineStart = this.bMarks[line];
        let first = lineStart;
        let last;
        if (line + 1 < end || keepLastLF) last = this.eMarks[line] + 1;
        else last = this.eMarks[line];
        while (first < last && lineIndent < indent) {
          const ch = this.src.charCodeAt(first);
          if (isSpace(ch)) {
            if (ch === 9) lineIndent += 4 - (lineIndent + this.bsCount[line]) % 4;
            else lineIndent++;
          } else if (first - lineStart < this.tShift[line]) lineIndent++;
          else break;
          first++;
        }
        if (lineIndent > indent) queue[i] = new Array(lineIndent - indent + 1).join(" ") + this.src.slice(first, last);
        else queue[i] = this.src.slice(first, last);
      }
      return queue.join("");
    }
  };
  var MAX_AUTOCOMPLETED_CELLS = 65536;
  function getLine(state2, line) {
    const pos = state2.bMarks[line] + state2.tShift[line];
    const max = state2.eMarks[line];
    return state2.src.slice(pos, max);
  }
  function escapedSplit(str) {
    const result = [];
    const max = str.length;
    let pos = 0;
    let ch = str.charCodeAt(pos);
    let isEscaped = false;
    let lastPos = 0;
    let current = "";
    while (pos < max) {
      if (ch === 124) {
        if (!isEscaped) {
          result.push(current + str.substring(lastPos, pos));
          current = "";
          lastPos = pos + 1;
        } else {
          current += str.substring(lastPos, pos - 1);
          lastPos = pos;
        }
      }
      isEscaped = ch === 92;
      pos++;
      ch = str.charCodeAt(pos);
    }
    result.push(current + str.substring(lastPos));
    return result;
  }
  function table(state2, startLine, endLine, silent) {
    if (startLine + 2 > endLine) return false;
    let nextLine = startLine + 1;
    if (state2.sCount[nextLine] < state2.blkIndent) return false;
    if (state2.sCount[nextLine] - state2.blkIndent >= 4) return false;
    let pos = state2.bMarks[nextLine] + state2.tShift[nextLine];
    if (pos >= state2.eMarks[nextLine]) return false;
    const firstCh = state2.src.charCodeAt(pos++);
    if (firstCh !== 124 && firstCh !== 45 && firstCh !== 58) return false;
    if (pos >= state2.eMarks[nextLine]) return false;
    const secondCh = state2.src.charCodeAt(pos++);
    if (secondCh !== 124 && secondCh !== 45 && secondCh !== 58 && !isSpace(secondCh)) return false;
    if (firstCh === 45 && isSpace(secondCh)) return false;
    while (pos < state2.eMarks[nextLine]) {
      const ch = state2.src.charCodeAt(pos);
      if (ch !== 124 && ch !== 45 && ch !== 58 && !isSpace(ch)) return false;
      pos++;
    }
    let lineText = getLine(state2, startLine + 1);
    let columns = lineText.split("|");
    const aligns = [];
    for (let i = 0; i < columns.length; i++) {
      const t2 = columns[i].trim();
      if (!t2) {
        if (i === 0 || i === columns.length - 1) continue;
        else return false;
      }
      if (!/^:?-+:?$/.test(t2)) return false;
      if (t2.charCodeAt(t2.length - 1) === 58) aligns.push(t2.charCodeAt(0) === 58 ? "center" : "right");
      else if (t2.charCodeAt(0) === 58) aligns.push("left");
      else aligns.push("");
    }
    lineText = getLine(state2, startLine).trim();
    if (lineText.indexOf("|") === -1) return false;
    if (state2.sCount[startLine] - state2.blkIndent >= 4) return false;
    columns = escapedSplit(lineText);
    if (columns.length && columns[0] === "") columns.shift();
    if (columns.length && columns[columns.length - 1] === "") columns.pop();
    const columnCount = columns.length;
    if (columnCount === 0 || columnCount !== aligns.length) return false;
    if (silent) return true;
    const oldParentType = state2.parentType;
    state2.parentType = "table";
    const terminatorRules = state2.md.block.ruler.getRules("blockquote");
    const token_to = state2.push("table_open", "table", 1);
    const tableLines = [startLine, 0];
    token_to.map = tableLines;
    const token_tho = state2.push("thead_open", "thead", 1);
    token_tho.map = [startLine, startLine + 1];
    const token_htro = state2.push("tr_open", "tr", 1);
    token_htro.map = [startLine, startLine + 1];
    for (let i = 0; i < columns.length; i++) {
      const token_ho = state2.push("th_open", "th", 1);
      if (aligns[i]) token_ho.attrs = [["style", `text-align:${aligns[i]}`]];
      const token_il = state2.push("inline", "", 0);
      token_il.content = columns[i].trim();
      token_il.children = [];
      state2.push("th_close", "th", -1);
    }
    state2.push("tr_close", "tr", -1);
    state2.push("thead_close", "thead", -1);
    let tbodyLines;
    let autocompletedCells = 0;
    for (nextLine = startLine + 2; nextLine < endLine; nextLine++) {
      if (state2.sCount[nextLine] < state2.blkIndent) break;
      let terminate = false;
      for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state2, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
      if (terminate) break;
      lineText = getLine(state2, nextLine).trim();
      if (!lineText) break;
      if (state2.sCount[nextLine] - state2.blkIndent >= 4) break;
      columns = escapedSplit(lineText);
      if (columns.length && columns[0] === "") columns.shift();
      if (columns.length && columns[columns.length - 1] === "") columns.pop();
      autocompletedCells += columnCount - columns.length;
      if (autocompletedCells > MAX_AUTOCOMPLETED_CELLS) break;
      if (nextLine === startLine + 2) {
        const token_tbo = state2.push("tbody_open", "tbody", 1);
        token_tbo.map = tbodyLines = [startLine + 2, 0];
      }
      const token_tro = state2.push("tr_open", "tr", 1);
      token_tro.map = [nextLine, nextLine + 1];
      for (let i = 0; i < columnCount; i++) {
        const token_tdo = state2.push("td_open", "td", 1);
        if (aligns[i]) token_tdo.attrs = [["style", `text-align:${aligns[i]}`]];
        const token_il = state2.push("inline", "", 0);
        token_il.content = columns[i] ? columns[i].trim() : "";
        token_il.children = [];
        state2.push("td_close", "td", -1);
      }
      state2.push("tr_close", "tr", -1);
    }
    if (tbodyLines) {
      state2.push("tbody_close", "tbody", -1);
      tbodyLines[1] = nextLine;
    }
    state2.push("table_close", "table", -1);
    tableLines[1] = nextLine;
    state2.parentType = oldParentType;
    state2.line = nextLine;
    return true;
  }
  function code(state2, startLine, endLine) {
    if (state2.sCount[startLine] - state2.blkIndent < 4) return false;
    let nextLine = startLine + 1;
    let last = nextLine;
    while (nextLine < endLine) {
      if (state2.isEmpty(nextLine)) {
        nextLine++;
        continue;
      }
      if (state2.sCount[nextLine] - state2.blkIndent >= 4) {
        nextLine++;
        last = nextLine;
        continue;
      }
      break;
    }
    state2.line = last;
    const token = state2.push("code_block", "code", 0);
    token.content = state2.getLines(startLine, last, 4 + state2.blkIndent, false) + "\n";
    token.map = [startLine, state2.line];
    return true;
  }
  function fence(state2, startLine, endLine, silent) {
    let pos = state2.bMarks[startLine] + state2.tShift[startLine];
    let max = state2.eMarks[startLine];
    if (state2.sCount[startLine] - state2.blkIndent >= 4) return false;
    if (pos + 3 > max) return false;
    const marker = state2.src.charCodeAt(pos);
    if (marker !== 126 && marker !== 96) return false;
    let mem = pos;
    pos = state2.skipChars(pos, marker);
    let len = pos - mem;
    if (len < 3) return false;
    const markup = state2.src.slice(mem, pos);
    const params = state2.src.slice(pos, max);
    if (marker === 96) {
      if (params.indexOf(String.fromCharCode(marker)) >= 0) return false;
    }
    if (silent) return true;
    let nextLine = startLine;
    let haveEndMarker = false;
    for (; ; ) {
      nextLine++;
      if (nextLine >= endLine) break;
      pos = mem = state2.bMarks[nextLine] + state2.tShift[nextLine];
      max = state2.eMarks[nextLine];
      if (pos < max && state2.sCount[nextLine] < state2.blkIndent) break;
      if (state2.src.charCodeAt(pos) !== marker) continue;
      if (state2.sCount[nextLine] - state2.blkIndent >= 4) continue;
      pos = state2.skipChars(pos, marker);
      if (pos - mem < len) continue;
      pos = state2.skipSpaces(pos);
      if (pos < max) continue;
      haveEndMarker = true;
      break;
    }
    len = state2.sCount[startLine];
    state2.line = nextLine + (haveEndMarker ? 1 : 0);
    const token = state2.push("fence", "code", 0);
    token.info = params;
    token.content = state2.getLines(startLine + 1, nextLine, len, true);
    token.markup = markup;
    token.map = [startLine, state2.line];
    return true;
  }
  function blockquote(state2, startLine, endLine, silent) {
    let pos = state2.bMarks[startLine] + state2.tShift[startLine];
    let max = state2.eMarks[startLine];
    const oldLineMax = state2.lineMax;
    if (state2.sCount[startLine] - state2.blkIndent >= 4) return false;
    if (state2.src.charCodeAt(pos) !== 62) return false;
    if (silent) return true;
    const oldBMarks = [];
    const oldBSCount = [];
    const oldSCount = [];
    const oldTShift = [];
    const terminatorRules = state2.md.block.ruler.getRules("blockquote");
    const oldParentType = state2.parentType;
    state2.parentType = "blockquote";
    let lastLineEmpty = false;
    let nextLine;
    for (nextLine = startLine; nextLine < endLine; nextLine++) {
      const isOutdented = state2.sCount[nextLine] < state2.blkIndent;
      pos = state2.bMarks[nextLine] + state2.tShift[nextLine];
      max = state2.eMarks[nextLine];
      if (pos >= max) break;
      if (state2.src.charCodeAt(pos++) === 62 && !isOutdented) {
        let initial = state2.sCount[nextLine] + 1;
        let spaceAfterMarker;
        let adjustTab;
        if (state2.src.charCodeAt(pos) === 32) {
          pos++;
          initial++;
          adjustTab = false;
          spaceAfterMarker = true;
        } else if (state2.src.charCodeAt(pos) === 9) {
          spaceAfterMarker = true;
          if ((state2.bsCount[nextLine] + initial) % 4 === 3) {
            pos++;
            initial++;
            adjustTab = false;
          } else adjustTab = true;
        } else spaceAfterMarker = false;
        let offset = initial;
        oldBMarks.push(state2.bMarks[nextLine]);
        state2.bMarks[nextLine] = pos;
        while (pos < max) {
          const ch = state2.src.charCodeAt(pos);
          if (isSpace(ch)) {
            if (ch === 9) offset += 4 - (offset + state2.bsCount[nextLine] + (adjustTab ? 1 : 0)) % 4;
            else offset++;
          } else break;
          pos++;
        }
        lastLineEmpty = pos >= max;
        oldBSCount.push(state2.bsCount[nextLine]);
        state2.bsCount[nextLine] = state2.sCount[nextLine] + 1 + (spaceAfterMarker ? 1 : 0);
        oldSCount.push(state2.sCount[nextLine]);
        state2.sCount[nextLine] = offset - initial;
        oldTShift.push(state2.tShift[nextLine]);
        state2.tShift[nextLine] = pos - state2.bMarks[nextLine];
        continue;
      }
      if (lastLineEmpty) break;
      let terminate = false;
      for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state2, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
      if (terminate) {
        state2.lineMax = nextLine;
        if (state2.blkIndent !== 0) {
          oldBMarks.push(state2.bMarks[nextLine]);
          oldBSCount.push(state2.bsCount[nextLine]);
          oldTShift.push(state2.tShift[nextLine]);
          oldSCount.push(state2.sCount[nextLine]);
          state2.sCount[nextLine] -= state2.blkIndent;
        }
        break;
      }
      oldBMarks.push(state2.bMarks[nextLine]);
      oldBSCount.push(state2.bsCount[nextLine]);
      oldTShift.push(state2.tShift[nextLine]);
      oldSCount.push(state2.sCount[nextLine]);
      state2.sCount[nextLine] = -1;
    }
    const oldIndent = state2.blkIndent;
    state2.blkIndent = 0;
    const token_o = state2.push("blockquote_open", "blockquote", 1);
    token_o.markup = ">";
    const lines = [startLine, 0];
    token_o.map = lines;
    state2.md.block.tokenize(state2, startLine, nextLine);
    const token_c = state2.push("blockquote_close", "blockquote", -1);
    token_c.markup = ">";
    state2.lineMax = oldLineMax;
    state2.parentType = oldParentType;
    lines[1] = state2.line;
    for (let i = 0; i < oldTShift.length; i++) {
      state2.bMarks[i + startLine] = oldBMarks[i];
      state2.tShift[i + startLine] = oldTShift[i];
      state2.sCount[i + startLine] = oldSCount[i];
      state2.bsCount[i + startLine] = oldBSCount[i];
    }
    state2.blkIndent = oldIndent;
    return true;
  }
  function hr(state2, startLine, endLine, silent) {
    const max = state2.eMarks[startLine];
    if (state2.sCount[startLine] - state2.blkIndent >= 4) return false;
    let pos = state2.bMarks[startLine] + state2.tShift[startLine];
    const marker = state2.src.charCodeAt(pos++);
    if (marker !== 42 && marker !== 45 && marker !== 95) return false;
    let cnt = 1;
    while (pos < max) {
      const ch = state2.src.charCodeAt(pos++);
      if (ch !== marker && !isSpace(ch)) return false;
      if (ch === marker) cnt++;
    }
    if (cnt < 3) return false;
    if (silent) return true;
    state2.line = startLine + 1;
    const token = state2.push("hr", "hr", 0);
    token.map = [startLine, state2.line];
    token.markup = Array(cnt + 1).join(String.fromCharCode(marker));
    return true;
  }
  function skipBulletListMarker(state2, startLine) {
    const max = state2.eMarks[startLine];
    let pos = state2.bMarks[startLine] + state2.tShift[startLine];
    const marker = state2.src.charCodeAt(pos++);
    if (marker !== 42 && marker !== 45 && marker !== 43) return -1;
    if (pos < max) {
      if (!isSpace(state2.src.charCodeAt(pos))) return -1;
    }
    return pos;
  }
  function skipOrderedListMarker(state2, startLine) {
    const start = state2.bMarks[startLine] + state2.tShift[startLine];
    const max = state2.eMarks[startLine];
    let pos = start;
    if (pos + 1 >= max) return -1;
    let ch = state2.src.charCodeAt(pos++);
    if (ch < 48 || ch > 57) return -1;
    for (; ; ) {
      if (pos >= max) return -1;
      ch = state2.src.charCodeAt(pos++);
      if (ch >= 48 && ch <= 57) {
        if (pos - start >= 10) return -1;
        continue;
      }
      if (ch === 41 || ch === 46) break;
      return -1;
    }
    if (pos < max) {
      ch = state2.src.charCodeAt(pos);
      if (!isSpace(ch)) return -1;
    }
    return pos;
  }
  function markTightParagraphs(state2, idx) {
    const level = state2.level + 2;
    for (let i = idx + 2, l = state2.tokens.length - 2; i < l; i++) if (state2.tokens[i].level === level && state2.tokens[i].type === "paragraph_open") {
      state2.tokens[i + 2].hidden = true;
      state2.tokens[i].hidden = true;
      i += 2;
    }
  }
  function list(state2, startLine, endLine, silent) {
    let max, pos, start, token;
    let nextLine = startLine;
    let tight = true;
    if (state2.sCount[nextLine] - state2.blkIndent >= 4) return false;
    if (state2.listIndent >= 0 && state2.sCount[nextLine] - state2.listIndent >= 4 && state2.sCount[nextLine] < state2.blkIndent) return false;
    let isTerminatingParagraph = false;
    if (silent && state2.parentType === "paragraph") {
      if (state2.sCount[nextLine] >= state2.blkIndent) isTerminatingParagraph = true;
    }
    let isOrdered;
    let markerValue;
    let posAfterMarker;
    if ((posAfterMarker = skipOrderedListMarker(state2, nextLine)) >= 0) {
      isOrdered = true;
      start = state2.bMarks[nextLine] + state2.tShift[nextLine];
      markerValue = Number(state2.src.slice(start, posAfterMarker - 1));
      if (isTerminatingParagraph && markerValue !== 1) return false;
    } else if ((posAfterMarker = skipBulletListMarker(state2, nextLine)) >= 0) isOrdered = false;
    else return false;
    if (isTerminatingParagraph) {
      if (state2.skipSpaces(posAfterMarker) >= state2.eMarks[nextLine]) return false;
    }
    if (silent) return true;
    const markerCharCode = state2.src.charCodeAt(posAfterMarker - 1);
    const listTokIdx = state2.tokens.length;
    if (isOrdered) {
      token = state2.push("ordered_list_open", "ol", 1);
      if (markerValue !== 1) token.attrs = [["start", markerValue]];
    } else token = state2.push("bullet_list_open", "ul", 1);
    const listLines = [nextLine, 0];
    token.map = listLines;
    token.markup = String.fromCharCode(markerCharCode);
    let prevEmptyEnd = false;
    const terminatorRules = state2.md.block.ruler.getRules("list");
    const oldParentType = state2.parentType;
    state2.parentType = "list";
    while (nextLine < endLine) {
      pos = posAfterMarker;
      max = state2.eMarks[nextLine];
      const initial = state2.sCount[nextLine] + posAfterMarker - (state2.bMarks[nextLine] + state2.tShift[nextLine]);
      let offset = initial;
      while (pos < max) {
        const ch = state2.src.charCodeAt(pos);
        if (ch === 9) offset += 4 - (offset + state2.bsCount[nextLine]) % 4;
        else if (ch === 32) offset++;
        else break;
        pos++;
      }
      const contentStart = pos;
      let indentAfterMarker;
      if (contentStart >= max) indentAfterMarker = 1;
      else indentAfterMarker = offset - initial;
      if (indentAfterMarker > 4) indentAfterMarker = 1;
      const indent = initial + indentAfterMarker;
      token = state2.push("list_item_open", "li", 1);
      token.markup = String.fromCharCode(markerCharCode);
      const itemLines = [nextLine, 0];
      token.map = itemLines;
      if (isOrdered) token.info = state2.src.slice(start, posAfterMarker - 1);
      const oldTight = state2.tight;
      const oldTShift = state2.tShift[nextLine];
      const oldSCount = state2.sCount[nextLine];
      const oldListIndent = state2.listIndent;
      state2.listIndent = state2.blkIndent;
      state2.blkIndent = indent;
      state2.tight = true;
      state2.tShift[nextLine] = contentStart - state2.bMarks[nextLine];
      state2.sCount[nextLine] = offset;
      if (contentStart >= max && state2.isEmpty(nextLine + 1)) state2.line = Math.min(state2.line + 2, endLine);
      else state2.md.block.tokenize(state2, nextLine, endLine);
      if (!state2.tight || prevEmptyEnd) tight = false;
      prevEmptyEnd = state2.line - nextLine > 1 && state2.isEmpty(state2.line - 1);
      state2.blkIndent = state2.listIndent;
      state2.listIndent = oldListIndent;
      state2.tShift[nextLine] = oldTShift;
      state2.sCount[nextLine] = oldSCount;
      state2.tight = oldTight;
      token = state2.push("list_item_close", "li", -1);
      token.markup = String.fromCharCode(markerCharCode);
      nextLine = state2.line;
      itemLines[1] = nextLine;
      if (nextLine >= endLine) break;
      if (state2.sCount[nextLine] < state2.blkIndent) break;
      if (state2.sCount[nextLine] - state2.blkIndent >= 4) break;
      let terminate = false;
      for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state2, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
      if (terminate) break;
      if (isOrdered) {
        posAfterMarker = skipOrderedListMarker(state2, nextLine);
        if (posAfterMarker < 0) break;
        start = state2.bMarks[nextLine] + state2.tShift[nextLine];
      } else {
        posAfterMarker = skipBulletListMarker(state2, nextLine);
        if (posAfterMarker < 0) break;
      }
      if (markerCharCode !== state2.src.charCodeAt(posAfterMarker - 1)) break;
    }
    if (isOrdered) token = state2.push("ordered_list_close", "ol", -1);
    else token = state2.push("bullet_list_close", "ul", -1);
    token.markup = String.fromCharCode(markerCharCode);
    listLines[1] = nextLine;
    state2.line = nextLine;
    state2.parentType = oldParentType;
    if (tight) markTightParagraphs(state2, listTokIdx);
    return true;
  }
  var MAX_LABEL_LENGTH = 999;
  function countCodePoints(str) {
    let length = str.length;
    for (let i = 0; i < str.length - 1; i++) {
      const high = str.charCodeAt(i);
      if (high < 55296 || high > 56319) continue;
      const low = str.charCodeAt(i + 1);
      if (low >= 56320 && low <= 57343) {
        length--;
        i++;
      }
    }
    return length;
  }
  function lineEnd(state2, line) {
    return Math.min(state2.eMarks[line] + 1, state2.src.length);
  }
  function getNextLinePos(state2, nextLine) {
    const endLine = state2.lineMax;
    if (nextLine >= endLine || state2.isEmpty(nextLine)) return -1;
    let isContinuation = false;
    if (state2.sCount[nextLine] - state2.blkIndent > 3) isContinuation = true;
    if (state2.sCount[nextLine] < 0) isContinuation = true;
    if (!isContinuation) {
      const terminatorRules = state2.md.block.ruler.getRules("reference");
      const oldParentType = state2.parentType;
      state2.parentType = "reference";
      let terminate = false;
      for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state2, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
      state2.parentType = oldParentType;
      if (terminate) return -1;
    }
    return state2.bMarks[nextLine] + state2.tShift[nextLine];
  }
  function reference(state2, startLine, _endLine, silent) {
    const src = state2.src;
    let pos = state2.bMarks[startLine] + state2.tShift[startLine];
    let nextLine = startLine + 1;
    if (state2.sCount[startLine] - state2.blkIndent >= 4) return false;
    if (src.charCodeAt(pos) !== 91) return false;
    let max = lineEnd(state2, startLine);
    let rawLabel = "";
    let labelEnd = -1;
    let segmentStart = ++pos;
    while (pos < max) {
      if (rawLabel.length + pos - segmentStart > MAX_LABEL_LENGTH * 2) return false;
      let ch = src.charCodeAt(pos);
      if (ch === 91) return false;
      if (ch === 93) {
        labelEnd = pos;
        break;
      }
      if (ch === 92) ch = src.charCodeAt(++pos);
      if (ch === 10 && pos < max) {
        const nextPos = getNextLinePos(state2, nextLine);
        if (nextPos < 0) return false;
        rawLabel += src.slice(segmentStart, max);
        pos = segmentStart = nextPos;
        max = lineEnd(state2, nextLine++);
        continue;
      }
      pos++;
    }
    if (labelEnd < 0 || src.charCodeAt(labelEnd + 1) !== 58) return false;
    rawLabel += src.slice(segmentStart, labelEnd);
    if (rawLabel.length > MAX_LABEL_LENGTH && countCodePoints(rawLabel) > MAX_LABEL_LENGTH) return false;
    pos = labelEnd + 2;
    while (pos < max) {
      const ch = src.charCodeAt(pos);
      if (ch === 10) {
        const nextPos = getNextLinePos(state2, nextLine);
        if (nextPos < 0) break;
        pos = nextPos;
        max = lineEnd(state2, nextLine++);
      } else if (isSpace(ch)) pos++;
      else break;
    }
    const destRes = state2.md.helpers.parseLinkDestination(src, pos, max);
    if (!destRes.ok) return false;
    const href = state2.md.normalizeLink(destRes.str);
    if (!state2.md.validateLink(href)) return false;
    pos = destRes.pos;
    const destEndPos = pos;
    const destEndMax = max;
    const destEndLineNo = nextLine;
    while (pos < max) {
      const ch = src.charCodeAt(pos);
      if (ch === 10) {
        const nextPos = getNextLinePos(state2, nextLine);
        if (nextPos < 0) break;
        pos = nextPos;
        max = lineEnd(state2, nextLine++);
      } else if (isSpace(ch)) pos++;
      else break;
    }
    const titleStart = pos;
    let titleRes = state2.md.helpers.parseLinkTitle(src, pos, max);
    while (titleRes.can_continue) {
      const nextPos = getNextLinePos(state2, nextLine);
      if (nextPos < 0) break;
      pos = nextPos;
      max = lineEnd(state2, nextLine++);
      titleRes = state2.md.helpers.parseLinkTitle(src, pos, max, titleRes);
    }
    let title;
    if (titleStart !== destEndPos && titleRes.ok) {
      title = titleRes.str;
      pos = titleRes.pos;
    } else {
      title = "";
      pos = destEndPos;
      max = destEndMax;
      nextLine = destEndLineNo;
    }
    while (pos < max) {
      if (!isSpace(src.charCodeAt(pos))) break;
      pos++;
    }
    if (pos < max && src.charCodeAt(pos) !== 10) {
      if (title) {
        title = "";
        pos = destEndPos;
        max = destEndMax;
        nextLine = destEndLineNo;
        while (pos < max) {
          if (!isSpace(src.charCodeAt(pos))) break;
          pos++;
        }
      }
    }
    if (pos < max && src.charCodeAt(pos) !== 10) return false;
    const label = normalizeReference(rawLabel);
    if (!label) return false;
    if (silent) return true;
    if (typeof state2.env.references === "undefined") state2.env.references = {};
    if (typeof state2.env.references[label] === "undefined") state2.env.references[label] = {
      title,
      href
    };
    const token = state2.push("reference_definition", "", 0);
    token.map = [startLine, nextLine];
    token.hidden = true;
    const meta = /* @__PURE__ */ Object.create(null);
    meta.label = label;
    token.meta = meta;
    state2.line = nextLine;
    return true;
  }
  var html_blocks_default = [
    "address",
    "article",
    "aside",
    "base",
    "basefont",
    "blockquote",
    "body",
    "caption",
    "center",
    "col",
    "colgroup",
    "dd",
    "details",
    "dialog",
    "dir",
    "div",
    "dl",
    "dt",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "frame",
    "frameset",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hr",
    "html",
    "iframe",
    "legend",
    "li",
    "link",
    "main",
    "menu",
    "menuitem",
    "nav",
    "noframes",
    "ol",
    "optgroup",
    "option",
    "p",
    "param",
    "search",
    "section",
    "summary",
    "table",
    "tbody",
    "td",
    "tfoot",
    "th",
    "thead",
    "title",
    "tr",
    "track",
    "ul"
  ];
  var open_tag = `<[A-Za-z][A-Za-z0-9\\-]*(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^"'=<>\`\\x00-\\x20]+|'[^']*'|"[^"]*"))?)*\\s*\\/?>`;
  var close_tag = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>";
  new RegExp(`^(?:${open_tag}|${close_tag}|<!---?>|<!--(?:[^-]|-[^-]|--[^>])*-->|<[?][\\s\\S]*?[?]>|<![A-Za-z][^>]*>|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>)`);
  var HTML_OPEN_CLOSE_TAG_RE = new RegExp(`^(?:${open_tag}|${close_tag})`);
  var HTML_SEQUENCES = [
    [
      /^<(script|pre|style|textarea)(?=(\s|>|$))/i,
      /<\/(script|pre|style|textarea)>/i,
      true
    ],
    [
      /^<!--/,
      /-->/,
      true
    ],
    [
      /^<\?/,
      /\?>/,
      true
    ],
    [
      /^<![A-Za-z]/,
      />/,
      true
    ],
    [
      /^<!\[CDATA\[/,
      /\]\]>/,
      true
    ],
    [
      new RegExp(`^</?(${html_blocks_default.join("|")})(?=(\\s|/?>|$))`, "i"),
      /^$/,
      true
    ],
    [
      new RegExp(`${HTML_OPEN_CLOSE_TAG_RE.source}\\s*$`),
      /^$/,
      false
    ]
  ];
  function html_block(state2, startLine, endLine, silent) {
    let pos = state2.bMarks[startLine] + state2.tShift[startLine];
    let max = state2.eMarks[startLine];
    if (state2.sCount[startLine] - state2.blkIndent >= 4) return false;
    if (!state2.md.options.html) return false;
    if (state2.src.charCodeAt(pos) !== 60) return false;
    let lineText = state2.src.slice(pos, max);
    let i = 0;
    for (; i < HTML_SEQUENCES.length; i++) if (HTML_SEQUENCES[i][0].test(lineText)) break;
    if (i === HTML_SEQUENCES.length) return false;
    if (silent) return HTML_SEQUENCES[i][2];
    let nextLine = startLine + 1;
    const endsOnBlankLine = HTML_SEQUENCES[i][1].test("");
    if (!HTML_SEQUENCES[i][1].test(lineText)) for (; nextLine < endLine; nextLine++) {
      if (state2.sCount[nextLine] < state2.blkIndent) {
        if (endsOnBlankLine || !state2.isEmpty(nextLine)) break;
      }
      pos = state2.bMarks[nextLine] + state2.tShift[nextLine];
      max = state2.eMarks[nextLine];
      lineText = state2.src.slice(pos, max);
      if (HTML_SEQUENCES[i][1].test(lineText)) {
        if (lineText.length !== 0) nextLine++;
        break;
      }
    }
    state2.line = nextLine;
    const token = state2.push("html_block", "", 0);
    token.map = [startLine, nextLine];
    token.content = state2.getLines(startLine, nextLine, state2.blkIndent, true);
    return true;
  }
  function heading(state2, startLine, endLine, silent) {
    let pos = state2.bMarks[startLine] + state2.tShift[startLine];
    let max = state2.eMarks[startLine];
    if (state2.sCount[startLine] - state2.blkIndent >= 4) return false;
    let ch = state2.src.charCodeAt(pos);
    if (ch !== 35 || pos >= max) return false;
    let level = 1;
    ch = state2.src.charCodeAt(++pos);
    while (ch === 35 && pos < max && level <= 6) {
      level++;
      ch = state2.src.charCodeAt(++pos);
    }
    if (level > 6 || pos < max && !isSpace(ch)) return false;
    if (silent) return true;
    max = state2.skipSpacesBack(max, pos);
    const tmp = state2.skipCharsBack(max, 35, pos);
    if (tmp > pos && isSpace(state2.src.charCodeAt(tmp - 1))) max = tmp;
    state2.line = startLine + 1;
    const token_o = state2.push("heading_open", `h${level}`, 1);
    token_o.markup = "########".slice(0, level);
    token_o.map = [startLine, state2.line];
    const token_i = state2.push("inline", "", 0);
    token_i.content = asciiTrim(state2.src.slice(pos, max));
    token_i.map = [startLine, state2.line];
    token_i.children = [];
    const token_c = state2.push("heading_close", `h${level}`, -1);
    token_c.markup = "########".slice(0, level);
    return true;
  }
  function lheading(state2, startLine, endLine) {
    const terminatorRules = state2.md.block.ruler.getRules("paragraph");
    if (state2.sCount[startLine] - state2.blkIndent >= 4) return false;
    const oldParentType = state2.parentType;
    state2.parentType = "paragraph";
    let level = 0;
    let marker;
    let nextLine = startLine + 1;
    for (; nextLine < endLine && !state2.isEmpty(nextLine); nextLine++) {
      if (state2.sCount[nextLine] - state2.blkIndent > 3) continue;
      if (state2.sCount[nextLine] >= state2.blkIndent) {
        let pos = state2.bMarks[nextLine] + state2.tShift[nextLine];
        const max = state2.eMarks[nextLine];
        if (pos < max) {
          marker = state2.src.charCodeAt(pos);
          if (marker === 45 || marker === 61) {
            pos = state2.skipChars(pos, marker);
            pos = state2.skipSpaces(pos);
            if (pos >= max) {
              level = marker === 61 ? 1 : 2;
              break;
            }
          }
        }
      }
      if (state2.sCount[nextLine] < 0) continue;
      let terminate = false;
      for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state2, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
      if (terminate) break;
    }
    if (!level) {
      state2.parentType = oldParentType;
      return false;
    }
    const content = asciiTrim(state2.getLines(startLine, nextLine, state2.blkIndent, false));
    state2.line = nextLine + 1;
    const token_o = state2.push("heading_open", `h${level}`, 1);
    token_o.markup = String.fromCharCode(marker);
    token_o.map = [startLine, state2.line];
    const token_i = state2.push("inline", "", 0);
    token_i.content = content;
    token_i.map = [startLine, state2.line - 1];
    token_i.children = [];
    const token_c = state2.push("heading_close", `h${level}`, -1);
    token_c.markup = String.fromCharCode(marker);
    state2.parentType = oldParentType;
    return true;
  }
  function paragraph(state2, startLine, endLine) {
    const terminatorRules = state2.md.block.ruler.getRules("paragraph");
    const oldParentType = state2.parentType;
    let nextLine = startLine + 1;
    state2.parentType = "paragraph";
    for (; nextLine < endLine && !state2.isEmpty(nextLine); nextLine++) {
      if (state2.sCount[nextLine] - state2.blkIndent > 3) continue;
      if (state2.sCount[nextLine] < 0) continue;
      let terminate = false;
      for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state2, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
      if (terminate) break;
    }
    const content = asciiTrim(state2.getLines(startLine, nextLine, state2.blkIndent, false));
    state2.line = nextLine;
    const token_o = state2.push("paragraph_open", "p", 1);
    token_o.map = [startLine, state2.line];
    const token_i = state2.push("inline", "", 0);
    token_i.content = content;
    token_i.map = [startLine, state2.line];
    token_i.children = [];
    state2.push("paragraph_close", "p", -1);
    state2.parentType = oldParentType;
    return true;
  }
  var _rules$1 = [
    [
      "table",
      table,
      ["paragraph", "reference"]
    ],
    ["code", code],
    [
      "fence",
      fence,
      [
        "paragraph",
        "reference",
        "blockquote",
        "list"
      ]
    ],
    [
      "blockquote",
      blockquote,
      [
        "paragraph",
        "reference",
        "blockquote",
        "list"
      ]
    ],
    [
      "hr",
      hr,
      [
        "paragraph",
        "reference",
        "blockquote",
        "list"
      ]
    ],
    [
      "list",
      list,
      [
        "paragraph",
        "reference",
        "blockquote"
      ]
    ],
    ["reference", reference],
    [
      "html_block",
      html_block,
      [
        "paragraph",
        "reference",
        "blockquote"
      ]
    ],
    [
      "heading",
      heading,
      [
        "paragraph",
        "reference",
        "blockquote"
      ]
    ],
    ["lheading", lheading],
    ["paragraph", paragraph]
  ];
  var ParserBlock = class {
    constructor() {
      _defineProperty(
        this,
        /**
        * {@link Ruler} instance. Keep configuration of block rules.
        */
        "ruler",
        new Ruler()
      );
      _defineProperty(this, "State", StateBlock);
      for (let i = 0; i < _rules$1.length; i++) this.ruler.push(_rules$1[i][0], _rules$1[i][1], { alt: (_rules$1[i][2] || []).slice() });
    }
    tokenize(state2, startLine, endLine) {
      const rules = this.ruler.getRules("");
      const len = rules.length;
      const maxNesting = state2.md.options.maxNesting;
      let line = startLine;
      let hasEmptyLines = false;
      while (line < endLine) {
        state2.line = line = state2.skipEmptyLines(line);
        if (line >= endLine) break;
        if (state2.sCount[line] < state2.blkIndent) break;
        if (state2.level >= maxNesting) {
          state2.line = endLine;
          break;
        }
        const prevLine = state2.line;
        let ok = false;
        for (let i = 0; i < len; i++) {
          ok = rules[i](state2, line, endLine, false);
          if (ok) {
            if (prevLine >= state2.line) throw new Error("block rule didn't increment state.line");
            break;
          }
        }
        if (!ok) throw new Error("none of the block rules matched");
        state2.tight = !hasEmptyLines;
        if (state2.isEmpty(state2.line - 1)) hasEmptyLines = true;
        line = state2.line;
        if (line < endLine && state2.isEmpty(line)) {
          hasEmptyLines = true;
          line++;
          state2.line = line;
        }
      }
    }
    /**
    * Process input string and push block tokens into `outTokens`
    */
    parse(src, md2, env, outTokens) {
      if (!src) return;
      const state2 = new this.State(src, md2, env, outTokens);
      this.tokenize(state2, state2.line, state2.lineMax);
    }
  };
  var StateInline = class {
    constructor(src, md2, env, outTokens) {
      _defineProperty(this, "pos", 0);
      _defineProperty(this, "level", 0);
      _defineProperty(this, "pending", "");
      _defineProperty(this, "pendingLevel", 0);
      _defineProperty(this, "cache", {});
      _defineProperty(this, "backticks", {});
      _defineProperty(this, "backticksScanned", false);
      _defineProperty(this, "skipHtmlSpecial", false);
      _defineProperty(this, "linkLevel", 0);
      _defineProperty(this, "delimiters", []);
      _defineProperty(this, "_prev_delimiters", []);
      _defineProperty(this, "Token", Token);
      this.src = src;
      this.env = env;
      this.md = md2;
      this.tokens = outTokens;
      this.tokens_meta = Array(outTokens.length);
      this.posMax = this.src.length;
    }
    pushPending() {
      const token = new Token("text", "", 0);
      token.content = this.pending;
      token.level = this.pendingLevel;
      this.tokens.push(token);
      this.pending = "";
      return token;
    }
    push(type, tag, nesting) {
      if (this.pending) this.pushPending();
      const token = new Token(type, tag, nesting);
      let token_meta = void 0;
      if (nesting < 0) {
        this.level--;
        this.delimiters = this._prev_delimiters.pop();
      }
      token.level = this.level;
      if (nesting > 0) {
        this.level++;
        this._prev_delimiters.push(this.delimiters);
        this.delimiters = [];
        token_meta = { delimiters: this.delimiters };
      }
      this.pendingLevel = this.level;
      this.tokens.push(token);
      this.tokens_meta.push(token_meta);
      return token;
    }
    scanDelims(start, canSplitWord) {
      const max = this.posMax;
      const marker = this.src.charCodeAt(start);
      let lastChar;
      if (start === 0) lastChar = 32;
      else if (start === 1) {
        lastChar = this.src.charCodeAt(0);
        if ((lastChar & 63488) === 55296) lastChar = 65533;
      } else {
        lastChar = this.src.charCodeAt(start - 1);
        if ((lastChar & 64512) === 56320) {
          const highSurr = this.src.charCodeAt(start - 2);
          lastChar = (highSurr & 64512) === 55296 ? 65536 + (highSurr - 55296 << 10) + (lastChar - 56320) : 65533;
        } else if ((lastChar & 64512) === 55296) lastChar = 65533;
      }
      let pos = start;
      while (pos < max && this.src.charCodeAt(pos) === marker) pos++;
      const count = pos - start;
      let nextChar = pos < max ? this.src.charCodeAt(pos) : 32;
      if ((nextChar & 64512) === 55296) {
        const lowSurr = this.src.charCodeAt(pos + 1);
        nextChar = (lowSurr & 64512) === 56320 ? 65536 + (nextChar - 55296 << 10) + (lowSurr - 56320) : 65533;
      } else if ((nextChar & 64512) === 56320) nextChar = 65533;
      const isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctCharCode(lastChar);
      const isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctCharCode(nextChar);
      const isLastWhiteSpace = isWhiteSpace(lastChar);
      const isNextWhiteSpace = isWhiteSpace(nextChar);
      const left_flanking = !isNextWhiteSpace && (!isNextPunctChar || isLastWhiteSpace || isLastPunctChar);
      const right_flanking = !isLastWhiteSpace && (!isLastPunctChar || isNextWhiteSpace || isNextPunctChar);
      return {
        can_open: left_flanking && (canSplitWord || !right_flanking || isLastPunctChar),
        can_close: right_flanking && (canSplitWord || !left_flanking || isNextPunctChar),
        length: count
      };
    }
  };
  function isTerminatorChar(ch) {
    switch (ch) {
      case 10:
      case 33:
      case 35:
      case 36:
      case 37:
      case 38:
      case 42:
      case 43:
      case 45:
      case 58:
      case 60:
      case 61:
      case 62:
      case 64:
      case 91:
      case 92:
      case 93:
      case 94:
      case 95:
      case 96:
      case 123:
      case 125:
      case 126:
        return true;
      default:
        return false;
    }
  }
  function text(state2, silent) {
    let pos = state2.pos;
    while (pos < state2.posMax && !isTerminatorChar(state2.src.charCodeAt(pos))) pos++;
    if (pos === state2.pos) return false;
    if (!silent) state2.pending += state2.src.slice(state2.pos, pos);
    state2.pos = pos;
    return true;
  }
  function isAsciiAlpha(code2) {
    return code2 >= 65 && code2 <= 90 || code2 >= 97 && code2 <= 122;
  }
  function isSchemeChar(code2) {
    return code2 >= 65 && code2 <= 90 || code2 >= 97 && code2 <= 122 || code2 >= 48 && code2 <= 57 || code2 === 43 || code2 === 45 || code2 === 46;
  }
  function linkify(state2, silent) {
    if (!state2.md.options.linkify) return false;
    if (state2.linkLevel > 0) return false;
    const pos = state2.pos;
    const max = state2.posMax;
    if (pos + 3 > max) return false;
    if (state2.src.charCodeAt(pos) !== 58) return false;
    if (state2.src.charCodeAt(pos + 1) !== 47) return false;
    if (state2.src.charCodeAt(pos + 2) !== 47) return false;
    const protoMin = pos - Math.min(10, state2.pending.length, pos);
    let protoStart = pos;
    while (protoStart > protoMin && isSchemeChar(state2.src.charCodeAt(protoStart - 1))) protoStart--;
    if (protoStart === pos || !isAsciiAlpha(state2.src.charCodeAt(protoStart))) return false;
    const protoLength = pos - protoStart;
    const link2 = state2.md.linkify.matchAtStart(state2.src.slice(protoStart));
    if (!link2) return false;
    let url = link2.url;
    if (url.length <= protoLength) return false;
    let urlEnd = url.length;
    while (urlEnd > 0 && url.charCodeAt(urlEnd - 1) === 42) urlEnd--;
    if (urlEnd !== url.length) url = url.slice(0, urlEnd);
    const fullUrl = state2.md.normalizeLink(url);
    if (!state2.md.validateLink(fullUrl)) return false;
    if (!silent) {
      state2.pending = state2.pending.slice(0, -protoLength);
      const token_o = state2.push("link_open", "a", 1);
      token_o.attrs = [["href", fullUrl]];
      token_o.markup = "linkify";
      token_o.info = "auto";
      const token_t = state2.push("text", "", 0);
      token_t.content = state2.md.normalizeLinkText(url);
      const token_c = state2.push("link_close", "a", -1);
      token_c.markup = "linkify";
      token_c.info = "auto";
    }
    state2.pos += url.length - protoLength;
    return true;
  }
  function newline(state2, silent) {
    let pos = state2.pos;
    if (state2.src.charCodeAt(pos) !== 10) return false;
    const pmax = state2.pending.length - 1;
    const max = state2.posMax;
    if (!silent) {
      if (pmax >= 0 && state2.pending.charCodeAt(pmax) === 32) {
        if (pmax >= 1 && state2.pending.charCodeAt(pmax - 1) === 32) {
          let ws = pmax - 1;
          while (ws >= 1 && state2.pending.charCodeAt(ws - 1) === 32) ws--;
          state2.pending = state2.pending.slice(0, ws);
          state2.push("hardbreak", "br", 0);
        } else {
          state2.pending = state2.pending.slice(0, -1);
          state2.push("softbreak", "br", 0);
        }
      } else state2.push("softbreak", "br", 0);
    }
    pos++;
    while (pos < max && isSpace(state2.src.charCodeAt(pos))) pos++;
    state2.pos = pos;
    return true;
  }
  var ESCAPED = [];
  for (let i = 0; i < 256; i++) ESCAPED.push(0);
  "\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(ch) {
    ESCAPED[ch.charCodeAt(0)] = 1;
  });
  function escape(state2, silent) {
    let pos = state2.pos;
    const max = state2.posMax;
    if (state2.src.charCodeAt(pos) !== 92) return false;
    pos++;
    if (pos >= max) return false;
    let ch1 = state2.src.charCodeAt(pos);
    if (ch1 === 10) {
      if (!silent) state2.push("hardbreak", "br", 0);
      pos++;
      while (pos < max) {
        ch1 = state2.src.charCodeAt(pos);
        if (!isSpace(ch1)) break;
        pos++;
      }
      state2.pos = pos;
      return true;
    }
    if (ch1 === 32) {
      if (!silent) {
        const token = state2.push("text_special", "", 0);
        token.content = "\\";
        token.markup = "\\";
        token.info = "escape";
      }
      state2.pos = pos;
      return true;
    }
    let escapedStr = state2.src[pos];
    if (ch1 >= 55296 && ch1 <= 56319 && pos + 1 < max) {
      const ch2 = state2.src.charCodeAt(pos + 1);
      if (ch2 >= 56320 && ch2 <= 57343) {
        escapedStr += state2.src[pos + 1];
        pos++;
      }
    }
    const origStr = "\\" + escapedStr;
    if (!silent) {
      const token = state2.push("text_special", "", 0);
      if (ch1 < 256 && ESCAPED[ch1] !== 0) token.content = escapedStr;
      else token.content = origStr;
      token.markup = origStr;
      token.info = "escape";
    }
    state2.pos = pos + 1;
    return true;
  }
  function buildLastRuns(src) {
    const lastRuns = {};
    let pos = 0;
    while ((pos = src.indexOf("`", pos)) !== -1) {
      const start = pos;
      while (src.charCodeAt(++pos) === 96) ;
      lastRuns[pos - start] = start;
    }
    return lastRuns;
  }
  function backtick(state2, silent) {
    var _state$backticks$open;
    const start = state2.pos;
    if (state2.src.charCodeAt(start) !== 96) return false;
    const max = state2.posMax;
    let pos = start + 1;
    while (pos < max && state2.src.charCodeAt(pos) === 96) pos++;
    const marker = state2.src.slice(start, pos);
    const openerLength = marker.length;
    if (!state2.backticksScanned) {
      state2.backticks = buildLastRuns(state2.src);
      state2.backticksScanned = true;
    }
    if (((_state$backticks$open = state2.backticks[openerLength]) !== null && _state$backticks$open !== void 0 ? _state$backticks$open : -1) >= pos) {
      let matchEnd = pos;
      let matchStart;
      while ((matchStart = state2.src.indexOf("`", matchEnd)) !== -1 && matchStart < max) {
        matchEnd = matchStart + 1;
        while (state2.src.charCodeAt(matchEnd) === 96) matchEnd++;
        if (matchEnd > max) break;
        if (matchEnd - matchStart === openerLength) {
          if (!silent) {
            const token = state2.push("code_inline", "code", 0);
            token.markup = marker;
            let content = state2.src.slice(pos, matchStart).replace(/\n/g, " ");
            if (content.startsWith(" ") && content.endsWith(" ") && /[^ ]/.test(content)) content = content.slice(1, -1);
            token.content = content;
          }
          state2.pos = matchEnd;
          return true;
        }
      }
    }
    if (!silent) state2.pending += marker;
    state2.pos = pos;
    return true;
  }
  function strikethrough_tokenize(state2, silent) {
    const start = state2.pos;
    const marker = state2.src.charCodeAt(start);
    if (silent) return false;
    if (marker !== 126) return false;
    const scanned = state2.scanDelims(state2.pos, true);
    let len = scanned.length;
    const ch = String.fromCharCode(marker);
    if (len < 2) return false;
    let token;
    if (len % 2) {
      token = state2.push("text", "", 0);
      token.content = ch;
      len--;
    }
    for (let i = 0; i < len; i += 2) {
      token = state2.push("text", "", 0);
      token.content = ch + ch;
      state2.delimiters.push({
        marker,
        length: 0,
        token: state2.tokens.length - 1,
        end: -1,
        open: scanned.can_open,
        close: scanned.can_close
      });
    }
    state2.pos += scanned.length;
    return true;
  }
  function postProcess$1(state2, delimiters) {
    let token;
    const loneMarkers = [];
    const max = delimiters.length;
    for (let i = 0; i < max; i++) {
      const startDelim = delimiters[i];
      if (startDelim.marker !== 126) continue;
      if (startDelim.end === -1) continue;
      const endDelim = delimiters[startDelim.end];
      token = state2.tokens[startDelim.token];
      token.type = "s_open";
      token.tag = "s";
      token.nesting = 1;
      token.markup = "~~";
      token.content = "";
      token = state2.tokens[endDelim.token];
      token.type = "s_close";
      token.tag = "s";
      token.nesting = -1;
      token.markup = "~~";
      token.content = "";
      if (state2.tokens[endDelim.token - 1].type === "text" && state2.tokens[endDelim.token - 1].content === "~") loneMarkers.push(endDelim.token - 1);
    }
    while (loneMarkers.length) {
      const i = loneMarkers.pop();
      let j = i + 1;
      while (j < state2.tokens.length && state2.tokens[j].type === "s_close") j++;
      j--;
      if (i !== j) {
        token = state2.tokens[j];
        state2.tokens[j] = state2.tokens[i];
        state2.tokens[i] = token;
      }
    }
  }
  function strikethrough_postProcess(state2) {
    const tokens_meta = state2.tokens_meta;
    const max = state2.tokens_meta.length;
    postProcess$1(state2, state2.delimiters);
    for (let curr = 0; curr < max; curr++) {
      var _tokens_meta$curr;
      const delimiters = (_tokens_meta$curr = tokens_meta[curr]) === null || _tokens_meta$curr === void 0 ? void 0 : _tokens_meta$curr.delimiters;
      if (delimiters) postProcess$1(state2, delimiters);
    }
  }
  var strikethrough_default = {
    tokenize: strikethrough_tokenize,
    postProcess: strikethrough_postProcess
  };
  function emphasis_tokenize(state2, silent) {
    const start = state2.pos;
    const marker = state2.src.charCodeAt(start);
    if (silent) return false;
    if (marker !== 95 && marker !== 42) return false;
    const scanned = state2.scanDelims(state2.pos, marker === 42);
    for (let i = 0; i < scanned.length; i++) {
      const token = state2.push("text", "", 0);
      token.content = String.fromCharCode(marker);
      state2.delimiters.push({
        marker,
        length: scanned.length,
        token: state2.tokens.length - 1,
        end: -1,
        open: scanned.can_open,
        close: scanned.can_close
      });
    }
    state2.pos += scanned.length;
    return true;
  }
  function postProcess(state2, delimiters) {
    const max = delimiters.length;
    for (let i = max - 1; i >= 0; i--) {
      const startDelim = delimiters[i];
      if (startDelim.marker !== 95 && startDelim.marker !== 42) continue;
      if (startDelim.end === -1) continue;
      const endDelim = delimiters[startDelim.end];
      const isStrong = i > 0 && delimiters[i - 1].end === startDelim.end + 1 && delimiters[i - 1].marker === startDelim.marker && delimiters[i - 1].token === startDelim.token - 1 && delimiters[startDelim.end + 1].token === endDelim.token + 1;
      const ch = String.fromCharCode(startDelim.marker);
      const token_o = state2.tokens[startDelim.token];
      token_o.type = isStrong ? "strong_open" : "em_open";
      token_o.tag = isStrong ? "strong" : "em";
      token_o.nesting = 1;
      token_o.markup = isStrong ? ch + ch : ch;
      token_o.content = "";
      const token_c = state2.tokens[endDelim.token];
      token_c.type = isStrong ? "strong_close" : "em_close";
      token_c.tag = isStrong ? "strong" : "em";
      token_c.nesting = -1;
      token_c.markup = isStrong ? ch + ch : ch;
      token_c.content = "";
      if (isStrong) {
        state2.tokens[delimiters[i - 1].token].content = "";
        state2.tokens[delimiters[startDelim.end + 1].token].content = "";
        i--;
      }
    }
  }
  function emphasis_post_process(state2) {
    const tokens_meta = state2.tokens_meta;
    const max = state2.tokens_meta.length;
    postProcess(state2, state2.delimiters);
    for (let curr = 0; curr < max; curr++) {
      var _tokens_meta$curr;
      const delimiters = (_tokens_meta$curr = tokens_meta[curr]) === null || _tokens_meta$curr === void 0 ? void 0 : _tokens_meta$curr.delimiters;
      if (delimiters) postProcess(state2, delimiters);
    }
  }
  var emphasis_default = {
    tokenize: emphasis_tokenize,
    postProcess: emphasis_post_process
  };
  function link(state2, silent) {
    let code2, label, res, ref;
    let href = "";
    let title = "";
    let start = state2.pos;
    let parseReference = true;
    if (state2.src.charCodeAt(state2.pos) !== 91) return false;
    const oldPos = state2.pos;
    const max = state2.posMax;
    const labelStart = state2.pos + 1;
    const labelEnd = state2.md.helpers.parseLinkLabel(state2, state2.pos, true);
    if (labelEnd < 0) return false;
    let pos = labelEnd + 1;
    if (pos < max && state2.src.charCodeAt(pos) === 40) {
      parseReference = false;
      pos++;
      for (; pos < max; pos++) {
        code2 = state2.src.charCodeAt(pos);
        if (!isSpace(code2) && code2 !== 10) break;
      }
      if (pos >= max) return false;
      start = pos;
      res = state2.md.helpers.parseLinkDestination(state2.src, pos, state2.posMax);
      if (res.ok) {
        href = state2.md.normalizeLink(res.str);
        if (state2.md.validateLink(href)) pos = res.pos;
        else href = "";
        start = pos;
        for (; pos < max; pos++) {
          code2 = state2.src.charCodeAt(pos);
          if (!isSpace(code2) && code2 !== 10) break;
        }
        res = state2.md.helpers.parseLinkTitle(state2.src, pos, state2.posMax);
        if (pos < max && start !== pos && res.ok) {
          title = res.str;
          pos = res.pos;
          for (; pos < max; pos++) {
            code2 = state2.src.charCodeAt(pos);
            if (!isSpace(code2) && code2 !== 10) break;
          }
        }
      }
      if (pos >= max || state2.src.charCodeAt(pos) !== 41) parseReference = true;
      pos++;
    }
    if (parseReference) {
      if (typeof state2.env.references === "undefined") return false;
      if (pos < max && state2.src.charCodeAt(pos) === 91) {
        start = pos + 1;
        pos = state2.md.helpers.parseLinkLabel(state2, pos);
        if (pos >= 0) label = state2.src.slice(start, pos++);
        else pos = labelEnd + 1;
      } else pos = labelEnd + 1;
      if (!label) label = state2.src.slice(labelStart, labelEnd);
      label = normalizeReference(label);
      ref = state2.env.references[label];
      if (!ref) {
        state2.pos = oldPos;
        return false;
      }
      href = ref.href;
      title = ref.title;
    }
    if (!silent) {
      state2.pos = labelStart;
      state2.posMax = labelEnd;
      const token_o = state2.push("link_open", "a", 1);
      const attrs = [["href", href]];
      token_o.attrs = attrs;
      if (title) attrs.push(["title", title]);
      if (label) {
        const meta = /* @__PURE__ */ Object.create(null);
        meta.label = label;
        token_o.meta = meta;
      }
      state2.linkLevel++;
      state2.md.inline.tokenize(state2);
      state2.linkLevel--;
      state2.push("link_close", "a", -1);
    }
    state2.pos = pos;
    state2.posMax = max;
    return true;
  }
  function image(state2, silent) {
    let code2, content, label, pos, ref, res, title, start;
    let href = "";
    const oldPos = state2.pos;
    const max = state2.posMax;
    if (state2.src.charCodeAt(state2.pos) !== 33) return false;
    if (state2.src.charCodeAt(state2.pos + 1) !== 91) return false;
    const labelStart = state2.pos + 2;
    const labelEnd = state2.md.helpers.parseLinkLabel(state2, state2.pos + 1, false);
    if (labelEnd < 0) return false;
    pos = labelEnd + 1;
    if (pos < max && state2.src.charCodeAt(pos) === 40) {
      pos++;
      for (; pos < max; pos++) {
        code2 = state2.src.charCodeAt(pos);
        if (!isSpace(code2) && code2 !== 10) break;
      }
      if (pos >= max) return false;
      start = pos;
      res = state2.md.helpers.parseLinkDestination(state2.src, pos, state2.posMax);
      if (res.ok) {
        href = state2.md.normalizeLink(res.str);
        if (state2.md.validateLink(href)) pos = res.pos;
        else href = "";
      }
      start = pos;
      for (; pos < max; pos++) {
        code2 = state2.src.charCodeAt(pos);
        if (!isSpace(code2) && code2 !== 10) break;
      }
      res = state2.md.helpers.parseLinkTitle(state2.src, pos, state2.posMax);
      if (pos < max && start !== pos && res.ok) {
        title = res.str;
        pos = res.pos;
        for (; pos < max; pos++) {
          code2 = state2.src.charCodeAt(pos);
          if (!isSpace(code2) && code2 !== 10) break;
        }
      } else title = "";
      if (pos >= max || state2.src.charCodeAt(pos) !== 41) {
        state2.pos = oldPos;
        return false;
      }
      pos++;
    } else {
      if (typeof state2.env.references === "undefined") return false;
      if (pos < max && state2.src.charCodeAt(pos) === 91) {
        start = pos + 1;
        pos = state2.md.helpers.parseLinkLabel(state2, pos);
        if (pos >= 0) label = state2.src.slice(start, pos++);
        else pos = labelEnd + 1;
      } else pos = labelEnd + 1;
      if (!label) label = state2.src.slice(labelStart, labelEnd);
      label = normalizeReference(label);
      ref = state2.env.references[label];
      if (!ref) {
        state2.pos = oldPos;
        return false;
      }
      href = ref.href;
      title = ref.title;
    }
    if (!silent) {
      content = state2.src.slice(labelStart, labelEnd);
      const tokens = [];
      state2.md.inline.parse(content, state2.md, state2.env, tokens);
      const token = state2.push("image", "img", 0);
      const attrs = [["src", href], ["alt", ""]];
      token.attrs = attrs;
      token.children = tokens;
      token.content = content;
      if (title) attrs.push(["title", title]);
      if (label) {
        const meta = /* @__PURE__ */ Object.create(null);
        meta.label = label;
        token.meta = meta;
      }
    }
    state2.pos = pos;
    state2.posMax = max;
    return true;
  }
  var EMAIL_RE = /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/;
  var AUTOLINK_RE = /^([a-zA-Z][a-zA-Z0-9+.-]{1,31}):([^<>\x00-\x20]*)$/;
  function autolink(state2, silent) {
    let pos = state2.pos;
    if (state2.src.charCodeAt(pos) !== 60) return false;
    const start = state2.pos;
    const max = state2.posMax;
    for (; ; ) {
      if (++pos >= max) return false;
      const ch = state2.src.charCodeAt(pos);
      if (ch === 60) return false;
      if (ch === 62) break;
    }
    const url = state2.src.slice(start + 1, pos);
    if (AUTOLINK_RE.test(url)) {
      const fullUrl = state2.md.normalizeLink(url);
      if (!state2.md.validateLink(fullUrl)) return false;
      if (!silent) {
        const token_o = state2.push("link_open", "a", 1);
        token_o.attrs = [["href", fullUrl]];
        token_o.markup = "autolink";
        token_o.info = "auto";
        const token_t = state2.push("text", "", 0);
        token_t.content = state2.md.normalizeLinkText(url);
        const token_c = state2.push("link_close", "a", -1);
        token_c.markup = "autolink";
        token_c.info = "auto";
      }
      state2.pos += url.length + 2;
      return true;
    }
    if (EMAIL_RE.test(url)) {
      const fullUrl = state2.md.normalizeLink(`mailto:${url}`);
      if (!state2.md.validateLink(fullUrl)) return false;
      if (!silent) {
        const token_o = state2.push("link_open", "a", 1);
        token_o.attrs = [["href", fullUrl]];
        token_o.markup = "autolink";
        token_o.info = "auto";
        const token_t = state2.push("text", "", 0);
        token_t.content = state2.md.normalizeLinkText(url);
        const token_c = state2.push("link_close", "a", -1);
        token_c.markup = "autolink";
        token_c.info = "auto";
      }
      state2.pos += url.length + 2;
      return true;
    }
    return false;
  }
  function isLinkOpen(str) {
    return /^<a[>\s]/i.test(str);
  }
  function isLinkClose(str) {
    return /^<\/a\s*>/i.test(str);
  }
  function isLetter(ch) {
    const lc = ch | 32;
    return lc >= 97 && lc <= 122;
  }
  function scanSpecial(state2, pos) {
    const src = state2.src;
    let start;
    let terminator;
    if (src.startsWith("<!--", pos)) {
      if (src.startsWith(">", pos + 4)) return pos + 5;
      if (src.startsWith("->", pos + 4)) return pos + 6;
      start = pos + 4;
      terminator = "-->";
    } else if (src.startsWith("<![CDATA[", pos)) {
      start = pos + 9;
      terminator = "]]>";
    } else if (src.charCodeAt(pos + 1) === 63) {
      start = pos + 2;
      terminator = "?>";
    } else if (isLetter(src.charCodeAt(pos + 2))) {
      start = pos + 3;
      terminator = ">";
    } else return -1;
    if (state2.skipHtmlSpecial) return -1;
    const end = src.indexOf(terminator, start);
    if (end < 0) {
      state2.skipHtmlSpecial = true;
      return -1;
    }
    return end + terminator.length;
  }
  function html_inline(state2, silent) {
    if (!state2.md.options.html) return false;
    const max = state2.posMax;
    const pos = state2.pos;
    if (state2.src.charCodeAt(pos) !== 60 || pos + 2 >= max) return false;
    let end;
    const ch = state2.src.charCodeAt(pos + 1);
    if (ch === 33 || ch === 63) end = scanSpecial(state2, pos);
    else if (ch === 47 || isLetter(ch)) {
      const match = state2.src.slice(pos).match(HTML_OPEN_CLOSE_TAG_RE);
      end = match ? pos + match[0].length : -1;
    } else return false;
    if (end < 0) return false;
    if (!silent) {
      const token = state2.push("html_inline", "", 0);
      token.content = state2.src.slice(pos, end);
      if (isLinkOpen(token.content)) state2.linkLevel++;
      if (isLinkClose(token.content)) state2.linkLevel--;
    }
    state2.pos = end;
    return true;
  }
  var DIGITAL_RE = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i;
  var NAMED_RE = /^&([a-z][a-z0-9]{1,31});/i;
  function entity(state2, silent) {
    const pos = state2.pos;
    const max = state2.posMax;
    if (state2.src.charCodeAt(pos) !== 38) return false;
    if (pos + 1 >= max) return false;
    if (state2.src.charCodeAt(pos + 1) === 35) {
      const match = state2.src.slice(pos).match(DIGITAL_RE);
      if (match) {
        if (!silent) {
          const code2 = match[1][0].toLowerCase() === "x" ? parseInt(match[1].slice(1), 16) : parseInt(match[1], 10);
          const token = state2.push("text_special", "", 0);
          token.content = isValidEntityCode(code2) ? fromCodePoint(code2) : fromCodePoint(65533);
          token.markup = match[0];
          token.info = "entity";
        }
        state2.pos += match[0].length;
        return true;
      }
    } else {
      const match = state2.src.slice(pos).match(NAMED_RE);
      if (match) {
        const decoded = decodeHTMLStrict(match[0]);
        if (decoded !== match[0]) {
          if (!silent) {
            const token = state2.push("text_special", "", 0);
            token.content = decoded;
            token.markup = match[0];
            token.info = "entity";
          }
          state2.pos += match[0].length;
          return true;
        }
      }
    }
    return false;
  }
  function processDelimiters(delimiters) {
    const openersBottom = {};
    const max = delimiters.length;
    if (!max) return;
    let headerIdx = 0;
    let lastTokenIdx = -2;
    const jumps = [];
    for (let closerIdx = 0; closerIdx < max; closerIdx++) {
      const closer = delimiters[closerIdx];
      jumps.push(0);
      if (delimiters[headerIdx].marker !== closer.marker || lastTokenIdx !== closer.token - 1) headerIdx = closerIdx;
      lastTokenIdx = closer.token;
      closer.length = closer.length || 0;
      if (!closer.close) continue;
      if (!openersBottom.hasOwnProperty(closer.marker)) openersBottom[closer.marker] = [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ];
      const minOpenerIdx = openersBottom[closer.marker][(closer.open ? 3 : 0) + closer.length % 3];
      let openerIdx = headerIdx - jumps[headerIdx] - 1;
      let newMinOpenerIdx = openerIdx;
      for (; openerIdx > minOpenerIdx; openerIdx -= jumps[openerIdx] + 1) {
        const opener = delimiters[openerIdx];
        if (opener.marker !== closer.marker) continue;
        if (opener.open && opener.end < 0) {
          let isOddMatch = false;
          if (opener.close || closer.open) {
            if ((opener.length + closer.length) % 3 === 0) {
              if (opener.length % 3 !== 0 || closer.length % 3 !== 0) isOddMatch = true;
            }
          }
          if (!isOddMatch) {
            const lastJump = openerIdx > 0 && !delimiters[openerIdx - 1].open ? jumps[openerIdx - 1] + 1 : 0;
            jumps[closerIdx] = closerIdx - openerIdx + lastJump;
            jumps[openerIdx] = lastJump;
            closer.open = false;
            opener.end = closerIdx;
            opener.close = false;
            newMinOpenerIdx = -1;
            lastTokenIdx = -2;
            break;
          }
        }
      }
      if (newMinOpenerIdx !== -1) openersBottom[closer.marker][(closer.open ? 3 : 0) + (closer.length || 0) % 3] = newMinOpenerIdx;
    }
  }
  function link_pairs(state2) {
    const tokens_meta = state2.tokens_meta;
    const max = state2.tokens_meta.length;
    processDelimiters(state2.delimiters);
    for (let curr = 0; curr < max; curr++) {
      var _tokens_meta$curr;
      const delimiters = (_tokens_meta$curr = tokens_meta[curr]) === null || _tokens_meta$curr === void 0 ? void 0 : _tokens_meta$curr.delimiters;
      if (delimiters) processDelimiters(delimiters);
    }
  }
  function fragments_join(state2) {
    let curr, last;
    let level = 0;
    const tokens = state2.tokens;
    const max = state2.tokens.length;
    for (curr = last = 0; curr < max; curr++) {
      if (tokens[curr].nesting < 0) level--;
      tokens[curr].level = level;
      if (tokens[curr].nesting > 0) level++;
      if (tokens[curr].type === "text" && curr + 1 < max && tokens[curr + 1].type === "text") tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
      else {
        if (curr !== last) tokens[last] = tokens[curr];
        last++;
      }
    }
    if (curr !== last) tokens.length = last;
  }
  var _rules = [
    ["text", text],
    ["linkify", linkify],
    ["newline", newline],
    ["escape", escape],
    ["backticks", backtick],
    ["strikethrough", strikethrough_default.tokenize],
    ["emphasis", emphasis_default.tokenize],
    ["link", link],
    ["image", image],
    ["autolink", autolink],
    ["html_inline", html_inline],
    ["entity", entity]
  ];
  var _rules2 = [
    ["balance_pairs", link_pairs],
    ["strikethrough", strikethrough_default.postProcess],
    ["emphasis", emphasis_default.postProcess],
    ["fragments_join", fragments_join]
  ];
  var ParserInline = class {
    constructor() {
      _defineProperty(
        this,
        /**
        * {@link Ruler} instance. Keep configuration of inline rules.
        */
        "ruler",
        new Ruler()
      );
      _defineProperty(
        this,
        /**
        * {@link Ruler} instance. Second ruler used for post-processing
        * (e.g. in emphasis-like rules).
        */
        "ruler2",
        new Ruler()
      );
      _defineProperty(this, "State", StateInline);
      for (let i = 0; i < _rules.length; i++) this.ruler.push(_rules[i][0], _rules[i][1]);
      for (let i = 0; i < _rules2.length; i++) this.ruler2.push(_rules2[i][0], _rules2[i][1]);
    }
    skipToken(state2) {
      const pos = state2.pos;
      const rules = this.ruler.getRules("");
      const len = rules.length;
      const maxNesting = state2.md.options.maxNesting;
      const cache = state2.cache;
      if (typeof cache[pos] !== "undefined") {
        state2.pos = cache[pos];
        return;
      }
      let ok = false;
      if (state2.level < maxNesting) for (let i = 0; i < len; i++) {
        state2.level++;
        ok = rules[i](state2, true);
        state2.level--;
        if (ok) {
          if (pos >= state2.pos) throw new Error("inline rule didn't increment state.pos");
          break;
        }
      }
      else state2.pos = state2.posMax;
      if (!ok) state2.pos++;
      cache[pos] = state2.pos;
    }
    tokenize(state2) {
      const rules = this.ruler.getRules("");
      const len = rules.length;
      const end = state2.posMax;
      const maxNesting = state2.md.options.maxNesting;
      while (state2.pos < end) {
        const prevPos = state2.pos;
        let ok = false;
        if (state2.level < maxNesting) for (let i = 0; i < len; i++) {
          ok = rules[i](state2, false);
          if (ok) {
            if (prevPos >= state2.pos) throw new Error("inline rule didn't increment state.pos");
            break;
          }
        }
        if (ok) {
          if (state2.pos >= end) break;
          continue;
        }
        state2.pending += state2.src[state2.pos++];
      }
      if (state2.pending) state2.pushPending();
    }
    /**
    * Process input string and push inline tokens into `outTokens`
    */
    parse(str, md2, env, outTokens) {
      const state2 = new this.State(str, md2, env, outTokens);
      this.tokenize(state2);
      const rules = this.ruler2.getRules("");
      const len = rules.length;
      for (let i = 0; i < len; i++) rules[i](state2);
    }
  };
  var config = {
    default: {
      options: {
        html: false,
        xhtmlOut: false,
        breaks: false,
        langPrefix: "language-",
        linkify: false,
        typographer: false,
        quotes: "\u201C\u201D\u2018\u2019",
        highlight: null,
        maxNesting: 100
      },
      components: {
        core: {},
        block: {},
        inline: {}
      }
    },
    zero: {
      options: {
        html: false,
        xhtmlOut: false,
        breaks: false,
        langPrefix: "language-",
        linkify: false,
        typographer: false,
        quotes: "\u201C\u201D\u2018\u2019",
        highlight: null,
        maxNesting: 20
      },
      components: {
        core: { rules: [
          "normalize",
          "block",
          "strip_references",
          "inline",
          "text_join"
        ] },
        block: { rules: ["paragraph"] },
        inline: {
          rules: ["text"],
          rules2: ["balance_pairs", "fragments_join"]
        }
      }
    },
    commonmark: {
      options: {
        html: true,
        xhtmlOut: true,
        breaks: false,
        langPrefix: "language-",
        linkify: false,
        typographer: false,
        quotes: "\u201C\u201D\u2018\u2019",
        highlight: null,
        maxNesting: 20
      },
      components: {
        core: { rules: [
          "normalize",
          "block",
          "strip_references",
          "inline",
          "text_join"
        ] },
        block: { rules: [
          "blockquote",
          "code",
          "fence",
          "heading",
          "hr",
          "html_block",
          "lheading",
          "list",
          "reference",
          "paragraph"
        ] },
        inline: {
          rules: [
            "autolink",
            "backticks",
            "emphasis",
            "entity",
            "escape",
            "html_inline",
            "image",
            "link",
            "newline",
            "text"
          ],
          rules2: [
            "balance_pairs",
            "emphasis",
            "fragments_join"
          ]
        }
      }
    }
  };
  var BAD_PROTO_RE = /^(vbscript|javascript|file|data):/;
  var GOOD_DATA_RE = /^data:image\/(gif|png|jpeg|webp);/;
  var RECODE_HOSTNAME_FOR = [
    "http:",
    "https:",
    "mailto:"
  ];
  var MarkdownIt = class {
    /**
    * Link validation function. CommonMark allows too much in links. By default
    * we disable `javascript:`, `vbscript:`, `file:` schemas, and almost all `data:...` schemas
    * except some embedded image types.
    *
    * You can change this behaviour:
    *
    * @example
    * ```javascript
    * import MarkdownIt from 'markdown-it'
    * const md = new MarkdownIt()
    *
    * // enable everything
    * md.validateLink = function () { return true; }
    * ```
    */
    validateLink(url) {
      const str = url.trim().toLowerCase();
      return BAD_PROTO_RE.test(str) ? GOOD_DATA_RE.test(str) : true;
    }
    /**
    * Function used to encode link url to a machine-readable format,
    * which includes url-encoding, punycode, etc.
    */
    normalizeLink(url) {
      const parsed = parse_default(url, true);
      if (parsed.hostname) {
        if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) try {
          parsed.hostname = punycode_es6_default.toASCII(parsed.hostname);
        } catch (er) {
        }
      }
      if (parsed.auth) parsed.auth = encode_default(parsed.auth);
      if (parsed.hostname) parsed.hostname = encode_default(parsed.hostname);
      if (parsed.pathname) parsed.pathname = encode_default(parsed.pathname);
      if (parsed.search) parsed.search = encode_default(parsed.search);
      if (parsed.hash) parsed.hash = encode_default(parsed.hash);
      return format(parsed);
    }
    /**
    * Function used to decode link url to a human-readable format`
    */
    normalizeLinkText(url) {
      const parsed = parse_default(url, true);
      if (parsed.hostname) {
        if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) try {
          parsed.hostname = punycode_es6_default.toUnicode(parsed.hostname);
        } catch (er) {
        }
      }
      return decode_default(format(parsed), decode_default.defaultChars + "%");
    }
    constructor(...args) {
      _defineProperty(
        this,
        /**
        * Instance of {@link ParserInline}. You may need it to add new rules when
        * writing plugins. For simple rules control use {@link MarkdownIt.disable}
        * and {@link MarkdownIt.enable}.
        */
        "inline",
        new ParserInline()
      );
      _defineProperty(
        this,
        /**
        * Instance of {@link ParserBlock}. You may need it to add new rules when
        * writing plugins. For simple rules control use {@link MarkdownIt.disable}
        * and {@link MarkdownIt.enable}.
        */
        "block",
        new ParserBlock()
      );
      _defineProperty(
        this,
        /**
        * Instance of {@link ParserCore} chain executor. You may need it to add new
        * rules when writing plugins. For simple rules control use
        * {@link MarkdownIt.disable} and {@link MarkdownIt.enable}.
        */
        "core",
        new ParserCore()
      );
      _defineProperty(
        this,
        /**
        * Instance of {@link Renderer}. Use it to modify output look. Or to add rendering
        * rules for new token types, generated by plugins.
        *
        * See {@link Renderer} docs and
        * [source code](https://github.com/markdown-it/markdown-it/blob/master/src/renderer.ts).
        *
        * @example
        * ```javascript
        * import MarkdownIt from 'markdown-it'
        * const md = new MarkdownIt()
        *
        * function myToken(tokens, idx, options, env, self) {
        *   //...
        *   return result;
        * };
        *
        * md.renderer.rules['my_token'] = myToken
        * ```
        */
        "renderer",
        new Renderer()
      );
      _defineProperty(
        this,
        /**
        * [linkify-it](https://github.com/markdown-it/linkify-it) instance.
        * Used by [linkify](https://github.com/markdown-it/markdown-it/blob/master/src/rules_core/linkify.ts)
        * rule.
        */
        "linkify",
        new LinkifyIt()
      );
      _defineProperty(
        this,
        /**
        * Assorted utility functions, useful to write plugins. See details
        * [here](https://github.com/markdown-it/markdown-it/blob/master/src/common/utils.ts).
        */
        "utils",
        utils_exports
      );
      _defineProperty(
        this,
        /**
        * Link components parser functions, useful to write plugins. See details
        * [here](https://github.com/markdown-it/markdown-it/blob/master/src/helpers).
        */
        "helpers",
        Object.assign({}, helpers_exports)
      );
      const [presetNameOrOptions, options] = args;
      if (typeof presetNameOrOptions === "string") {
        this.configure(presetNameOrOptions);
        if (options) this.set(options);
      } else {
        this.configure("default");
        this.set(presetNameOrOptions || {});
      }
    }
    /**
    * Set parser options (in the same format as in constructor). Probably, you
    * will never need it, but you can change options after constructor call.
    *
    * __Note:__ To achieve the best possible performance, don't modify a
    * `markdown-it` instance options on the fly. If you need multiple configurations
    * it's best to create multiple instances and initialize each with separate
    * config.
    *
    * @example
    * ```javascript
    * import MarkdownIt from 'markdown-it'
    *
    * const md = new MarkdownIt()
    *   .set({ html: true, breaks: true })
    *   .set({ typographer: true })
    * ```
    */
    set(options) {
      Object.assign(this.options, options);
      return this;
    }
    /**
    * Batch load of all options and compenent settings. This is internal method,
    * and you probably will not need it. But if you will - see available presets
    * and data structure [here](https://github.com/markdown-it/markdown-it/tree/master/src/presets)
    *
    * We strongly recommend to use presets instead of direct config loads. That
    * will give better compatibility with next versions.
    */
    configure(presets) {
      let p;
      if (typeof presets === "string") {
        const presetName = presets;
        p = config[presetName];
        if (!p) throw new Error(`Wrong 'markdown-it' preset "${presetName}", check name`);
      } else p = presets;
      if (!p) throw new Error("Wrong `markdown-it` preset, can't be empty");
      if (p.options) this.options = { ...p.options };
      const components = p.components;
      if (components) {
        var _components$inline;
        [
          "core",
          "block",
          "inline"
        ].forEach((name) => {
          var _components$name;
          const rules = (_components$name = components[name]) === null || _components$name === void 0 ? void 0 : _components$name.rules;
          if (rules) this[name].ruler.enableOnly(rules);
        });
        const rules2 = (_components$inline = components.inline) === null || _components$inline === void 0 ? void 0 : _components$inline.rules2;
        if (rules2) this.inline.ruler2.enableOnly(rules2);
      }
      return this;
    }
    /**
    * Enable list or rules. It will automatically find appropriate components,
    * containing rules with given names. If rule not found, and `ignoreInvalid`
    * not set - throws exception.
    *
    * @example
    * ```javascript
    * import MarkdownIt from 'markdown-it'
    *
    * const md = new MarkdownIt()
    *   .enable(['sub', 'sup'])
    *   .disable('smartquotes')
    * ```
    */
    enable(list2, ignoreInvalid = false) {
      let result = [];
      if (!Array.isArray(list2)) list2 = [list2];
      [
        "core",
        "block",
        "inline"
      ].forEach((chain) => {
        result = result.concat(this[chain].ruler.enable(list2, true));
      });
      result = result.concat(this.inline.ruler2.enable(list2, true));
      const missed = list2.filter((name) => result.indexOf(name) < 0);
      if (missed.length && !ignoreInvalid) throw new Error(`MarkdownIt. Failed to enable unknown rule(s): ${missed}`);
      return this;
    }
    /**
    * The same as {@link MarkdownIt.enable}, but turn specified rules off.
    */
    disable(list2, ignoreInvalid = false) {
      let result = [];
      if (!Array.isArray(list2)) list2 = [list2];
      [
        "core",
        "block",
        "inline"
      ].forEach((chain) => {
        result = result.concat(this[chain].ruler.disable(list2, true));
      });
      result = result.concat(this.inline.ruler2.disable(list2, true));
      const missed = list2.filter((name) => result.indexOf(name) < 0);
      if (missed.length && !ignoreInvalid) throw new Error(`MarkdownIt. Failed to disable unknown rule(s): ${missed}`);
      return this;
    }
    /**
    * Load specified plugin with given params into current parser instance.
    * It's just a sugar to call `plugin(md, params)` with curring.
    *
    * @example
    * ```javascript
    * import MarkdownIt from 'markdown-it'
    * import iterator from 'markdown-it-for-inline'
    *
    * const md = new MarkdownIt()
    *   .use(iterator, 'foo_replace', 'text', function (tokens, idx) {
    *     tokens[idx].content = tokens[idx].content.replace(/foo/g, 'bar')
    *   })
    * ```
    */
    use(plugin, ...params) {
      plugin.apply(plugin, [this, ...params]);
      return this;
    }
    /**
    * Parse input string and return list of block tokens (special token type
    * "inline" will contain list of inline tokens). You should not call this
    * method directly, until you write custom renderer (for example, to produce
    * AST).
    *
    * `env` is used to pass data between "distributed" rules and return additional
    * metadata like reference info, needed for the renderer. It also can be used to
    * inject data in specific cases. Usually, you will be ok to pass `{}`,
    * and then pass updated object to renderer.
    */
    parse(src, env) {
      if (typeof src !== "string") throw new Error("Input data should be a String");
      const state2 = new this.core.State(src, this, env);
      this.core.process(state2);
      return state2.tokens;
    }
    /**
    * Render markdown string into html. It does all magic for you :).
    *
    * `env` can be used to inject additional metadata (`{}` by default).
    * But you will not need it with high probability. See also comment
    * in {@link MarkdownIt.parse}.
    */
    render(src, env = {}) {
      return this.renderer.render(this.parse(src, env), this.options, env);
    }
    /**
    * The same as {@link MarkdownIt.parse} but skip all block rules. It returns
    * the block tokens list with the single `inline` element, containing parsed
    * inline tokens in `children` property. Also updates `env` object.
    */
    parseInline(src, env) {
      const state2 = new this.core.State(src, this, env);
      state2.inlineMode = true;
      this.core.process(state2);
      return state2.tokens;
    }
    /**
    * Similar to {@link MarkdownIt.render} but for single paragraph content.
    * Result will NOT be wrapped into `<p>` tags.
    */
    renderInline(src, env = {}) {
      return this.renderer.render(this.parseInline(src, env), this.options, env);
    }
  };
  _defineProperty(MarkdownIt, "Token", Token);
  _defineProperty(MarkdownIt, "Ruler", Ruler);
  _defineProperty(MarkdownIt, "Renderer", Renderer);
  _defineProperty(MarkdownIt, "ParserCore", ParserCore);
  _defineProperty(MarkdownIt, "StateCore", StateCore);
  _defineProperty(MarkdownIt, "ParserBlock", ParserBlock);
  _defineProperty(MarkdownIt, "StateBlock", StateBlock);
  _defineProperty(MarkdownIt, "ParserInline", ParserInline);
  _defineProperty(MarkdownIt, "StateInline", StateInline);
  var MarkdownItCallable = callable(MarkdownIt);

  // ../../workbench/config.json
  var config_default = {
    schema: "workbench-config/v1",
    title: "Agent \u5DE5\u4F5C\u53F0",
    mark: "W",
    description: "\u4E00\u4E2A\u53EF\u4EE5\u7167\u7740\u6539\u7684\u4FA7\u680F\u5DE5\u4F5C\u53F0\uFF1A4 \u4E2A\u6A21\u5F0F\u3001\u4E24\u884C\u7B5B\u9009\u3001\u5168\u5BBD\u5217\u8868\u3001Markdown \u9605\u8BFB\u4E0E\u53EF\u7F16\u8F91\u6279\u6CE8\u5C42\u3002",
    libraryRoot: "workbench",
    port: 8787,
    labels: {
      today: "\u4ECA\u65E5",
      library: "\u8D44\u6599\u5E93",
      reports: "\u62A5\u544A",
      settings: "\u8BBE\u7F6E",
      item: "\u6761\u76EE",
      items: "\u6761\u76EE",
      searchPlaceholder: "\u641C\u7D22\u6807\u9898\u3001\u673A\u6784\u3001\u6587\u53F7\u6216\u5173\u952E\u8BCD",
      summary: "\u6458\u8981",
      judgment: "\u5224\u65AD",
      source: "\u539F\u6587",
      emptyTitle: "\u6CA1\u6709\u5339\u914D\u7684\u6761\u76EE",
      emptyHint: "\u8C03\u6574\u7B5B\u9009\u6761\u4EF6\uFF0C\u6216\u6E05\u7A7A\u641C\u7D22\u540E\u518D\u8BD5\u3002",
      clearFilters: "\u6E05\u7A7A\u7B5B\u9009",
      readOnly: "\u53EA\u8BFB"
    },
    dimensions: {
      primary: {
        field: "level",
        label: "\u5C42\u7EA7"
      },
      secondary: {
        field: "kind",
        label: "\u7C7B\u578B"
      }
    },
    types: [
      "\u539F\u6587",
      "\u89E3\u8BFB",
      "\u6570\u636E",
      "\u7533\u62A5",
      "\u7ADE\u54C1",
      "\u7814\u7A76"
    ],
    statuses: [
      {
        label: "\u5F85\u7814\u5224",
        tone: "warn"
      },
      {
        label: "\u5728\u8DDF",
        tone: "info"
      },
      {
        label: "\u5DF2\u7814\u5224",
        tone: "ok"
      },
      {
        label: "\u5DF2\u5F52\u6863",
        tone: "muted"
      }
    ],
    today: {
      referenceDate: "latest",
      recentDays: 14,
      deadlineDays: 7,
      pendingStatuses: [
        "\u5F85\u7814\u5224"
      ],
      focusCount: 3
    },
    reports: {
      label: "\u62A5\u544A",
      types: [
        "\u65E5\u62A5",
        "\u5468\u62A5",
        "\u6708\u62A5",
        "\u4E13\u9898",
        "\u590D\u76D8"
      ]
    }
  };

  // ../../workbench/index.json
  var workbench_default = {
    schema: "workbench-index/v1",
    generated_at: "2026-11-13",
    items: [
      {
        id: "ex-001",
        title: "\u793A\u4F8B\u5E02\u667A\u80FD\u7EC8\u7AEF\u4EA7\u4E1A\u53D1\u5C55\u884C\u52A8\u65B9\u6848\uFF082026\u20142028 \u5E74\uFF09",
        level: "\u793A\u4F8B\u5E02",
        kind: "\u539F\u6587",
        issuer: "\u793A\u4F8B\u5E02\u53D1\u5C55\u548C\u6539\u9769\u59D4\u5458\u4F1A",
        doc_number: "\u793A\u4F8B\u53D1\u6539\u30142026\u301541 \u53F7",
        published_at: "2026-11-12",
        deadline: "",
        status: "\u5F85\u7814\u5224",
        priority: 5,
        themes: ["\u667A\u80FD\u7EC8\u7AEF", "\u4EA7\u4E1A\u89C4\u5212"],
        summary: "\u63D0\u51FA\u5230 2028 \u5E74\u5F62\u6210\u667A\u80FD\u7EC8\u7AEF\u4EA7\u4E1A\u96C6\u7FA4\uFF0C\u91CD\u70B9\u652F\u6301\u7AEF\u4FA7\u6A21\u578B\u3001\u6574\u673A\u8BBE\u8BA1\u3001\u6D4B\u8BD5\u8BA4\u8BC1\u548C\u573A\u666F\u5F00\u653E\u56DB\u7C7B\u9879\u76EE\u3002",
        source_url: "https://example.com/policy/ex-001",
        content_path: "items/ex-001/content.md"
      },
      {
        id: "ex-002",
        title: "\u5173\u4E8E\u5F00\u5C55 2026 \u5E74\u5EA6\u667A\u80FD\u5236\u9020\u8BD5\u70B9\u9879\u76EE\u7533\u62A5\u7684\u901A\u77E5",
        level: "\u793A\u4F8B\u5E02",
        kind: "\u7533\u62A5",
        issuer: "\u793A\u4F8B\u5E02\u7ECF\u6D4E\u548C\u4FE1\u606F\u5316\u5C40",
        doc_number: "\u793A\u4F8B\u7ECF\u4FE1\u30142026\u301518 \u53F7",
        published_at: "2026-11-10",
        deadline: "2026-11-19",
        status: "\u5728\u8DDF",
        priority: 5,
        themes: ["\u667A\u80FD\u5236\u9020", "\u9879\u76EE\u7533\u62A5"],
        summary: "\u9762\u5411\u5236\u9020\u4E1A\u4F01\u4E1A\u5F81\u96C6\u8BD5\u70B9\u9879\u76EE\uFF0C\u5355\u4E2A\u9879\u76EE\u6700\u9AD8\u652F\u6301 300 \u4E07\u5143\uFF0C\u8981\u6C42 2027 \u5E74 6 \u6708\u524D\u5B8C\u6210\u9A8C\u6536\u3002",
        source_url: "https://example.com/notice/ex-002",
        content_path: "items/ex-002/content.md"
      },
      {
        id: "ex-003",
        title: "\u793A\u4F8B\u7701\u4EBA\u5DE5\u667A\u80FD\u91CD\u70B9\u5B9E\u9A8C\u5BA4\u5EFA\u8BBE\u6307\u5357",
        level: "\u793A\u4F8B\u7701",
        kind: "\u539F\u6587",
        issuer: "\u793A\u4F8B\u7701\u79D1\u5B66\u6280\u672F\u5385",
        doc_number: "\u793A\u4F8B\u79D1\u57FA\u30142026\u30157 \u53F7",
        published_at: "2026-11-08",
        deadline: "2027-01-20",
        status: "\u5F85\u7814\u5224",
        priority: 4,
        themes: ["\u4EBA\u5DE5\u667A\u80FD", "\u5B9E\u9A8C\u5BA4"],
        summary: "\u660E\u786E\u91CD\u70B9\u5B9E\u9A8C\u5BA4\u7684\u7533\u62A5\u6761\u4EF6\u3001\u8FD0\u884C\u673A\u5236\u548C\u5E74\u5EA6\u8003\u6838\u8981\u6C42\uFF0C\u9F13\u52B1\u4F01\u4E1A\u4E0E\u9AD8\u6821\u8054\u5408\u5171\u5EFA\u3002",
        source_url: "https://example.com/guide/ex-003",
        content_path: "items/ex-003/content.md"
      },
      {
        id: "ex-004",
        title: "\u793A\u4F8B\u533A\u652F\u6301\u4E2D\u5C0F\u4F01\u4E1A\u6570\u5B57\u5316\u8F6C\u578B\u7684\u82E5\u5E72\u63AA\u65BD",
        level: "\u793A\u4F8B\u533A",
        kind: "\u89E3\u8BFB",
        issuer: "\u793A\u4F8B\u533A\u79D1\u6280\u521B\u65B0\u5C40",
        doc_number: "",
        published_at: "2026-10-30",
        deadline: "",
        status: "\u5DF2\u7814\u5224",
        priority: 3,
        themes: ["\u6570\u5B57\u5316\u8F6C\u578B", "\u4E2D\u5C0F\u4F01\u4E1A"],
        summary: "\u4ECE\u8BCA\u65AD\u670D\u52A1\u3001\u8F6F\u4EF6\u91C7\u8D2D\u3001\u573A\u666F\u6539\u9020\u4E09\u65B9\u9762\u7ED9\u51FA\u8865\u8D34\uFF0C\u5355\u5BB6\u4F01\u4E1A\u5E74\u5EA6\u6700\u9AD8 50 \u4E07\u5143\u3002",
        source_url: "https://example.com/interpretation/ex-004",
        content_path: "items/ex-004/content.md"
      },
      {
        id: "ex-005",
        title: "2026 \u5E74\u7B2C\u4E09\u5B63\u5EA6\u884C\u4E1A\u8FD0\u884C\u6570\u636E\u7B80\u62A5",
        level: "\u793A\u4F8B\u5E02",
        kind: "\u6570\u636E",
        issuer: "\u793A\u4F8B\u7814\u7A76\u9662",
        doc_number: "",
        published_at: "2026-10-18",
        deadline: "",
        status: "\u5DF2\u5F52\u6863",
        priority: 2,
        themes: ["\u884C\u4E1A\u6570\u636E", "\u5B63\u5EA6"],
        summary: "\u4E09\u5B63\u5EA6\u6837\u672C\u4F01\u4E1A\u8425\u6536\u540C\u6BD4\u589E\u957F 8.4%\uFF0C\u7814\u53D1\u6295\u5165\u5360\u6BD4 6.1%\uFF0C\u8BA2\u5355\u4EA4\u4ED8\u5468\u671F\u7F29\u77ED\u81F3 21 \u5929\u3002",
        source_url: "https://example.com/data/ex-005",
        content_path: "items/ex-005/content.md"
      },
      {
        id: "ex-006",
        title: "\u793A\u4F8B\u884C\u4E1A\u5E74\u5EA6\u89C2\u5BDF\uFF1A\u4ECE\u8BD5\u70B9\u5230\u89C4\u6A21\u5316",
        level: "\u793A\u4F8B\u7701",
        kind: "\u7814\u7A76",
        issuer: "\u793A\u4F8B\u884C\u4E1A\u534F\u4F1A",
        doc_number: "",
        published_at: "2026-09-22",
        deadline: "",
        status: "\u5DF2\u7814\u5224",
        priority: 3,
        themes: ["\u884C\u4E1A\u7814\u7A76", "\u89C4\u6A21\u5316"],
        summary: "\u590D\u76D8\u8FD1\u4E09\u5E74\u8BD5\u70B9\u9879\u76EE\uFF0C\u603B\u7ED3\u51FA\u201C\u5355\u70B9\u9A8C\u8BC1\u2014\u6D41\u7A0B\u56FA\u5316\u2014\u89C4\u6A21\u590D\u5236\u201D\u7684\u4E09\u9636\u6BB5\u8DEF\u5F84\u548C\u4E94\u4E2A\u5E38\u89C1\u5931\u8D25\u539F\u56E0\u3002",
        source_url: "https://example.com/research/ex-006",
        content_path: "items/ex-006/content.md"
      },
      {
        id: "ex-007",
        title: "\u793A\u4F8B\u4F01\u4E1A\u53D1\u5E03\u7AEF\u4FA7\u63A8\u7406\u4EA7\u54C1\u767D\u76AE\u4E66",
        level: "\u793A\u4F8B\u5E02",
        kind: "\u7ADE\u54C1",
        issuer: "\u793A\u4F8B\u4F01\u4E1A\u7532",
        doc_number: "",
        published_at: "2026-08-14",
        deadline: "",
        status: "\u5728\u8DDF",
        priority: 3,
        themes: ["\u7ADE\u54C1", "\u7AEF\u4FA7\u63A8\u7406"],
        summary: "\u767D\u76AE\u4E66\u62AB\u9732\u5176\u7AEF\u4FA7\u63A8\u7406\u6846\u67B6\u7684\u529F\u8017\u3001\u65F6\u5EF6\u548C\u6A21\u578B\u9002\u914D\u8303\u56F4\uFF0C\u5E76\u7ED9\u51FA\u4E09\u4E2A\u884C\u4E1A\u843D\u5730\u6848\u4F8B\u3002",
        source_url: "https://example.com/whitepaper/ex-007",
        content_path: "items/ex-007/content.md"
      },
      {
        id: "ex-008",
        title: "\u5173\u4E8E\u89C4\u8303\u6570\u636E\u51FA\u5883\u6D3B\u52A8\u5907\u6848\u6D41\u7A0B\u7684\u8BF4\u660E",
        level: "\u793A\u4F8B\u90E8\u95E8",
        kind: "\u539F\u6587",
        issuer: "\u793A\u4F8B\u90E8\u95E8\u6570\u636E\u7BA1\u7406\u5904",
        doc_number: "\u793A\u4F8B\u6570\u636E\u30142026\u30153 \u53F7",
        published_at: "2026-06-03",
        deadline: "2026-12-31",
        status: "\u5DF2\u5F52\u6863",
        priority: 4,
        themes: ["\u6570\u636E\u5408\u89C4", "\u5907\u6848"],
        summary: "\u68B3\u7406\u6570\u636E\u51FA\u5883\u5907\u6848\u7684\u9002\u7528\u60C5\u5F62\u3001\u6750\u6599\u6E05\u5355\u548C\u529E\u7406\u65F6\u9650\uFF0C\u660E\u786E\u5B58\u91CF\u4E1A\u52A1\u7684\u8FC7\u6E21\u671F\u5B89\u6392\u3002",
        source_url: "https://example.com/notice/ex-008",
        content_path: "items/ex-008/content.md"
      },
      {
        id: "ex-009",
        title: "\u793A\u4F8B\u673A\u6784\u53D1\u5E03 2026 \u5E74\u884C\u4E1A\u4EBA\u624D\u9700\u6C42\u62A5\u544A",
        level: "\u793A\u4F8B\u7701",
        kind: "\u6570\u636E",
        issuer: "\u793A\u4F8B\u673A\u6784",
        doc_number: "",
        published_at: "2025-12-19",
        deadline: "",
        status: "\u5DF2\u5F52\u6863",
        priority: 1,
        themes: ["\u4EBA\u624D", "\u884C\u4E1A\u6570\u636E"],
        summary: "\u62A5\u544A\u8986\u76D6 12 \u4E2A\u5C97\u4F4D\u65CF\uFF0C\u6307\u51FA\u7B97\u6CD5\u5DE5\u7A0B\u3001\u6570\u636E\u6CBB\u7406\u548C\u89E3\u51B3\u65B9\u6848\u67B6\u6784\u4E09\u7C7B\u5C97\u4F4D\u7F3A\u53E3\u6700\u5927\u3002",
        source_url: "https://example.com/report/ex-009",
        content_path: "items/ex-009/content.md"
      },
      {
        id: "ex-010",
        title: "\u5173\u4E8E\u4FC3\u8FDB\u667A\u80FD\u7B97\u529B\u57FA\u7840\u8BBE\u65BD\u5EFA\u8BBE\u7684\u6307\u5BFC\u610F\u89C1",
        level: "\u793A\u4F8B\u90E8\u95E8",
        kind: "\u539F\u6587",
        issuer: "\u793A\u4F8B\u90E8\u95E8\u4EA7\u4E1A\u53D1\u5C55\u5904",
        doc_number: "\u793A\u4F8B\u4EA7\u4E1A\u30142026\u30151 \u53F7",
        published_at: "2026-01-15",
        deadline: "",
        status: "\u5DF2\u7814\u5224",
        priority: 4,
        themes: ["\u7B97\u529B", "\u57FA\u7840\u8BBE\u65BD"],
        summary: "\u63D0\u51FA\u7EDF\u7B79\u7B97\u529B\u5E03\u5C40\u3001\u63D0\u5347\u5229\u7528\u7387\u3001\u652F\u6301\u7EFF\u8272\u6570\u636E\u4E2D\u5FC3\u7684\u4E09\u9879\u4EFB\u52A1\uFF0C\u5E76\u660E\u786E\u90E8\u95E8\u5206\u5DE5\u3002",
        source_url: "https://example.com/guide/ex-010",
        content_path: "items/ex-010/content.md"
      }
    ]
  };

  // src/panel/main.js
  var LIB_ROOT = "workbench";
  var INDEX_PATH = LIB_ROOT + "/index.json";
  var REPORTS_PATH = LIB_ROOT + "/reports.json";
  var ANNOTATIONS_PATH = LIB_ROOT + "/annotations.json";
  var NOTES_DIR = LIB_ROOT + "/_notes";
  var LOCAL_BASE = "http://127.0.0.1:8787/";
  var PREVIEW_CONFIG = "../../../workbench/config.json";
  var PREVIEW_INDEX = "../../../workbench/index.json";
  var PREVIEW_REPORTS = "../../../workbench/reports.json";
  var PREVIEW_ANNOTATIONS = "../../../workbench/annotations.json";
  var host = connectHost();
  var md = new MarkdownItCallable({ html: false, linkify: true, breaks: false });
  var TABS = [
    { id: "today", label: "\u4ECA\u65E5" },
    { id: "library", label: "\u8D44\u6599\u5E93" },
    { id: "reports", label: "\u62A5\u544A" },
    { id: "settings", label: "\u8BBE\u7F6E" }
  ];
  var TIME_OPTIONS = [
    { id: "all", label: "\u5168\u90E8\u65F6\u95F4" },
    { id: "7d", label: "\u8FD1 7 \u5929" },
    { id: "30d", label: "\u8FD1 30 \u5929" },
    { id: "year", label: "\u672C\u5E74" }
  ];
  var DEFAULT_CONFIG = config_default && typeof config_default === "object" ? config_default : {};
  var state = {
    tab: "today",
    primary: "all",
    secondary: "all",
    status: "all",
    time: "all",
    reportType: "all",
    search: "",
    selectedId: "",
    editing: false,
    saving: false,
    draft: { summary: "", judgment: "", status: "" },
    config: DEFAULT_CONFIG,
    items: [],
    reports: [],
    docs: [],
    annotations: {},
    generatedAt: "",
    refDate: null,
    loaded: false,
    preview: true,
    statusMessage: "\u6B63\u5728\u8BFB\u53D6\u5DE5\u4F5C\u53F0\u2026",
    contentCache: /* @__PURE__ */ new Map(),
    currentContent: "",
    contentLoading: false,
    contentError: "",
    directory: "",
    session: null,
    surface: "panel"
  };
  var root = document.querySelector("#root");
  root.innerHTML = [
    '<div class="app">',
    '  <header class="top">',
    '    <div class="brand">',
    '      <span class="mark" id="brand-mark">W</span>',
    '      <span class="brand-name" id="brand-name">\u5DE5\u4F5C\u53F0</span>',
    '      <span class="preview-badge" id="preview-badge" hidden>\u9884\u89C8</span>',
    "    </div>",
    '    <input id="search" class="search" type="search" placeholder="\u641C\u7D22\u6807\u9898\u3001\u673A\u6784\u3001\u6587\u53F7\u6216\u5173\u952E\u8BCD" aria-label="\u641C\u7D22\u5DE5\u4F5C\u53F0" title="\u641C\u7D22\uFF08/\uFF09" />',
    '    <button id="refresh" class="btn ghost" type="button" title="\u91CD\u65B0\u8BFB\u53D6\u5DE5\u4F5C\u53F0\u6570\u636E">\u5237\u65B0</button>',
    '    <button id="close" class="btn ghost close" type="button" title="\u5173\u95ED">\xD7</button>',
    "  </header>",
    '  <nav id="tabs" class="tabs" role="tablist" aria-label="\u5DE5\u4F5C\u53F0\u89C6\u56FE"></nav>',
    '  <div id="filters" class="filters"></div>',
    '  <main id="main" class="main"></main>',
    '  <footer class="foot">',
    '    <span id="status"></span>',
    '    <span id="meta"></span>',
    "  </footer>",
    "</div>",
    '<div id="toast" class="toast" hidden></div>'
  ].join("\n");
  var els = {
    tabs: document.querySelector("#tabs"),
    filters: document.querySelector("#filters"),
    main: document.querySelector("#main"),
    search: document.querySelector("#search"),
    refresh: document.querySelector("#refresh"),
    close: document.querySelector("#close"),
    status: document.querySelector("#status"),
    meta: document.querySelector("#meta"),
    previewBadge: document.querySelector("#preview-badge"),
    brandName: document.querySelector("#brand-name"),
    brandMark: document.querySelector("#brand-mark"),
    toast: document.querySelector("#toast")
  };
  function el(tag, className, text2) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text2 !== void 0 && text2 !== null) node.textContent = String(text2);
    return node;
  }
  function t(key, fallback) {
    const labels = state.config && state.config.labels ? state.config.labels : {};
    return labels[key] || fallback;
  }
  function pad(value) {
    return String(value).padStart(2, "0");
  }
  function startOfToday() {
    const now = /* @__PURE__ */ new Date();
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
    return value ? String(value).slice(0, 10) : "\u2014";
  }
  function formatDateISO(date) {
    if (!date) return "";
    return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
  }
  function dayDiff(later, earlier) {
    return Math.round((later.getTime() - earlier.getTime()) / 864e5);
  }
  function daysFromRef(value) {
    const date = parseDate(value);
    if (!date || !state.refDate) return null;
    return dayDiff(state.refDate, date);
  }
  function primaryField() {
    return "level";
  }
  function secondaryField() {
    return "type";
  }
  function primaryLabel() {
    const dimensions = state.config && state.config.dimensions ? state.config.dimensions : {};
    return dimensions.primary && dimensions.primary.label || "\u5C42\u7EA7";
  }
  function secondaryLabel() {
    const dimensions = state.config && state.config.dimensions ? state.config.dimensions : {};
    return dimensions.secondary && dimensions.secondary.label || "\u7C7B\u578B";
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
    const list2 = statuses();
    return list2.length ? list2[0].label : "";
  }
  function toneForStatus(label) {
    const found = statuses().filter((item) => item && item.label === label)[0];
    if (found && found.tone) return found.tone;
    if (label === "\u5DF2\u53D1\u5E03") return "ok";
    if (label === "\u8349\u7A3F") return "warn";
    return "muted";
  }
  function mapItem(raw) {
    return {
      doc_id: String(raw.id),
      title: raw.title || "",
      level: raw.level || "",
      type: raw.kind || "",
      issuer: raw.issuer || "",
      doc_number: raw.doc_number || "",
      publish_date: raw.published_at || "",
      deadline: raw.deadline || "",
      status: raw.status || "",
      priority: Number(raw.priority) || 0,
      themes: Array.isArray(raw.themes) ? raw.themes : [],
      summary: raw.summary || "",
      source_url: raw.source_url || "",
      original_path: raw.original_path || "",
      path: raw.content_path || "",
      content: "",
      period: "",
      subtype: "",
      is_report: false
    };
  }
  function mapReport(raw) {
    const status = raw.status === "draft" ? "\u8349\u7A3F" : raw.status || "\u5DF2\u53D1\u5E03";
    return {
      doc_id: String(raw.id),
      title: raw.title || "",
      level: "\u62A5\u544A",
      type: "\u62A5\u544A",
      issuer: raw.issuer || "",
      doc_number: "",
      publish_date: raw.date || "",
      deadline: "",
      status,
      priority: 0,
      themes: Array.isArray(raw.themes) ? raw.themes : [],
      summary: raw.summary || "",
      source_url: raw.source_url || "",
      original_path: raw.original_path || "",
      path: "",
      content: raw.content || "",
      period: raw.period || "",
      subtype: raw.type || "",
      is_report: true
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
    return annotationFor(doc).status || doc.status || defaultStatus() || "\u2014";
  }
  function docSummary(doc) {
    const annotation = annotationFor(doc);
    return annotation.summary || doc.summary || "";
  }
  function docJudgment(doc) {
    const annotation = annotationFor(doc);
    return annotation.judgment || "";
  }
  function primaryOptions() {
    const seen = [];
    itemDocs().forEach((doc) => {
      const value = doc[primaryField()];
      if (value && seen.indexOf(value) === -1) seen.push(value);
    });
    return seen;
  }
  function matchesTime(doc) {
    if (state.time === "all") return true;
    const age = daysFromRef(doc.publish_date);
    if (age === null) return false;
    if (state.time === "7d") return age >= 0 && age <= 7;
    if (state.time === "30d") return age >= 0 && age <= 30;
    if (state.time === "year") {
      const date = parseDate(doc.publish_date);
      return Boolean(date && state.refDate && date.getFullYear() === state.refDate.getFullYear());
    }
    return true;
  }
  function matchesDoc(doc) {
    if (state.primary !== "all" && String(doc[primaryField()] || "") !== state.primary) return false;
    if (state.secondary !== "all" && String(doc[secondaryField()] || "") !== state.secondary) return false;
    if (state.status !== "all" && docStatus(doc) !== state.status) return false;
    if (!matchesTime(doc)) return false;
    const query = state.search.trim().toLowerCase();
    if (!query) return true;
    const haystack = [
      doc.title,
      doc.issuer,
      doc.doc_number,
      doc[primaryField()],
      doc[secondaryField()],
      (doc.themes || []).join(" "),
      doc.summary,
      docSummary(doc),
      docJudgment(doc)
    ].join(" ").toLowerCase();
    return haystack.indexOf(query) !== -1;
  }
  function filteredDocs(docs) {
    return docs.filter(matchesDoc);
  }
  function matchesReport(doc) {
    if (state.reportType !== "all" && doc.subtype !== state.reportType) return false;
    const query = state.search.trim().toLowerCase();
    if (!query) return true;
    const haystack = [
      doc.title,
      doc.subtype,
      doc.period,
      doc.summary,
      docSummary(doc),
      docJudgment(doc)
    ].join(" ").toLowerCase();
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
      const byDate = String(b.publish_date || "").localeCompare(String(a.publish_date || ""));
      if (byDate !== 0) return byDate;
      return (Number(b.priority) || 0) - (Number(a.priority) || 0);
    });
  }
  function sortByPriority(docs) {
    return docs.slice().sort((a, b) => {
      const byPriority = (Number(b.priority) || 0) - (Number(a.priority) || 0);
      if (byPriority !== 0) return byPriority;
      return String(b.publish_date || "").localeCompare(String(a.publish_date || ""));
    });
  }
  function recentDocs() {
    const recent = recentWindowDocs();
    if (recent.length) return recent;
    return sortByDate(itemDocs()).slice(0, 8);
  }
  function hasActiveFilters() {
    return state.primary !== "all" || state.secondary !== "all" || state.status !== "all" || state.time !== "all" || state.reportType !== "all" || Boolean(state.search.trim());
  }
  function clearFilters() {
    state.primary = "all";
    state.secondary = "all";
    state.status = "all";
    state.time = "all";
    state.reportType = "all";
    state.search = "";
    els.search.value = "";
    renderFilters();
    renderMain();
  }
  function computeReferenceDate() {
    const setting = state.config && state.config.today ? state.config.today.referenceDate : "auto";
    if (setting === "latest") {
      let latest = null;
      itemDocs().forEach((doc) => {
        const date = parseDate(doc.publish_date);
        if (date && (!latest || date > latest)) latest = date;
      });
      if (latest) return latest;
    }
    if (typeof setting === "string" && /^\d{4}-\d{2}-\d{2}$/.test(setting)) {
      const fixed = parseDate(setting);
      if (fixed) return fixed;
    }
    return startOfToday();
  }
  function renderTabs() {
    els.tabs.replaceChildren();
    const counts = {
      today: state.loaded ? recentDocs().length : 0,
      library: state.loaded ? itemDocs().length : 0,
      reports: state.loaded ? reportDocs().length : 0
    };
    for (const tab of TABS) {
      const button = el("button", "tab" + (state.tab === tab.id ? " active" : ""));
      button.type = "button";
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", state.tab === tab.id ? "true" : "false");
      button.append(el("span", "tab-label", tab.label));
      if (counts[tab.id]) button.append(el("span", "tab-count", counts[tab.id]));
      button.addEventListener("click", () => {
        if (state.tab === tab.id && !state.selectedId) return;
        state.tab = tab.id;
        state.selectedId = "";
        state.editing = false;
        state.saving = false;
        state.currentContent = "";
        state.contentError = "";
        state.contentLoading = false;
        render();
        els.main.scrollTop = 0;
      });
      els.tabs.append(button);
    }
  }
  function chip(label, active, onClick) {
    const button = el("button", "chip" + (active ? " active" : ""), label);
    button.type = "button";
    button.setAttribute("aria-pressed", active ? "true" : "false");
    button.addEventListener("click", onClick);
    return button;
  }
  function badge(label, tone) {
    return el("span", "badge badge-" + (tone || "muted"), label);
  }
  function selectControl(label, options, value, onChange) {
    const wrap = el("label", "select-wrap");
    wrap.append(el("span", "select-label", label));
    const select = el("select", "select");
    for (const option of options) {
      const item = typeof option === "string" ? { id: option, label: option } : option;
      const node = el("option", "", item.label);
      node.value = item.id;
      select.append(node);
    }
    select.value = value;
    select.setAttribute("aria-label", label);
    select.addEventListener("change", () => onChange(select.value));
    wrap.append(select);
    return wrap;
  }
  function countText() {
    if (state.tab === "reports") return "\u5171 " + filteredReports().length + " \u4EFD";
    const scope = state.tab === "today" ? recentDocs() : itemDocs();
    return "\u5171 " + filteredDocs(scope).length + " \u6761";
  }
  function renderFilters() {
    els.filters.replaceChildren();
    if (!state.loaded || state.tab === "settings" || state.selectedId) {
      els.filters.hidden = true;
      return;
    }
    els.filters.hidden = false;
    if (state.tab === "reports") {
      const row = el("div", "filter-row");
      row.append(el("span", "filter-label", "\u62A5\u544A"));
      row.append(chip("\u5168\u90E8\u7C7B\u578B", state.reportType === "all", () => {
        state.reportType = "all";
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
      const right2 = el("div", "filter-right");
      right2.append(el("span", "filter-count", countText()));
      row.append(right2);
      els.filters.append(row);
      return;
    }
    const primaryRow = el("div", "filter-row");
    primaryRow.append(el("span", "filter-label", primaryLabel()));
    primaryRow.append(chip("\u5168\u90E8", state.primary === "all", () => {
      state.primary = "all";
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
    const secondaryRow = el("div", "filter-row");
    secondaryRow.append(el("span", "filter-label", secondaryLabel()));
    secondaryRow.append(chip("\u5168\u90E8", state.secondary === "all", () => {
      state.secondary = "all";
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
    const right = el("div", "filter-right");
    right.append(
      selectControl("\u72B6\u6001", [{ id: "all", label: "\u5168\u90E8\u72B6\u6001" }].concat(statuses().map((item) => ({ id: item.label, label: item.label }))), state.status, (value) => {
        state.status = value;
        renderFilters();
        renderMain();
      }),
      selectControl("\u65F6\u95F4", TIME_OPTIONS, state.time, (value) => {
        state.time = value;
        renderFilters();
        renderMain();
      }),
      el("span", "filter-count", countText())
    );
    secondaryRow.append(right);
    els.filters.append(primaryRow, secondaryRow);
  }
  function emptyState(title) {
    const wrap = el("div", "empty");
    wrap.append(
      el("div", "empty-title", title || t("emptyTitle", "\u6CA1\u6709\u5339\u914D\u7684\u6761\u76EE")),
      el("div", "empty-sub", t("emptyHint", "\u8C03\u6574\u7B5B\u9009\u6761\u4EF6\uFF0C\u6216\u6E05\u7A7A\u641C\u7D22\u540E\u518D\u8BD5\u3002"))
    );
    if (hasActiveFilters()) {
      const button = el("button", "btn small", t("clearFilters", "\u6E05\u7A7A\u7B5B\u9009"));
      button.type = "button";
      button.addEventListener("click", clearFilters);
      wrap.append(button);
    }
    return wrap;
  }
  function docList(docs, emptyTitle) {
    if (!docs.length) return emptyState(emptyTitle);
    const list2 = el("div", "doc-list");
    const head = el("div", "doc-head");
    for (const label of [primaryLabel(), secondaryLabel(), "\u65E5\u671F", "\u6761\u76EE / \u6458\u8981", "\u72B6\u6001", "\u673A\u5173"]) {
      head.append(el("span", "", label));
    }
    list2.append(head);
    for (const doc of docs) {
      const row = el("button", "doc-row");
      row.type = "button";
      row.dataset.id = doc.doc_id;
      row.append(
        el("span", "doc-level", doc.level || "\u2014"),
        el("span", "doc-type", doc.type || "\u2014"),
        el("span", "doc-date", formatDate(doc.publish_date))
      );
      const main = el("span", "doc-main");
      main.append(
        el("span", "doc-title", doc.title),
        el("span", "doc-summary", docSummary(doc) || "\u6682\u65E0\u6458\u8981"),
        el("span", "doc-mobile-meta", [formatDate(doc.publish_date), doc.level, doc.type, doc.issuer].filter(Boolean).join(" \xB7 "))
      );
      row.append(main, badge(docStatus(doc), toneForStatus(docStatus(doc))), el("span", "doc-issuer", doc.issuer || "\u2014"));
      row.addEventListener("click", () => openDoc(doc.doc_id));
      list2.append(row);
    }
    return list2;
  }
  function statBlock(label, value) {
    const block2 = el("div", "stat");
    block2.append(el("span", "stat-num", String(value)), el("span", "stat-label", label));
    return block2;
  }
  function renderToday() {
    const todayConfig = state.config && state.config.today ? state.config.today : {};
    const recentDays = Number(todayConfig.recentDays) || 14;
    const deadlineDays = Number(todayConfig.deadlineDays) || 7;
    const pendingStatuses = Array.isArray(todayConfig.pendingStatuses) && todayConfig.pendingStatuses.length ? todayConfig.pendingStatuses : [defaultStatus()].filter(Boolean);
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
    const wrap = el("div", "page");
    const head = el("div", "page-head");
    head.append(
      el("h1", "page-title", TABS[0].label),
      el("span", "page-note", fallback ? "\u6700\u8FD1\u66F4\u65B0 \xB7 \u663E\u793A " + recent.length + " \u6761" : (state.refDate ? formatDateISO(state.refDate) : "") + " \u4E3A\u57FA\u51C6 \xB7 \u8FD1 " + recentDays + " \u5929")
    );
    wrap.append(head);
    const stats = el("div", "stats");
    stats.append(
      statBlock("\u8FD1 " + recentDays + " \u5929\u66F4\u65B0", recentWindow.length),
      statBlock(pendingStatuses.join(" / ") || "\u5F85\u5904\u7406", pending.length),
      statBlock(deadlineDays + " \u5929\u5185\u622A\u6B62", deadlines.length)
    );
    wrap.append(stats);
    const focus = sortByPriority(filteredDocs(recent)).slice(0, Number(todayConfig.focusCount) || 3);
    if (focus.length) {
      const section = el("section", "section");
      const sectionHead = el("div", "section-head");
      sectionHead.append(
        el("h2", "section-title", "\u91CD\u70B9\u5173\u6CE8"),
        el("span", "section-note", fallback ? "\u6309\u4F18\u5148\u7EA7\u6392\u5E8F" : "\u6309\u4F18\u5148\u7EA7\u6392\u5E8F\uFF0C\u70B9\u5F00\u53EF\u7F16\u8F91\u6458\u8981")
      );
      section.append(sectionHead);
      const grid = el("div", "highlights");
      for (const doc of focus) {
        const card = el("button", "highlight");
        card.type = "button";
        const top = el("span", "highlight-top");
        top.append(
          el("span", "highlight-meta", [doc.level, doc.type, formatDate(doc.publish_date)].filter(Boolean).join(" \xB7 ")),
          badge(docStatus(doc), toneForStatus(docStatus(doc)))
        );
        card.append(top, el("span", "highlight-title", doc.title), el("span", "highlight-summary", docSummary(doc) || "\u6682\u65E0\u6458\u8981"));
        card.addEventListener("click", () => openDoc(doc.doc_id));
        grid.append(card);
      }
      section.append(grid);
      wrap.append(section);
    }
    const feed = el("section", "section");
    const feedHead = el("div", "section-head");
    const feedDocs = sortByDate(filteredDocs(recent));
    feedHead.append(
      el("h2", "section-title", "\u52A8\u6001"),
      el("span", "section-note", fallback ? "\u6700\u8FD1 " + feedDocs.length + " \u6761" : feedDocs.length + " \u6761 \xB7 \u8FD1 " + recentDays + " \u5929")
    );
    feed.append(feedHead, docList(feedDocs, fallback ? "\u6700\u8FD1\u6CA1\u6709\u5339\u914D\u7684\u6761\u76EE" : "\u8FD1 " + recentDays + " \u5929\u6CA1\u6709\u5339\u914D\u7684\u6761\u76EE"));
    wrap.append(feed);
    return wrap;
  }
  function renderLibrary() {
    const docs = filteredDocs(itemDocs());
    const wrap = el("div", "page");
    const head = el("div", "page-head");
    head.append(
      el("h1", "page-title", TABS[1].label),
      el("span", "page-note", "\u5171 " + docs.length + " \u6761" + (state.generatedAt ? " \xB7 \u6570\u636E\u65E5\u671F " + state.generatedAt : ""))
    );
    wrap.append(head, docList(docs));
    return wrap;
  }
  function renderReports() {
    const docs = filteredReports();
    const wrap = el("div", "page");
    const head = el("div", "page-head");
    head.append(
      el("h1", "page-title", TABS[2].label),
      el("span", "page-note", "\u5171 " + docs.length + " \u4EFD \xB7 " + LIB_ROOT + "/reports.json")
    );
    wrap.append(head, docList(docs, "\u62A5\u544A\u76EE\u5F55\u91CC\u8FD8\u6CA1\u6709\u5185\u5BB9"));
    return wrap;
  }
  function settingCard(title, rows, actions) {
    const card = el("div", "setting-card");
    card.append(el("h3", "", title));
    for (const row of rows) {
      const line = el("div", "setting-row");
      line.append(el("span", "setting-key", row[0]), el("span", "setting-value", row[1]));
      card.append(line);
    }
    if (actions && actions.length) {
      const bar = el("div", "setting-actions");
      for (const action of actions) bar.append(action);
      card.append(bar);
    }
    return card;
  }
  function settingsButton(label, onClick) {
    const button = el("button", "btn small", label);
    button.type = "button";
    button.addEventListener("click", onClick);
    return button;
  }
  function renderSettings() {
    const config2 = state.config || {};
    const directory = state.directory || "\u9879\u76EE\u6839";
    const libraryPath = directory === "\u9879\u76EE\u6839" ? LIB_ROOT : directory + "/" + LIB_ROOT;
    const wrap = el("div", "page settings");
    const head = el("div", "page-head");
    head.append(el("h1", "page-title", TABS[3].label), el("span", "page-note", "\u6570\u636E\u4F4D\u7F6E\u3001\u672C\u5730\u670D\u52A1\u548C Agent \u5DE5\u5177"));
    wrap.append(head);
    wrap.append(settingCard("\u5DE5\u4F5C\u53F0", [
      ["\u6807\u9898", config2.title || "\u5DE5\u4F5C\u53F0"],
      ["\u8BF4\u660E", config2.description || "\u2014"],
      ["\u6570\u636E\u76EE\u5F55", libraryPath + "/"],
      ["\u6570\u636E\u7248\u672C", config2.schema || "workbench-config/v1"],
      ["\u5185\u5BB9", itemDocs().length + " \u6761 / " + reportDocs().length + " \u4EFD\u62A5\u544A"],
      ["\u6279\u6CE8", Object.keys(state.annotations).length + " \u6761"],
      ["\u57FA\u51C6\u65E5\u671F", state.refDate ? formatDateISO(state.refDate) : "\u2014"]
    ], [
      settingsButton("\u91CD\u65B0\u8BFB\u53D6", () => void loadData()),
      settingsButton("\u590D\u5236\u6570\u636E\u76EE\u5F55", () => void copyText(LIB_ROOT))
    ]));
    wrap.append(settingCard("\u6570\u636E\u6587\u4EF6", [
      ["\u914D\u7F6E", LIB_ROOT + "/config.json"],
      ["\u7D22\u5F15", LIB_ROOT + "/index.json"],
      ["\u6279\u6CE8", LIB_ROOT + "/annotations.json"],
      ["\u62A5\u544A", LIB_ROOT + "/reports.json"],
      ["\u6B63\u6587", LIB_ROOT + "/items/<id>/content.md"],
      ["\u6279\u6CE8\u526F\u672C", LIB_ROOT + "/_notes/<id>.md"]
    ], [
      settingsButton("\u590D\u5236\u542F\u52A8\u547D\u4EE4", () => void copyText("node server/server.mjs"))
    ]));
    wrap.append(settingCard("\u672C\u5730\u539F\u4EF6", [
      ["\u670D\u52A1\u5730\u5740", LOCAL_BASE],
      ["\u542F\u52A8\u65B9\u5F0F", "\u5728\u6A21\u677F\u4ED3\u5E93\u6839\u76EE\u5F55\u8FD0\u884C node server/server.mjs"],
      ["\u663E\u793A\u6761\u4EF6", "\u6761\u76EE\u5E26\u6709 original_path \u65F6\u624D\u663E\u793A\u201C\u672C\u5730\u539F\u4EF6\u201D"],
      ["\u8BF4\u660E", "PDF/HTML \u901A\u8FC7\u672C\u673A\u670D\u52A1\u6253\u5F00\uFF1B\u672A\u542F\u52A8\u65F6\u94FE\u63A5\u65E0\u6CD5\u8BBF\u95EE\u3002"]
    ], [
      settingsButton("\u590D\u5236\u670D\u52A1\u5730\u5740", () => void copyText(LOCAL_BASE))
    ]));
    wrap.append(settingCard("Agent \u5DE5\u5177", [
      ["\u5DE5\u4F5C\u53F0", "workbench_list / workbench_read / workbench_write"],
      ["\u8D44\u6599\u5E93", "library_search / library_read"],
      ["\u5199\u5165\u76EE\u6807", LIB_ROOT + "/annotations.json \u4E0E " + LIB_ROOT + "/_notes/<id>.md"]
    ]));
    wrap.append(settingCard("\u5B89\u88C5\u4F4D\u7F6E", [
      ["\u9879\u76EE\u6839", "\u6A21\u677F\u4ED3\u5E93\u6839\u76EE\u5F55"],
      ["\u6269\u5C55\u76EE\u5F55", "adapters/openchamber"],
      ["\u6570\u636E\u76EE\u5F55", LIB_ROOT + "/"],
      ["\u63D2\u4EF6\u8DEF\u5F84", "plugin/"]
    ]));
    wrap.append(settingCard("\u5FEB\u6377\u952E", [
      ["\u641C\u7D22", "/"],
      ["\u6E05\u7A7A\u641C\u7D22 / \u8FD4\u56DE", "Esc"],
      ["\u4FDD\u5B58\u6279\u6CE8", "Ctrl / Cmd + S"]
    ]));
    return wrap;
  }
  function metaChip(text2, mono) {
    return el("span", "meta-chip" + (mono ? " mono" : ""), text2);
  }
  function actionButton(label, className, onClick, disabled) {
    const button = el("button", "btn " + className, label);
    button.type = "button";
    button.disabled = Boolean(disabled);
    button.addEventListener("click", onClick);
    return button;
  }
  function markdownBlock(text2, className) {
    const block2 = el("div", "prose" + (className ? " " + className : ""));
    block2.innerHTML = md.render(String(text2 || ""));
    return block2;
  }
  function stripLeadingTitle(text2, title) {
    const source = String(text2 || "");
    const match = /^\s*#\s+(.+?)\s*(?:\r?\n|$)/.exec(source);
    if (!match) return source;
    if (match[1].trim() !== String(title || "").trim()) return source;
    return source.slice(match[0].length);
  }
  function renderEditor() {
    const form = el("div", "edit-form");
    const summaryLabel = el("label", "edit-field");
    summaryLabel.append(el("span", "edit-label", t("summary", "\u6458\u8981")));
    const summary = el("textarea", "edit-area");
    summary.id = "edit-summary";
    summary.rows = 4;
    summary.value = state.draft.summary;
    summary.placeholder = "\u4E00\u53E5\u8BDD\u8BF4\u660E\u8FD9\u6761\u5185\u5BB9\u662F\u4EC0\u4E48\uFF0C\u4EE5\u53CA\u4E3A\u4EC0\u4E48\u503C\u5F97\u770B\u3002\u652F\u6301 Markdown\u3002";
    summary.addEventListener("input", () => {
      state.draft.summary = summary.value;
    });
    summaryLabel.append(summary);
    const judgmentLabel = el("label", "edit-field");
    judgmentLabel.append(el("span", "edit-label", t("judgment", "\u5224\u65AD")));
    const judgment = el("textarea", "edit-area");
    judgment.rows = 3;
    judgment.value = state.draft.judgment;
    judgment.placeholder = "\u5F71\u54CD\u3001\u622A\u6B62\u65F6\u95F4\u3001\u4E0B\u4E00\u6B65\u52A8\u4F5C\u6216\u9700\u8981\u8C01\u8DDF\u8FDB\u3002\u652F\u6301 Markdown\u3002";
    judgment.addEventListener("input", () => {
      state.draft.judgment = judgment.value;
    });
    judgmentLabel.append(judgment);
    const statusOptions = statuses().map((item) => ({ id: item.label, label: item.label }));
    if (state.draft.status && !statusOptions.some((item) => item.id === state.draft.status)) {
      statusOptions.unshift({ id: state.draft.status, label: state.draft.status });
    }
    const row = el("div", "edit-row");
    row.append(
      selectControl("\u72B6\u6001", statusOptions, state.draft.status, (value) => {
        state.draft.status = value;
      }),
      el("span", "edit-hint", "\u4FDD\u5B58\u5230 annotations.json\uFF1B\u6B63\u6587 content.md \u4E0D\u4F1A\u88AB\u4FEE\u6539\u3002")
    );
    form.append(summaryLabel, judgmentLabel, row);
    return form;
  }
  function renderDetail(doc) {
    const wrap = el("div", "detail-wrap");
    const detail = el("div", "detail");
    const back = el("button", "back-link", "\u2190 \u8FD4\u56DE");
    back.type = "button";
    back.addEventListener("click", closeDetail);
    detail.append(back);
    detail.append(el("h1", "detail-title", doc.title));
    const meta = el("div", "meta");
    meta.append(
      metaChip(doc.level || "\u2014"),
      metaChip(doc.type || "\u2014"),
      metaChip(formatDate(doc.publish_date), true)
    );
    if (doc.issuer) meta.append(metaChip(doc.issuer));
    if (doc.doc_number) meta.append(metaChip(doc.doc_number, true));
    if (doc.period) meta.append(metaChip(doc.period, true));
    meta.append(badge(docStatus(doc), toneForStatus(docStatus(doc))));
    detail.append(meta);
    const links = el("div", "detail-links");
    if (doc.source_url) links.append(actionButton("\u539F\u6587\u94FE\u63A5", "link-btn", () => void openUrl(doc.source_url)));
    if (doc.original_path) links.append(actionButton("\u672C\u5730\u539F\u4EF6", "link-btn", () => void openUrl(localOriginalUrl(doc.original_path))));
    links.append(actionButton("\u590D\u5236 ID", "link-btn", () => void copyText(doc.doc_id)));
    detail.append(links);
    const note = el("section", "note-block");
    const noteHead = el("div", "note-head");
    noteHead.append(el("h2", "note-title", t("summary", "\u6458\u8981") + " / " + t("judgment", "\u5224\u65AD")));
    if (!state.editing) noteHead.append(actionButton("\u7F16\u8F91", "link-btn", enterEdit));
    note.append(noteHead);
    if (state.editing) {
      note.append(renderEditor());
    } else {
      if (docSummary(doc)) note.append(markdownBlock(docSummary(doc)));
      else note.append(el("div", "note-empty", "\u8FD8\u6CA1\u6709\u6458\u8981\u3002\u70B9\u201C\u7F16\u8F91\u201D\u5199\u4E00\u6761\u3002"));
      if (docJudgment(doc)) {
        note.append(el("h3", "note-sub", t("judgment", "\u5224\u65AD")));
        note.append(markdownBlock(docJudgment(doc)));
      } else {
        note.append(el("div", "note-empty", "\u8FD8\u6CA1\u6709\u5224\u65AD\u3002\u70B9\u201C\u7F16\u8F91\u201D\u8865\u5145\u5F71\u54CD\u3001\u622A\u6B62\u65F6\u95F4\u6216\u4E0B\u4E00\u6B65\u3002"));
      }
    }
    detail.append(note);
    const original = el("section", "original-block");
    const originalHead = el("div", "section-head");
    originalHead.append(
      el("h2", "section-title", doc.is_report ? "\u62A5\u544A\u5168\u6587" : "\u539F\u6587"),
      el("span", "section-note", doc.is_report ? "\u6765\u81EA reports.json\uFF0C\u53EA\u8BFB" : "\u6765\u81EA content.md\uFF0C\u53EA\u8BFB")
    );
    original.append(originalHead);
    if (state.contentLoading) {
      original.append(el("div", "loading", "\u6B63\u5728\u8BFB\u53D6\u6B63\u6587\u2026"));
    } else if (state.contentError) {
      const notice = el("div", "notice");
      notice.append(el("span", "notice-text", state.contentError));
      notice.append(actionButton("\u91CD\u8BD5", "btn small", () => void loadDocContent(doc)));
      original.append(notice);
    } else {
      original.append(markdownBlock(stripLeadingTitle(state.currentContent, doc.title), "doc-body"));
    }
    detail.append(original);
    wrap.append(detail);
    const bar = el("div", "action-bar");
    bar.append(
      actionButton(state.editing ? "\u53D6\u6D88" : "\u7F16\u8F91", "btn", () => {
        if (state.editing) cancelEdit();
        else enterEdit();
      }),
      actionButton(state.saving ? "\u4FDD\u5B58\u4E2D\u2026" : "\u4FDD\u5B58", "btn primary", () => void saveAnnotation(), !state.editing || state.saving),
      actionButton("\u8BA9 Agent \u5206\u6790", "btn", () => void sendDoc(doc, true, "analyze")),
      actionButton("\u653E\u5165\u5BF9\u8BDD", "btn ghost", () => void sendDoc(doc, false, "compose")),
      actionButton("\u53D1\u9001", "btn ghost", () => void sendDoc(doc, true, "send"))
    );
    wrap.append(bar);
    return wrap;
  }
  function localOriginalUrl(path) {
    const clean = String(path || "").replace(/^\/+/, "");
    return LOCAL_BASE + encodeURI(clean);
  }
  async function readProjectFile(path, previewPath) {
    try {
      const result = await host.readFile(path);
      return { content: result && typeof result === "object" ? result.content : result, viaHost: true };
    } catch (error2) {
      if (!previewPath) throw error2;
      const response = await fetch(previewPath, { cache: "no-store" });
      if (!response.ok) throw error2;
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
    state.contentError = "";
    els.main.scrollTop = 0;
    const cached = state.contentCache.get(id);
    if (cached !== void 0) {
      state.currentContent = cached;
      state.contentLoading = false;
      render();
      return;
    }
    state.currentContent = "";
    state.contentLoading = true;
    render();
    void loadDocContent(doc);
  }
  function closeDetail() {
    state.selectedId = "";
    state.editing = false;
    state.saving = false;
    state.currentContent = "";
    state.contentLoading = false;
    state.contentError = "";
    render();
    els.main.scrollTop = 0;
  }
  async function loadDocContent(doc) {
    if (!doc) return;
    if (state.contentCache.has(doc.doc_id)) {
      state.currentContent = state.contentCache.get(doc.doc_id);
      state.contentLoading = false;
      state.contentError = "";
      renderMain();
      return;
    }
    if (doc.content) {
      state.contentCache.set(doc.doc_id, doc.content);
      state.currentContent = doc.content;
      state.contentLoading = false;
      state.contentError = "";
      renderMain();
      return;
    }
    if (!doc.path) {
      state.currentContent = "";
      state.contentLoading = false;
      state.contentError = "\u8FD9\u6761\u5185\u5BB9\u6CA1\u6709\u6B63\u6587\u6587\u4EF6\u3002";
      renderMain();
      return;
    }
    state.contentLoading = true;
    state.contentError = "";
    renderMain();
    try {
      const result = await readProjectFile(LIB_ROOT + "/" + doc.path, "../../../workbench/" + doc.path);
      state.contentCache.set(doc.doc_id, result.content || "");
      if (state.selectedId === doc.doc_id) {
        state.currentContent = result.content || "";
        state.contentError = "";
      }
    } catch (error2) {
      if (state.selectedId === doc.doc_id) {
        state.currentContent = "";
        state.contentError = "\u65E0\u6CD5\u8BFB\u53D6\u6B63\u6587\uFF1A" + (error2 && error2.message ? error2.message : error2);
      }
    } finally {
      if (state.selectedId === doc.doc_id) {
        state.contentLoading = false;
        renderMain();
      }
    }
  }
  function enterEdit() {
    const doc = docById(state.selectedId);
    if (!doc) return;
    state.draft = {
      summary: docSummary(doc),
      judgment: docJudgment(doc),
      status: docStatus(doc) || defaultStatus()
    };
    state.editing = true;
    renderMain();
    const area = document.querySelector("#edit-summary");
    if (area) area.focus();
  }
  function cancelEdit() {
    state.editing = false;
    state.saving = false;
    renderMain();
  }
  function noteFileName(id) {
    const safe = String(id || "").replace(/[\\/:*?"<>|\s]+/g, "_");
    return safe || "item-" + Date.now();
  }
  function annotationMarkdown(doc, annotation) {
    return [
      "---",
      "doc_id: " + doc.doc_id,
      "title: " + JSON.stringify(doc.title),
      "status: " + annotation.status,
      "updated_at: " + annotation.updated_at,
      "---",
      "",
      "# " + doc.title,
      "",
      "## \u6458\u8981",
      "",
      annotation.summary || "",
      "",
      "## \u5224\u65AD",
      "",
      annotation.judgment || "",
      "",
      "\u94FE\u63A5\uFF1A" + (doc.source_url || (doc.path ? LIB_ROOT + "/" + doc.path : "\u2014")),
      ""
    ].join("\n");
  }
  async function saveAnnotation() {
    const doc = docById(state.selectedId);
    if (!doc || !state.editing || state.saving) return;
    const updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    const annotation = {
      summary: state.draft.summary.trim(),
      judgment: state.draft.judgment.trim(),
      status: state.draft.status || defaultStatus(),
      updated_at: updatedAt
    };
    const next = Object.assign(/* @__PURE__ */ Object.create(null), state.annotations);
    next[doc.doc_id] = annotation;
    if (state.preview) {
      state.annotations = next;
      state.editing = false;
      renderMain();
      toast("\u9884\u89C8\u6A21\u5F0F\uFF1A\u5DF2\u66F4\u65B0\u5F53\u524D\u89C6\u56FE\uFF0C\u672A\u5199\u5165\u78C1\u76D8\u3002");
      return;
    }
    state.saving = true;
    renderMain();
    try {
      const payload = {
        schema: "workbench-annotations/v1",
        updated_at: updatedAt,
        items: next
      };
      await host.writeFile(ANNOTATIONS_PATH, JSON.stringify(payload, null, 2));
      await host.writeFile(NOTES_DIR + "/" + noteFileName(doc.doc_id) + ".md", annotationMarkdown(doc, annotation));
      state.annotations = next;
      state.editing = false;
      state.saving = false;
      state.statusMessage = "\u5DF2\u4FDD\u5B58 " + doc.doc_id;
      render();
      toast("\u6458\u8981 / \u5224\u65AD\u5DF2\u4FDD\u5B58");
    } catch (error2) {
      state.saving = false;
      renderMain();
      toast("\u4FDD\u5B58\u5931\u8D25\uFF1A" + (error2 && error2.message ? error2.message : error2));
    }
  }
  function docContext(doc) {
    const lines = [
      "\u3010\u5DE5\u4F5C\u53F0\u3011" + doc.title,
      "ID\uFF1A" + doc.doc_id,
      [doc.level, doc.type, formatDate(doc.publish_date), doc.issuer].filter(Boolean).join(" \xB7 "),
      "\u6458\u8981\uFF1A" + (docSummary(doc) || "\u6682\u65E0"),
      "\u5224\u65AD\uFF1A" + (docJudgment(doc) || "\u6682\u65E0")
    ];
    if (doc.source_url) lines.push("\u539F\u6587\uFF1A" + doc.source_url);
    else if (doc.path) lines.push("\u6B63\u6587\uFF1A" + LIB_ROOT + "/" + doc.path);
    return lines.join("\n");
  }
  async function sendDoc(doc, send, mode) {
    let text2 = docContext(doc);
    if (mode === "analyze") {
      text2 = "\u8BF7\u4ECE\u8981\u70B9\u3001\u5F71\u54CD\u3001\u4E0B\u4E00\u6B65\u548C\u65F6\u95F4\u7A97\u53E3\u56DB\u4E2A\u89D2\u5EA6\u5206\u6790\u4E0B\u9762\u8FD9\u6761\u5185\u5BB9\u3002\n\n" + text2;
    }
    try {
      await host.prompt({ text: text2, send });
      toast(send ? "\u5DF2\u53D1\u9001\u5230\u5F53\u524D\u4F1A\u8BDD" : "\u5DF2\u653E\u5165\u5BF9\u8BDD");
    } catch (error2) {
      toast("\u53D1\u9001\u5931\u8D25\uFF1A" + (error2 && error2.message ? error2.message : error2));
    }
  }
  async function openUrl(url) {
    try {
      await host.openUrl(url);
    } catch (error2) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }
  async function copyText(text2) {
    try {
      await host.writeClipboard(text2);
      toast("\u5DF2\u590D\u5236");
    } catch (error2) {
      try {
        await navigator.clipboard.writeText(text2);
        toast("\u5DF2\u590D\u5236");
      } catch (copyError) {
        toast("\u590D\u5236\u5931\u8D25\uFF0C\u8BF7\u624B\u52A8\u9009\u62E9\u6587\u672C\u3002");
      }
    }
  }
  function renderStatus() {
    els.status.textContent = state.statusMessage;
    els.meta.textContent = state.loaded ? itemDocs().length + " \u6761 / " + reportDocs().length + " \u4EFD\u62A5\u544A \xB7 " + (state.generatedAt || "\u672A\u6807\u6CE8\u65E5\u671F") : "workbench";
    els.previewBadge.hidden = !state.preview;
    els.close.hidden = state.surface !== "dialog";
  }
  function renderMain() {
    els.main.replaceChildren();
    if (!state.loaded) {
      els.main.append(el("div", "loading", "\u6B63\u5728\u8BFB\u53D6\u5DE5\u4F5C\u53F0\u2026"));
      return;
    }
    if (state.selectedId) {
      const doc = docById(state.selectedId);
      if (doc) {
        els.main.append(renderDetail(doc));
        return;
      }
      state.selectedId = "";
    }
    if (state.tab === "today") els.main.append(renderToday());
    else if (state.tab === "library") els.main.append(renderLibrary());
    else if (state.tab === "reports") els.main.append(renderReports());
    else els.main.append(renderSettings());
  }
  function render() {
    renderTabs();
    renderFilters();
    renderMain();
    renderStatus();
  }
  var toastTimer = 0;
  function toast(message) {
    els.toast.textContent = message;
    els.toast.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      els.toast.hidden = true;
    }, 2800);
  }
  async function loadData() {
    state.statusMessage = "\u6B63\u5728\u8BFB\u53D6\u5DE5\u4F5C\u53F0\u2026";
    renderStatus();
    const results = await Promise.allSettled([
      loadJson(INDEX_PATH, PREVIEW_INDEX),
      loadJson(REPORTS_PATH, PREVIEW_REPORTS),
      loadJson(ANNOTATIONS_PATH, PREVIEW_ANNOTATIONS),
      loadJson(LIB_ROOT + "/config.json", PREVIEW_CONFIG)
    ]);
    const indexResult = results[0];
    const reportsResult = results[1];
    const annotationsResult = results[2];
    const configResult = results[3];
    let viaHost = false;
    let items = [];
    let generatedAt = "";
    if (indexResult.status === "fulfilled" && indexResult.value && indexResult.value.value && Array.isArray(indexResult.value.value.items)) {
      items = indexResult.value.value.items.filter((item) => item && typeof item.id === "string" && typeof item.title === "string").map(mapItem);
      generatedAt = indexResult.value.value.generated_at || "";
      viaHost = indexResult.value.viaHost;
    } else {
      const fallbackItems = workbench_default && Array.isArray(workbench_default.items) ? workbench_default.items : [];
      items = fallbackItems.filter((item) => item && typeof item.id === "string" && typeof item.title === "string").map(mapItem);
      generatedAt = workbench_default && workbench_default.generated_at || "";
    }
    let config2 = DEFAULT_CONFIG;
    if (configResult.status === "fulfilled" && configResult.value && configResult.value.value && typeof configResult.value.value === "object") {
      config2 = configResult.value.value;
    }
    let reports = [];
    if (reportsResult.status === "fulfilled" && reportsResult.value && reportsResult.value.value && Array.isArray(reportsResult.value.value.reports)) {
      reports = reportsResult.value.value.reports.filter((report) => report && typeof report.id === "string").map(mapReport);
    }
    const annotations = annotationsResult.status === "fulfilled" && annotationsResult.value && annotationsResult.value.value && annotationsResult.value.value.items && typeof annotationsResult.value.value.items === "object" && !Array.isArray(annotationsResult.value.value.items) ? annotationsResult.value.value.items : {};
    state.config = config2;
    state.items = items;
    state.reports = reports;
    state.docs = items.concat(reports);
    state.annotations = annotations;
    state.generatedAt = generatedAt;
    state.refDate = computeReferenceDate();
    state.loaded = true;
    state.preview = !viaHost;
    state.contentCache.clear();
    state.selectedId = "";
    state.editing = false;
    state.saving = false;
    state.currentContent = "";
    state.contentLoading = false;
    state.contentError = "";
    state.statusMessage = "\u5DF2\u8BFB\u53D6 " + items.length + " \u6761 / " + reports.length + " \u4EFD\u62A5\u544A";
    document.title = config2.title || "\u5DE5\u4F5C\u53F0";
    els.brandName.textContent = config2.title || "\u5DE5\u4F5C\u53F0";
    els.brandMark.textContent = config2.mark || "W";
    els.search.placeholder = t("searchPlaceholder", "\u641C\u7D22\u6807\u9898\u3001\u673A\u6784\u3001\u6587\u53F7\u6216\u5173\u952E\u8BCD");
    render();
  }
  els.search.addEventListener("input", () => {
    state.search = els.search.value;
    if (state.selectedId) {
      state.selectedId = "";
      state.editing = false;
      state.currentContent = "";
      state.contentLoading = false;
      state.contentError = "";
      render();
      return;
    }
    renderFilters();
    renderMain();
  });
  els.refresh.addEventListener("click", () => void loadData());
  els.close.addEventListener("click", () => {
    void host.close().catch(() => void 0);
  });
  document.addEventListener("keydown", (event) => {
    const modifier = event.ctrlKey || event.metaKey;
    if (modifier && String(event.key).toLowerCase() === "s") {
      event.preventDefault();
      if (state.editing) void saveAnnotation();
      return;
    }
    if (event.key === "Escape") {
      if (document.activeElement === els.search) {
        state.search = "";
        els.search.value = "";
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
    const typing = target instanceof HTMLElement && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable);
    if (event.key === "/" && !typing) {
      event.preventDefault();
      els.search.focus();
      els.search.select();
    }
  });
  els.main.addEventListener("click", (event) => {
    const anchor = event.target.closest("a[href]");
    if (!anchor) return;
    const href = anchor.getAttribute("href");
    if (!href || href.charAt(0) === "#") return;
    event.preventDefault();
    if (/^https?:\/\//i.test(href) || href.indexOf(LOCAL_BASE) === 0) {
      void openUrl(href);
    } else {
      toast("\u6682\u4E0D\u6253\u5F00\u94FE\u63A5\uFF1A" + href);
    }
  });
  host.onReady((ctx) => {
    state.surface = ctx.surface || "panel";
    state.directory = ctx.directory || "";
    state.session = ctx.session || null;
    document.body.dataset.theme = ctx.theme && ctx.theme.mode === "dark" ? "dark" : "light";
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
})();
/*! Bundled license information:

markdown-it/dist/markdown-it.mjs:
  (*! markdown-it 15.0.3 https://github.com/markdown-it/markdown-it @license MIT *)
*/
