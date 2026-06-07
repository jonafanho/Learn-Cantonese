import {Injectable} from "@angular/core";

import {Preferences} from "@capacitor/preferences";

import {MasteryEntry, StorylineProgress, UserProgress} from "../model/progress.model";

const PROGRESS_KEY = "user_progress";
const CURRENT_VERSION = "1.0.0";

@Injectable({providedIn: "root"})
export class ProgressService {
	private async getProgress(): Promise<UserProgress> {
		const {value} = await Preferences.get({key: PROGRESS_KEY});
		if (!value) {
			return this.createDefaultProgress();
		}
		try {
			return JSON.parse(value) as UserProgress;
		} catch {
			return this.createDefaultProgress();
		}
	}

	private async saveProgress(progress: UserProgress): Promise<void> {
		progress.meta.lastUpdated = new Date().toISOString();
		await Preferences.set({key: PROGRESS_KEY, value: JSON.stringify(progress)});
	}

	private createDefaultProgress(): UserProgress {
		return {
			meta: {
				version: CURRENT_VERSION,
				lastUpdated: new Date().toISOString(),
				deviceId: "local-device",
			},
			storylineProgress: {
				currentChapterId: "hkia",
				unlockedChapterIds: ["hkia"],
				completedSectionIds: [],
			},
			wordMastery: {},
		};
	}

	async getStorylineProgress(): Promise<StorylineProgress> {
		const progress = await this.getProgress();
		return progress.storylineProgress;
	}

	async getMastery(cardId: string): Promise<MasteryEntry | null> {
		const progress = await this.getProgress();
		return progress.wordMastery[cardId] ?? null;
	}

	async updateMasteryScore(cardId: string, isCorrect: boolean): Promise<void> {
		const progress = await this.getProgress();
		const entry = progress.wordMastery[cardId] ?? {
			level: 0,
			consecutiveCorrectAnswers: 0,
			lastReviewedTimestamp: new Date().toISOString(),
		} satisfies MasteryEntry;

		if (isCorrect) {
			entry.consecutiveCorrectAnswers += 1;
			entry.level = Math.min(1, entry.level + 0.1 * (1 + entry.consecutiveCorrectAnswers * 0.05));
		} else {
			entry.consecutiveCorrectAnswers = 0;
			entry.level = Math.max(0, entry.level - 0.05);
		}
		entry.lastReviewedTimestamp = new Date().toISOString();
		progress.wordMastery[cardId] = entry;
		await this.saveProgress(progress);
	}

	async completeSection(sectionId: string): Promise<void> {
		const progress = await this.getProgress();
		if (!progress.storylineProgress.completedSectionIds.includes(sectionId)) {
			progress.storylineProgress.completedSectionIds.push(sectionId);
			await this.saveProgress(progress);
		}
	}

	async unlockChapter(chapterId: string): Promise<void> {
		const progress = await this.getProgress();
		if (!progress.storylineProgress.unlockedChapterIds.includes(chapterId)) {
			progress.storylineProgress.unlockedChapterIds.push(chapterId);
			await this.saveProgress(progress);
		}
	}

	async exportUserProfile(): Promise<string> {
		const progress = await this.getProgress();
		return JSON.stringify(progress, null, 2);
	}

	async importUserProfile(fileRawText: string): Promise<boolean> {
		try {
			const parsed = JSON.parse(fileRawText);
			if (!parsed.meta?.version || !parsed.storylineProgress || !parsed.wordMastery) {
				return false;
			}
			for (const entry of Object.values(parsed.wordMastery as Record<string, MasteryEntry>)) {
				entry.level = Math.max(0, Math.min(1, entry.level));
			}
			await Preferences.set({key: PROGRESS_KEY, value: JSON.stringify(parsed)});
			return true;
		} catch {
			return false;
		}
	}
}
