# Host API

`core/app.js` 只通过 `window.workbenchHost` 和外界打交道。这个接口是工作台和宿主之间的**唯一合同**。换宿主时，只换适配器，不改 UI。

## 接口

```ts
type Tone = 'warn' | 'info' | 'ok' | 'muted';

interface WorkbenchHost {
  name: string;
  capabilities: {
    chat: boolean;
    files: boolean;
    clipboard: boolean;
    externalLinks: boolean;
  };

  ready(): Promise<{
    surface?: 'panel' | 'page' | 'dialog';
    theme?: 'light' | 'dark';
  }>;

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

`Config` / `Index` / `Annotations` / `Reports` 的结构见 `docs/data-contract.md`。

## 方法合同

| 方法 | 何时调用 | 返回 | 失败时 |
| --- | --- | --- | --- |
| `ready` | 每次加载/刷新 | `{surface, theme}` | 抛错 → 错误页 |
| `loadConfig` | 加载/刷新 | 配置对象 | 抛错 → 错误页 |
| `loadIndex` | 加载/刷新 | 索引对象 | 抛错 → 错误页 |
| `loadAnnotations` | 加载/刷新 | 批注对象；无文件时 `{items:{}}` | 抛错 → 视为空批注（仍可读，保存可能失败） |
| `saveAnnotations` | 点击保存 / Ctrl+S | `{ok:true, updated_at}` | 抛错 → 保留编辑态 + toast |
| `loadItem` | 打开条目详情 | `{item, content}` | 抛错 → 详情内错误 + 重试 |
| `loadReports` | 加载/刷新 | 报告对象 | 抛错 → 空报告列表 |
| `sendToAgent` | 分析/放入对话/发送 | `{delivered, copied?, note?}` | 抛错 → toast |
| `openExternal` | 点击原文/ Markdown 链接 | `void` | 抛错 → toast |
| `copyText` | 复制 ID/全文/命令 | `void` | 抛错 → toast |
| `close` | 宿主关闭按钮 | `void` | 忽略 |

### `ready`

- 可重复调用，必须幂等。
- `theme: 'dark'` 会给 `<body data-theme="dark">`，使用 `core/styles.css` 里的深色变量。
- `surface` 只影响适配器自己的布局，工作台不依赖它。

### `saveAnnotations`

- 入参是**完整**的批注对象，不是单条 patch。适配器直接覆盖 `annotations.json`。
- 必须只写 `annotations.json`；不要写 `content.md`、`index.json` 或 `config.json`。
- 建议原子写：临时文件 + rename；失败时抛错，不要返回 `ok: true`。
- 服务端会规范化字段；宿主文件适配器也应至少校验 `items` 是对象。

### `sendToAgent`

| mode | 触发按钮 | 期望行为 |
| --- | --- | --- |
| `analyze` | 让 Agent 分析 | 把文本 + 分析指令发到当前会话，通常 `send: true` |
| `compose` | 放入对话 | 只填进输入框，不自动发送 |
| `send` | 发送 | 直接发到当前会话 |

返回值：

- `{ delivered: true }` → UI 提示“已发送/已放入对话”。
- `{ delivered: false, copied: true, note: '...' }` → UI 显示 note，通常是“已复制到剪贴板”。
- `{ delivered: false, copied: false, note: '...' }` → UI 显示 note，说明为什么没发出去。
- 抛错 → UI 显示“操作失败：message”。

**不要静默失败。** 没有聊天能力时，复制 + note 是明确的降级。

### `loadItem`

- 只接受条目 id，不接受路径。
- 适配器自己根据 `index.json` 的 `content_path` 拼路径，并做目录边界检查。
- `content` 是 Markdown 原文，不要在前端做 HTML 转义（渲染层会做）。

## 注入

`core/host.js` 在加载时按这个顺序决定用谁：

1. 如果 `window.workbenchHost` 存在且 11 个方法齐全 → 用它。
2. 如果存在但缺方法 → `console.warn`，回退到 web 适配器。
3. 如果不存在 → 用内置 web 适配器（`/api/*`）。

**完整宿主（文件模式）**：适配器脚本在 `host.js` **之前**执行：

```html
<script src="adapter-host.js"></script>
<script src="host.js"></script>
<script src="vendor/markdown-it.umd.min.js"></script>
<script src="markdown.js"></script>
<script src="app.js"></script>
```

**Server-backed 包装**：先加载 `host.js`，再加载包装脚本：

```html
<script src="host.js"></script>
<script src="adapter-host.js"></script>
<script src="vendor/markdown-it.umd.min.js"></script>
<script src="markdown.js"></script>
<script src="app.js"></script>
```

包装脚本里用 `window.WorkbenchHost.createWebHost()` 拿到内置适配器，再覆盖 `sendToAgent` 等方法。`app.js` 最后加载，此时 `window.workbenchHost` 已经就位。

如果宿主只能加载 `core/index.html`，可以在服务端把 `adapter-host.js` 注入到正确位置，或用宿主的 preload 在页面脚本前设置 `window.workbenchHost`。

## 各宿主映射

### Web（内置）

| 方法 | 实现 |
| --- | --- |
| `loadConfig` | `GET /api/config` |
| `loadIndex` | `GET /api/index` |
| `loadAnnotations` | `GET /api/annotations` |
| `saveAnnotations` | `PUT /api/annotations` |
| `loadItem` | `GET /api/item/:id` |
| `loadReports` | `GET /api/reports` |
| `sendToAgent` | 复制文本，返回 `delivered:false, copied:true` |
| `openExternal` | `window.open(url, '_blank', 'noopener,noreferrer')` |
| `copyText` | Clipboard API，失败时 `execCommand('copy')` |
| `close` | 空实现 |

### OpenChamber（参考适配器）

参考实现的思路（具体以 `adapters/openchamber/` 代码为准）：

| Host 方法 | OpenChamber 能力 |
| --- | --- |
| `ready` | `onReady(ctx)` 的 `surface` / `theme`；`onSession` 可选 |
| `load*` | `host.readFile(path)` + `JSON.parse`（按实际返回取 `.content`） |
| `saveAnnotations` | `host.writeFile('workbench/annotations.json', json)` |
| `sendToAgent` | `host.prompt({ text, send: mode !== 'compose' })` |
| `openExternal` | `host.openUrl(url)` |
| `copyText` | `host.writeClipboard(text)` |
| `close` | `host.close()` |

OpenChamber 的 panel 通常较窄，重点验证 420px 下的筛选横向滚动和动作条。

### DSH

DSH 没有统一 SDK 时，按宿主文档实现同一组能力：

- 文件：`readFile` / `writeFile`（或等价的资源 API）。
- 会话：`prompt` / `fillPrompt` / `send`。
- 窗口：`openUrl` / `close`。
- 主题：`ready` 返回 `theme`。

适配器只做翻译；不要在 DSH 适配器里改 UI 或数据字段。

### OpenCode

OpenCode 侧有两种接法：

1. **文件系统**：适配器直接读 `workbench/*.json` 和 `content.md`，保存写 `annotations.json`。
2. **会话/工具**：把 `sendToAgent` 映射到 session prompt；`loadItem` 可以走文件系统，也可以走宿主的读取工具。

如果 OpenCode 只能读不能写，`saveAnnotations` 应抛错“当前宿主为只读”，而不是假装保存成功。

### 只读静态

适合展示和评审：

- `load*` 用 `fetch` 预生成的 JSON。
- `saveAnnotations` 抛错。
- `sendToAgent` 复制。
- `openExternal` 正常打开。

在设置页会显示“会话：不支持（降级为复制）”，这是预期行为。

## 错误与降级

| 情况 | 行为 |
| --- | --- |
| server 没启动 | `loadConfig` 抛“无法连接工作台服务”，显示错误页 + 重试 |
| `annotations.json` 损坏 | `GET` 返回 500；前端视为空批注，保存时服务端报错 |
| 宿主无聊天 | `sendToAgent` 复制 + note |
| 宿主无剪贴板 | `copyText` 抛错；`sendToAgent` 应返回 note 说明手动复制 |
| 宿主只读 | `saveAnnotations` 抛错；编辑态保留 |
| 报告缺失 | `loadReports` 返回 `{reports:[]}`，报告页空状态 |
| 条目正文缺失 | `loadItem` 抛 404；详情显示错误 + 重试 |

错误信息用用户能看懂的中文；技术细节放 `console.error`。

## 安全

- 适配器是**受信任代码**：它能读写你授予的文件、发消息、开链接。只安装信任的适配器。
- 不要把 API key、令牌、内网地址写进适配器前端代码。
- 路径拼接只接受条目 id；不要接受前端传入的任意路径。
- `content.md` 只读；保存只写 `annotations.json`。
- `openExternal` 只允许 `http(s)`；不要打开 `file:`、`javascript:` 或自定义协议。
- 如果适配器通过 HTTP 访问本地 server，优先同源；跨源时限制 `Access-Control-Allow-Origin`，不要用 `*`。

## 适配器自测

```js
// 在宿主控制台里
const host = window.workbenchHost;
const required = window.WorkbenchHost.requiredMethods;
console.log(required.filter((name) => typeof host[name] !== 'function'));

const index = await host.loadIndex();
console.log(index.items.length);

const first = index.items[0];
const detail = await host.loadItem(first.id);
console.log(detail.item.id, detail.content.length);

const before = await host.loadAnnotations();
console.log(Object.keys(before.items).length);

const result = await host.sendToAgent({ text: 'ping', mode: 'compose' });
console.log(result);
```

通过标准：没有缺失方法；`loadItem` 返回正文；`sendToAgent` 有明确返回值；保存后重新读取能看到变化。

