import {ChangeDetectionStrategy, Component} from "@angular/core";
import {RouterLink} from "@angular/router";

import {IonApp, IonContent, IonHeader, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle, IonRouterOutlet, IonTitle, IonToolbar} from "@ionic/angular/standalone";
import {TranslocoPipe} from "@jsverse/transloco";

@Component({
	selector: "app-root",
	imports: [
		IonApp,
		IonContent,
		IonHeader,
		IonItem,
		IonLabel,
		IonList,
		IonMenu,
		IonMenuToggle,
		IonRouterOutlet,
		IonTitle,
		IonToolbar,
		RouterLink,
		TranslocoPipe,
	],
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.scss",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
}
