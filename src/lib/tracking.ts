import type { EventType } from "@prisma/client";

export async function trackEvent(type: EventType, sessionId?: string): Promise<void> {
	try {
		await fetch("/api/events", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ type, sessionId }),
		});
	} catch {
		// Трекинг не должен ломать UX
	}
}
