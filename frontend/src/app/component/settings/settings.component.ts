import {ChangeDetectionStrategy, Component, inject} from "@angular/core";

import {IonItem, IonLabel, IonList, IonSelect, IonSelectOption, IonToggle} from "@ionic/angular/standalone";
import {TranslocoPipe, TranslocoService} from "@jsverse/transloco";

import {languageMapping, SettingsService} from "../../service/settings.service";
import {PageLayoutComponent} from "../page-layout/page-layout.component";

@Component({
	selector: "app-settings",
	imports: [
		IonItem,
		IonLabel,
		IonList,
		IonSelect,
		IonSelectOption,
		IonToggle,
		PageLayoutComponent,
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
	protected readonly languages = this.translocoService.getAvailableLangs().map(
		language => language.toString(),
	).map(language => ({key: language, value: languageMapping[language]}));

	protected toggleDarkMode(): void {
		this.settingsService.darkMode.set(!this.settingsService.darkMode());
	}

	protected setLanguage(event: CustomEvent): void {
		this.settingsService.language.set(event.detail.value);
	}
}
