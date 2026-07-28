#!/bin/bash
#
# publish-weekly.sh — 审核后一键发布（人工闸门后执行，不进 launchd）
#
# 把 auto-sync/<date> 草稿分支合入 main、bump 缓存版本参数、push 触发 GitHub Pages。
#
# 用法:
#   bash scripts/publish-weekly.sh [auto-sync/<date>]
#   省略分支名 → 自动选最近的 auto-sync/* 分支。
#   加 --dry-run → 只演示要做什么，不真正 push。

set -uo pipefail

DEMO_REPO="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
GIT="/Library/Developer/CommandLineTools/usr/bin/git"
INDEX="$DEMO_REPO/index.html"
LIVE_URL="https://liuzhaoran88-rgb.github.io/design-skill-community-demo/"

DRY_RUN=0
BRANCH=""
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=1 ;;
    *) BRANCH="$arg" ;;
  esac
done

die() { echo "❌ $*" >&2; exit 1; }

cd "$DEMO_REPO" || die "无法进入 $DEMO_REPO"

# 未指定分支 → 选最近的 auto-sync/*
if [ -z "$BRANCH" ]; then
  BRANCH="$("$GIT" for-each-ref --sort=-creatordate --format='%(refname:short)' 'refs/heads/auto-sync/*' | head -1)"
  [ -n "$BRANCH" ] || die "找不到任何 auto-sync/* 草稿分支，请先跑 weekly-auto-sync.sh"
  echo "自动选中最近草稿分支: $BRANCH"
fi

"$GIT" show-ref --verify --quiet "refs/heads/$BRANCH" || die "分支不存在: $BRANCH"

# 工作区必须干净（避免把无关改动一起发出去）；dry-run 只读，降级为警告
if ! "$GIT" diff --quiet || ! "$GIT" diff --cached --quiet; then
  if [ "$DRY_RUN" = "1" ]; then
    echo "⚠️  [dry-run] 工作区有未提交改动——真正发布前需先处理干净（git stash 或提交）。"
  else
    die "工作区有未提交改动，请先处理干净再发布（git status 查看）。可先 git stash。"
  fi
fi

VERSION="$(date +%Y%m%d%H%M)"
echo "----------------------------------------"
echo "发布计划:"
echo "  草稿分支 : $BRANCH"
echo "  合入目标 : main"
echo "  缓存版本 : ?v=$VERSION"
echo "  线上链接 : $LIVE_URL"
[ "$DRY_RUN" = "1" ] && echo "  模式     : DRY-RUN（不真正 push）"
echo "----------------------------------------"

# 1. 切 main 并合入草稿
if [ "$DRY_RUN" = "1" ]; then
  echo "[dry-run] git checkout main"
  echo "[dry-run] git merge --no-ff $BRANCH"
else
  "$GIT" checkout main >/dev/null 2>&1 || die "无法切到 main"
  "$GIT" merge --no-ff "$BRANCH" -m "release: 发布周更数据（来自 ${BRANCH}）" >/dev/null 2>&1 \
    || die "合并失败，可能有冲突。手动解决后重试。"
  echo "✅ 已合入 main"
fi

# 2. bump 所有 assets/*.js?v= 缓存参数（触发 Pages 刷新）
#    只改 assets 引用行，避免误伤其它资源版本号
if [ "$DRY_RUN" = "1" ]; then
  echo "[dry-run] 将把 index.html 中 assets/*.js?v= 更新为 ?v=$VERSION"
else
  /usr/bin/sed -i '' -E "s#(assets/[a-zA-Z0-9._-]+\.js\?v=)[0-9]+#\1${VERSION}#g" "$INDEX"
  if ! "$GIT" diff --quiet -- index.html; then
    "$GIT" add index.html
    "$GIT" commit -m "chore: bump 缓存版本 ?v=$VERSION" >/dev/null 2>&1
    echo "✅ 已 bump 缓存版本参数"
  else
    echo "ℹ️  缓存参数无变化（同分钟内重复发布？）"
  fi
fi

# 3. push 触发 Pages 部署
if [ "$DRY_RUN" = "1" ]; then
  echo "[dry-run] git push origin main"
  echo ""
  echo "DRY-RUN 结束，未做任何远端改动。"
  exit 0
fi

echo "推送到 GitHub..."
GIT_TERMINAL_PROMPT=0 "$GIT" push origin main 2>&1 | tail -3 || die "push 失败（检查 GitHub 认证 / 网络）"

echo ""
echo "🎉 发布完成！"
echo "   线上链接: $LIVE_URL"
echo "   带版本参数（绕缓存）: ${LIVE_URL}?v=$VERSION"
echo ""
echo "   GitHub Pages 通常 1-3 分钟内刷新。如未更新，用上面带 ?v= 的链接。"
echo ""
echo "   交付口径（发给使用方）:"
echo "   - 最新线上链接: $LIVE_URL"
echo "   - 本次数据来自草稿分支: $BRANCH"
