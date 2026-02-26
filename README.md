# Vibe Landing Starter

Лендинг с лид-формой, аналитикой конверсий, вебхуками и Telegram-уведомлениями.

**Живой деплой:** https://test2-realpepin.amvera.io

## Стек

| Технология | Роль |
|---|---|
| Next.js 15 (App Router) | Фронтенд + бэкенд в одном проекте |
| TypeScript (strict) | Типизация |
| Tailwind CSS v4 + Framer Motion | Стили и анимации |
| Aceternity UI | Визуальные эффекты (лучи, вихри, карточки) |
| Prisma 6 + PostgreSQL 17 | ORM + база данных (Prisma 7 ломает обратную совместимость — используем 6) |
| Bun | Пакетный менеджер |
| Biome + lefthook | Линтинг, форматирование, pre-commit хуки |
| Docker Compose | Деплой |

## Переменные окружения

```bash
cp .env.example .env
```

| Переменная | Обязательная | Описание |
|---|---|---|
| `DATABASE_URL` | да | Строка подключения к PostgreSQL |
| `WEBHOOK_SECRET` | да | Секрет для входящих вебхуков |
| `TELEGRAM_BOT_TOKEN` | нет | Токен Telegram-бота (из [@BotFather](https://t.me/BotFather)) |
| `TELEGRAM_CHAT_ID` | нет | ID чата для уведомлений |

Без Telegram-переменных приложение работает — просто не шлёт уведомления.

## Быстрый старт (локально)

Требования: [Node.js 22+](https://nodejs.org/), [Bun](https://bun.sh/), [Docker](https://docs.docker.com/get-docker/), [Git](https://git-scm.com/).

```bash
git clone https://github.com/JumbikTank/vibe-landing-starter.git
cd vibe-landing-starter
bun install
cp .env.example .env   # отредактируйте DATABASE_URL если нужен свой Postgres
```

### С Docker (рекомендуется)

```bash
docker compose up --build -d     # поднимет Postgres + приложение
```

Откройте http://localhost:3000.

### Без Docker

Нужен запущенный PostgreSQL. Укажите `DATABASE_URL` в `.env`, затем:

```bash
bunx prisma migrate dev --name init   # создать таблицы
bun prisma/seed.ts                    # (опционально) тестовые данные
bun dev                               # запустить на :3000
```

## Демо-скрипт (проверка за 2 минуты)

```bash
# Локально
bash scripts/demo.sh

# Живой деплой
bash scripts/demo.sh https://test2-realpepin.amvera.io
```

Скрипт проверяет: лендинг отдаёт 200, события записываются, вебхук без секрета отклоняется (401), с секретом записывается (201), дубль не создаётся (200).

```
=== Vibe Landing Starter — Demo ===
✓ GET / returns 200
✓ POST /api/events returns 201
✓ POST /api/webhook without secret returns 401
✓ POST /api/webhook with secret returns 201
✓ POST /api/webhook duplicate returns 200

Результат: 5 passed, 0 failed
```

После автоматических проверок — откройте сайт в браузере, заполните форму и убедитесь, что уведомление пришло в Telegram.

## API

### Server Action: createLead

Форма отправляет данные через React Server Action. Валидация → сохранение в БД → событие `lead_created` → уведомление в Telegram (fire-and-forget).

### POST /api/events

Трекинг конверсий: `landing_view`, `cta_click`, `lead_created`.

```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{"type":"landing_view","sessionId":"abc"}'
# → 201
```

### POST /api/webhook

Входящий эндпоинт для внешних сервисов. Защищён заголовком `x-webhook-secret`. Повторный запрос с тем же `idempotencyKey` не создаёт дубль — вернёт 200 с `duplicate: true`.

```bash
# Первый запрос → 201
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: demo-secret-2026" \
  -d '{"idempotencyKey":"evt-123","eventType":"payment_success","payload":{"amount":4900}}'

# Повтор с тем же ключом → 200, duplicate: true
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: demo-secret-2026" \
  -d '{"idempotencyKey":"evt-123","eventType":"payment_success","payload":{"amount":4900}}'

# Без секрета → 401
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"idempotencyKey":"evt-456","eventType":"test","payload":{}}'
```

## Docker Compose (деплой на VPS)

```bash
cp .env.example .env
# заполните TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID
docker compose up --build -d
```

PostgreSQL + приложение поднимаются одной командой. Volume `pgdata` сохраняет данные между перезапусками. Миграции запускаются автоматически при старте контейнера.

## Структура проекта

```
src/
├── app/
│   ├── page.tsx              # лендинг (5 секций)
│   ├── actions/lead.ts       # server action: создание лида
│   └── api/
│       ├── events/route.ts   # POST — трекинг конверсий
│       └── webhook/route.ts  # POST — входящие вебхуки
├── components/
│   ├── sections/             # Hero, Proof, Benefits, Faq, Cta
│   ├── ui/                   # Aceternity UI компоненты
│   ├── LeadForm.tsx          # форма с useActionState
│   └── FaqItem.tsx           # раскрывающийся вопрос-ответ
├── types/                    # TypeScript типы (content, api, form)
├── lib/                      # prisma, telegram, tracking
└── content/landing.ts        # все тексты лендинга (ru)
```
