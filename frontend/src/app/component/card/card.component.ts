import {ChangeDetectionStrategy, Component, inject, input, output} from "@angular/core";

import {TranslocoPipe} from "@jsverse/transloco";

import {AudioPlaybackComponent} from "../audio-playback/audio-playback.component";
import {ContentService} from "../../service/content.service";
import {ToneTracingComponent} from "../tone-tracing/tone-tracing.component";

@Component({
	selector: "app-card",
	imports: [
		AudioPlaybackComponent,
		ToneTracingComponent,
		TranslocoPipe,
	],
	templateUrl: "./card.component.html",
	styleUrl: "./card.component.scss",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
	private readonly contentService = inject(ContentService);

	readonly packId = input.required<string>();
	readonly characterKey = input.required<string>();
	readonly romanizationVisualFonts = input.required<string>();
	readonly audioAssetPath = input.required<string>();
	readonly translationKey = input.required<string>();
	readonly toneSequence = input<number[]>();
	readonly toneComplete = output<boolean>();

	protected resolveAudioSrc(): string {
		return this.contentService.resolveAssetPath(this.packId(), this.audioAssetPath());
	}

}
