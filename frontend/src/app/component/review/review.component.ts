import {ChangeDetectionStrategy, Component} from "@angular/core";

import {TranslocoPipe} from "@jsverse/transloco";

import {PageLayoutComponent} from "../page-layout/page-layout.component";

@Component({
	selector: "app-review",
	imports: [
		PageLayoutComponent,
		TranslocoPipe,
	],
	templateUrl: "./review.component.html",
	styleUrl: "./review.component.scss",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewComponent {
}
