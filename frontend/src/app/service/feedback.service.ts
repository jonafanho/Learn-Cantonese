import {inject, Injectable} from "@angular/core";

import {Observable} from "rxjs";

import {SocialFeedbackProfile, SocialFeedbackTier} from "../model/content-pack.model";
import {ContentService} from "./content.service";

@Injectable({providedIn: "root"})
export class FeedbackService {
	private readonly contentService = inject(ContentService);

	getFeedbackProfile(packId: string, profileId: string): Observable<SocialFeedbackProfile | null> {
		return this.contentService.getFeedbackProfile(packId, profileId);
	}

	getMatchingTier(tiers: SocialFeedbackTier[], level: number): SocialFeedbackTier | null {
		const sorted = [...tiers].sort((a, b) => b.minLevel - a.minLevel);
		for (const tier of sorted) {
			if (level >= tier.minLevel) {
				return tier;
			}
		}
		return sorted.length > 0 ? sorted[sorted.length - 1] : null;
	}
}
