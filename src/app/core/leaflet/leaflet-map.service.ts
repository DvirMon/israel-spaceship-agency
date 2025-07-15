// leaflet-map.service.ts
import { ElementRef, inject, Injectable } from "@angular/core";
import {
  LatLngExpression,
  LatLngLiteral,
  map as leafletMap,
  marker,
  tileLayer,
} from "leaflet";
import {
  LEAFLET_MAP_CONFIG,
  LeafletMapConfig,
} from "./leaflet-map-config.token";
import { DEFAULT_CONFIG } from "./ provide-leaflet-map";

export interface MapController {
  updateMap(data: LatLngLiteral[]): void;
  setCenter(center: LatLngExpression, zoom?: number): void;
  destroy(): void;
}

@Injectable()
export class LeafletMap {
  private readonly config =
    inject(LEAFLET_MAP_CONFIG, { optional: true }) ?? DEFAULT_CONFIG;

  configMap(el: ElementRef, options?: LeafletMapConfig): MapController {
    const configOptions = {
      ...this.config,
      ...options,
    };
    const { center, zoom, tileUrl } = configOptions;

    const map = leafletMap(el.nativeElement).setView(center, zoom);

    tileLayer(tileUrl, {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    return {
      updateMap(locations) {
        locations.forEach(({ lat, lng }) => marker([lat, lng]).addTo(map));
      },
      setCenter(center, zoom) {
        map.setView(center, zoom ?? map.getZoom());
      },
      destroy() {
        map.remove();
      },
    };
  }
}
