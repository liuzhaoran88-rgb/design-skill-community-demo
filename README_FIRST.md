# Dong Design 社区化项目交接包

建议 Claude 按以下顺序接手：

1. 阅读 `CLAUDE_START_HERE.md`，了解运行入口、主要代码和不能破坏的约束。
2. 阅读 `PROJECT_HANDOFF.md`，理解目标、产品架构、数据边界和后续优先级。
3. 阅读 `WEEKLY_CHANGE_CONTEXT_2026-07-08_07-15.md`，理解本周页面改动和真实数据口径。
4. 阅读 `community.yaml.example`，理解仓库内容如何进入社区。
5. 执行 `node server.js`，打开 `http://127.0.0.1:8765/index.html` 查看当前 Demo。
6. 按 `HANDOFF_CHECKLIST.md` 完成运行、数据和首次同步检查。

主要页面：

- `index.html`：社区首页 Demo。
- `community-content-framework.html`：社区内容与运营框架。
- `community-content-structure.html`：社区内容结构图。
- `community-architecture.html`：早期架构探索稿，仅作过程参考。

重要提醒：

- 页面同时存在真实仓库快照、人工配置内容和演示占位内容，发布前必须按 `PROJECT_HANDOFF.md` 的数据口径逐项核对。
- 不展示没有可靠数据源的使用次数、评分或贡献记录。
- Git / PR / Issue 和 Agent 使用上下文先形成可核验的结构化记录，再进入社区呈现。
