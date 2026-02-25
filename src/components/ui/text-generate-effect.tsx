"use client";

import { cn } from "@/lib/cn";
import { motion, stagger, useAnimate, useInView } from "framer-motion";
import { useEffect } from "react";

export function TextGenerateEffect({
	words,
	className,
}: {
	words: string;
	className?: string;
}) {
	const [scope, animate] = useAnimate();
	const isInView = useInView(scope, { once: true });
	const wordsArray = words.split(" ");

	useEffect(() => {
		if (isInView) {
			animate("span", { opacity: 1, filter: "blur(0px)" }, { duration: 0.4, delay: stagger(0.05) });
		}
	}, [isInView, animate]);

	return (
		<div ref={scope} className={cn("font-bold", className)}>
			{wordsArray.map((word, idx) => (
				<motion.span
					// biome-ignore lint/suspicious/noArrayIndexKey: words can repeat, index needed for uniqueness
					key={`${word}-${idx}`}
					className="mr-[0.25em] inline-block opacity-0"
					style={{ filter: "blur(8px)" }}
				>
					{word}
				</motion.span>
			))}
		</div>
	);
}
