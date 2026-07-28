#!/bin/bash
#
# 兼容旧入口：定时任务统一转交 refresh-community.sh。

set -uo pipefail

DEMO_REPO="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
exec /bin/bash "$DEMO_REPO/scripts/refresh-community.sh" --scheduled "$@"
