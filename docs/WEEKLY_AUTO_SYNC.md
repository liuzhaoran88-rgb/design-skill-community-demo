# 社区数据自动刷新

社区 Demo 使用同一条流水线支持定时刷新和手动刷新。流水线只创建待审核 PR，不自动合并 `main`。

## 刷新范围

- Coding main 最近 7 天贡献者与非合并提交
- 变更 Skill 数量与贡献者头像墙
- 五类核心规范更新数量
- 社区 Skill 元数据、验证信息与案例
- 首页“本周更新”卡片
- 场景推荐中的最新设计交付能力

## 手动刷新

```bash
bash scripts/refresh-community.sh --manual
```

只生成和校验、不推送：

```bash
bash scripts/refresh-community.sh --manual --dry-run
```

测试本地 `origin/main`、跳过网络拉取：

```bash
bash scripts/refresh-community.sh --manual --dry-run --skip-fetch
```

## 定时刷新

默认配置为每周三 20:00，通过 macOS `launchd` 调用：

```bash
bash scripts/refresh-community.sh --scheduled
```

安装：

```bash
cp scripts/com.liuzhaoran.community-weekly-sync.plist ~/Library/LaunchAgents/
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.liuzhaoran.community-weekly-sync.plist
```

查看状态：

```bash
launchctl list | grep community-weekly-sync
tail -50 ~/Library/Logs/community-weekly-sync.log
```

卸载：

```bash
launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/com.liuzhaoran.community-weekly-sync.plist
```

## 安全边界

- Coding 与 Demo 都使用独立 `git worktree`，不会切换当前工作分支。
- 通过原子锁避免定时和手动任务并发运行。
- 数据校验失败时不会 push，也不会创建 PR。
- 相同 Coding HEAD 已有开放 PR 时，不重复创建。
- 自动任务绝不合并 `main`，由人工确认贡献者、头像、文案和排版后合并。
