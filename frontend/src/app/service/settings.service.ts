import {effect, inject, Injectable, signal} from "@angular/core";

import {Preferences} from "@capacitor/preferences";
import {TranslocoService} from "@jsverse/transloco";

const darkModeKey = "dark_mode";
const languageKey = "language";

@Injectable({providedIn: "root"})
export class SettingsService {
	private readonly translocoService = inject(TranslocoService);

	readonly darkMode = signal(false);
	readonly language = signal("en");

	constructor() {
		effect(() => {
			document.documentElement.classList.toggle("ion-palette-dark", this.darkMode());
			void Preferences.set({key: darkModeKey, value: String(this.darkMode())});
		});

		effect(() => {
			this.translocoService.setActiveLang(this.language());
			void Preferences.set({key: languageKey, value: this.language()});
		});
	}

	async init(): Promise<void> {
		const [storedDarkMode, storedLanguage] = await Promise.all([
			Preferences.get({key: darkModeKey}),
			Preferences.get({key: languageKey}),
		]);

		if (storedDarkMode.value === null) {
			this.darkMode.set(window.matchMedia("(prefers-color-scheme: dark)").matches);
		} else {
			this.darkMode.set(storedDarkMode.value === "true");
		}

		if (storedLanguage.value !== null) {
			this.language.set(storedLanguage.value);
		}
	}
}

export const languageMapping: Record<string, string> = {
	"en": "English",
};
