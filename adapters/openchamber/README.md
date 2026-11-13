# 工作台 · OpenChamber 适配器

把模板仓库里的 workbench/ 数据接到 OpenChamber：今日、资料库、报告、设置四个 Tab，横向筛选、全宽列表、Markdown 阅读、摘要/判断编辑和 Agent 动作。

![OpenChamber 420px 预览](../../examples/screenshots/openchamber-420.png)

## 目录

    adapters/openchamber/
      package.json          OpenChamber manifest 与构建脚本
      panel/                面板页面与构建产物
      dialog/               附着对话框入口
      plugin/               OpenCode 插件（workbench / library 工具）
      data/notes.json       扩展本地的自由笔记
      src/panel/main.js     面板源码（esbuild 入口）
      scripts/              manifest 检查

数据来自模板仓库根目录的 workbench/：

    workbench/
      config.json           标题、标签、维度、类型、状态、报告类型
      index.json            schema workbench-index/v1，items[]
      annotations.json      schema workbench-annotations/v1，items{}
      reports.json          schema workbench-reports/v1，reports[]
      items/<id>/content.md 条目正文
      _notes/<id>.md        保存批注时生成的 Markdown 副本

## 安装

1. 确认 OpenChamber 项目的根目录就是模板仓库根目录（能看到 workbench/、server/、adapters/ 的那一层）。
2. 构建适配器：

        cd adapters/openchamber
        npm install
        npm run build

3. 在 OpenChamber 打开 Settings → Extensions，选择“从文件夹添加”，指向：

        <模板仓库根>/adapters/openchamber

4. 授予三项能力：读取和写入项目文件、写入/发送到对话、加载 OpenCode 插件（files / prompt / plugin）。
5. 打开“工作台”面板。项目根下的 workbench/ 会被自动读取。

建议直接从本地文件夹安装，不要复制扩展目录。插件通过相对路径定位 workbench/，复制后会断。

## 本地原件

适配器只在本机服务里打开 PDF/HTML 原件：

    node server/server.mjs

服务监听 http://127.0.0.1:8787/ 。条目带有 original_path 时，详情页才显示“本地原件”，地址为：

    http://127.0.0.1:8787/<original_path>

种子数据没有 original_path，所以默认不显示这个入口。未启动服务时，已有的原件链接无法访问。

## 数据映射

面板读取 workbench/index.json 后把每条 item 映射为界面字段：

    doc_id       = id
    title        = title
    level        = level
    type         = kind
    issuer       = issuer
    doc_number   = doc_number
    publish_date = published_at
    path         = content_path
    summary / status / source_url / original_path 原样保留

reports.json 里的报告会合并成 type 为“报告”的条目：

    doc_id       = id
    level        = 报告
    type         = 报告
    publish_date = date
    status       = 已发布（draft 为草稿）
    content      = report.content
    path         = 空

正文加载：报告直接使用 content；普通条目读取 workbench/<content_path>。

批注按条目 id 读写 workbench/annotations.json；保存时同时写入 workbench/_notes/<id>.md。正文 content.md 不会被修改。

## Agent 工具

插件注册 workbench 命名空间：

- workbench_list：列出条目、报告和批注状态。
- workbench_read：按 doc_id 读取元数据、批注与正文。
- workbench_write：写入摘要/判断/状态，或保存扩展本地自由笔记。
- library_search：按关键词、层级、类型搜索条目和报告。
- library_read：按 doc_id 读取完整正文。

## 构建与检查

    npm install
    npm run build
    npm run check
    npm run check:manifest
    npm run test:plugin

npm run build 使用 esbuild 把 src/panel/main.js 打成 panel/main.js。构建时还会把仓库根的 workbench/index.json 作为离线 fallback 打进包里；运行时会优先通过 OpenChamber 的 files 能力读取项目文件。

## 限制

- OpenChamber 项目根必须等于模板仓库根，否则 workbench/ 和插件相对路径都会找不到。
- 如果 OpenChamber 复制扩展而不是原地运行，插件里的 ../../../workbench 会指向错误位置。请从本地文件夹安装。
- 面板的普通页面预览会在扩展页面位置尝试 ../../../workbench/，只适合本地静态预览；安装到 OpenChamber 后以 files 能力为准。
- 本地原件依赖 8787 端口的静态服务；服务未启动时只显示提示，不影响条目阅读。
- 批注写入需要 files 能力；没有授权时面板会停留在预览模式，不落盘。
