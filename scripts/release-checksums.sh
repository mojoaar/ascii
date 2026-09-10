#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

if [ $# -ne 1 ]; then
  echo "usage: $0 <version>" >&2
  exit 1
fi

version="$1"
outdir="apps/cli/bin"

cd "$outdir"
sha256sum ascii-* > "ascii-${version}.sha256"
ls -l "ascii-${version}.sha256"
