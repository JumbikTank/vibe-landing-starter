# Vibe Landing Starter

Лендинг с лид-формой, аналитикой, вебхуками и Telegram-уведомлениями.

## Стек

- **Next.js 15** (App Router) — фронт + бэк
- **TypeScript** — строгая типизация
- **Tailwind CSS v4** — стили
- **Framer Motion** — анимации
- **Prisma + PostgreSQL** — база данных
- **Docker Compose** — деплой

## Быстрый старт

### Локально (dev)

```bash
# 1. Клонировать и установить зависимости
git clone <repo-url> && cd vibe-landing-starter
bun install

# 2. Настроить переменные окружения
cp .env.example .env
# Отредактируйте .env — укажите DATABASE_URL (нужен запущенный PostgreSQL)

# 3. Применить миграции
bunx prisma migrate dev --name init

# 4. (Опционально) Заполнить тестовыми данными
bun prisma/seed.ts

# 5. Запустить
bun dev
```

Откройте [http://localhost:3000](http://localhost:3000).

### Docker Compose

```bash
# 1. Настроить переменные
cp .env.example .env

# 2. Поднять всё
docker compose up --build -d

# 3. Проверить
bash scripts/demo.sh
```

## Переменные окружения

| Переменная | Обязательная | Описание |
|---|---|---|
| `DATABASE_URL` | да | URL подключения к PostgreSQL |
| `WEBHOOK_SECRET` | да | Секрет для верификации входящих вебхуков |
| `TELEGRAM_BOT_TOKEN` | нет | Токен Telegram-бота для уведомлений |
| `TELEGRAM_CHAT_ID` | нет | ID чата для отправки уведомлений |

## API

### Server Action: `createLead`
Форма отправляет данные через React Server Action. Валидация, сохранение в БД, трекинг конверсии, уведомление в Telegram.

### POST /api/events
Трекинг конверсий: `landing_view`, `cta_click`, `lead_created`.

```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{"type":"landing_view","sessionId":"abc"}'
```

### POST /api/webhook
Входящие вебхуки с идемпотентностью.

```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: your-secret" \
  -d '{"idempotencyKey":"unique-key","eventType":"order","payload":{}}'
```

## Демо-скрипт

```bash
bash scripts/demo.sh              # localhost:3000
bash scripts/demo.sh https://my.vps.com  # произвольный URL
```

## DX

- **Biome** — линтинг + форматирование (`bun run lint`, `bun run format`)
- **lefthook** — pre-commit хуки (Biome + TypeScript)
- **Prisma Studio** — GUI для базы (`bun run db:studio`)
