# 每日版本记录

从 2026-07-23 起，社区化项目按天保存改动，便于查看历史和恢复版本。

## 记录规则

1. 每天首次修改前，运行：

   ```bash
   ./scripts/daily-version.sh snapshot before
   ```

2. 当天每完成一批改动，更新 `change-history/YYYY-MM-DD.md`，记录：

   - 改动目标
   - 修改文件
   - 具体变化
   - 验证结果
   - 回退说明

3. 当天工作结束后，运行：

   ```bash
   ./scripts/daily-version.sh snapshot after
   ```

## 快照位置

完整快照保存在：

```text
.local-history/YYYY-MM-DD/
```

该目录仅保存在本机，并已加入 `.gitignore`。每日文字记录会保留在仓库中，方便后续模型或同事理解改动上下文。

## 恢复原则

不要直接覆盖当前项目。需要恢复时，先把对应 `.tar.gz` 解压到临时目录，对比确认后再选择性恢复文件。
