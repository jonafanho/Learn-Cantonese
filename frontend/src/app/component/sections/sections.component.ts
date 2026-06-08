import {AsyncPipe} from "@angular/common";
import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

import {Observable} from "rxjs";
import {map} from "rxjs/operators";

import {Section} from "../../model/content-pack.model";
import {ContentService} from "../../service/content.service";
import {NumberedListComponent, NumberedListItem} from "../numbered-list/numbered-list.component";
import {PageLayoutComponent} from "../page-layout/page-layout.component";

@Component({
	selector: "app-sections",
	imports: [
		AsyncPipe,
		PageLayoutComponent,
		NumberedListComponent,
	],
	templateUrl: "./sections.component.html",
	styleUrl: "./sections.component.scss",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionsComponent {
	private readonly contentService = inject(ContentService);
	private readonly route = inject(ActivatedRoute);

	protected readonly packId = this.route.snapshot.paramMap.get("packId")!;
	protected readonly sections$: Observable<Section[]> = this.contentService.getPack(this.packId).pipe(map(pack => pack.sections));

	protected readonly sectionItems$: Observable<NumberedListItem[]> = this.sections$.pipe(
		map(sections => sections.map(section => ({
			titleKey: section.titleKey,
			descriptionKey: section.descriptionKey,
			routerLink: ["/chapters", this.packId, "sections", section.id],
		}))),
	);
}
