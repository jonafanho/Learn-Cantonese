import {Routes} from "@angular/router";

import {ChaptersComponent} from "./component/chapters/chapters.component";
import {HomeComponent} from "./component/home/home.component";
import {SettingsComponent} from "./component/settings/settings.component";

export const routes: Routes = [
	{path: "", component: HomeComponent},
	{path: "chapters", component: ChaptersComponent},
	{path: "settings", component: SettingsComponent},
];
