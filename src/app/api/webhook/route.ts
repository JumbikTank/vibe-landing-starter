import { prisma } from "@/lib/prisma";
import type { WebhookRequest } from "@/types/api";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const secret = request.headers.get("x-webhook-secret");

	if (secret !== process.env.WEBHOOK_SECRET) {
		return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = (await request.json()) as WebhookRequest;

		if (!body.idempotencyKey || !body.eventType || !body.payload) {
			return NextResponse.json(
				{ success: false, error: "idempotencyKey, eventType, and payload are required" },
				{ status: 400 },
			);
		}

		await prisma.webhookEvent.create({
			data: {
				idempotencyKey: body.idempotencyKey,
				eventType: body.eventType,
				payload: body.payload as object,
			},
		});

		return NextResponse.json({ success: true }, { status: 201 });
	} catch (error: unknown) {
		// P2002 = unique constraint violation (идемпотентность)
		if (
			typeof error === "object" &&
			error !== null &&
			"code" in error &&
			(error as { code: string }).code === "P2002"
		) {
			return NextResponse.json({ success: true, duplicate: true }, { status: 200 });
		}

		return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
	}
}
