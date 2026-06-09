import {ChangeDetectionStrategy, Component, input, output} from "@angular/core";

import {IonApp, IonBackButton, IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonMenuButton, IonTitle, IonToolbar} from "@ionic/angular/standalone";
import {TranslocoPipe} from "@jsverse/transloco";

@Component({
	selector: "app-page-layout",
	imports: [
		IonApp,
		IonBackButton,
		IonButton,
		IonButtons,
		IonContent,
		IonFooter,
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
	readonly backHref = input<string>();
	readonly previousButtonEnabled = input<boolean>();
	readonly nextButtonEnabled = input<boolean>();
	readonly clickPrevious = output();
	readonly clickNext = output();
	readonly nextButtonLabelKey = input("page.next");
}
