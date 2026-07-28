#!/bin/bash
#
# 统一的社区数据刷新入口。
# - 定时：bash scripts/refresh-community.sh --scheduled
# - 手动：bash scripts/refresh-community.sh --manual
# - 预演：bash scripts/refresh-community.sh --manual --dry-run
#
# 自动阶段只创建待审核 PR，绝不自动合并 main。

set -uo pipefail

DEMO_REPO="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
CODING_REPO="${CODING_REPO:-/Users/liuzhaoran/Desktop/AI项目/2C-DesignWiki}"
GITHUB_REPO="${GITHUB_REPO:-liuzhaoran88-rgb/design-skill-community-demo}"
DEMO_BASE_REF="${DEMO_BASE_REF:-origin/main}"
GIT="/Library/Developer/CommandLineTools/usr/bin/git"
NODE="$(command -v node || true)"
GH="$(command -v gh || true)"
FEISHU_CLI="${HOME}/.local/bin/feishu-cli"
FEISHU_EMAIL="${FEISHU_EMAIL:-liuzhaoran@jd.com}"
LOG="${HOME}/Library/Logs/community-weekly-sync.log"
LOCK_DIR="${TMPDIR:-/tmp}/community-refresh.lock"

MODE="manual"
DRY_RUN=0
FORCE=0
SKIP_FETCH=0

for arg in "$@"; do
  case "$arg" in
    --scheduled) MODE="scheduled" ;;
    --manual) MODE="manual" ;;
    --dry-run) DRY_RUN=1 ;;
    --force) FORCE=1 ;;
    --skip-fetch) SKIP_FETCH=1 ;;
    *)
      echo "未知参数: $arg" >&2
      echo "用法: bash scripts/refresh-community.sh [--manual|--scheduled] [--dry-run] [--force] [--skip-fetch]" >&2
      exit 2
      ;;
  esac
done

mkdir -p "$(dirname "$LOG")"

log() {
  echo "[$(date '+%F %T')] $*" | tee -a "$LOG"
}

notify() {
  local title="$1"
  local body="$2"
  /usr/bin/osascript -e "display notification \"${body//\"/\\\"}\" with title \"${title//\"/\\\"}\"" 2>/dev/null || true
  if [ -x "$FEISHU_CLI" ] && "$FEISHU_CLI" auth status >/dev/null 2>&1; then
    "$FEISHU_CLI" msg send --receive-id-type email --receive-id "$FEISHU_EMAIL" \
      --text "【社区周更】${title}
${body}" >/dev/null 2>&1 || true
  fi
}

if ! mkdir "$LOCK_DIR" 2>/dev/null; then
  log "已有社区刷新任务运行中，本次 ${MODE} 触发跳过"
  notify "社区刷新已跳过" "已有刷新任务运行中，请稍后再试。"
  exit 75
fi

RUN_ID="$(date '+%Y%m%d-%H%M%S')"
RUN_DATE="$(date '+%F')"
RUN_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/community-refresh.XXXXXX")"
CODING_WORKTREE="${RUN_ROOT}/coding"
DEMO_WORKTREE="${RUN_ROOT}/demo"
OLD_SNAPSHOT="${RUN_ROOT}/old-snapshot.json"
PR_BODY="${RUN_ROOT}/pr-body.md"
DRAFT_BRANCH="automation/community-refresh-${RUN_ID}"
DELETE_LOCAL_BRANCH=0

cleanup() {
  if [ -d "$DEMO_WORKTREE" ]; then
    "$GIT" -C "$DEMO_REPO" worktree remove --force "$DEMO_WORKTREE" >/dev/null 2>&1 || true
  fi
  if [ -d "$CODING_WORKTREE" ]; then
    "$GIT" -C "$CODING_REPO" worktree remove --force "$CODING_WORKTREE" >/dev/null 2>&1 || true
  fi
  if [ "$DELETE_LOCAL_BRANCH" = "1" ]; then
    "$GIT" -C "$DEMO_REPO" branch -D "$DRAFT_BRANCH" >/dev/null 2>&1 || true
  fi
  case "$RUN_ROOT" in
    */community-refresh.*) /bin/rm -rf "$RUN_ROOT" ;;
  esac
  rmdir "$LOCK_DIR" >/dev/null 2>&1 || true
}

fail() {
  log "❌ 刷新失败: $*"
  notify "社区刷新失败" "$*；详见 ${LOG}"
  exit 1
}

trap cleanup EXIT INT TERM

[ -x "$GIT" ] || fail "git 不可用"
[ -n "$NODE" ] && [ -x "$NODE" ] || fail "node 不可用"
"$GIT" -C "$CODING_REPO" rev-parse --git-dir >/dev/null 2>&1 \
  || fail "Coding 仓库不存在: ${CODING_REPO}"
"$GIT" -C "$DEMO_REPO" rev-parse --git-dir >/dev/null 2>&1 \
  || fail "Demo 仓库不存在: ${DEMO_REPO}"
if [ "$DRY_RUN" = "0" ]; then
  [ -n "$GH" ] && [ -x "$GH" ] || fail "gh CLI 不可用，无法创建审核 PR"
fi

log "==================== 社区刷新开始（${MODE} / ${RUN_ID}）===================="

export GIT_SSH_COMMAND="ssh -o ConnectTimeout=20 -o BatchMode=yes"
if [ "$SKIP_FETCH" = "0" ]; then
  log "同步 Coding origin/main（不切换当前工作分支）"
  "$GIT" -C "$CODING_REPO" fetch origin main >>"$LOG" 2>&1 \
    || fail "Coding fetch 失败，请确认内网连接"
  log "同步 Demo origin/main"
  "$GIT" -C "$DEMO_REPO" fetch origin main >>"$LOG" 2>&1 \
    || fail "GitHub fetch 失败"
else
  log "跳过远端 fetch，使用本地 origin/main（仅建议 dry-run）"
fi

log "创建 Coding 只读 worktree"
"$GIT" -C "$CODING_REPO" worktree add --detach "$CODING_WORKTREE" origin/main >>"$LOG" 2>&1 \
  || fail "无法创建 Coding worktree"

log "创建 Demo 草稿 worktree: ${DRAFT_BRANCH}（基于 ${DEMO_BASE_REF}）"
"$GIT" -C "$DEMO_REPO" worktree add -b "$DRAFT_BRANCH" "$DEMO_WORKTREE" "$DEMO_BASE_REF" >>"$LOG" 2>&1 \
  || fail "无法创建 Demo worktree"
DELETE_LOCAL_BRANCH=1

cp "$DEMO_WORKTREE/assets/coding-community-snapshot.json" "$OLD_SNAPSHOT" \
  || fail "无法读取上一版 Coding snapshot"

log "生成 Coding 快照"
(cd "$DEMO_WORKTREE" && CODING_SOURCE_BRANCH=main "$NODE" scripts/sync-coding-snapshot.js "$CODING_WORKTREE") >>"$LOG" 2>&1 \
  || fail "sync-coding-snapshot.js 执行失败"

log "同步社区 Skill 数据"
(cd "$DEMO_WORKTREE" && "$NODE" scripts/sync-community-skills.js "$CODING_WORKTREE") >>"$LOG" 2>&1 \
  || fail "sync-community-skills.js 执行失败"

log "生成本周更新卡片"
(cd "$DEMO_WORKTREE" && "$NODE" scripts/sync-weekly-updates.js "$CODING_WORKTREE") >>"$LOG" 2>&1 \
  || fail "sync-weekly-updates.js 执行失败"

VERSION="$(date '+%Y%m%d%H%M')"
(cd "$DEMO_WORKTREE" && "$NODE" scripts/bump-data-cache-version.js "$VERSION") >>"$LOG" 2>&1 \
  || fail "缓存版本更新失败"

NEW_SNAPSHOT="$DEMO_WORKTREE/assets/coding-community-snapshot.json"
OLD_HEAD="$("$NODE" -e "console.log(require(process.argv[1]).source.head)" "$OLD_SNAPSHOT")"
NEW_HEAD="$("$NODE" -e "console.log(require(process.argv[1]).source.head)" "$NEW_SNAPSHOT")"

if [ "$FORCE" = "0" ] && [ "$OLD_HEAD" = "$NEW_HEAD" ]; then
  log "Coding HEAD 未变化（${NEW_HEAD:0:8}），无需创建重复 PR"
  notify "社区数据无需刷新" "Coding main 没有新提交。"
  exit 0
fi

log "执行完整数据校验"
(cd "$DEMO_WORKTREE" && "$NODE" --check app.js) >>"$LOG" 2>&1 \
  || fail "app.js 语法检查失败"
(cd "$DEMO_WORKTREE" && "$NODE" --check scripts/sync-coding-snapshot.js) >>"$LOG" 2>&1 \
  || fail "sync-coding-snapshot.js 语法检查失败"
(cd "$DEMO_WORKTREE" && "$NODE" --check scripts/sync-community-skills.js) >>"$LOG" 2>&1 \
  || fail "sync-community-skills.js 语法检查失败"
(cd "$DEMO_WORKTREE" && "$NODE" --check scripts/sync-weekly-updates.js) >>"$LOG" 2>&1 \
  || fail "sync-weekly-updates.js 语法检查失败"
SUMMARY="$(cd "$DEMO_WORKTREE" && "$NODE" scripts/validate-community-refresh.js)" \
  || fail "社区刷新数据校验失败"
"$GIT" -C "$DEMO_WORKTREE" diff --check >>"$LOG" 2>&1 \
  || fail "生成文件包含空白或补丁格式问题"

BRIEF_FILE="$DEMO_WORKTREE/docs/daily-changes/${RUN_DATE}.md"
"$NODE" "$DEMO_WORKTREE/scripts/gen-weekly-brief.js" "$OLD_SNAPSHOT" "$NEW_SNAPSHOT" "$BRIEF_FILE" >>"$LOG" 2>&1 \
  || fail "周报草稿生成失败"

log "校验通过"
echo "$SUMMARY" | tee -a "$LOG"

if [ "$DRY_RUN" = "1" ]; then
  log "DRY-RUN：以下文件会进入待审核 PR"
  "$GIT" -C "$DEMO_WORKTREE" status --short | tee -a "$LOG"
  "$GIT" -C "$DEMO_WORKTREE" diff --stat | tee -a "$LOG"
  log "==================== DRY-RUN 完成，未 push、未创建 PR ===================="
  exit 0
fi

if [ -n "$("$GH" pr list --repo "$GITHUB_REPO" --state open --json url,body \
  --jq ".[] | select(.body | contains(\"coding-head:${NEW_HEAD}\")) | .url" 2>/dev/null)" ]; then
  log "相同 Coding HEAD 已有待审核 PR，本次不重复创建"
  notify "社区刷新已有待审核 PR" "Coding ${NEW_HEAD:0:8} 已生成过草稿，请直接审核现有 PR。"
  exit 0
fi

"$GIT" -C "$DEMO_WORKTREE" add \
  assets/coding-community-snapshot.json \
  assets/coding-community-snapshot.js \
  assets/community-skills.json \
  assets/community-skills.js \
  assets/weekly-updates.json \
  assets/weekly-updates.js \
  index.html \
  "docs/daily-changes/${RUN_DATE}.md" \
  || fail "git add 失败"

"$GIT" -C "$DEMO_WORKTREE" -c user.name="community-refresh" -c user.email="community-refresh@local" \
  commit -m "chore: refresh community data ${RUN_DATE} (coding ${NEW_HEAD:0:8})" >>"$LOG" 2>&1 \
  || fail "生成提交失败"

log "推送草稿分支"
GIT_TERMINAL_PROMPT=0 "$GIT" -C "$DEMO_WORKTREE" push -u origin "$DRAFT_BRANCH" >>"$LOG" 2>&1 \
  || fail "草稿分支 push 失败"

CONTRIB="$("$NODE" -e "console.log(require(process.argv[1]).weekly.contributor_count)" "$NEW_SNAPSHOT")"
UPDATES="$("$NODE" -e "console.log(require(process.argv[1]).weekly.non_merge_commit_count)" "$NEW_SNAPSHOT")"
SKILLS="$("$NODE" -e "console.log(require(process.argv[1]).weekly.changed_skill_count)" "$NEW_SNAPSHOT")"
CORE="$("$NODE" -e "console.log(require(process.argv[1]).weekly.design_system.core_design_md_added)" "$NEW_SNAPSHOT")"
PERIOD="$("$NODE" -e "const s=require(process.argv[1]); console.log(s.windows.week.start+'–'+s.windows.week.end)" "$NEW_SNAPSHOT")"

{
  echo "## 自动刷新摘要"
  echo
  echo "- 统计周期：${PERIOD}"
  echo "- 贡献者：${CONTRIB} 位"
  echo "- 社区共建更新：${UPDATES} 次"
  echo "- Skill 变更：${SKILLS} 项"
  echo "- 核心规范更新：${CORE} 份"
  echo "- Coding source：\`${NEW_HEAD}\`"
  echo
  echo "coding-head:${NEW_HEAD}"
  echo
  echo "## 人工审核"
  echo
  echo "- [ ] 贡献者姓名与头像正确"
  echo "- [ ] 本周更新卡片文案可读"
  echo "- [ ] 核心规范数字与分类一致"
  echo "- [ ] 页面预览无溢出或遮挡"
  echo
  echo "> 由 \`scripts/refresh-community.sh --${MODE}\` 自动生成；不会自动合并 main。"
} >"$PR_BODY"

PR_URL="$("$GH" pr create \
  --repo "$GITHUB_REPO" \
  --base main \
  --head "$DRAFT_BRANCH" \
  --title "chore: 刷新社区数据 ${RUN_DATE}" \
  --body-file "$PR_BODY")" \
  || fail "GitHub PR 创建失败"

log "✅ 待审核 PR: ${PR_URL}"
notify "社区数据已刷新，等待审核" \
"${PERIOD} · ${CONTRIB} 位贡献者 · ${UPDATES} 次更新
${PR_URL}"
log "==================== 社区刷新完成（未自动合并）===================="
