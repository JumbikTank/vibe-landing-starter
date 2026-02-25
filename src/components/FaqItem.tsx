"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export function FaqItem({
	question,
	answer,
}: {
	question: string;
	answer: string;
}) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="border-b border-zinc-800">
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="flex w-full cursor-pointer items-center justify-between py-5 text-left"
			>
				<span className="text-lg font-medium text-white">{question}</span>
				<motion.span
					animate={{ rotate: isOpen ? 45 : 0 }}
					transition={{ duration: 0.2 }}
					className="ml-4 text-2xl text-zinc-400"
				>
					+
				</motion.span>
			</button>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="overflow-hidden"
					>
						<p className="pb-5 text-zinc-400">{answer}</p>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
