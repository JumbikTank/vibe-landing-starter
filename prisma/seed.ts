import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	// Тестовый лид
	await prisma.lead.create({
		data: {
			name: "Тестовый Пользователь",
			contact: "test@example.com",
			consent: true,
		},
	});

	// Тестовые события конверсии
	await prisma.conversionEvent.createMany({
		data: [
			{ type: "landing_view", sessionId: "seed-session-1" },
			{ type: "cta_click", sessionId: "seed-session-1" },
			{ type: "lead_created" },
		],
	});

	// Тестовый вебхук
	await prisma.webhookEvent.create({
		data: {
			idempotencyKey: "seed-webhook-1",
			eventType: "test_event",
			payload: { source: "seed", message: "Тестовый вебхук" },
		},
	});

	console.log("Seed completed");
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
