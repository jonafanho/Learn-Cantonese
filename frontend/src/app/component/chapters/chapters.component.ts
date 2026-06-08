import {AsyncPipe} from "@angular/common";
import {ChangeDetectionStrategy, Component, inject} from "@angular/core";

import {forkJoin, Observable} from "rxjs";
import {map, switchMap} from "rxjs/operators";

import {Pack} from "../../model/content-pack.model";
import {ContentService} from "../../service/content.service";
import {NumberedListComponent, NumberedListItem} from "../numbered-list/numbered-list.component";
import {PageLayoutComponent} from "../page-layout/page-layout.component";

interface ChapterEntry {
	packId: string;
	pack: Pack;
}

@Component({
	selector: "app-chapters",
	imports: [
		AsyncPipe,
		PageLayoutComponent,
		NumberedListComponent,
	],
	templateUrl: "./chapters.component.html",
	styleUrl: "./chapters.component.scss",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChaptersComponent {
	private readonly contentService = inject(ContentService);

	private readonly chapters$: Observable<ChapterEntry[]> = this.contentService.getAvailablePackIds().pipe(
		map(packIds => packIds.map(packId => this.contentService.getPack(packId).pipe(map(pack => ({packId, pack}) as ChapterEntry)))),
		switchMap(packObservables => forkJoin(packObservables)),
	);

	protected readonly chapterItems$: Observable<NumberedListItem[]> = this.chapters$.pipe(map(entries => entries.map(entry => ({
		titleKey: entry.pack.titleKey,
		descriptionKey: entry.pack.descriptionKey,
		routerLink: ["/chapters", entry.packId, "sections"],
	}))));
}
