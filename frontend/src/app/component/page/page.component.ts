import {ChangeDetectionStrategy, Component, computed, effect, inject, signal} from "@angular/core";
import {toSignal} from "@angular/core/rxjs-interop";
import {ActivatedRoute, RouterLink} from "@angular/router";

import {IonButton, IonItem, IonLabel, IonList} from "@ionic/angular/standalone";

import {TranslocoPipe} from "@jsverse/transloco";

import {CardComponent} from "../card/card.component";
import {ContentService} from "../../service/content.service";
import {NarrativeComponent} from "../narrative/narrative.component";
import {PageLayoutComponent} from "../page-layout/page-layout.component";

@Component({
	selector: "app-page",
	imports: [
		CardComponent,
		IonButton,
		IonItem,
		IonLabel,
		IonList,
		NarrativeComponent,
		PageLayoutComponent,
		RouterLink,
		TranslocoPipe,
	],
	templateUrl: "./page.component.html",
	styleUrl: "./page.component.scss",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent {
	private readonly contentService = inject(ContentService);
	private readonly route = inject(ActivatedRoute);

	protected readonly packId = this.route.snapshot.paramMap.get("packId")!;
	protected readonly sectionId = this.route.snapshot.paramMap.get("sectionId")!;
	protected readonly currentSection = toSignal(this.contentService.getSection(this.packId, this.sectionId));

	protected readonly currentStepIndex = signal(0);
	protected readonly isComplete = signal(false);
	protected readonly canClickNext = signal(false);

	protected readonly nextButtonLabelKey = computed(() => {
		const section = this.currentSection();
		if (section) {
			return this.currentStepIndex() < section.steps.length - 1 ? "page.next" : "page.finish";
		} else {
			return "page.next";
		}
	});

	constructor() {
		effect(() => {
			const section = this.currentSection();
			if (section && section.steps.length > 0) {
				this.resetTracing(this.currentStepIndex());
			}
		});
	}

	protected nextStep() {
		const section = this.currentSection();
		if (section) {
			const nextIndex = this.currentStepIndex() + 1;
			if (nextIndex >= section.steps.length) {
				this.isComplete.set(true);
			} else {
				this.currentStepIndex.set(nextIndex);
				this.resetTracing(nextIndex);
			}
		}
	}

	protected previousStep() {
		const prevIndex = this.currentStepIndex() - 1;
		if (prevIndex >= 0) {
			this.currentStepIndex.set(prevIndex);
			this.resetTracing(prevIndex);
		}
	}

	protected onToneComplete(result: boolean) {
		if (result) {
			this.canClickNext.set(true);
		}
	}

	private resetTracing(index: number) {
		const section = this.currentSection();
		if (section) {
			const step = section.steps[index];
			this.canClickNext.set(step.type !== "flashcard" || !("toneSequence" in step && step.toneSequence));
		}
	}
}
