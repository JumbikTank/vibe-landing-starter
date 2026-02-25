"use server";

import { prisma } from "@/lib/prisma";
import { sendTelegramMessage } from "@/lib/telegram";
import type { LeadFormState } from "@/types/form";

export async function createLead(_prev: LeadFormState, formData: FormData): Promise<LeadFormState> {
	const name = formData.get("name")?.toString().trim() ?? "";
	const contact = formData.get("contact")?.toString().trim() ?? "";
	const consent = formData.get("consent") === "on";

	if (!name || !contact) {
		return { status: "error", message: "Заполните имя и контакт" };
	}

	if (!consent) {
		return { status: "error", message: "Необходимо согласие на обработку данных" };
	}

	try {
		const lead = await prisma.lead.create({
			data: { name, contact, consent },
		});

		await prisma.conversionEvent.create({
			data: { type: "lead_created" },
		});

		// Fire-and-forget: если TG упал — лид всё равно сохранён
		sendTelegramMessage(`<b>Новая заявка</b>\n\nИмя: ${lead.name}\nКонтакт: ${lead.contact}`).catch(
			() => {},
		);

		return { status: "success", message: "Принято. Свяжемся в течение дня." };
	} catch {
		return { status: "error", message: "Что-то пошло не так. Попробуйте ещё раз." };
	}
}
