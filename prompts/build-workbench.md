# 建一个工作台

把下面任意一版复制给 Agent。短版适合快速起一个可运行版本；完整版适合一次做到可发布。

---

## 短版

```text
你是一个前端 + Node 工程师。请在一个空目录里做一个“侧栏工作台”starter，不要问问题，直接实现并跑通。

硬性要求：
1. 4 个模式 Tab：今日 / 资料库 / 报告 / 设置。Tab 是模式，不是内容分类。
2. 两行横向筛选：第一行第一维度 chips，第二行第二维度 chips；右侧状态下拉、时间下拉、条数；可 AND 组合；窄栏横向滚动不换行。
3. 全宽列表 + 详情页；不要左树、不要“更多”菜单、不要营销首页。列表行高 44–50px。
4. 详情默认 Markdown 预览；摘要/判断可编辑；原文只读。底部动作：编辑 / 保存 / 让 Agent 分析 / 放入对话 / 发送。
5. 批注保存到 annotations.json；原文 content.md 永远不写。
6. 零依赖 Node server：GET /api/config、/api/index、/api/annotations、/api/item/:id、/api/reports；PUT /api/annotations；静态文件；路径穿越保护；默认 127.0.0.1:8787，PORT 可覆盖。
7. 10 条虚构种子数据，覆盖不同维度/状态/日期；不要真实公司、人名、政策、绝对路径。
8. 浅中性底 + 一个暖色强调；正文 13.5px/1.7；420/760/1000px 三档；420 不横向溢出。
9. 键盘：/ 搜索，Esc 清空/返回，Ctrl/Cmd+S 保存。
10. 交付 README、SETUP、docs（设计原则/数据合同/host API/定制/弯路）、prompts（建站/验收/脱敏）、MIT/CC BY/CC0 三个许可。

技术栈：原生 HTML/CSS/JS，无框架、无构建；Node 18+ 内置模块。先实现 web 版，宿主适配器只留 window.workbenchHost 接口和说明。
验收：node --check server/server.mjs；启动后 curl 三个 API；用 node 断言至少 10 条且字段齐全。
```

---

## 完整版

```text
你是一个资深前端 + Node 工程师，也是一个信息架构师。请在一个空目录里从零实现一个“Agent 工作台模板”（agent-workbench-template）。这是一个公开、脱敏、宿主无关的 starter kit，不是某个行业的成品。

不要问问题。按下面的约束直接做，做完报告：文件、运行命令、测试结果、限制。

==================================================
一、目标与读者
==================================================

两类读者：
A. 非技术知识工作者：想照着做一个自己的侧栏工作台，跟踪政策/客户/选题/候选人/文献/运营事件。
B. 开发者：想改壳、接自己的宿主（OpenChamber / DSH / OpenCode / 桌面壳 / 编辑器插件）。

因此：
- 默认路径必须 5 分钟内能跑起来，零依赖、零构建。
- 领域逻辑必须可替换：标签、两个维度、类型、状态都在 config 里。
- 宿主能力必须抽象：UI 不 import 任何宿主 SDK。
- 文档要能教人“怎么做下一个工作台”，不是只介绍功能。

==================================================
二、硬性结构
==================================================

agent-workbench-template/
  README.md                 # 中文为主，开头英文摘要；5 分钟试用 + 开发者路径
  SETUP.md                  # clone→打开项目→安装扩展→权限→启动 server
  LICENSE                   # MIT（代码）
  LICENSE-docs              # CC BY 4.0（文档/提示词）
  LICENSE-data              # CC0（示例数据）
  SECURITY.md
  .gitignore
  config.example.json
  core/
    index.html
    styles.css
    app.js
    host.js
    markdown.js
    vendor/markdown-it.umd.min.js
    vendor/markdown-it.LICENSE
  server/
    server.mjs
  workbench/
    config.json
    index.json
    annotations.json
    reports.json
    items/<id>/content.md
  adapters/
    README.md
  docs/
    design-principles.md
    data-contract.md
    host-api.md
    customization.md
    lessons.md
  prompts/
    build-workbench.md
    review-workbench.md
    desensitize.md
  examples/
    screenshots/.gitkeep

不要创建数据库、不要引入前端框架、不要引入构建工具、不要 npm install。

==================================================
三、交互与布局（不可妥协）
==================================================

1. 4 个模式 Tab：今日 / 资料库 / 报告 / 设置。
   - Tab 是“怎么工作”，不是“内容分类”。
   - “原文/解读/数据/申报/竞品/研究”是第二维度 chip；“国家/省/市/区”是第一维度 chip。
   - Tab 数量 3–5 个；不要按分类加 Tab。

2. 两行横向筛选：
   - 第一行：第一维度 chips（全部 + 数据里出现的值）。
   - 第二行：第二维度 chips（全部 + config.types）。
   - 第二行右侧：状态下拉、时间下拉、“共 N 条”。
   - 同一维度单选；两个维度、状态、时间、搜索之间 AND。
   - 窄栏 `overflow-x: auto; flex-wrap: nowrap`，不换行、不缩字号。
   - 选中的 chip 有明显背景/边框/字重。

3. 全宽列表 + 详情页：
   - 不要左树；不要左右分栏；不要“更多”菜单；不要营销首页。
   - 列表是行，不是卡片；行高 44–50px；标题一行、摘要一行。
   - 点行打开详情；详情替换列表；顶部“← 返回”。
   - 详情宽度约 900px，正文阅读宽度约 72ch。

4. 详情：
   - 默认 Markdown 预览。
   - 元数据 3–6 个 chip：维度1、维度2、日期、机构、文号、状态。
   - 摘要/判断块：阅读态渲染 Markdown；有“编辑”链接。
   - 原文块：标题“原文 · 只读”，渲染 content.md；不提供编辑。
   - 底部动作条固定 5 个：编辑、保存、让 Agent 分析、放入对话、发送。窄栏横向滚动，不换行、不折叠。

5. 编辑：
   - 只编辑摘要、判断、状态。
   - 摘要/判断用 textarea，支持 Markdown；状态用 select。
   - 保存只写 annotations.json；原文 content.md 永远不写。
   - 保存失败保留编辑态和草稿，不要假装成功。
   - Esc 取消编辑；Ctrl/Cmd+S 保存。

6. 键盘：
   - `/` 聚焦搜索（输入框内不触发）。
   - `Esc`：清空搜索 → 取消编辑 → 返回列表 → 清空筛选。
   - `Ctrl/Cmd+S`：保存当前批注。

7. 视觉：
   - 浅中性暖灰底 + 一个暖色强调（例如陶土色），状态色只用于徽标。
   - 正文 13.5px / 1.7；列表行 44–50px；圆角 4–6px。
   - 不要大卡片、大阴影、渐变、玻璃拟态、插画 hero。
   - 断点 420 / 760 / 1000；420px 不横向溢出。
   - 深色主题可选：只改 CSS 变量，不复制布局。

==================================================
四、数据合同
==================================================

workbench/config.json：
{
  "schema": "workbench-config/v1",
  "title": "Agent 工作台",
  "mark": "W",
  "libraryRoot": "workbench",
  "port": 8787,
  "labels": { "today": "今日", "library": "资料库", "reports": "报告", "settings": "设置", "searchPlaceholder": "...", "summary": "摘要", "judgment": "判断", "source": "原文", "emptyTitle": "...", "emptyHint": "...", "clearFilters": "清空筛选" },
  "dimensions": {
    "primary": { "field": "level", "label": "层级" },
    "secondary": { "field": "kind", "label": "类型" }
  },
  "types": ["原文", "解读", "数据", "申报", "竞品", "研究"],
  "statuses": [
    { "label": "待研判", "tone": "warn" },
    { "label": "在跟", "tone": "info" },
    { "label": "已研判", "tone": "ok" },
    { "label": "已归档", "tone": "muted" }
  ],
  "today": {
    "referenceDate": "latest",
    "recentDays": 14,
    "deadlineDays": 7,
    "pendingStatuses": ["待研判"],
    "focusCount": 3
  },
  "reports": { "label": "报告", "types": ["周报", "月报", "专题", "复盘"] }
}

workbench/index.json：
{
  "schema": "workbench-index/v1",
  "generated_at": "YYYY-MM-DD",
  "items": [{
    "id": "ex-001",
    "title": "...",
    "level": "示例市",
    "kind": "原文",
    "issuer": "示例市发展和改革委员会",
    "doc_number": "示例发改〔2026〕41 号",
    "published_at": "2026-11-12",
    "deadline": "2026-11-19",
    "status": "待研判",
    "priority": 5,
    "themes": ["...", "..."],
    "summary": "...",
    "source_url": "https://example.com/policy/ex-001",
    "content_path": "items/ex-001/content.md"
  }]
}

workbench/annotations.json：
{
  "schema": "workbench-annotations/v1",
  "updated_at": "",
  "items": {}
}

workbench/reports.json：
{
  "schema": "workbench-reports/v1",
  "generated_at": "YYYY-MM-DD",
  "reports": [{
    "id": "report-001",
    "title": "...",
    "type": "周报",
    "period": "2026-W46",
    "date": "2026-11-13",
    "summary": "...",
    "content": "# 标题\n\nMarkdown 正文。"
  }]
}

读取优先级：
summary  = annotation.summary || item.summary || ''
judgment = annotation.judgment || ''
status   = annotation.status || item.status || statuses[0].label

id 规则：^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$，全局唯一。
content_path 相对于 workbench/，不允许绝对路径或 ..

==================================================
五、种子数据
==================================================

10 条，全部虚构：
- 机构用“示例市 / 示例省 / 示例区 / 示例部门 / 示例机构 / 示例企业甲”。
- 政策、数字、文号、链接全部编造；链接用 https://example.com/...
- 不出现真实公司、人名、真实政策、内部项目名、绝对路径、令牌。
- 覆盖：至少 4 个第一维度值；6 个第二维度值；4 个状态；日期从近 7 天到跨年；至少 1 条截止日期在 7 天内；priority 1–5。
- 每条 content.md 都要有：标题、列表、链接、表格、引用，用于演示 Markdown。
- 2 份报告，类型不同（周报/专题），正文内联 Markdown。

“今日”基准：
- config.today.referenceDate = "latest" 时，以数据中最大 published_at 为“今天”，保证示例任何时候打开都有内容。
- "auto" 用真实今天；也支持固定 "YYYY-MM-DD"。

==================================================
六、Server
==================================================

零依赖 Node 18+，只用 node:http / node:fs / node:path / node:url。

API：
- GET /api/config
- GET /api/index
- GET /api/annotations
- PUT /api/annotations
- GET /api/item/:id  → { item, content }
- GET /api/reports
- 其他路径：core/ 静态文件

要求：
- 默认 127.0.0.1:8787；PORT 环境变量覆盖；config.port 次之。
- 静态路径穿越保护：解码后拒绝 ..、.、空段、反斜杠、空字节、点开头；resolve 后必须在 core/ 内。
- PUT 校验：Content-Type application/json；body ≤ 1MB；items 是对象；id 符合规则；拒绝 __proto__/constructor/prototype；summary/judgment ≤ 20000；status ≤ 80；最多 2000 条。
- 写入：临时文件 + rename；替换前尽力备份 annotations.json.bak；串行化并发写。
- 安全头：nosniff、no-referrer、CSP（script-src 'self'）。
- 不加 CORS（默认同源）；如需跨源，用 WORKBENCH_CORS=1 显式开启并文档说明。
- 404/405/413/415 返回 JSON：{ error, message }。
- 启动日志打印地址和 data 目录；EADDRINUSE 给清晰提示。

==================================================
七、Host 接口
==================================================

core/host.js 定义 window.workbenchHost，11 个方法：
ready, loadConfig, loadIndex, loadAnnotations, saveAnnotations, loadItem, loadReports, sendToAgent, openExternal, copyText, close。

- 如果页面在 host.js 之前注入了 window.workbenchHost 且方法齐全，用它。
- 否则用内置 web 适配器：fetch /api/*；sendToAgent 复制到剪贴板并返回 { delivered:false, copied:true, note }。
- 缺方法时 console.warn 并回退 web。
- 适配器只做能力翻译，不放领域逻辑。
- adapters/README.md 写清 OpenChamber / Web / DSH / OpenCode 对照、注入顺序、两种接法（server-backed / host-file-backed）、能力矩阵、验收清单。

==================================================
八、文档
==================================================

docs/design-principles.md：
- 7 个界面部件 + 2 层地基。
- Tab=mode、chip=filter。
- 内容优先；阅读/编辑分离；全宽列表不要左树；不要“更多”；不要营销页。
- 视觉基线、键盘、自查问题。

docs/data-contract.md：
- config/index/annotations/reports/content 的完整字段表。
- 读取优先级、id 规则、不变量、最小校验脚本、迁移建议。

docs/host-api.md：
- 11 个方法的 TypeScript 接口、调用时机、返回/失败。
- Web/OpenChamber/DSH/OpenCode 映射。
- 注入顺序、错误与降级、安全、自测脚本。

docs/customization.md：
- 六种领域的适配表。
- 只改文案、改两个维度、改状态、改 Tab、加 Agent 动作、换种子数据、改视觉、加字段。
- 推荐顺序和自查。

docs/lessons.md：
- 10 条弯路：分类当 Tab、左树、卡片网格、改原文、弹层筛选、详情堆元数据、读写混合、假装有聊天、schema 只在代码里、真实数据做模板。
- 每条：症状 → 为什么错 → 正确做法。

==================================================
九、README / SETUP / SECURITY
==================================================

README：
- 开头英文摘要（6–10 行），然后中文。
- 5 分钟试用（node server/server.mjs；不用 npm install）。
- 目录、三个设计决定、换成你的领域、开发者路径、API 表、Web 限制、文档索引、许可。

SETUP：
- 前置、获取文件、打开项目、跑 Web 版、验证（页面 + curl + PUT）。
- 安装到宿主的通用步骤和权限表；不要假设某个宿主的精确命令。
- 数据位置、备份、常见问题（端口、file://、CORS、400、乱码、样式冲突）。

SECURITY：
- 本地单用户威胁模型；默认 127.0.0.1；无认证。
- 已实现的保护：路径穿越、写入范围、输入校验、XSS、CSP、原子写。
- 不防什么；如果要暴露怎么改；报告渠道；发布前 grep 清单。

==================================================
十、验收
==================================================

必须跑：
1. node --check server/server.mjs
2. node --check core/app.js && node --check core/host.js && node --check core/markdown.js
3. 启动 server，curl /api/index、/api/annotations、/api/item/<id>、/api/reports。
4. PUT /api/annotations 写入一条，GET 确认；再恢复空批注。
5. node 断言：index.items.length === 10；每条 id/title/published_at/status/content_path 齐全；id 唯一；content 文件存在；status 在 config.statuses；reports 2 份。
6. 路径穿越测试：GET /%2e%2e/server/server.mjs 必须 404/400。
7. 文本扫描：仓库内不得出现真实公司/人名/真实政策/绝对路径/令牌。

人工检查：
- 420 / 760 / 1000px：不横向溢出；筛选和动作条可横向滚动。
- 4 个 Tab、两行筛选、AND 组合、条数更新。
- 详情 Markdown 表格可横向滚动；链接可点。
- 编辑保存后刷新仍在；content.md 未变。
- Web 版三个 Agent 动作复制 + 提示。
- 键盘 /、Esc、Ctrl/Cmd+S。

==================================================
十一、边界
==================================================

- 不做登录、权限、多用户、数据库、全文搜索服务、文件上传、PDF 解析、采集爬虫。
- 不做暗色切换按钮（只支持宿主传 theme）；不做 i18n 框架（中文为主，英文摘要）。
- 不做“更多”菜单、左树、卡片网格、营销首页。
- 不引入 npm 依赖；markdown-it 用 vendored UMD + LICENSE。
- 不 git init / commit / push；交付文件即可。

完成后按这个顺序报告：
1. 文件清单（按目录）。
2. 运行命令。
3. 测试结果（命令 + 输出摘要）。
4. 已知限制。
```

