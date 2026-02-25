"use client";

import { Benefits } from "@/components/sections/Benefits";
import { Cta } from "@/components/sections/Cta";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { Proof } from "@/components/sections/Proof";
import { trackEvent } from "@/lib/tracking";
import { useEffect } from "react";

export default function Home() {
	useEffect(() => {
		trackEvent("landing_view");
	}, []);

	return (
		<main>
			<Hero />
			<Proof />
			<Benefits />
			<Faq />
			<Cta />
		</main>
	);
}
