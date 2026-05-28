#!/usr/bin/env sh
# Cross-platform launcher wrapper (Unix/Linux/macOS). Primary logic: launch.mjs
set -e
SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
ROOT="$(CDPATH= cd -- "$SCRIPT_DIR/../.." && pwd)"
cd "$ROOT" || exit 1
exec node "$SCRIPT_DIR/launch.mjs" "$@"
