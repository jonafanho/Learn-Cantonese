import {provideHttpClient} from "@angular/common/http";
import {ApplicationConfig, isDevMode} from "@angular/core";
import {provideTransloco} from "@jsverse/transloco";
import {TranslocoHttpLoader} from "../transloco-loader";
import {getCookie} from "./utility/utilities";

export const appConfig: ApplicationConfig = {
	providers: [
		provideHttpClient(),
		provideTransloco({
			config: {
				availableLangs: ["en"],
				defaultLang: getCookie("language") || "en",
				reRenderOnLangChange: true,
				prodMode: !isDevMode(),
			},
			loader: TranslocoHttpLoader,
		}),
	],
};
