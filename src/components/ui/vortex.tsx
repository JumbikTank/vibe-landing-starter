"use client";

import { cn } from "@/lib/cn";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export function Vortex({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let animationId: number;
		let particles: {
			x: number;
			y: number;
			angle: number;
			radius: number;
			speed: number;
			opacity: number;
		}[] = [];

		function resize() {
			if (!canvas) return;
			canvas.width = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;
		}

		function initParticles() {
			if (!canvas) return;
			particles = Array.from({ length: 80 }, () => ({
				x: canvas.width / 2,
				y: canvas.height / 2,
				angle: Math.random() * Math.PI * 2,
				radius: Math.random() * Math.min(canvas.width, canvas.height) * 0.4,
				speed: 0.002 + Math.random() * 0.004,
				opacity: 0.1 + Math.random() * 0.3,
			}));
		}

		function draw() {
			if (!canvas || !ctx) return;
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			const centerX = canvas.width / 2;
			const centerY = canvas.height / 2;

			for (const p of particles) {
				p.angle += p.speed;
				const x = centerX + Math.cos(p.angle) * p.radius;
				const y = centerY + Math.sin(p.angle) * p.radius * 0.6;

				ctx.beginPath();
				ctx.arc(x, y, 1.5, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(168, 85, 247, ${p.opacity})`;
				ctx.fill();
			}

			animationId = requestAnimationFrame(draw);
		}

		// Ждём, пока canvas получит реальные размеры после layout
		const startAnimation = () => {
			resize();
			if (canvas.width === 0 || canvas.height === 0) return;
			initParticles();
			draw();
		};

		startAnimation();

		const onResize = () => {
			resize();
			initParticles();
		};
		window.addEventListener("resize", onResize);

		return () => {
			cancelAnimationFrame(animationId);
			window.removeEventListener("resize", onResize);
		};
	}, []);

	return (
		<div className={cn("relative overflow-hidden", className)}>
			<canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				viewport={{ once: true }}
				className="relative z-10"
			>
				{children}
			</motion.div>
		</div>
	);
}
