#!/usr/bin/env bash
# image-to-video.sh — Animate a still image with Wan 3.0 Prime on Kinovi.
#
# Usage:
#   Put KINOVI_API_KEY in a .env file (repo root or this folder), or:
#   export KINOVI_API_KEY=your-api-key     # https://kinovi.ai/api-keys
#   bash image-to-video.sh
#
# Requires only curl. No jq needed.
set -euo pipefail

# Load .env from this script's directory or any parent. Does not override existing vars.
_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
while true; do
  if [[ -f "$_dir/.env" ]]; then
    while IFS= read -r line || [[ -n "$line" ]]; do
      line="${line%$'\r'}"
      [[ -z "$line" || "$line" == \#* || "$line" != *=* ]] && continue
      key="${line%%=*}"
      value="${line#*=}"
      key="${key#"${key%%[![:space:]]*}"}"; key="${key%"${key##*[![:space:]]}"}"
      value="${value#"${value%%[![:space:]]*}"}"; value="${value%"${value##*[![:space:]]}"}"
      value="${value#\"}"; value="${value%\"}"
      value="${value#\'}"; value="${value%\'}"
      if [[ -n "$key" && -z "${!key:-}" ]]; then
        export "$key=$value"
      fi
    done < "$_dir/.env"
    break
  fi
  _parent="$(dirname "$_dir")"
  [[ "$_parent" == "$_dir" ]] && break
  _dir="$_parent"
done
unset _dir

MODEL="wan3.0-prime-image-to-video"
read -r -d '' INPUTS <<'JSON' || true
{
  "prompt": "Bring this image to life: a slow push-in on the subject, gentle wind moving the details, soft natural light shifting across the scene.",
  "imageUrls": ["https://static.kinovi.ai/materials/20260705/1783247738434-3a5b9fbb.png"],
  "aspectRatio": "16:9",
  "duration": 5,
  "outputResolution": "720p"
}
JSON

# ---- you normally don't need to edit below this line ----

API_BASE="https://kinovi.ai/api/v1"
: "${KINOVI_API_KEY:?Set KINOVI_API_KEY first: export KINOVI_API_KEY=your-api-key}"
AUTH=(-H "Authorization: Bearer $KINOVI_API_KEY")

# 1. Submit the task
RESPONSE=$(curl -sS -X POST "$API_BASE/jobs/createTask" \
  "${AUTH[@]}" -H "Content-Type: application/json" \
  -d "{\"model\":\"$MODEL\",\"inputs\":$INPUTS}")
TASK_ID=$(printf '%s' "$RESPONSE" | grep -o '"taskId":"[^"]*"' | cut -d'"' -f4 || true)
if [[ -z "$TASK_ID" ]]; then
  echo "createTask failed: $RESPONSE" >&2
  exit 1
fi
echo "Task created: $TASK_ID"

# 2. Poll until it reaches a terminal state (success | fail)
while true; do
  RESULT=$(curl -sS "$API_BASE/jobs/recordInfo?taskId=$TASK_ID" "${AUTH[@]}")
  STATUS=$(printf '%s' "$RESULT" | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)
  case "$STATUS" in
    success) break ;;
    fail) echo "Task failed: $RESULT" >&2; exit 1 ;;
    *) echo "Status: ${STATUS:-unknown} — waiting..."; sleep 2 ;;
  esac
done

# 3. Download the result
CREDITS=$(printf '%s' "$RESULT" | grep -o '"creditsUsed":[0-9.]*' | cut -d: -f2)
echo "Done. Credits used: $CREDITS"
URL=$(printf '%s' "$RESULT" | grep -o '"url":"[^"]*"' | head -1 | cut -d'"' -f4)
EXT="${URL##*.}"; EXT="${EXT%%\?*}"
OUT="image-to-video.${EXT:-mp4}"
curl -sS -o "$OUT" "$URL"
echo "Saved $OUT  $URL"
