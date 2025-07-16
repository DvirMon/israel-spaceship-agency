import {
  ElementRef,
  inject,
  Injectable,
  resource,
  Signal,
} from "@angular/core";
import { LatLngExpression, LatLngLiteral } from "leaflet"; // Only types — safe for import
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

  createResource(el: Signal<ElementRef>) {
    return resource({
      params: () => el(),
      loader: async ({ params: el }) => {
        if (!el) return Promise.resolve(undefined);
        return this.configMap(el);
      },
    });
  }

  private async configMap(
    el: ElementRef,
    options?: LeafletMapConfig
  ): Promise<MapController> {
    const leaflet = await import("leaflet");

    this.setupDefaultIcon(leaflet);

    const { map: leafletMap, tileLayer, marker } = leaflet;

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

  private setupDefaultIcon(leaflet: typeof import("leaflet")) {

    const icon = leaflet.icon;
    const Marker = leaflet.Marker;

    // Access Icon.Default directly and safely
    const DefaultIcon = leaflet.Icon.Default;

    const defaultIcon = icon({
      iconUrl: "assets/marker-icon.png",
      iconRetinaUrl: "assets/marker-icon-2x.png",
      shadowUrl: "assets/marker-shadow.png",
      ...new DefaultIcon().options, // ✅ safe way to get defaults
    });

    Marker.prototype.options.icon = defaultIcon;
  }
}
