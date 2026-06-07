import {HttpClient} from "@angular/common/http";
import {inject, Injectable} from "@angular/core";

import {Observable} from "rxjs";
import {map, shareReplay} from "rxjs/operators";

import {Pack, PackManifest, Section, SocialFeedbackProfile} from "../model/content-pack.model";

const CONTENT_ROOT = "./assets/content";

@Injectable({providedIn: "root"})
export class ContentService {
	private readonly httpClient = inject(HttpClient);

	private readonly manifest$ = this.httpClient.get<PackManifest>(`${CONTENT_ROOT}/manifest.json`).pipe(
		shareReplay(1),
	);

	private readonly packCache = new Map<string, Observable<Pack>>();

	getAvailablePackIds(): Observable<string[]> {
		return this.manifest$.pipe(map(m => m.packs));
	}

	getPack(packId: string): Observable<Pack> {
		if (!this.packCache.has(packId)) {
			const pack$ = this.httpClient.get<Pack>(`${CONTENT_ROOT}/${packId}/pack.json`).pipe(
				shareReplay(1),
			);
			this.packCache.set(packId, pack$);
		}
		return this.packCache.get(packId)!;
	}

	getSection(packId: string, sectionId: string): Observable<Section | undefined> {
		return this.getPack(packId).pipe(
			map(pack => pack.sections.find(s => s.id === sectionId)),
		);
	}

	getFeedbackProfile(packId: string, profileId: string): Observable<SocialFeedbackProfile | null> {
		return this.getPack(packId).pipe(
			map(pack => pack.feedbackProfiles[profileId] ?? null),
		);
	}

	resolveAssetPath(packId: string, relativePath: string): string {
		return `${CONTENT_ROOT}/${packId}/${relativePath}`;
	}
}
