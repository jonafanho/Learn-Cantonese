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

	async init() {
		const [darkMode, language] = await Promise.all([
			Preferences.get({key: darkModeKey}),
			Preferences.get({key: languageKey}),
		]);

		if (darkMode.value === null) {
			this.darkMode.set(window.matchMedia("(prefers-color-scheme: dark)").matches);
		} else {
			this.darkMode.set(darkMode.value === "true");
		}

		if (language.value !== null) {
			this.language.set(language.value);
		}
	}

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
}

export const languageMapping: Record<string, string> = {
	"en": "English",
};
