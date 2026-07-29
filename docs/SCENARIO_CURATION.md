# 场景提效推荐选品

“场景提效推荐”由运营人工精选。全量 Skill 扫描是按需流程，不属于每周默认刷新任务。

## 触发方式

最简单的方式是双击仓库根目录的：

```text
场景推荐选品.command
```

也可以在终端运行：

```bash
bash scripts/scenario-curation.sh --scan
```

脚本会先同步 Coding 在线 `main`，再在隔离 worktree 中扫描全部已跟踪的
`SKILL.md`。它不会切换或读取 Coding 当前工作分支中的未提交内容。

## 选品目录

生成结果位于：

```text
artifacts/scenario-skill-catalog/index.html
```

这个目录只用于本地运营，不进入 Git。页面支持：

- 搜索名称、说明、维护者和仓库路径
- 按研究分析、体验优化、设计交付、品牌营销筛选
- 按资料完整度、文档示例和最近更新时间筛选
- 查看每项 Skill 的真实 `SKILL.md`
- 最多选择 6 项，并分配到三个展示场景
- 填写人工推荐理由并导出 `scenario-picks-YYYY-MM-DD.json`

“资料完整度”只表示 `SKILL.md` 是否包含简介、使用说明、案例示例、验证检查及
持续维护信号，不等同于自动判断成熟度。

## 数据新鲜度

目录记录生成时间和 Coding main commit SHA。正式应用运营选择前，需要再次比较
远端 HEAD：

- HEAD 未变化：可以继续生成页面预览和审核 PR。
- HEAD 已变化：重新扫描后再选择，或明确确认继续使用旧目录。
- 在线 fetch 失败：默认停止，不静默使用缓存。

仅本地预览时可以显式跳过 fetch：

```bash
bash scripts/scenario-curation.sh --scan --skip-fetch
```

此时目录会提示可能不是最新数据，不建议用于正式选品。

## 与每周任务的边界

`scripts/refresh-community.sh --scheduled` 不调用全量扫描，也不会自动替换人工推荐。
未来应用 `scenario-picks.json` 后，每周任务只刷新已选 Skill 的名称、简介、链接、
弹层和迭代记录。
