// provide-leaflet-map.ts
import { makeEnvironmentProviders, Provider } from "@angular/core";
import { LeafletMap } from "./leaflet-map.service";
import {
  LEAFLET_MAP_CONFIG,
  LeafletMapConfig,
} from "./leaflet-map-config.token";
import * as L from "leaflet";

export const DEFAULT_CONFIG: LeafletMapConfig = {
  zoom: 8,
  center: [32.3040272, 34.8620134],
  tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
};

export function provideLeafletMap(config: Partial<LeafletMapConfig> = {}) {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  // Set global default marker icon
  const defaultIcon = L.icon({
    ...L.Icon.Default.prototype.options,
    iconUrl: "assets/marker-icon.png",
    iconRetinaUrl: "assets/marker-icon-2x.png",
    shadowUrl: "assets/marker-shadow.png",
  });

  L.Marker.prototype.options.icon = defaultIcon;

  return makeEnvironmentProviders([
    { provide: LEAFLET_MAP_CONFIG, useValue: mergedConfig },
    LeafletMap,
  ]);
}
