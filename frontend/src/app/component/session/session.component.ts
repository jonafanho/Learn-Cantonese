import {AsyncPipe} from "@angular/common";
import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

import {TranslocoPipe} from "@jsverse/transloco";
import {Observable} from "rxjs";

import {AudioPlaybackComponent} from "../audio-playback/audio-playback.component";
import {ContentService} from "../../service/content.service";
import {PageLayoutComponent} from "../page-layout/page-layout.component";
import {ProgressService} from "../../service/progress.service";
import {Section} from "../../model/content-pack.model";
import {ToneTracingComponent} from "../tone-tracing/tone-tracing.component";

@Component({
	selector: "app-session",
	imports: [
		AsyncPipe,
		AudioPlaybackComponent,
		PageLayoutComponent,
		ToneTracingComponent,
		TranslocoPipe,
	],
	templateUrl: "./session.component.html",
	styleUrl: "./session.component.scss",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionComponent {
	protected readonly contentService = inject(ContentService);
	private readonly progressService = inject(ProgressService);
	private readonly route = inject(ActivatedRoute);

	protected readonly packId = this.route.snapshot.paramMap.get("packId")!;
	protected readonly sectionId = this.route.snapshot.paramMap.get("sectionId")!;
	protected readonly section$: Observable<Section | undefined> = this.contentService.getSection(this.packId, this.sectionId);
}
