#!/bin/bash

set -euo pipefail

DEMO_REPO="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
CODING_REPO="${CODING_REPO:-/Users/liuzhaoran/Desktop/AI项目/2C-DesignWiki}"
OUTPUT_DIR="${SCENARIO_CATALOG_OUTPUT:-${DEMO_REPO}/artifacts/scenario-skill-catalog}"
GIT="/Library/Developer/CommandLineTools/usr/bin/git"
NODE="$(command -v node)"
SKIP_FETCH=0
OPEN_PAGE=1

for arg in "$@"; do
  case "$arg" in
    --scan) ;;
    --skip-fetch) SKIP_FETCH=1 ;;
    --no-open) OPEN_PAGE=0 ;;
    *)
      echo "未知参数: $arg" >&2
      echo "用法: bash scripts/scenario-curation.sh --scan [--skip-fetch] [--no-open]" >&2
      exit 2
      ;;
  esac
done

[ -x "$GIT" ] || { echo "git 不可用" >&2; exit 1; }
[ -n "$NODE" ] || { echo "node 不可用" >&2; exit 1; }
"$GIT" -C "$CODING_REPO" rev-parse --git-dir >/dev/null 2>&1 \
  || { echo "Coding 仓库不存在: $CODING_REPO" >&2; exit 1; }

if [ "$SKIP_FETCH" = "0" ]; then
  echo "同步 Coding 在线 main..."
  "$GIT" -C "$CODING_REPO" fetch origin main
else
  echo "跳过在线同步，候选目录可能不是最新数据。"
fi

RUN_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/scenario-curation.XXXXXX")"
CODING_WORKTREE="${RUN_ROOT}/coding"

cleanup() {
  if [ -d "$CODING_WORKTREE" ]; then
    "$GIT" -C "$CODING_REPO" worktree remove --force "$CODING_WORKTREE" >/dev/null 2>&1 || true
  fi
  case "$RUN_ROOT" in
    */scenario-curation.*) /bin/rm -rf "$RUN_ROOT" ;;
  esac
}
trap cleanup EXIT INT TERM

echo "创建 Coding main 隔离副本..."
"$GIT" -C "$CODING_REPO" worktree add --detach "$CODING_WORKTREE" origin/main >/dev/null

echo "扫描全量 SKILL.md..."
"$NODE" "$DEMO_REPO/scripts/build-skill-catalog.js" "$CODING_WORKTREE" "$OUTPUT_DIR"
"$NODE" "$DEMO_REPO/scripts/validate-skill-catalog.js" "$OUTPUT_DIR"

PAGE="${OUTPUT_DIR}/index.html"
echo "候选目录已生成: $PAGE"

if [ "$OPEN_PAGE" = "1" ]; then
  /usr/bin/open "$PAGE"
fi
