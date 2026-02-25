"use client";

import { CardSpotlight } from "@/components/ui/card-spotlight";
import { landing } from "@/content/landing";

export function Benefits() {
	const { benefits } = landing;

	return (
		<section className="bg-zinc-950 py-24">
			<div className="mx-auto max-w-7xl px-4">
				<h2 className="mb-12 text-center text-3xl font-bold text-white md:text-4xl">
					{benefits.title}
				</h2>
				<div className="grid gap-6 md:grid-cols-2">
					{benefits.items.map((item) => (
						<CardSpotlight key={item.title}>
							<h3 className="text-xl font-semibold text-white">{item.title}</h3>
							<p className="mt-3 text-zinc-400">{item.description}</p>
						</CardSpotlight>
					))}
				</div>
			</div>
		</section>
	);
}
