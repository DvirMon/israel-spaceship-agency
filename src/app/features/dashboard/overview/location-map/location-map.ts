import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  viewChild,
} from "@angular/core";
import {
  latLng,
  Map as LeafletMap,
  map as leafletMap,
  marker,
  Marker,
  tileLayer,
} from "leaflet";

@Component({
  selector: "app-location-map",
  imports: [],
  template: `<div class="location-map" #mapContainer></div>`,
  styles: [
    `
      :host,
      .location-map {
        height: 400px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationMap {
  private readonly mapContainer = viewChild("mapContainer", {
    read: ElementRef,
  });
  private readonly defaultCenter = latLng(32.3040272, 34.8620134);
  private readonly defaultZoom = 8;
  readonly results = input.required<{ lat: number; lng: number }[]>();
  readonly center = input(this.defaultCenter);
  readonly zoom = input(this.defaultZoom);

  private map: LeafletMap | null = null;



  constructor() {

    // TODO: refactor witohut effect
    effect(() => {
      const el = this.mapContainer();
      if (!el || this.map) return;

      this.map = leafletMap(el.nativeElement).setView(
        this.center(),
        this.zoom()
      );

      // TODO - fix image error
      const baseMapURl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

      tileLayer(baseMapURl, {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(this.map);

      const points: Marker[] = this.results().map(({ lat, lng }) =>
        marker([lat, lng])
      );

      points.forEach((point) => point.addTo(this.map!));
    });
  }
}
