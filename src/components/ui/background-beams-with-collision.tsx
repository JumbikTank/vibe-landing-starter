"use client";

import { cn } from "@/lib/cn";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Beam {
	id: number;
	x: number;
	duration: number;
	delay: number;
	height: number;
}

export function BackgroundBeamsWithCollision({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [beams, setBeams] = useState<Beam[]>([]);

	useEffect(() => {
		const generated: Beam[] = Array.from({ length: 20 }, (_, i) => ({
			id: i,
			x: Math.random() * 100,
			duration: 4 + Math.random() * 8,
			delay: Math.random() * 4,
			height: 100 + Math.random() * 200,
		}));
		setBeams(generated);
	}, []);

	return (
		<div
			ref={containerRef}
			className={cn(
				"relative flex min-h-screen w-full items-center justify-center overflow-hidden",
				className,
			)}
		>
			{beams.map((beam) => (
				<motion.div
					key={beam.id}
					className="absolute top-0 w-px bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-20"
					style={{
						left: `${beam.x}%`,
						height: beam.height,
					}}
					animate={{
						y: ["-100%", "calc(100vh + 100%)"],
						opacity: [0, 0.4, 0.4, 0],
					}}
					transition={{
						duration: beam.duration,
						delay: beam.delay,
						repeat: Number.POSITIVE_INFINITY,
						ease: "linear",
					}}
				/>
			))}
			<div className="relative z-10">{children}</div>
		</div>
	);
}
