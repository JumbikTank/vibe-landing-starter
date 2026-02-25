import { prisma } from "@/lib/prisma";
import type { TrackEventRequest } from "@/types/api";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as TrackEventRequest;

		if (!body.type) {
			return NextResponse.json({ success: false, error: "type is required" }, { status: 400 });
		}

		await prisma.conversionEvent.create({
			data: {
				type: body.type,
				sessionId: body.sessionId ?? null,
			},
		});

		return NextResponse.json({ success: true }, { status: 201 });
	} catch {
		return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
	}
}
