export interface UserProgress {
	meta: UserProgressMeta;
	storylineProgress: StorylineProgress;
	wordMastery: Record<string, MasteryEntry>;
}

export interface UserProgressMeta {
	version: string;
	lastUpdated: string;
	deviceId: string;
}

export interface StorylineProgress {
	currentChapterId: string;
	unlockedChapterIds: string[];
	completedSectionIds: string[];
}

export interface MasteryEntry {
	level: number;
	consecutiveCorrectAnswers: number;
	lastReviewedTimestamp: string;
}
