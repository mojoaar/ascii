#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p bin
for target in \
  "darwin amd64" "darwin arm64" \
  "linux amd64" "linux arm64" \
  "windows amd64"; do
  set -- $target
  GOOS=$1 GOARCH=$2 go build -o "bin/ascii-$1-$2${3:-}" ./cmd/ascii
  [ "$1" = "windows" ] && mv "bin/ascii-$1-$2" "bin/ascii-$1-$2.exe" || true
done
ls -lh bin
