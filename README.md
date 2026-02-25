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

### Деплой на Amvera Cloud

1. Зарегистрируйтесь на [amvera.ru](https://amvera.ru)
2. Создайте **PostgreSQL** в разделе «Управляемые сервисы» (тариф «Начальный»). Заполните форму:
   - **Postgres version**: оставьте как есть (17.5)
   - **Имя создаваемой БД**: `vibe_landing`
   - **Имя пользователя**: `vibe_user`
   - **Пароль пользователя**: придумайте пароль и сохраните

   Эти три значения — имя БД, пользователь и пароль — потом подставляются в переменную `DATABASE_URL`, по которой приложение подключается к базе:
   ```
   Шаблон:  postgresql://ПОЛЬЗОВАТЕЛЬ:ПАРОЛЬ@ХОСТ:5432/ИМЯ_БД
   Пример:  postgresql://vibe_user:my5ecretPass@amvera-realpepin-cnpg-mydb-rw:5432/vibe_landing
   ```
   - **Размер кластера СУБД**: `1`
   - **Superuser Access**: не включайте
   - Остальное не трогайте
3. Создайте **проект** (тип: приложение, тариф «Начальный»)
4. На шаге «Загрузка данных» выберите «Через git». Откройте терминал в папке проекта — в VS Code это Terminal → New Terminal, или откройте терминал отдельно и перейдите в папку командой `cd`. Вы в правильном месте, если путь заканчивается на название проекта:
   ```
   user@pc:~/vibe-landing-starter$
   ```
   Если в проекте ещё нет git — инициализируйте:
   ```bash
   touch public/.gitkeep   # git не трекает пустые папки, а Docker-сборке нужна public/
   git init && git add -A && git commit -m "init"
   ```
   Затем скопируйте команду из интерфейса Amvera и выполните:
   ```bash
   git remote add amvera <URL из интерфейса Amvera>
   git push amvera master
   ```
   > Важно: пишите именно `git push amvera master`, а не просто `git push` — нужно явно указать, куда отправляем код.
   >
   > Терминал спросит логин и пароль — введите ваши данные от аккаунта Amvera.
5. На шаге «Конфигурация» — пропустите, Amvera подхватит `Dockerfile` автоматически
6. В настройках проекта откройте **Переменные**. Проще всего: создайте файл `.env` с содержимым ниже и нажмите «Подгрузить .env»:
   ```
   DATABASE_URL=postgresql://USER:PASSWORD@amvera-ЛОГИН-cnpg-ИМЯБД-rw:5432/ИМЯБД?schema=public
   WEBHOOK_SECRET=вставьте-случайную-строку-из-randomorg
   TELEGRAM_BOT_TOKEN=токен-из-BotFather
   TELEGRAM_CHAT_ID=ваш-chat-id
   ```
   Для `WEBHOOK_SECRET` сгенерируйте случайную строку на [1password.com/password-generator](https://1password.com/password-generator/). Подставьте реальные значения: `USER`, `PASSWORD`, `ЛОГИН`, `ИМЯБД` — из шага 2, когда создавали PostgreSQL. У каждой переменной выберите этап **«Запуск»**, отметьте **«Это секрет»** и нажмите **Применить**
7. Amvera соберёт и задеплоит проект. Живой URL появится в панели проекта

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
Входящий эндпоинт для внешних сервисов. Защищён секретом, дубли отсекаются по `idempotencyKey`.

**Зачем это нужно на практике?**

Допустим, заявки с лендинга попадают в amoCRM. Менеджер обработал заявку, назначил встречу — amoCRM отправляет на ваш сервер POST-запрос: «лид #42 переведён в "Встреча назначена"». Вы логируете событие и шлёте уведомление в Telegram.

Почему важна идемпотентность: CRM может отправить тот же запрос повторно (сеть глюкнула, таймаут). Без `idempotencyKey` событие запишется дважды. С ним — повторный запрос вернёт `{ "duplicate": true }` и дубля не будет.

Сейчас к лендингу не подключена CRM, но эндпоинт готов — когда подключите amoCRM, Битрикс или любой другой сервис с вебхуками, всё заработает.

```bash
# Первый запрос — событие записано (201)
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: your-secret" \
  -d '{"idempotencyKey":"payment-abc123","eventType":"payment_success","payload":{"amount":4900}}'

# Повторный запрос с тем же ключом — дубль не создан (200)
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: your-secret" \
  -d '{"idempotencyKey":"payment-abc123","eventType":"payment_success","payload":{"amount":4900}}'
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
