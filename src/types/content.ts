export interface HeroContent {
	headline: string;
	subheadline: string;
	cta: string;
}

export interface ProofStat {
	value: string;
	label: string;
}

export interface ProofContent {
	title: string;
	stats: ProofStat[];
}

export interface Benefit {
	title: string;
	description: string;
}

export interface BenefitsContent {
	title: string;
	items: Benefit[];
}

export interface FaqItem {
	question: string;
	answer: string;
}

export interface FaqContent {
	title: string;
	items: FaqItem[];
}

export interface FormContent {
	namePlaceholder: string;
	contactPlaceholder: string;
	consentLabel: string;
	submit: string;
	sending: string;
	success: string;
	error: string;
}

export interface CtaContent {
	title: string;
	subtitle: string;
	form: FormContent;
}

export interface LandingContent {
	hero: HeroContent;
	proof: ProofContent;
	benefits: BenefitsContent;
	faq: FaqContent;
	cta: CtaContent;
}
