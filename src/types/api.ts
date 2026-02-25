import type { EventType } from "@prisma/client";

export interface TrackEventRequest {
	type: EventType;
	sessionId?: string;
}

export interface WebhookRequest {
	idempotencyKey: string;
	eventType: string;
	payload: JsonValue;
}

export type JsonValue =
	| string
	| number
	| boolean
	| null
	| JsonValue[]
	| { [key: string]: JsonValue };

export interface ApiResponse {
	success: boolean;
	error?: string;
	duplicate?: boolean;
}
