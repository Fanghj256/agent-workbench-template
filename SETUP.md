# 安装与启动

这份文档从“拿到文件”讲到“在宿主里打开面板”。全程不需要构建，不需要数据库。

## 0. 前置

| 需要 | 版本 | 检查 |
| --- | --- | --- |
| Node.js | 18 或更高 | `node --version` |
| 浏览器 | 近两年的 Chrome / Edge / Safari / Firefox | 能打开本地页面 |
| 宿主（可选） | 支持本地扩展/面板的版本 | 见宿主文档 |

没有 Node 也可以只用静态文件看界面，但保存批注、读取正文 API 会不可用。建议先用 Node 跑通。

## 1. 获取文件

```bash
git clone <this-repo-url> agent-workbench-template
cd agent-workbench-template
```

或者下载 ZIP 解压。不要在这个模板里执行 `git init` 再提交真实业务数据；先脱敏，再建自己的私有仓库。

## 2. 打开项目

用 VS Code、Cursor、Sublime 或任意编辑器打开 `agent-workbench-template/` 目录。建议先看：

```text
README.md
workbench/config.json
core/app.js
server/server.mjs
```

## 3. 先跑 Web 版

在项目根目录：

```bash
node server/server.mjs
```

看到：

```text
Agent Workbench Template
  http://127.0.0.1:8787
  data: workbench/ (index.json, annotations.json, reports.json, items/)
  stop: Ctrl+C
```

打开 <http://127.0.0.1:8787>。

### 换端口

```bash
PORT=9000 node server/server.mjs
```

Windows PowerShell：

```powershell
$env:PORT=9000; node server/server.mjs
```

优先级：`PORT` 环境变量 > `workbench/config.json` 的 `port` > `8787`。

### 不要用 file:// 打开

直接双击 `core/index.html` 会用 `file://` 协议，`fetch('/api/...')` 无法工作，页面会停在“无法连接工作台服务”。

必须通过 `http://127.0.0.1:8787` 访问。

## 4. 验证

### 4.1 页面

- 顶部有品牌、搜索、刷新。
- 4 个 Tab：今日 / 资料库 / 报告 / 设置。
- 今日页有 3 个统计、3 个重点、动态列表。
- 列表 10 条，筛选行有两行 chip。
- 点条目能打开详情，正文有标题、列表、链接、表格、引用。
- 点“编辑”，改摘要，`Ctrl/Cmd + S`，刷新后还在。
- 打开 `workbench/annotations.json`，能看到刚保存的批注。
- 打开对应的 `workbench/items/<id>/content.md`，内容没有变化。

### 4.2 API

另开一个终端：

```bash
curl http://127.0.0.1:8787/api/index
curl http://127.0.0.1:8787/api/annotations
curl http://127.0.0.1:8787/api/item/ex-001
curl http://127.0.0.1:8787/api/reports
```

PowerShell 也可以用 `Invoke-RestMethod`：

```powershell
Invoke-RestMethod http://127.0.0.1:8787/api/index
```

### 4.3 写入

```bash
curl -X PUT http://127.0.0.1:8787/api/annotations \
  -H "Content-Type: application/json" \
  -d "{\"items\":{\"ex-001\":{\"summary\":\"测试摘要\",\"judgment\":\"测试判断\",\"status\":\"在跟\"}}}"
```

返回 `{ "ok": true, "updated_at": "...", "count": 1 }`。刷新页面，摘要和状态应该变化。

测试完记得把 `workbench/annotations.json` 恢复成：

```json
{
  "schema": "workbench-annotations/v1",
  "updated_at": "",
  "items": {}
}
```

## 5. 安装到宿主（可选）

不同宿主的安装方式不同。以 OpenChamber 为例，参考适配器在 `adapters/openchamber/`（如果当前仓库包含；没有的话按 `adapters/README.md` 自行实现），具体安装命令和 manifest 以该目录的 README 为准。

通用步骤：

### 5.1 找到扩展目录

在宿主的“扩展 / 插件 / 本地开发”设置里找到“从本地目录安装”或“加载未打包扩展”。

### 5.2 选择目录

选择 `adapters/openchamber/`（如果使用参考适配器；目录不存在就按 `adapters/README.md` 自行实现），而不是整个仓库根目录。适配器目录里应该有宿主能识别的 manifest。

### 5.3 授权

宿主会请求权限，通常包括：

| 权限 | 用途 | 是否可以拒绝 |
| --- | --- | --- |
| 读取项目文件 | 读 `workbench/*.json` 和 `content.md` | 拒绝后无法加载数据 |
| 写入项目文件 | 保存 `annotations.json` | 拒绝后只能阅读 |
| 会话 / prompt | “让 Agent 分析”“放入对话”“发送” | 拒绝后降级为复制 |
| 剪贴板 | 复制摘要、ID、报告全文 | 拒绝后复制失败 |
| 打开链接 | 打开原文 URL | 拒绝后链接不可点 |
| 访问 localhost | 使用本地 server 模式 | 拒绝后改用宿主文件模式 |

只授予你需要的权限。只读使用时，拒绝写入和会话权限是合理的。

### 5.4 启动 server（如果适配器用 server 模式）

```bash
node server/server.mjs
```

保持终端开着。关掉终端，页面会加载失败。

如果适配器页面和 server 不同源（例如宿主用自己的协议加载面板），需要显式开启 CORS：

```bash
WORKBENCH_CORS=1 node server/server.mjs
```

只在本机、受控环境使用；不要把它和公网暴露一起开。

### 5.5 打开面板

在宿主里打开“工作台”面板/页面。窄栏下重点检查：

- 两行筛选是否横向滚动而不换行。
- 点条目后详情是否替换列表。
- 底部 5 个动作是否可横向滚动。
- `Esc` 是否能返回。
- `Ctrl/Cmd + S` 是否能保存。

## 6. 权限说明

| 权限 | 模板的默认行为 | 最小权限建议 |
| --- | --- | --- |
| 文件读 | 读 `workbench/` 下的 JSON 和 Markdown | 只读 `workbench/`，不要读整个项目 |
| 文件写 | 只写 `workbench/annotations.json` | 只给这一个文件/目录 |
| 会话 | 分析/放入/发送时调用宿主 prompt | 不需要就拒绝，UI 会降级 |
| 剪贴板 | 复制 ID、摘要、报告全文 | 可拒绝，手动选择文本 |
| 打开链接 | 只打开 `http(s)` | 可拒绝 |
| 网络 | 仅本机 `127.0.0.1` | 不要开放到局域网 |

适配器不应该请求与工作台无关的权限（例如读取整个主目录、访问任意网络、读取浏览器 Cookie）。

## 7. 数据位置与备份

```text
workbench/
  config.json          # 配置
  index.json           # 条目索引
  annotations.json     # 你的批注（会变）
  reports.json         # 报告
  items/<id>/content.md # 原文（只读）
```

- 备份：复制整个 `workbench/` 目录，或纳入私有 git。
- `annotations.json.bak` 是最近一次保存前的自动备份，已在 `.gitignore` 中忽略。
- 不要把 `node_modules`、`.env`、真实数据提交到公开仓库。
- 模板没有自动版本历史；重要批注请自己备份。

## 8. 常见问题

### 端口被占用

```text
[workbench] port 8787 is already in use. Set PORT to another value.
```

换端口：

```bash
PORT=8788 node server/server.mjs
```

或找出占用进程：

```bash
# macOS / Linux
lsof -i :8787

# Windows PowerShell
Get-NetTCPConnection -LocalPort 8787
```

### 页面空白 / 静态资源 404

- 确认从项目根目录启动，而不是 `server/` 目录。
- 确认 `core/index.html`、`core/styles.css`、`core/app.js` 存在。
- 打开浏览器开发者工具，看 Console 和 Network。
- 如果 `markdown-it.umd.min.js` 404，Markdown 会退化成纯文本；补齐 `core/vendor/` 即可。

### “无法连接工作台服务”

- server 没启动，或端口不一致。
- 页面是 `file://` 打开的，改用 `http://127.0.0.1:8787`。
- 宿主面板的 CSP 阻止了 localhost 请求；改用宿主文件模式，或在宿主里允许该来源。
- 防火墙拦截：Windows 首次启动可能弹窗，选择“仅专用网络”或拒绝公网。

### `PUT /api/annotations` 返回 400

- `Content-Type` 必须是 `application/json`。
- `items` 必须是对象，不能是数组。
- 条目 id 必须是 ASCII，匹配 `^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$`。
- `summary` / `judgment` 不超过 20,000 字符。

### 保存后刷新，批注没了

- 看 server 终端有没有写入错误。
- 看 `workbench/annotations.json` 的修改时间。
- 如果宿主适配器用的是文件模式，确认它写的是同一个 `workbench/` 目录。
- 如果同时开了两个 server（不同端口），它们写的是同一个文件；后写入者覆盖。

### 中文乱码

- 文件统一 UTF-8（无 BOM 更稳）。
- server 已设置 `charset=utf-8`；如果仍乱码，检查编辑器保存编码。
- Windows 终端显示乱码不影响浏览器，通常是终端代码页问题。

### 宿主里样式错乱

- 宿主可能注入了全局 CSS；面板应放在 iframe/webview 里隔离。
- 420px 下检查 `.filters` 和 `.action-bar` 是否 `overflow-x: auto`。
- 不要把 `body` 的高度改成 `auto`；工作台依赖 `height: 100%` 的 grid 布局。

## 9. 下一步

1. 读 `docs/design-principles.md`，确认你要的 Tab 和两个维度。
2. 按 `docs/customization.md` 改 `config.json` 和种子数据。
3. 跑 `prompts/review-workbench.md` 的验收清单。
4. 跑 `prompts/desensitize.md`，再决定是否公开。

