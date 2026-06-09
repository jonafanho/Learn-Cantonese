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
	steps: SectionStep[];
}

export type SectionStep = NarrativeStep | FlashcardStep;

export interface NarrativeStep {
	type: "narrative";
	narrativeKey: string;
	imageAssetPath?: string;
}

export interface FlashcardStep {
	type: "flashcard";
	id: string;
	characterKey: string;
	romanizationVisualFonts: string;
	audioAssetPath: string;
	translationKey: string;
	contextualHintKey?: string;
	imageAssetPath?: string;
	toneSequence?: number[];
}
