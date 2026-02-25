-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('landing_view', 'cta_click', 'lead_created');

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "contact" VARCHAR(300) NOT NULL,
    "consent" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversion_events" (
    "id" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "session_id" TEXT,
    "payload" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversion_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_events" (
    "id" TEXT NOT NULL,
    "idempotency_key" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "received_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "conversion_events_type_idx" ON "conversion_events"("type");

-- CreateIndex
CREATE INDEX "conversion_events_created_at_idx" ON "conversion_events"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "webhook_events_idempotency_key_key" ON "webhook_events"("idempotency_key");
