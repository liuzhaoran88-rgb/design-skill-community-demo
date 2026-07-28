#!/bin/bash
#
# weekly-auto-sync.sh — 每周自动同步 coding 仓库数据到社区官网（半自动 · 人工审核）
#
# 由 launchd 每周三 20:00 触发。做到「生成待审核草稿分支 + 通知」即停，绝不自动上线。
# 发布是人工闸门：审核后手动跑 publish-weekly.sh。
#
# 架构要点：用 git worktree 隔离，绝不 checkout 主工作区的分支
#   —— 这样你手头的工作分支和未提交改动纹丝不动，也不会出现「切到 main 后脚本消失」的问题。
#
# 手动跑（不等周三）：bash scripts/weekly-auto-sync.sh

set -uo pipefail

# ---------- 配置 ----------
CODING_REPO="/Users/liuzhaoran/Desktop/AI项目/2C-DesignWiki"
DEMO_REPO="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
# GitHub Pages 发布源。自动草稿始终从线上 main 创建，避免长期绑定临时分支。
PUBLISH_BRANCH="main"
GIT="/Library/Developer/CommandLineTools/usr/bin/git"
NODE="$(command -v node || echo /opt/homebrew/bin/node)"
FEISHU_CLI="$HOME/.local/bin/feishu-cli"
FEISHU_EMAIL="liuzhaoran@jd.com"   # 飞书已登录时推手机的收件人；未登录则忽略
LOG="$HOME/Library/Logs/community-weekly-sync.log"

# sync/brief 脚本从主工作区绝对路径调用（不受 worktree 分支内容影响）
SYNC_SCRIPT="$DEMO_REPO/scripts/sync-coding-snapshot.js"
BRIEF_SCRIPT="$DEMO_REPO/scripts/gen-weekly-brief.js"

DATE="$(date +%F)"                 # 2026-07-29
DRAFT_BRANCH="auto-sync/$DATE"
WORKTREE="/tmp/community-weekly-worktree-$DATE"

mkdir -p "$(dirname "$LOG")"

# ---------- 工具函数 ----------
log() { echo "[$(date '+%F %T')] $*" | tee -a "$LOG"; }

notify() {
  local title="$1" body="$2"
  /usr/bin/osascript -e "display notification \"${body//\"/\\\"}\" with title \"${title//\"/\\\"}\"" 2>/dev/null || true
  if [ -x "$FEISHU_CLI" ] && "$FEISHU_CLI" auth status >/dev/null 2>&1; then
    "$FEISHU_CLI" msg send --receive-id-type email --receive-id "$FEISHU_EMAIL" \
      --text "【社区周更】$title
$body" >/dev/null 2>&1 || true
  fi
}

cleanup_worktree() {
  # 移除临时 worktree（分支保留在主仓库里供审核）
  if [ -d "$WORKTREE" ]; then
    "$GIT" -C "$DEMO_REPO" worktree remove --force "$WORKTREE" >/dev/null 2>&1 || rm -rf "$WORKTREE"
  fi
}

fail() {
  log "❌ 失败: $*"
  cleanup_worktree
  notify "周更同步失败" "$* — 详见 $LOG"
  exit 1
}

log "==================== 周更同步开始 ($DATE) ===================="

# ---------- 0. 前置检查 ----------
[ -d "$CODING_REPO/.git" ] || fail "coding 活仓库不存在: $CODING_REPO"
[ -x "$GIT" ] || fail "git 不可用: $GIT"
[ -n "$NODE" ] && [ -x "$NODE" ] || fail "node 不可用"
[ -f "$SYNC_SCRIPT" ] || fail "找不到 sync 脚本: $SYNC_SCRIPT"
"$GIT" -C "$DEMO_REPO" show-ref --verify --quiet "refs/heads/$PUBLISH_BRANCH" \
  || fail "发布分支不存在: ${PUBLISH_BRANCH}（收编 main 后请改脚本顶部 PUBLISH_BRANCH）"

# ---------- 1. 拉取 coding 最新（只读，--ff-only 防意外 merge）----------
log "拉取 coding 仓库最新 main..."
CODING_BRANCH="$("$GIT" -C "$CODING_REPO" rev-parse --abbrev-ref HEAD 2>/dev/null)"
if [ "$CODING_BRANCH" != "main" ]; then
  log "coding 仓库当前在 ${CODING_BRANCH}，切到 main"
  "$GIT" -C "$CODING_REPO" checkout main >/dev/null 2>&1 || fail "coding 仓库无法切到 main"
fi
export GIT_SSH_COMMAND="ssh -o ConnectTimeout=15 -o BatchMode=yes"
"$GIT" -C "$CODING_REPO" fetch origin main >>"$LOG" 2>&1 || fail "coding fetch 失败（内网未连通？）"
"$GIT" -C "$CODING_REPO" pull --ff-only origin main >>"$LOG" 2>&1 || fail "coding pull --ff-only 失败（本地有分叉提交？）"
CODING_HEAD="$("$GIT" -C "$CODING_REPO" rev-parse --short HEAD)"
log "coding HEAD: $CODING_HEAD"

# ---------- 2. 建隔离 worktree，基于发布分支拉出草稿分支 ----------
log "创建隔离 worktree: $WORKTREE (草稿分支 $DRAFT_BRANCH)"
cleanup_worktree
# 若同名草稿分支已存在（当天重跑），先删掉重来
"$GIT" -C "$DEMO_REPO" branch -D "$DRAFT_BRANCH" >/dev/null 2>&1 || true
"$GIT" -C "$DEMO_REPO" worktree add -b "$DRAFT_BRANCH" "$WORKTREE" "$PUBLISH_BRANCH" >>"$LOG" 2>&1 \
  || fail "无法创建 worktree（发布分支被占用？）"

# 备份 worktree 里的旧 snapshot 供 diff
OLD_SNAPSHOT="/tmp/coding-snapshot-prev-$DATE.json"
if [ -f "$WORKTREE/assets/coding-community-snapshot.json" ]; then
  cp "$WORKTREE/assets/coding-community-snapshot.json" "$OLD_SNAPSHOT"
else
  echo "-" > "$OLD_SNAPSHOT"
fi

# ---------- 3. 生成 snapshot（写进 worktree 的 assets/）----------
log "生成 snapshot..."
# sync 脚本第 2 参可指定输出根目录？—— 它固定写到自己所在仓库的 assets/。
# 因此在 worktree 内执行 sync 的一份拷贝，确保输出落在 worktree。
cp "$SYNC_SCRIPT" "$WORKTREE/scripts/sync-coding-snapshot.js" 2>/dev/null || true
( cd "$WORKTREE" && "$NODE" "$WORKTREE/scripts/sync-coding-snapshot.js" "$CODING_REPO" ) >>"$LOG" 2>&1 \
  || fail "sync-coding-snapshot.js 执行失败"

NEW_SNAPSHOT="$WORKTREE/assets/coding-community-snapshot.json"
[ -f "$NEW_SNAPSHOT" ] || fail "snapshot 未生成: $NEW_SNAPSHOT"

# 数据无变化 → 不留分支、不打扰
if "$GIT" -C "$WORKTREE" diff --quiet -- assets/coding-community-snapshot.json 2>/dev/null; then
  log "本周 snapshot 无变化，跳过建分支与通知"
  cleanup_worktree
  "$GIT" -C "$DEMO_REPO" branch -D "$DRAFT_BRANCH" >/dev/null 2>&1 || true
  log "==================== 周更同步结束（无变化）===================="
  exit 0
fi

# ---------- 4. 生成周报草稿 ----------
BRIEF_FILE="$WORKTREE/docs/daily-changes/$DATE.md"
log "生成周报草稿: docs/daily-changes/$DATE.md"
"$NODE" "$BRIEF_SCRIPT" "$OLD_SNAPSHOT" "$NEW_SNAPSHOT" "$BRIEF_FILE" >>"$LOG" 2>&1 \
  || log "⚠️ 周报草稿生成失败（不阻断，snapshot 已生成）"

# ---------- 5. 在 worktree 里 commit（不 push、不合 main）----------
# 把临时拷贝的 sync 脚本还原（避免误提交重复文件）
"$GIT" -C "$WORKTREE" checkout -- scripts/sync-coding-snapshot.js >/dev/null 2>&1 || true
"$GIT" -C "$WORKTREE" add assets/coding-community-snapshot.json assets/coding-community-snapshot.js "docs/daily-changes/$DATE.md" >/dev/null 2>&1
"$GIT" -C "$WORKTREE" -c user.name="weekly-auto-sync" -c user.email="auto-sync@local" \
  commit -m "chore: 周更数据草稿 ${DATE}（coding ${CODING_HEAD}，待审核）" >>"$LOG" 2>&1 \
  || fail "commit 失败"

# 读关键数字用于通知
CONTRIB="$("$NODE" -e "console.log(require('$NEW_SNAPSHOT').weekly.contributor_count)" 2>/dev/null || echo '?')"
SKILLS="$("$NODE" -e "console.log(require('$NEW_SNAPSHOT').weekly.changed_skill_count)" 2>/dev/null || echo '?')"
MD="$("$NODE" -e "console.log(require('$NEW_SNAPSHOT').weekly.design_system.core_design_md_added)" 2>/dev/null || echo '?')"
log "✅ 草稿就绪 — 贡献者 $CONTRIB / Skill 变更 $SKILLS / 核心 MD $MD"

# ---------- 6. 移除 worktree（草稿分支 auto-sync/<date> 保留在主仓库供审核）----------
cleanup_worktree

# ---------- 7. 通知审核 ----------
notify "本周数据已抓取，去审核" \
"贡献者 ${CONTRIB} · Skill ${SKILLS} · 核心MD ${MD}
草稿分支 ${DRAFT_BRANCH}
审核后跑: bash scripts/publish-weekly.sh ${DRAFT_BRANCH}"

log "==================== 周更同步结束 ===================="
log "下一步（人工）：git checkout $DRAFT_BRANCH → 审核 docs/daily-changes/$DATE.md → bash scripts/publish-weekly.sh $DRAFT_BRANCH"
