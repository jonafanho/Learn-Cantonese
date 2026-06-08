import {Routes} from "@angular/router";

import {ChaptersComponent} from "./component/chapters/chapters.component";
import {HomeComponent} from "./component/home/home.component";
import {ReviewComponent} from "./component/review/review.component";
import {SectionsComponent} from "./component/sections/sections.component";
import {SessionComponent} from "./component/session/session.component";
import {SettingsComponent} from "./component/settings/settings.component";

export const routes: Routes = [
	{path: "", component: HomeComponent},
	{path: "chapters", component: ChaptersComponent},
	{path: "chapters/:packId/sections", component: SectionsComponent},
	{path: "chapters/:packId/sections/:sectionId", component: SessionComponent},
	{path: "review", component: ReviewComponent},
	{path: "settings", component: SettingsComponent},
];
