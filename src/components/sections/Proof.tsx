"use client";

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { landing } from "@/content/landing";

export function Proof() {
	const { proof } = landing;

	return (
		<section className="bg-zinc-950 py-24">
			<div className="mx-auto max-w-7xl px-4">
				<h2 className="mb-12 text-center text-3xl font-bold text-white md:text-4xl">
					{proof.title}
				</h2>
				<InfiniteMovingCards items={proof.stats} speed="normal" />
			</div>
		</section>
	);
}
