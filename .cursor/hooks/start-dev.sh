#!/bin/bash
# Ensure a single Vite preview on port 5174 for this project.
input=$(cat)

PROJECT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$PROJECT_DIR" || exit 0

if node scripts/ensure-single-preview.mjs --background 2>/dev/null | grep -q "already running"; then
  echo '{"additional_context": "Preview already running on http://127.0.0.1:5174/."}'
else
  echo '{"additional_context": "Preview started at http://127.0.0.1:5174/."}'
fi
exit 0
