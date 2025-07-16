import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  viewChild,
} from "@angular/core";
import { LeafletMap } from "@core/leaflet/leaflet-map.service";

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
  private readonly map = inject(LeafletMap);
  private readonly container = viewChild.required("container", {
    read: ElementRef,
  });
  private readonly mapResource = this.map.createResource(this.container);

  readonly results = input.required<{ lat: number; lng: number }[]>();

  readonly updateMap = effect(() => {
    if (this.mapResource.isLoading()) return;
    const points = this.results();
    this.mapResource.value()?.updateMap(points);
  });
}
