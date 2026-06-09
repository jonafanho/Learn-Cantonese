import {AfterViewInit, ChangeDetectionStrategy, Component, effect, ElementRef, input, output, signal, viewChild} from "@angular/core";

import {IonButton, IonIcon} from "@ionic/angular/standalone";
import {TranslocoPipe} from "@jsverse/transloco";

import {isStrokeLongEnough, normalizeCoordinate, TONE_THRESHOLDS, validateTone} from "../../utility/tone-validation.utility";
import {addIcons} from "ionicons";
import {helpCircleOutline} from "ionicons/icons";

interface StrokePoint {
	x: number;
	y: number;
}

interface CompletedStroke {
	points: StrokePoint[];
}

interface HintShape {
	startX: number;
	startY: number;
	endX: number;
	endY: number;
}

const HINT_SHAPES: Record<number, HintShape> = {
	1: {startX: 20, startY: 15, endX: 80, endY: 15},
	2: {startX: 20, startY: 55, endX: 80, endY: 15},
	3: {startX: 20, startY: 50, endX: 80, endY: 50},
	4: {startX: 20, startY: 35, endX: 80, endY: 85},
	5: {startX: 20, startY: 85, endX: 80, endY: 55},
	6: {startX: 20, startY: 85, endX: 80, endY: 85},
};

@Component({
	selector: "app-tone-tracing",
	imports: [
		IonButton,
		IonIcon,
		TranslocoPipe,
	],
	templateUrl: "./tone-tracing.component.html",
	styleUrl: "./tone-tracing.component.scss",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToneTracingComponent implements AfterViewInit {
	readonly toneSequence = input.required<number[]>();
	readonly disabled = input(false);
	readonly toneComplete = output<boolean>();

	private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>("toneCanvas");

	private readonly devicePixelRatio = window.devicePixelRatio || 1;
	private context!: CanvasRenderingContext2D;
	private currentToneIndex = 0;
	private isDrawing = false;
	private completedStrokes: CompletedStroke[] = [];
	private currentPoints: StrokePoint[] = [];

	protected readonly showHint = signal(false);

	constructor() {
		addIcons({helpCircleOutline});

		effect(() => {
			this.toneSequence();
			this.resetInternalState();
			if (this.context) {
				this.drawFull();
			}
		});
	}

	ngAfterViewInit(): void {
		const canvas = this.canvasRef().nativeElement;
		this.context = canvas.getContext("2d")!;
		this.setupCanvas();
		this.drawFull();
	}

	private resetInternalState(): void {
		this.currentToneIndex = 0;
		this.isDrawing = false;
		this.completedStrokes = [];
		this.currentPoints = [];
	}

	private get canvasRect(): DOMRect {
		return this.canvasRef().nativeElement.getBoundingClientRect();
	}

	private setupCanvas(): void {
		const canvas = this.canvasRef().nativeElement;
		const rect = canvas.getBoundingClientRect();

		canvas.width = rect.width * this.devicePixelRatio;
		canvas.height = rect.height * this.devicePixelRatio;
		this.context.setTransform(1, 0, 0, 1, 0, 0);
		this.context.scale(this.devicePixelRatio, this.devicePixelRatio);
		this.context.lineCap = "round";
		this.context.lineJoin = "round";
	}

	private drawFull(): void {
		const canvasRect = this.canvasRect;

		this.context.clearRect(0, 0, canvasRect.width, canvasRect.height);

		this.drawZoneGuides(canvasRect);
		this.drawLabels(canvasRect);

		this.completedStrokes.forEach(({points}) => this.drawPolyline(points, "var(--ion-color-success, #2dd55b)"));

		if (this.showHint() && this.currentToneIndex < this.toneSequence().length) {
			this.drawHint(canvasRect);
		}
	}

	private drawZoneGuides(rect: DOMRect): void {
		const width = rect.width;
		const height = rect.height;

		this.context.strokeStyle = "var(--ion-color-medium, #ccc)";
		this.context.lineWidth = 1;
		this.context.setLineDash([4, 4]);

		this.context.beginPath();
		this.context.moveTo(0, height / 3);
		this.context.lineTo(width, height / 3);
		this.context.stroke();

		this.context.beginPath();
		this.context.moveTo(0, (2 * height) / 3);
		this.context.lineTo(width, (2 * height) / 3);
		this.context.stroke();

		this.context.setLineDash([]);
	}

	private drawLabels(rect: DOMRect): void {
		const width = rect.width;

		const targetTone = this.toneSequence()[this.currentToneIndex];
		const threshold = TONE_THRESHOLDS.find(t => t.tone === targetTone);

		if (threshold) {
			this.context.fillStyle = "var(--ion-color-step-600, #666)";
			this.context.font = "12px sans-serif";
			this.context.textAlign = "left";
			this.context.fillText(`${threshold.label} (tone ${targetTone})`, 8, 16);
		}

		if (this.toneSequence().length > 1) {
			this.context.fillStyle = "var(--ion-color-step-400, #999)";
			this.context.font = "12px sans-serif";
			this.context.textAlign = "right";
			this.context.fillText(`${this.currentToneIndex + 1} / ${this.toneSequence().length}`, width - 8, 16);
		}
	}

	private drawHint(rect: DOMRect): void {
		const tone = this.toneSequence()[this.currentToneIndex];
		const shape = HINT_SHAPES[tone];

		if (!shape) {
			return;
		}

		const sx = (shape.startX / 100) * rect.width;
		const sy = (shape.startY / 100) * rect.height;
		const ex = (shape.endX / 100) * rect.width;
		const ey = (shape.endY / 100) * rect.height;

		this.context.save();
		this.context.strokeStyle = "rgba(0, 122, 255, 0.35)";
		this.context.lineWidth = 2.5;
		this.context.setLineDash([6, 4]);

		this.context.beginPath();
		this.context.moveTo(sx, sy);
		this.context.lineTo(ex, ey);
		this.context.stroke();

		this.context.setLineDash([]);

		const angle = Math.atan2(ey - sy, ex - sx);
		const headLen = 10;

		this.context.beginPath();
		this.context.moveTo(ex, ey);
		this.context.lineTo(ex - headLen * Math.cos(angle - Math.PI / 6), ey - headLen * Math.sin(angle - Math.PI / 6));
		this.context.lineTo(ex - headLen * Math.cos(angle + Math.PI / 6), ey - headLen * Math.sin(angle + Math.PI / 6));
		this.context.closePath();
		this.context.fillStyle = "rgba(0, 122, 255, 0.35)";
		this.context.fill();

		this.context.beginPath();
		this.context.arc(sx, sy, 4, 0, Math.PI * 2);
		this.context.fillStyle = "rgba(0, 122, 255, 0.35)";
		this.context.fill();

		this.context.restore();
	}

	private drawPolyline(points: StrokePoint[], color: string): void {
		if (points.length < 2) {
			return;
		}

		this.context.strokeStyle = color;
		this.context.lineWidth = 3;

		this.context.beginPath();
		this.context.moveTo(points[0].x, points[0].y);
		for (let i = 1; i < points.length; i++) {
			this.context.lineTo(points[i].x, points[i].y);
		}
		this.context.stroke();
	}

	protected toggleHint(): void {
		this.showHint.update(v => !v);
		this.drawFull();
	}

	protected onPointerDown(event: PointerEvent): void {
		if (this.disabled() || this.currentToneIndex >= this.toneSequence().length) {
			return;
		}

		const canvas = this.canvasRef().nativeElement;
		const rect = canvas.getBoundingClientRect();

		this.drawFull();
		this.isDrawing = true;
		this.currentPoints = [{x: event.clientX - rect.left, y: event.clientY - rect.top}];
		canvas.setPointerCapture(event.pointerId);
	}

	protected onPointerMove(event: PointerEvent): void {
		if (!this.isDrawing) {
			return;
		}

		const rect = this.canvasRect;
		const pt: StrokePoint = {x: event.clientX - rect.left, y: event.clientY - rect.top};
		const prev = this.currentPoints[this.currentPoints.length - 1];

		this.drawSegment(prev.x, prev.y, pt.x, pt.y, "var(--ion-color-primary, #3880ff)");
		this.currentPoints.push(pt);
	}

	protected onPointerUp(event: PointerEvent): void {
		if (!this.isDrawing) {
			return;
		}

		this.isDrawing = false;

		const rect = this.canvasRect;
		const endPt: StrokePoint = {x: event.clientX - rect.left, y: event.clientY - rect.top};

		this.currentPoints.push(endPt);

		const first = this.currentPoints[0];
		const last = this.currentPoints[this.currentPoints.length - 1];
		const normStartX = normalizeCoordinate(first.x, rect.width);
		const normStartY = normalizeCoordinate(first.y, rect.height);
		const normEndX = normalizeCoordinate(last.x, rect.width);
		const normEndY = normalizeCoordinate(last.y, rect.height);

		if (!isStrokeLongEnough(normStartX, normStartY, normEndX, normEndY)) {
			this.currentPoints = [];
			return;
		}

		const targetTone = this.toneSequence()[this.currentToneIndex];
		const isValid = validateTone(normStartX, normStartY, normEndX, normEndY, targetTone, TONE_THRESHOLDS);

		if (isValid) {
			this.completedStrokes.push({points: [...this.currentPoints]});
			this.currentPoints = [];
			this.currentToneIndex++;

			this.drawFull();

			if (this.currentToneIndex >= this.toneSequence().length) {
				this.drawCompletionMark(rect);
				this.toneComplete.emit(true);
			}
		} else {
			this.drawPolyline(this.currentPoints, "var(--ion-color-danger, #f04141)");
			this.drawWrongMark(rect);
			this.currentPoints = [];
		}
	}

	private drawSegment(x1: number, y1: number, x2: number, y2: number, color: string): void {
		this.context.beginPath();
		this.context.moveTo(x1, y1);
		this.context.lineTo(x2, y2);
		this.context.strokeStyle = color;
		this.context.lineWidth = 3;
		this.context.stroke();
	}

	private drawCompletionMark(rect: DOMRect): void {
		this.context.fillStyle = "var(--ion-color-success, #2dd55b)";
		this.context.font = "bold 24px sans-serif";
		this.context.textAlign = "center";
		this.context.fillText("\u2713", rect.width / 2, rect.height / 2 + 8);
	}

	private drawWrongMark(rect: DOMRect): void {
		this.context.fillStyle = "var(--ion-color-danger, #f04141)";
		this.context.font = "bold 24px sans-serif";
		this.context.textAlign = "center";
		this.context.fillText("\u2717", rect.width / 2, rect.height / 2 + 8);
	}
}
