import {ChangeDetectionStrategy, Component} from "@angular/core";
import {RouterLink} from "@angular/router";

import {IonApp, IonButton, IonContent, IonHeader, IonTitle, IonToolbar} from "@ionic/angular/standalone";
import {TranslocoPipe} from "@jsverse/transloco";

@Component({
	selector: "app-home",
	imports: [
		IonApp,
		IonButton,
		IonContent,
		IonHeader,
		IonTitle,
		IonToolbar,
		RouterLink,
		TranslocoPipe,
	],
	templateUrl: "./home.component.html",
	styleUrl: "./home.component.scss",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
}
