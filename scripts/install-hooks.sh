#!/usr/bin/env bash
# Install git hooks by symlinking scripts/pre-commit → .git/hooks/pre-commit
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
HOOK_SRC="$REPO_ROOT/scripts/pre-commit"
HOOK_DST="$REPO_ROOT/.git/hooks/pre-commit"

chmod +x "$HOOK_SRC"

if [ -e "$HOOK_DST" ] || [ -L "$HOOK_DST" ]; then
  echo "Replacing existing pre-commit hook."
  rm -f "$HOOK_DST"
fi

ln -s "$HOOK_SRC" "$HOOK_DST"
echo "Pre-commit hook installed: $HOOK_DST -> $HOOK_SRC"
