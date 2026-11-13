# 数据合同

工作台只认 `workbench/` 下的四类文件：

```text
workbench/
  config.json          # 界面标签、两个维度、类型、状态、今日窗口
  index.json           # 条目索引（元数据）
  annotations.json     # 你的批注（可写）
  reports.json         # 报告
  items/<id>/content.md # 原文（只读）
```

所有路径都相对于 `workbench/`。不要写本机绝对路径、盘符或用户目录。

## 版本

每个文件都有 `schema` 字段：

| 文件 | schema |
| --- | --- |
| `config.json` | `workbench-config/v1` |
| `index.json` | `workbench-index/v1` |
| `annotations.json` | `workbench-annotations/v1` |
| `reports.json` | `workbench-reports/v1` |

改结构时递增版本号，并在 `docs/` 里写迁移说明。新增字段可以向后兼容；重命名字段必须迁移。

## config.json

```json
{
  "schema": "workbench-config/v1",
  "title": "Agent 工作台",
  "mark": "W",
  "description": "一句话说明这个工作台是干什么的。",
  "libraryRoot": "workbench",
  "port": 8787,
  "labels": {
    "today": "今日",
    "library": "资料库",
    "reports": "报告",
    "settings": "设置",
    "searchPlaceholder": "搜索标题、机构、文号或关键词",
    "summary": "摘要",
    "judgment": "判断",
    "source": "原文",
    "emptyTitle": "没有匹配的条目",
    "emptyHint": "调整筛选条件，或清空搜索后再试。",
    "clearFilters": "清空筛选"
  },
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
  "reports": {
    "label": "报告",
    "types": ["日报", "周报", "月报", "专题", "复盘"]
  }
}
```

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `title` | string | 顶栏品牌和页面标题 |
| `mark` | string | 品牌方块里的 1–2 个字符 |
| `description` | string | 一句话说明这个工作台做什么（可选） |
| `libraryRoot` | string | 数据目录，默认 `workbench` |
| `port` | number | server 默认端口；`PORT` 环境变量优先 |
| `labels` | object | 主要 UI 文案；未覆盖的短文案在 `core/app.js` 里 |
| `dimensions.primary.field` | string | 第一行 chip 取哪个字段，默认 `level` |
| `dimensions.secondary.field` | string | 第二行 chip 取哪个字段，默认 `kind` |
| `types` | string[] | 第二行 chip 的受控词表 |
| `statuses` | `{label,tone}[]` | 状态词表；`tone` 为 `warn/info/ok/muted` |
| `today.referenceDate` | string | `auto`（真实今天）、`latest`（数据最新日期）或 `YYYY-MM-DD` |
| `today.recentDays` | number | “今日”最近窗口 |
| `today.deadlineDays` | number | “N 天内截止”的窗口 |
| `today.pendingStatuses` | string[] | 计入“待处理”的状态 |
| `today.focusCount` | number | 今日重点条数 |
| `reports.types` | string[] | 报告类型 chip |

### 第一维度为什么从数据里汇总

第一行 chip 的取值来自 `index.json` 中 `dimensions.primary.field` 的去重值，按首次出现排序。这样换领域时只改字段名和数据，不用同步维护两个词表。

第二行 chip 用 `types` 受控词表，因为类型通常需要固定顺序和完整集合（即使当前没有该类型的条目，也应该能筛出空结果）。

### `referenceDate` 怎么选

- 接真实数据：`"auto"`，按运行当天计算“近 7 天/近 14 天/今年”。
- 演示数据：`"latest"`，以 `published_at` 的最大值为“今天”。这样任何时候打开，今日页都有内容，不会因为示例日期过期而空掉。
- 固定演示：`"2026-11-13"`，适合截图和验收。

## index.json

```json
{
  "schema": "workbench-index/v1",
  "generated_at": "2026-11-13",
  "items": [
    {
      "id": "ex-001",
      "title": "示例市智能终端产业发展行动方案（2026—2028 年）",
      "level": "示例市",
      "kind": "原文",
      "issuer": "示例市发展和改革委员会",
      "doc_number": "示例发改〔2026〕41 号",
      "published_at": "2026-11-12",
      "deadline": "2026-11-19",
      "status": "待研判",
      "priority": 5,
      "themes": ["智能终端", "产业规划"],
      "summary": "一句话摘要，列表里显示。",
      "source_url": "https://example.com/policy/ex-001",
      "content_path": "items/ex-001/content.md"
    }
  ]
}
```

| 字段 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- |
| `id` | 是 | string | ASCII，`^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$`，全局唯一 |
| `title` | 是 | string | 条目标题 |
| `level` | 是* | string | 第一维度；字段名由 config 决定 |
| `kind` | 是* | string | 第二维度；字段名由 config 决定 |
| `issuer` | 否 | string | 发文/来源机构 |
| `doc_number` | 否 | string | 文号/编号 |
| `published_at` | 是 | `YYYY-MM-DD` | 发布日期；时间筛选和排序用它 |
| `deadline` | 否 | `YYYY-MM-DD` | 截止日期；今日页用 |
| `status` | 是 | string | 必须是 `config.statuses` 中的 label |
| `priority` | 否 | number | 数字越大越靠前；今日重点用 |
| `themes` | 否 | string[] | 关键词，参与搜索 |
| `summary` | 否 | string | 列表摘要；批注为空时显示 |
| `source_url` | 否 | string | `http(s)` 链接；详情页“原文链接” |
| `content_path` | 是 | string | 相对 `workbench/` 的 Markdown 路径 |

\* 如果改了 `dimensions.primary.field`，对应字段名也要改；字段值必须在条目上存在。

### 条目 id

- 用稳定、可读的 slug：`ex-001`、`acme-2026-01`。
- 不要用标题或日期拼接；标题会改。
- 不要用中文、空格、斜杠；服务端会拒绝。
- id 出现在 URL `/api/item/:id` 和 `annotations.json` 的键里，改 id 等于丢批注。

## annotations.json

```json
{
  "schema": "workbench-annotations/v1",
  "updated_at": "2026-11-13T09:30:00.000Z",
  "items": {
    "ex-001": {
      "summary": "我的摘要，支持 Markdown。",
      "judgment": "影响、截止时间、下一步动作。",
      "status": "在跟",
      "updated_at": "2026-11-13T09:30:00.000Z"
    }
  }
}
```

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `updated_at` | ISO string | 顶层最后写入时间 |
| `items` | object | 键是条目 id；没有批注时为空对象 `{}` |
| `items[id].summary` | string | 覆盖 `index.json` 的摘要；空字符串回退到原摘要 |
| `items[id].judgment` | string | 只存在于批注层 |
| `items[id].status` | string | 覆盖条目状态 |
| `items[id].updated_at` | ISO string | 该条最后修改时间 |

### 优先级

读取时按这个顺序取值：

```text
summary  = annotations[id].summary || index.items[id].summary || ''
judgment = annotations[id].judgment || ''
status   = annotations[id].status  || index.items[id].status || statuses[0].label
```

### 写入规则

- 只通过 `PUT /api/annotations` 或宿主适配器的 `saveAnnotations` 写入。
- 服务端会规范化：只保留上面四个字段，丢弃未知字段。
- 单条 `summary` / `judgment` 上限 20,000 字符；`status` 上限 80。
- 最多 2000 条批注；整个请求体最多 1 MB（两者同时生效）。
- 顶层 `updated_at` 由服务端覆盖为写入时间。
- 写入是“临时文件 + rename”；替换前尽力保留 `annotations.json.bak`。
- 不要手工把整个文件改成数组；`items` 必须是对象。

### 孤儿批注

条目从 `index.json` 删除后，`annotations.json` 里可能留下对应键。读取时会被忽略；可以定期清理，也可以在下次保存时保留（默认保留）。不要因为孤儿批注而拒绝保存。

## reports.json

```json
{
  "schema": "workbench-reports/v1",
  "generated_at": "2026-11-13",
  "reports": [
    {
      "id": "report-001",
      "title": "示例行业观察周报（2026 年第 46 周）",
      "type": "周报",
      "period": "2026-W46",
      "date": "2026-11-13",
      "summary": "一句话说明本周结论。",
      "content": "# 标题\n\n正文 Markdown。"
    }
  ]
}
```

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `id` | 是 | ASCII，唯一 |
| `title` | 是 | 报告标题 |
| `type` | 是 | 必须在 `config.reports.types` 中 |
| `period` | 否 | 周期标识，如 `2026-W46`、`2026-11` |
| `date` | 是 | `YYYY-MM-DD` |
| `summary` | 否 | 列表摘要 |
| `content` | 是 | 内联 Markdown 正文 |

这个 starter 把报告正文内联在 JSON 里，方便单文件分发和评审。报告在 UI 中只读；要改报告，直接编辑 `reports.json`。如果报告很长，可以在适配器层改成分文件读取（`content_path`），但要同步扩展服务端和文档，不要只改前端。

## content.md

- 每条一个文件，路径由 `content_path` 指定。
- 标准 Markdown：标题、列表、链接、表格、引用、代码块。
- 原始 HTML 被禁用（`html: false`）；不要依赖 `<div>`、`<script>`、内联样式。
- 链接用 `http(s)`；相对链接不会被 server 提供，点击只会提示。
- 图片可以用 `http(s)` 或 `data:`；远程图片可能泄露访问行为，敏感场景请禁用。
- 应用**永远不会写**这个文件。要改原文，手工编辑或用采集脚本，改完保留 `id`。

## 不变量

发布前逐条检查：

1. `index.items` 是数组，至少 1 条；示例模板为 10 条。
2. 每条都有 `id`、`title`、`published_at`、`status`、`content_path`。
3. `id` 唯一，且匹配 `^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$`。
4. 每个 `content_path` 都能在 `workbench/` 下找到文件。
5. `status` 都能在 `config.statuses` 中找到。
6. 第二维度值都能在 `config.types` 中找到（或至少不为空）。
7. `published_at` / `deadline` 是合法 `YYYY-MM-DD`。
8. `annotations.items` 是对象；每个值有 `summary`、`judgment`、`status`、`updated_at`。
9. `reports.reports` 是数组；`id` 唯一；`type` 在 `config.reports.types` 中。
10. 没有任何真实公司、人名、政策、内网地址、绝对路径、令牌。

## 最小校验脚本

```bash
node --input-type=module -e "
import fs from 'node:fs';
const root = 'workbench';
const read = (p) => JSON.parse(fs.readFileSync(root + '/' + p, 'utf8'));
const config = read('config.json');
const index = read('index.json');
const annotations = read('annotations.json');
const reports = read('reports.json');
const ids = new Set();
for (const item of index.items) {
  if (!item.id || ids.has(item.id)) throw new Error('bad id: ' + item.id);
  ids.add(item.id);
  for (const field of ['title', 'published_at', 'status', 'content_path']) {
    if (!item[field]) throw new Error(item.id + ' missing ' + field);
  }
  if (!fs.existsSync(root + '/' + item.content_path)) throw new Error('missing ' + item.content_path);
  if (!config.statuses.some((s) => s.label === item.status)) throw new Error('bad status: ' + item.status);
}
if (!annotations.items || Array.isArray(annotations.items)) throw new Error('annotations.items must be an object');
for (const report of reports.reports) {
  if (!report.id || !report.title || !report.content) throw new Error('bad report: ' + report.id);
}
console.log('ok', index.items.length, 'items,', reports.reports.length, 'reports');
"
```

## 迁移

从 v1 改到 v2 时：

1. 先写迁移脚本，读旧文件、写新文件，不动原文。
2. 保留旧字段一个版本，读取时回退。
3. 更新 `schema` 和本文档。
4. 跑一遍校验脚本和 `prompts/review-workbench.md`。
5. 在 `annotations.json` 写入前备份。

