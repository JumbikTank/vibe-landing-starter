"use client";

import { createLead } from "@/app/actions/lead";
import { landing } from "@/content/landing";
import type { LeadFormState } from "@/types/form";
import { useActionState } from "react";

const initialState: LeadFormState = { status: "idle", message: "" };

export function LeadForm() {
	const [state, formAction, isPending] = useActionState(createLead, initialState);
	const { form } = landing.cta;

	if (state.status === "success") {
		return (
			<div className="rounded-2xl border border-green-800 bg-green-950/50 p-8 text-center">
				<p className="text-lg text-green-300">{state.message}</p>
			</div>
		);
	}

	return (
		<form action={formAction} className="mx-auto max-w-md space-y-4">
			<input
				type="text"
				name="name"
				placeholder={form.namePlaceholder}
				required
				className="w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-colors focus:border-purple-500"
			/>
			<input
				type="text"
				name="contact"
				placeholder={form.contactPlaceholder}
				required
				className="w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-colors focus:border-purple-500"
			/>
			<label className="flex items-center gap-3 text-sm text-zinc-400">
				<input
					type="checkbox"
					name="consent"
					required
					className="h-4 w-4 rounded border-zinc-600 accent-purple-600"
				/>
				{form.consentLabel}
			</label>

			{state.status === "error" && <p className="text-sm text-red-400">{state.message}</p>}

			<button
				type="submit"
				disabled={isPending}
				className="w-full cursor-pointer rounded-xl bg-purple-600 py-3 font-medium text-white transition-colors hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{isPending ? form.sending : form.submit}
			</button>
		</form>
	);
}
