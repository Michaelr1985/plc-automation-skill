#!/usr/bin/env bash
set -euo pipefail

IDF_ROOT="${IDF_ROOT:-$HOME/esp/esp-idf}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BREW_PYTHON_PATH="${BREW_PYTHON_PATH:-/usr/local/opt/python@3.12/libexec/bin}"

if [[ -d "$BREW_PYTHON_PATH" ]]; then
  export PATH="$BREW_PYTHON_PATH:$PATH"
fi

if [[ ! -f "$IDF_ROOT/export.sh" ]]; then
  echo "ERROR: ESP-IDF export.sh not found at $IDF_ROOT/export.sh" >&2
  echo "Install ESP-IDF or set IDF_ROOT to the ESP-IDF checkout path." >&2
  exit 1
fi

. "$IDF_ROOT/export.sh" >/dev/null

cd "$SCRIPT_DIR/test"
idf.py set-target esp32
idf.py build
