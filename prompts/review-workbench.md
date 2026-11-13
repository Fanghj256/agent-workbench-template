# 工作台验收清单

用法：把这份清单发给 Agent，或自己逐条勾。**P0 有一条不过就不算完成。**

## 0. 先跑命令

```bash
node --check server/server.mjs
node --check core/app.js
node --check core/host.js
node --check core/markdown.js
npm run check
```

```bash
node server/server.mjs
```

另开终端：

```bash
curl -s http://127.0.0.1:8787/api/index | head -c 300
curl -s http://127.0.0.1:8787/api/annotations
curl -s http://127.0.0.1:8787/api/item/ex-001 | head -c 300
curl -s http://127.0.0.1:8787/api/reports | head -c 300
```

期望：都返回 JSON，不返回 HTML 错误页。

## 1. P0：结构

- [ ] 4 个 Tab：今日 / 资料库 / 报告 / 设置。
- [ ] Tab 是模式，不是内容分类；没有“原文/解读/竞品”这类 Tab。
- [ ] 两行筛选：第一行第一维度 chips，第二行第二维度 chips。
- [ ] 第二行右侧有状态、时间、条数。
- [ ] 全宽列表；没有左树、没有左右分栏、没有“更多”菜单。
- [ ] 列表是行，不是卡片；行高 44–50px。
- [ ] 点条目进入详情；详情替换列表；有“← 返回”。
- [ ] 详情默认 Markdown 预览。
- [ ] 摘要/判断可编辑；原文只读。
- [ ] 底部 5 个动作：编辑、保存、让 Agent 分析、放入对话、发送。
- [ ] 没有营销首页、hero、插画、功能三栏。

## 2. P0：筛选

- [ ] 第一行点“示例市”，列表只剩示例市条目。
- [ ] 第二行点“申报”，与第一行是 AND。
- [ ] 状态下拉再叠加，条数继续减少。
- [ ] 时间下拉“近 7 天”生效。
- [ ] 搜索与筛选是 AND；清空搜索恢复。
- [ ] “全部”只清除当前维度，不清除其他维度。
- [ ] 条数实时更新。
- [ ] 空结果有“清空筛选”按钮，点击恢复。
- [ ] 420px 下两行各自横向滚动，不换行、不溢出。
- [ ] 点击远端 chip 后，筛选行滚动位置不会跳回开头。

## 3. P0：阅读与编辑

- [ ] 详情标题、meta chip、摘要、原文顺序正确。
- [ ] 原文有“只读”提示。
- [ ] 点“编辑”后，摘要/判断变 textarea，状态变 select。
- [ ] 点“取消”恢复阅读态，不保存。
- [ ] 点“保存”后 toast，阅读态显示新摘要/判断/状态。
- [ ] 刷新页面后批注仍在。
- [ ] `workbench/annotations.json` 有对应条目。
- [ ] `workbench/items/<id>/content.md` 没有被修改（对比修改时间或 git diff）。
- [ ] 保存失败时（停掉 server 再保存）保留编辑态和草稿，有错误提示。
- [ ] 摘要/判断支持 Markdown（加粗、列表、链接）。
- [ ] 原文表格在窄栏可横向滚动，不撑破页面。
- [ ] Markdown 原始 HTML 不执行（例如 `<script>alert(1)</script>` 显示为文本或不显示，不弹窗）。

## 4. P0：键盘

- [ ] `/` 聚焦搜索；在 textarea 里按 `/` 不抢焦点。
- [ ] `Esc` 在搜索框：第一次清空，第二次失焦。
- [ ] `Esc` 在编辑态：取消编辑。
- [ ] `Esc` 在详情：返回列表。
- [ ] `Esc` 在列表且有筛选：清空筛选。
- [ ] `Ctrl/Cmd + S` 在编辑态保存。
- [ ] `Ctrl/Cmd + S` 不在编辑态不报错、不弹浏览器保存框。
- [ ] 所有 chip、Tab、按钮可 Tab 到达；焦点可见。

## 5. P0：数据

- [ ] `index.items.length === 10`（或你的目标条数）。
- [ ] 每条都有 `id`、`title`、`published_at`、`status`、`content_path`。
- [ ] `id` 唯一，匹配 `^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$`。
- [ ] 每个 `content_path` 文件存在。
- [ ] `status` 都在 `config.statuses` 中。
- [ ] `kind`（第二维度）都在 `config.types` 中。
- [ ] `published_at` / `deadline` 是合法 `YYYY-MM-DD`。
- [ ] `reports.reports.length === 2`（或目标数）；`type` 在 `config.reports.types` 中。
- [ ] `annotations.items` 是对象，不是数组。
- [ ] 种子数据覆盖 4 个状态、6 个类型、至少 4 个第一维度值。
- [ ] 至少 1 条截止日期在 7 天内；至少 1 条 30 天外；至少 1 条跨年。
- [ ] 所有 URL 是 `https://example.com/...` 或同样明显虚构的地址。

## 6. P0：Server

- [ ] 默认监听 `127.0.0.1:8787`。
- [ ] `PORT=9000` 能覆盖。
- [ ] 静态文件从 `core/` 提供；`/` 返回 `index.html`。
- [ ] `GET /api/config`、`/api/index`、`/api/annotations`、`/api/item/:id`、`/api/reports` 正常。
- [ ] `PUT /api/annotations` 正常，返回 `{ ok: true, count }`。
- [ ] `PUT` 非 JSON → 415。
- [ ] `PUT` 非法 JSON → 400。
- [ ] `PUT` 超过 1 MB → 413。
- [ ] `PUT` 带 `__proto__` 键 → 400。
- [ ] 不存在的 item → 404。
- [ ] 错误方法 → 405 + `Allow` 头。
- [ ] 路径穿越 `/%2e%2e/server/server.mjs` → 400/404，不返回源码。
- [ ] 静态目录点文件（如 `.gitignore`）→ 404。
- [ ] 响应有 `X-Content-Type-Options: nosniff` 和 CSP。
- [ ] 写入后有 `annotations.json.bak`（第二次保存起）。

## 7. P0：视觉与响应式

- [ ] 420px：无横向滚动条（页面本身）；筛选/动作条内部可横滑。
- [ ] 760px：列表变成两行式（标题 + 摘要 + mobile meta），不挤成三列。
- [ ] 1000px：隐藏机构列，不溢出。
- [ ] 宽屏：列表不拉成超长单行；内容区有最大宽度。
- [ ] 正文 13.5px / 1.7。
- [ ] 只有一个暖色强调；状态色只在徽标。
- [ ] 没有大卡片、大阴影、渐变 hero。
- [ ] 详情动作条吸底；窄栏可横滑。
- [ ] 深色宿主（如支持）：文字、边框、徽标可读；不出现白底白字。
- [ ] `prefers-reduced-motion` 下无动画。

## 8. P1：可访问性

- [ ] Tab 有 `role="tab"` / `aria-selected`。
- [ ] chip 有 `aria-pressed`。
- [ ] 搜索有 label 或 `aria-label`。
- [ ] 图片有 alt（Markdown 图片除外，按原文）。
- [ ] 图标按钮有 title 或 aria-label。
- [ ] 颜色不是唯一的信息载体（状态有文字）。
- [ ] 键盘焦点顺序合理。
- [ ] toast 有 `role="status"` / `aria-live`。

## 9. P0：文档与许可

- [ ] README 开头有英文摘要；有 5 分钟试用；有开发者路径。
- [ ] SETUP 覆盖 clone→打开→安装扩展→权限→启动 server。
- [ ] `docs/design-principles.md` 讲清 7 部件、Tab=mode、chip=filter、阅读/编辑分离。
- [ ] `docs/data-contract.md` 覆盖四类数据 + 读取优先级 + 不变量。
- [ ] `docs/host-api.md` 覆盖 11 个方法 + 各宿主映射 + 降级。
- [ ] `docs/customization.md` 有领域适配表和改法。
- [ ] `docs/lessons.md` 有 10 条弯路。
- [ ] `prompts/` 三份提示词可用。
- [ ] `LICENSE` MIT、`LICENSE-docs` CC BY 4.0、`LICENSE-data` CC0。
- [ ] vendored markdown-it 附 MIT LICENSE。
- [ ] `.gitignore` 忽略 `annotations.json.bak`、`.tmp`、`node_modules`。

## 10. P0：脱敏

- [ ] 没有真实公司、人名、政策、文号、内部项目名。
- [ ] 没有当前项目的私有词、产品代号、团队名、客户名。
- [ ] 没有带盘符、用户名或家目录的绝对路径。
- [ ] 没有真实 URL、内网 IP、邮箱、令牌。
- [ ] 截图没有真实姓名、公司、路径、浏览器标签。
- [ ] git 历史没有真实数据（如果已初始化）。
- [ ] 已跑 `prompts/desensitize.md`。

## 11. 拒绝条件

出现任一条，直接打回：

1. 有左树或“更多”菜单。
2. Tab 按内容分类。
3. 筛选是弹层/抽屉，或不能组合。
4. 编辑直接改 `content.md`。
5. 保存没有落到 `annotations.json`。
6. Web 版点“发送”静默失败。
7. 420px 页面横向溢出。
8. 路径穿越能读到 `server/server.mjs`。
9. 种子数据含真实信息。
10. 没有文档，或文档只讲功能不讲做法。

## 12. 验收记录

```text
日期：
版本 / commit：
执行人：
Node 版本：
浏览器 / 宿主：

P0 通过：____ / ____
P1 通过：____ / ____

已知限制：

签名：
```

## 13. 给 Agent 的验收提示词

```text
请按 prompts/review-workbench.md 验收当前工作台。
逐条勾选 P0；对每条给出证据（命令输出、文件、截图或代码位置）。
不要只写“通过”。发现问题的，给出文件、行号、最小修复方案。
最后输出：P0 未通过项、P1 未通过项、已知限制、是否可以发布。
```

