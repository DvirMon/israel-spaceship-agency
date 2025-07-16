import { makeEnvironmentProviders } from "@angular/core";
import {
  LEAFLET_MAP_CONFIG,
  LeafletMapConfig,
} from "./leaflet-map-config.token";
import { LeafletMap } from "./leaflet-map.service";

export const DEFAULT_CONFIG: LeafletMapConfig = {
  zoom: 8,
  center: [32.3040272, 34.8620134],
  tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
};

export function provideLeafletMap(config: Partial<LeafletMapConfig> = {}) {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  // // Set global default marker icon



  return makeEnvironmentProviders([
    { provide: LEAFLET_MAP_CONFIG, useValue: mergedConfig },
    LeafletMap,
  ]);
}
