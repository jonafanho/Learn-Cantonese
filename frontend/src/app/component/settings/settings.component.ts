import {ChangeDetectionStrategy, Component, inject} from "@angular/core";

import {IonApp, IonContent, IonHeader, IonItem, IonLabel, IonList, IonSelect, IonSelectOption, IonTitle, IonToggle, IonToolbar} from "@ionic/angular/standalone";
import {TranslocoPipe, TranslocoService} from "@jsverse/transloco";

import {languageMapping, SettingsService} from "../../service/settings.service";

@Component({
	selector: "app-settings",
	imports: [
		IonApp,
		IonContent,
		IonHeader,
		IonItem,
		IonLabel,
		IonList,
		IonSelect,
		IonSelectOption,
		IonTitle,
		IonToggle,
		IonToolbar,
		TranslocoPipe,
	],
	templateUrl: "./settings.component.html",
	styleUrl: "./settings.component.scss",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
	private readonly settingsService = inject(SettingsService);
	private readonly translocoService = inject(TranslocoService);

	protected readonly darkMode = this.settingsService.darkMode;
	protected readonly language = this.settingsService.language;
	protected readonly languages = this.translocoService.getAvailableLangs().map(language => language.toString()).map(language => ({key: language, value: languageMapping[language]}));

	protected toggleDarkMode() {
		this.settingsService.darkMode.set(!this.settingsService.darkMode());
	}

	protected setLanguage(event: HTMLIonSelectElement) {
		this.settingsService.language.set(event.value);
	}
}
