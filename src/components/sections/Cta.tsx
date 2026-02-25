"use client";

import { LeadForm } from "@/components/LeadForm";
import { Vortex } from "@/components/ui/vortex";
import { landing } from "@/content/landing";

export function Cta() {
	const { cta } = landing;

	return (
		<section id="cta" className="bg-zinc-950 py-24">
			<Vortex className="mx-auto max-w-3xl px-4 py-16">
				<h2 className="mb-4 text-center text-3xl font-bold text-white md:text-4xl">{cta.title}</h2>
				<p className="mb-10 text-center text-zinc-400">{cta.subtitle}</p>
				<LeadForm />
			</Vortex>
		</section>
	);
}
