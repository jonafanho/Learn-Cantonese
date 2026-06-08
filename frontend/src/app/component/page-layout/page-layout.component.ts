import {ChangeDetectionStrategy, Component, input} from "@angular/core";

import {IonApp, IonBackButton, IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar} from "@ionic/angular/standalone";
import {TranslocoPipe} from "@jsverse/transloco";

@Component({
	selector: "app-page-layout",
	imports: [
		IonApp,
		IonBackButton,
		IonButtons,
		IonContent,
		IonHeader,
		IonMenuButton,
		IonTitle,
		IonToolbar,
		TranslocoPipe,
	],
	templateUrl: "./page-layout.component.html",
	styleUrl: "./page-layout.component.scss",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageLayoutComponent {
	readonly titleKey = input.required<string>();
	readonly backHref = input<string | undefined>(undefined);
}
