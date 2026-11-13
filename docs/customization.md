# 定制指南

目标：把示例工作台换成你的领域，但不破坏“模式 / 筛选 / 阅读 / 批注”这套骨架。

## 先决定领域

| 领域 | 第一维度（行 1） | 第二维度（行 2） | 状态 | 条目叫法 | 报告 |
| --- | --- | --- | --- | --- | --- |
| 政策/情报监测 | 层级：国家/省/市/区 | 类型：原文/解读/申报/数据 | 待研判/在跟/已研判/已归档 | 条目 | 周报/专题 |
| 销售管线 | 阶段：线索/商机/报价/签约 | 来源： inbound/outbound/伙伴 | 新/跟进/赢单/丢单 | 客户/商机 | 周报/复盘 |
| 招聘 | 岗位族：研发/产品/设计 | 渠道：内推/猎头/官网 | 待筛/面试/offer/入职 | 候选人 | 周度 pipeline |
| 研究阅读 | 主题：模型/数据/系统 | 类型：论文/博客/报告 | 待读/在读/已读/归档 | 文献 | 综述/笔记 |
| 运营事故 | 系统：App/API/数据 | 严重度：P0/P1/P2 | 新建/处理中/已恢复/复盘 | 事件 | 复盘/周报 |
| 内容选题 | 渠道：公众号/视频/播客 | 类型：观点/教程/访谈 | 想法/写作/已发/归档 | 选题 | 周计划/月报 |

先把这张表填出来，再动代码。填不出来，说明你还没想清楚工作台要支持什么工作。

## 只改文案（5 分钟）

编辑 `workbench/config.json`：

```json
{
  "title": "客户情报台",
  "mark": "C",
  "labels": {
    "today": "今天",
    "library": "客户",
    "reports": "周报",
    "settings": "设置",
    "searchPlaceholder": "搜索客户、行业、联系人…"
  },
  "dimensions": {
    "primary": { "field": "stage", "label": "阶段" },
    "secondary": { "field": "source", "label": "来源" }
  },
  "types": ["线索", "商机", "报价", "签约"],
  "statuses": [
    { "label": "新", "tone": "warn" },
    { "label": "跟进", "tone": "info" },
    { "label": "赢单", "tone": "ok" },
    { "label": "丢单", "tone": "muted" }
  ]
}
```

然后改 `workbench/index.json` 的字段名和值，保证：

- 每条都有 `stage` 和 `source`（因为 `dimensions` 指向它们）。
- `status` 用新的状态 label。
- `content_path` 仍指向 `items/<id>/content.md`。

**只改文案不需要动 `core/`。**

## 改两个维度

### 换字段名

1. 改 `config.dimensions.primary.field` / `secondary.field`。
2. 改 `index.json` 每条对应字段。
3. 搜索是否还包含旧字段：`core/app.js` 的 `matchesItem` 用 `primaryField()` / `secondaryField()` 动态取，不用改。
4. 列表头会自动显示新 label。

### 换词表

- 第一维度：不用维护词表，`primaryOptions()` 从数据里汇总。想让顺序固定，就在 `index.json` 里按想要的顺序排列条目。
- 第二维度：改 `config.types`。当前没有该类型的条目时，chip 仍会出现，点开是空列表，这是有意的。

### 加第三个筛选条件

默认只有两行。第三行会挤压窄栏，先考虑：

- 能不能并进现有维度（例如“层级 · 类型”做成一个复合值）？
- 能不能用搜索或状态/时间下拉？
- 真的需要，再加第三行，并在 420px 下测试横向滚动。

如果确定要加：

1. `state` 里加 `tertiary: 'all'`。
2. `renderFilters` 加第三行。
3. `matchesItem` 加 AND 条件。
4. `hasActiveFilters` 和 `clearFilters` 同步。
5. 文档和验收清单更新。

## 改状态

`config.statuses` 是唯一词表。改完要同步：

- `index.json` 每条 `status`。
- `today.pendingStatuses`。
- 已存在的 `annotations.json` 里的 `status`（否则会显示旧状态；`toneForStatus` 找不到时回退 `muted`）。

状态只用于徽标，不要给整行加背景色。

## 改 Tab

Tab 是模式，不是分类。先读 `docs/design-principles.md`。

`core/app.js` 里：

1. `renderTabs()` 的 `labels` 数组加一项。
2. `renderMain()` 的分支加一个 render 函数。
3. 写 `renderXxx()`，决定数据范围和空状态。
4. `renderFilters()` 决定这个模式显示哪些筛选。
5. `state.tab` 的初始值和 `switchTab` 的合法值同步。

示例：加一个“复盘”模式（只看已归档 + 按结论聚合）：

```js
// 1. labels
{ id: 'review', label: '复盘' }

// 2. renderMain
else if (state.tab === 'review') els.main.append(renderReview());

// 3. 数据范围
function reviewItems() {
  return state.items.filter((item) => itemStatus(item) === '已归档');
}
```

不要把“竞品”“申报”“解读”加成 Tab；它们是第二维度 chip。

## 加一个 Agent 动作

默认动作条有三个 Agent 动作：分析、放入对话、发送。加一个“生成周报素材”而不改 host 合同：

```js
// core/app.js，renderItemDetail 的动作条里
actionButton('生成周报素材', 'btn ghost', function () {
  void sendCustom(item);
})

async function sendCustom(item) {
  const prompt = [
    '请把下面这条内容压缩成周报素材：',
    '1. 一句话结论',
    '2. 对本团队的影响',
    '3. 建议的下一步（含时间）',
    '',
    itemContext(item)
  ].join('\n');

  const result = await host.sendToAgent({ text: prompt, mode: 'analyze' });
  toast(result && result.delivered ? '已发送到当前会话' : (result && result.note) || '已复制');
}
```

需要 **新语义**（例如 `mode: 'weekly'`）时，必须同步：

1. `docs/host-api.md` 的 union 类型。
2. Web 适配器的降级文案。
3. 每个适配器的 `sendToAgent` 分支。
4. 验收清单。

只加按钮不改合同，成本最低。

## 换种子数据

1. 在 `workbench/items/` 下建 `<id>/content.md`。
2. 在 `index.json` 加条目，`content_path` 指向它。
3. 用 `prompts/desensitize.md` 检查，确保没有真实数据。
4. 跑校验脚本（`docs/data-contract.md` 末尾）。
5. 清空 `annotations.json` 的 `items`，或保留示例批注。

建议保留 10 条左右，覆盖：

- 每个第一维度至少 2 条。
- 每个第二维度至少 1 条。
- 每个状态至少 1 条。
- 至少 1 条近 7 天、1 条 30 天外、1 条跨年。
- 至少 1 条有截止日期。
- 至少 1 条有表格、1 条有引用、1 条有链接。

## 改视觉

改 `core/styles.css` 顶部的变量：

```css
:root {
  --bg: #f5f2ed;
  --panel: #fffdfa;
  --text: #24201c;
  --accent: #b4552f;       /* 只保留一个暖色强调 */
  --accent-soft: #f8ece4;
  --border: #e2dbd1;
  --radius: 6px;
}
```

约束：

- 正文 13.5px / 1.7；列表行 44–50px。
- 不要加大阴影、渐变、圆角超过 8px。
- 状态色只用于徽标。
- 改完在 420 / 760 / 1000px 三档检查；420px 不能横向溢出。
- 深色主题变量在 `body[data-theme="dark"]`，只改变量，不要复制一套布局。

## 加字段

例如给条目加 `owner`（负责人）：

1. `index.json` 每条加 `owner`。
2. 列表：`renderList` 里加一列（注意 1000px 以下隐藏，420px 进 mobile meta）。
3. 详情：`meta` 里加 `metaChip(item.owner)`。
4. 搜索：`matchesItem` 的 `haystack` 加 `item.owner`。
5. 数据合同：`docs/data-contract.md` 的字段表加一行。
6. 如果字段要可编辑，扩 `annotations.json` 和 server 的 `normalizeAnnotations`。

不要在没有迁移的情况下改字段名；旧 `annotations.json` 会变成孤儿。

## 推荐顺序

1. 填“领域适配表”。
2. 只改 `config.json` 文案和词表。
3. 换 3 条种子数据，跑通列表和详情。
4. 再换剩余种子数据。
5. 改 Tab / 加字段 / 加动作。
6. 跑 `prompts/review-workbench.md`。
7. 跑 `prompts/desensitize.md`，再发布。

## 自查

- [ ] 新领域的第一维度真的适合做 chip 吗？（值不超过 8 个）
- [ ] 第二维度是受控词表吗？
- [ ] 状态和 `pendingStatuses` 对得上吗？
- [ ] Tab 数量还在 3–5 个吗？
- [ ] 420px 下筛选和动作条能横向滚动、不换行吗？
- [ ] 保存只写 `annotations.json` 吗？
- [ ] 新字段在数据合同里有记录吗？
- [ ] 示例数据全是假的吗？

