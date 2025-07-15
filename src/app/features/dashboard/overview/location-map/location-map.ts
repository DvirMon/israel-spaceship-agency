// location-map.component.ts
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  viewChild,
} from "@angular/core";
import { LeafletMap, MapController } from "@core/leaflet/leaflet-map.service";

@Component({
  selector: "app-location-map",
  imports: [],
  template: `<div class="location-map" #container></div>`,
  styles: [
    `
      :host,
      .location-map {
        height: 400px;
        border-radius: 5px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationMap {
  private controller?: MapController;
  private readonly container = viewChild("container", {
    read: ElementRef,
  });

  private readonly map = inject(LeafletMap)
  readonly results = input.required<{ lat: number; lng: number }[]>();

  readonly mapEffect = effect(() => {
    const el = this.container();
    if (!el) return;
    this.controller = this.map.configMap(el);
  });

  readonly updateMap = effect(() => {
    if (!this.controller) return;
    const points = this.results();
    this.controller.updateMap(points);
  });
}
