"use client";

import { FaqItem } from "@/components/FaqItem";
import { landing } from "@/content/landing";

export function Faq() {
	const { faq } = landing;

	return (
		<section className="bg-zinc-950 py-24">
			<div className="mx-auto max-w-3xl px-4">
				<h2 className="mb-12 text-center text-3xl font-bold text-white md:text-4xl">{faq.title}</h2>
				<div>
					{faq.items.map((item) => (
						<FaqItem key={item.question} question={item.question} answer={item.answer} />
					))}
				</div>
			</div>
		</section>
	);
}
