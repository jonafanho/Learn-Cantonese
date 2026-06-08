import {ChangeDetectionStrategy, Component, input, output} from "@angular/core";

@Component({
	selector: "app-tone-tracing",
	imports: [],
	templateUrl: "./tone-tracing.component.html",
	styleUrl: "./tone-tracing.component.scss",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToneTracingComponent {
	readonly toneSequence = input.required<number[]>();
	readonly disabled = input(false);
	readonly toneComplete = output<boolean>();
}
