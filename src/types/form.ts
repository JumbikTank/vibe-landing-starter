export interface LeadFormState {
	status: "idle" | "success" | "error";
	message: string;
}

export interface CreateLeadInput {
	name: string;
	contact: string;
	consent: boolean;
}
