export interface PackManifest {
	packs: string[];
}

export interface Pack {
	packVersion: string;
	id: string;
	titleKey: string;
	descriptionKey: string;
	feedbackProfiles: Record<string, SocialFeedbackProfile>;
	sections: Section[];
}

export interface SocialFeedbackProfile {
	id: string;
	tiers: SocialFeedbackTier[];
}

export interface SocialFeedbackTier {
	minLevel: number;
	meterColor: "success" | "warning" | "danger";
	headlineKey: string;
	subtextKey: string;
}

export interface Section {
	id: string;
	titleKey: string;
	descriptionKey: string;
	feedbackProfileId: string;
	cards: Flashcard[];
}

export interface Flashcard {
	id: string;
	promptKey: string;
	translationKey: string;
	contextualHintKey: string;
	romanizationVisualFonts: string;
	audioAssetPath: string;
	imageAssetPath?: string;
	toneSequence: number[];
}
