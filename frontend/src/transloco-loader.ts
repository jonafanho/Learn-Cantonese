import {HttpClient} from "@angular/common/http";
import {inject, Injectable} from "@angular/core";

import {TranslocoLoader} from "@jsverse/transloco";
import {forkJoin, of} from "rxjs";
import {catchError, map, switchMap} from "rxjs/operators";

import {deepMerge} from "./app/utility/deep-merge.utility";

@Injectable({providedIn: "root"})
export class TranslocoHttpLoader implements TranslocoLoader {
	private readonly httpClient = inject(HttpClient);

	getTranslation(lang: string) {
		return this.httpClient.get<Record<string, unknown>>(`./assets/i18n/${lang}.json`).pipe(
			switchMap(base => this.httpClient.get<{packs: string[]}>("./assets/content/manifest.json").pipe(
				switchMap(manifest => {
					const packIds = manifest.packs;
					if (packIds.length === 0) {
						return of(base);
					} else {
						return forkJoin(packIds.map(packId => this.httpClient.get<Record<string, unknown>>(`./assets/content/${packId}/i18n/${lang}.json`).pipe(catchError(() => of({})))))
							.pipe(map(packTranslations => deepMerge(base, ...packTranslations)));
					}
				}),
				catchError(() => of(base)),
			)),
			catchError(() => of({})),
		);
	}
}
