"use client";

import { landing } from "@/content/landing";
import { motion } from "framer-motion";

export function Proof() {
	const { proof } = landing;

	return (
		<section className="bg-zinc-950 py-24">
			<div className="mx-auto max-w-5xl px-4">
				<h2 className="mb-16 text-center text-3xl font-bold text-white md:text-4xl">
					{proof.title}
				</h2>
				<div className="grid grid-cols-2 gap-6 md:grid-cols-3">
					{proof.stats.map((stat, idx) => (
						<motion.div
							key={stat.label}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-50px" }}
							transition={{ duration: 0.5, delay: idx * 0.1 }}
							className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 px-6 py-8 text-center transition-colors hover:border-purple-500/40"
						>
							<p className="text-4xl font-bold text-purple-400 transition-transform group-hover:scale-110">
								{stat.value}
							</p>
							<p className="mt-3 text-sm text-zinc-400">{stat.label}</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
