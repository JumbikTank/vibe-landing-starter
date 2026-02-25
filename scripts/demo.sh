#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:3000}"
WEBHOOK_SECRET="${WEBHOOK_SECRET:-demo-secret-2026}"
PASS=0
FAIL=0

green() { printf "\033[32m✓ %s\033[0m\n" "$1"; }
red()   { printf "\033[31m✗ %s\033[0m\n" "$1"; }

check() {
  local desc="$1" expected="$2" actual="$3"
  if [ "$actual" = "$expected" ]; then
    green "$desc"
    PASS=$((PASS + 1))
  else
    red "$desc (expected $expected, got $actual)"
    FAIL=$((FAIL + 1))
  fi
}

echo ""
echo "=== Vibe Landing Starter — Demo ==="
echo "URL: $BASE_URL"
echo ""

# 1. Лендинг отдаёт 200
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL")
check "GET / returns 200" "200" "$STATUS"

# 2. POST /api/events — событие записалось
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST "$BASE_URL/api/events" \
  -H "Content-Type: application/json" \
  -d '{"type":"landing_view","sessionId":"demo-session"}')
check "POST /api/events returns 201" "201" "$STATUS"

# 3. POST /api/webhook без секрета — 401
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST "$BASE_URL/api/webhook" \
  -H "Content-Type: application/json" \
  -d '{"idempotencyKey":"demo-1","eventType":"test","payload":{}}')
check "POST /api/webhook without secret returns 401" "401" "$STATUS"

# 4. POST /api/webhook с секретом — 201
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST "$BASE_URL/api/webhook" \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: $WEBHOOK_SECRET" \
  -d '{"idempotencyKey":"demo-1","eventType":"test","payload":{"source":"demo"}}')
check "POST /api/webhook with secret returns 201" "201" "$STATUS"

# 5. Повторный вебхук с тем же ключом — 200 (duplicate)
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST "$BASE_URL/api/webhook" \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: $WEBHOOK_SECRET" \
  -d '{"idempotencyKey":"demo-1","eventType":"test","payload":{"source":"demo"}}')
check "POST /api/webhook duplicate returns 200" "200" "$STATUS"

echo ""
echo "Результат: $PASS passed, $FAIL failed"
echo ""

if [ $FAIL -gt 0 ]; then
  exit 1
fi

echo "Ручная проверка:"
echo "  1. Откройте $BASE_URL в браузере"
echo "  2. Заполните форму и отправьте"
echo "  3. Проверьте уведомление в Telegram (если настроен)"
echo ""
