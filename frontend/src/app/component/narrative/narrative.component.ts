import {ChangeDetectionStrategy, Component, input} from "@angular/core";

import {TranslocoPipe} from "@jsverse/transloco";

@Component({
	selector: "app-narrative",
	imports: [TranslocoPipe],
	templateUrl: "./narrative.component.html",
	styleUrl: "./narrative.component.scss",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NarrativeComponent {
	readonly narrativeKey = input.required<string>();
	readonly imageAssetPath = input<string>();
}
