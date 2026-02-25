"use client";

import { cn } from "@/lib/cn";
import { useEffect, useRef, useState } from "react";

export function InfiniteMovingCards({
	items,
	direction = "left",
	speed = "normal",
	className,
}: {
	items: { value: string; label: string }[];
	direction?: "left" | "right";
	speed?: "fast" | "normal" | "slow";
	className?: string;
}) {
	const containerRef = useRef<HTMLDivElement>(null);
	const scrollerRef = useRef<HTMLUListElement>(null);
	const [start, setStart] = useState(false);

	useEffect(() => {
		if (containerRef.current && scrollerRef.current) {
			const scrollerContent = Array.from(scrollerRef.current.children);
			for (const item of scrollerContent) {
				const duplicatedItem = item.cloneNode(true);
				scrollerRef.current.appendChild(duplicatedItem);
			}

			const directionValue = direction === "left" ? "forwards" : "reverse";
			containerRef.current.style.setProperty("--animation-direction", directionValue);

			const speedValue = speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s";
			containerRef.current.style.setProperty("--animation-duration", speedValue);

			setStart(true);
		}
	}, [direction, speed]);

	return (
		<div
			ref={containerRef}
			className={cn(
				"scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
				className,
			)}
		>
			<ul
				ref={scrollerRef}
				className={cn("flex w-max min-w-full shrink-0 gap-4 py-4", start && "animate-scroll")}
			>
				{items.map((item) => (
					<li
						key={item.label}
						className="relative w-[250px] max-w-full shrink-0 rounded-2xl border border-zinc-700 bg-zinc-900/50 px-8 py-6 backdrop-blur-sm"
					>
						<p className="text-3xl font-bold text-purple-400">{item.value}</p>
						<p className="mt-2 text-sm text-zinc-400">{item.label}</p>
					</li>
				))}
			</ul>
		</div>
	);
}
