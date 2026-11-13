# 适配器

适配器只做一件事：把某个宿主的文件、会话、剪贴板和窗口能力，翻译成 `window.workbenchHost` 接口。**领域逻辑、UI、数据格式都不应该出现在适配器里。**

`core/app.js` 不 import 任何宿主 SDK。它只调用 `core/host.js` 暴露的 11 个方法。这样同一份工作台可以跑在浏览器、侧栏面板、桌面壳或编辑器插件里。

## 适配器对照

| 适配器 | 位置 | 数据来源 | 会话能力 | 适用场景 |
| --- | --- | --- | --- | --- |
| Web（内置） | `core/host.js` | 本地 server 的 `/api/*` | 无，复制到剪贴板 | 浏览器预览、评审、最小可用版 |
| OpenChamber | `adapters/openchamber/`（参考实现，独立维护） | 宿主文件 API 或本地 server | prompt / openUrl / clipboard | 侧栏 panel、整页、dialog |
| DSH | 自行实现 | 宿主文件 API 或本地 server | 宿主 prompt | DSH 插件/面板 |
| OpenCode | 自行实现 | 文件系统/工具或本地 server | session prompt | OpenCode 工作区 |
| 只读静态 | 自行实现 | `fetch` 预生成的 JSON | 无 | 展示、评审、归档 |

> `adapters/openchamber/` 由参考实现单独维护；本目录只说明接口和适配思路。

## Host 接口

```ts
interface WorkbenchHost {
  name: string;
  capabilities: {
    chat: boolean;
    files: boolean;
    clipboard: boolean;
    externalLinks: boolean;
  };

  ready(): Promise<{ surface?: 'panel' | 'page' | 'dialog'; theme?: 'light' | 'dark' }>;

  loadConfig(): Promise<Config>;
  loadIndex(): Promise<Index>;
  loadAnnotations(): Promise<Annotations>;
  saveAnnotations(payload: Annotations): Promise<{ ok: true; updated_at: string }>;
  loadItem(id: string): Promise<{ item: Item; content: string }>;
  loadReports(): Promise<Reports>;

  sendToAgent(input: {
    text: string;
    mode: 'analyze' | 'compose' | 'send';
  }): Promise<{ delivered: boolean; copied?: boolean; note?: string }>;

  openExternal(url: string): Promise<void>;
  copyText(text: string): Promise<void>;
  close(): Promise<void>;
}
```

### 方法约定

| 方法 | 必须返回 | 说明 |
| --- | --- | --- |
| `ready` | 对象 | 可返回 `theme: 'dark'` 让页面切换深色变量；`surface` 供适配器自己用 |
| `loadConfig` | 解析后的对象 | 不要返回 JSON 字符串 |
| `loadIndex` | `{ items: Item[] }` | 至少校验 `items` 是数组 |
| `loadAnnotations` | `{ items: Record<string, Annotation> }` | 文件不存在时返回 `{ items: {} }` |
| `saveAnnotations` | `{ ok: true, updated_at }` | 只写 `annotations.json`，不要写 `content.md` |
| `loadItem` | `{ item, content }` | `content` 是 Markdown 字符串 |
| `loadReports` | `{ reports: Report[] }` | 没有报告时返回空数组 |
| `sendToAgent` | `{ delivered, copied?, note? }` | `analyze` 应带上分析指令；`compose` 只放入输入框；`send` 直接发送 |
| `openExternal` | `void` | 只允许 `http(s)` |
| `copyText` | `void` | 失败时抛错，让 UI 提示 |
| `close` | `void` | 浏览器里可以是空实现 |

错误用 `throw new Error('人话')`。`app.js` 会把 message 显示在 toast 或错误框里；不要返回 `{ error: ... }` 让 UI 猜。

## 两种接法

### A. Server-backed（最省事）

页面仍由 `server/server.mjs` 提供，`core/host.js` 的内置 web 适配器负责 `/api/*`。适配器只额外接管会话动作。

这种接法要先加载 `host.js`，再加载包装脚本（两者都在 `app.js` 之前）：

```html
<script src="host.js"></script>
<script src="adapter-host.js"></script>
<script src="vendor/markdown-it.umd.min.js"></script>
<script src="markdown.js"></script>
<script src="app.js"></script>
```

```js
// adapter-host.js
const web = window.WorkbenchHost.createWebHost();

window.workbenchHost = {
  ...web,
  name: 'my-host',
  capabilities: { ...web.capabilities, chat: true, files: true },
  async sendToAgent({ text, mode }) {
    if (mode === 'compose') {
      await myHost.fillPrompt(text);       // 放入输入框
    } else {
      await myHost.prompt(text, { send: true });
    }
    return { delivered: true };
  }
};
```

适合：宿主能加载 `http://127.0.0.1:8787`，并且你接受本机跑一个 Node 进程。

### B. Host-file-backed（无 server）

适配器直接实现全部方法，从宿主的文件 API 读取 `workbench/`。下面假设 `myHost.readFile` 返回字符串；如果它返回 `{ content }`，先取 `.content` 再 `JSON.parse`。

```js
window.workbenchHost = {
  name: 'my-host',
  capabilities: { chat: true, files: true, clipboard: true, externalLinks: true },

  async ready() {
    return { surface: 'panel', theme: 'light' };
  },

  async loadConfig() {
    return JSON.parse(await myHost.readFile('workbench/config.json'));
  },

  async loadIndex() {
    return JSON.parse(await myHost.readFile('workbench/index.json'));
  },

  async loadAnnotations() {
    try {
      return JSON.parse(await myHost.readFile('workbench/annotations.json'));
    } catch {
      return { schema: 'workbench-annotations/v1', updated_at: '', items: {} };
    }
  },

  async saveAnnotations(payload) {
    await myHost.writeFile(
      'workbench/annotations.json',
      JSON.stringify(payload, null, 2) + '\n'
    );
    return { ok: true, updated_at: payload.updated_at };
  },

  async loadItem(id) {
    const index = await this.loadIndex();
    const item = index.items.find((entry) => entry.id === id);
    if (!item) throw new Error('没有找到条目 ' + id);
    const content = await myHost.readFile('workbench/' + item.content_path);
    return { item, content };
  },

  async loadReports() {
    return JSON.parse(await myHost.readFile('workbench/reports.json'));
  },

  async sendToAgent({ text, mode }) {
    if (mode === 'compose') await myHost.fillPrompt(text);
    else await myHost.prompt(text, { send: true });
    return { delivered: true };
  },

  async openExternal(url) { await myHost.openUrl(url); },
  async copyText(text) { await myHost.writeClipboard(text); },
  async close() { await myHost.close(); }
};
```

适合：宿主已有文件读写和会话 API，不想额外跑 server。注意：路径拼接必须由适配器完成，只接受条目 id，不能让前端传任意路径。

## 注入顺序

适配器不要改 `core/index.html`。在自己的入口 HTML 里按接法保持顺序。

**完整宿主（文件模式）**：先设置 `window.workbenchHost`，再加载 `host.js`：

```html
<script src="adapter-host.js"></script>   <!-- 先设置 window.workbenchHost -->
<script src="host.js"></script>          <!-- 校验接口，缺失则回退到 web -->
<script src="vendor/markdown-it.umd.min.js"></script>
<script src="markdown.js"></script>
<script src="app.js"></script>
```

**Server-backed 包装**：先加载 `host.js`，再包一层 web 适配器：

```html
<script src="host.js"></script>
<script src="adapter-host.js"></script>   <!-- 用 WorkbenchHost.createWebHost() 包装 -->
<script src="vendor/markdown-it.umd.min.js"></script>
<script src="markdown.js"></script>
<script src="app.js"></script>
```

如果宿主只能加载 `core/index.html`，可在服务端把 `adapter-host.js` 注入到正确位置，或用宿主提供的 preload 在页面脚本前设置 `window.workbenchHost`。

`host.js` 会检查 11 个方法是否齐全；缺方法时在 console 警告并回退到 web 适配器。适配器开发时留意这条警告。

## 能力矩阵

| 能力 | Web | OpenChamber | DSH | OpenCode |
| --- | --- | --- | --- | --- |
| 读配置/索引/报告 | HTTP | 宿主文件 API | 宿主文件 API | 文件/工具 |
| 保存批注 | PUT API | 宿主写文件 | 宿主写文件 | 文件写 |
| 打开外部链接 | `window.open` | 宿主 openUrl | 宿主 openUrl | 宿主 openUrl |
| 复制 | Clipboard API | 宿主剪贴板 | 浏览器/宿主 | 浏览器/宿主 |
| 分析/放入对话/发送 | 复制降级 | prompt（send 参数） | prompt | session prompt |
| 关闭面板 | 无 | 宿主 close | 宿主 close | 宿主 close |

## 适配器验收清单

- [ ] 11 个方法全部实现，`host.js` 不打印回退警告。
- [ ] `load*` 返回解析后的对象，不是字符串。
- [ ] `saveAnnotations` 只写 `workbench/annotations.json`，不碰 `content.md`。
- [ ] 写文件尽量原子化（临时文件 + rename），失败时抛错。
- [ ] `sendToAgent` 正确区分 `analyze` / `compose` / `send`。
- [ ] 没有聊天能力时，返回 `{ delivered: false, copied: true, note: '...' }`，不要静默失败。
- [ ] `ready` 的 `theme` 能让深色宿主正常工作。
- [ ] 只接受条目 id，不接受前端传入的文件路径。
- [ ] 不在适配器里写领域字段、Tab 或筛选逻辑。
- [ ] 在 420 / 760 / 1000px 三种宽度下试过面板。
- [ ] 权限说明写清楚：读哪些文件、写哪些文件、是否能发消息。

## 不要做

- 不要为每个宿主 fork 一份 `app.js`；差异放进适配器。
- 不要把 API key、令牌或内部地址写进前端。
- 不要绕过 `annotations.json` 直接改原文。
- 不要让适配器依赖 `workbench/config.json` 之外的本机绝对路径。
- 不要在适配器里复制一套数据 schema；引用 `docs/data-contract.md`。
- 不要假设宿主一定有聊天能力；先看 `capabilities.chat`。

