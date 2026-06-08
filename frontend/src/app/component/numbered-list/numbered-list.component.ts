import {ChangeDetectionStrategy, Component, input} from "@angular/core";
import {RouterLink} from "@angular/router";

import {IonItem, IonLabel, IonList} from "@ionic/angular/standalone";
import {TranslocoPipe} from "@jsverse/transloco";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RouterLinkInput = string | any[];

export interface NumberedListItem {
	titleKey: string;
	descriptionKey: string;
	routerLink: RouterLinkInput;
}

@Component({
	selector: "app-numbered-list",
	imports: [
		IonItem,
		IonLabel,
		IonList,
		RouterLink,
		TranslocoPipe,
	],
	templateUrl: "./numbered-list.component.html",
	styleUrl: "./numbered-list.component.scss",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumberedListComponent {
	readonly items = input<NumberedListItem[] | null>([]);
}
