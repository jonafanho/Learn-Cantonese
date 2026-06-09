import {ChangeDetectionStrategy, Component, inject, input} from "@angular/core";

import {IonButton} from "@ionic/angular/standalone";
import {TranslocoPipe} from "@jsverse/transloco";

import {AudioService} from "../../service/audio.service";

@Component({
	selector: "app-audio-playback",
	imports: [
		IonButton,
		TranslocoPipe,
	],
	templateUrl: "./audio-playback.component.html",
	styleUrl: "./audio-playback.component.scss",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioPlaybackComponent {
	protected readonly audioService = inject(AudioService);

	readonly jyutping = input.required<string>();
	readonly audioSrc = input.required<string>();
}
