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
  ): Promise<MapController | null> {
    try {
      const leafletModule = await import("leaflet");

      // Handle default vs named export for Leaflet (differs in prod builds)
      const leaflet = leafletModule.default || leafletModule;

      this.setupDefaultIcon(leaflet);

      const configOptions = {
        ...this.config,
        ...options,
      };
      const { center, zoom, tileUrl } = configOptions;

      const map = leaflet.map(el.nativeElement).setView(center, zoom);

      leaflet
        .tileLayer(tileUrl, {
          attribution: "&copy; OpenStreetMap contributors",
        })
        .addTo(map);

      return {
        updateMap(locations) {
          locations.forEach(({ lat, lng }) =>
            leaflet.marker([lat, lng]).addTo(map)
          );
        },
        setCenter(center, zoom) {
          map.setView(center, zoom ?? map.getZoom());
        },
        destroy() {
          map.remove();
        },
      };
    } catch (error) {
      console.error("[MapService] Failed to configure map:", error);
      return null;
    }
  }

  private setupDefaultIcon(leaflet: typeof import("leaflet")): void {
    try {
      const icon = leaflet.icon;
      const Marker = leaflet.Marker;
      const DefaultIcon = leaflet.Icon?.Default;

      if (DefaultIcon) {
        const defaultIcon = icon({
          iconUrl: "assets/marker-icon.png",
          iconRetinaUrl: "assets/marker-icon-2x.png",
          shadowUrl: "assets/marker-shadow.png",
          ...new DefaultIcon().options,
        });

        Marker.prototype.options.icon = defaultIcon;
      }
    } catch (err) {
      console.warn("[MapService] Failed to setup default icon:", err);
    }
  }
}
