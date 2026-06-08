import {Injectable} from "@angular/core";

@Injectable({providedIn: "root"})
export class AudioService {
	private activeTracks: HTMLAudioElement[] = [];

	playTrack(assetPath: string): void {
		this.stopActiveTracks();

		const audio = new Audio(assetPath);
		audio.preload = "auto";
		audio.play().catch(() => {
			// Audio play may be rejected without user interaction
		});
		this.activeTracks.push(audio);
		audio.addEventListener("ended", () => this.removeTrack(audio));
	}

	stopActiveTracks(): void {
		for (const track of this.activeTracks) {
			track.pause();
			track.currentTime = 0;
		}

		this.activeTracks = [];
	}

	private removeTrack(audio: HTMLAudioElement): void {
		const index = this.activeTracks.indexOf(audio);

		if (index > -1) {
			this.activeTracks.splice(index, 1);
		}
	}
}
