"use client";

import { cn } from "@/lib/cn";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import type { MouseEvent } from "react";

export function CardSpotlight({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);

	function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
		const { left, top } = currentTarget.getBoundingClientRect();
		mouseX.set(clientX - left);
		mouseY.set(clientY - top);
	}

	return (
		<div
			className={cn(
				"group relative rounded-2xl border border-zinc-700 bg-zinc-900/50 p-8",
				className,
			)}
			onMouseMove={handleMouseMove}
		>
			<motion.div
				className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
				style={{
					background: useMotionTemplate`
						radial-gradient(
							400px circle at ${mouseX}px ${mouseY}px,
							rgba(168, 85, 247, 0.12),
							transparent 80%
						)
					`,
				}}
			/>
			<div className="relative z-10">{children}</div>
		</div>
	);
}
