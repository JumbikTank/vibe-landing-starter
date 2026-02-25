"use client";

import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { landing } from "@/content/landing";
import { trackEvent } from "@/lib/tracking";

export function Hero() {
	const { hero } = landing;

	function handleCtaClick() {
		trackEvent("cta_click");
		document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" });
	}

	return (
		<BackgroundBeamsWithCollision className="bg-zinc-950">
			<div className="mx-auto max-w-3xl px-4 text-center">
				<TextGenerateEffect
					words={hero.headline}
					className="text-4xl leading-tight text-white md:text-6xl"
				/>
				<p className="mx-auto mt-6 max-w-xl text-lg text-zinc-400">{hero.subheadline}</p>
				<button
					type="button"
					onClick={handleCtaClick}
					className="mt-10 cursor-pointer rounded-full bg-purple-600 px-8 py-3 font-medium text-white transition-colors hover:bg-purple-500"
				>
					{hero.cta}
				</button>
			</div>
		</BackgroundBeamsWithCollision>
	);
}
