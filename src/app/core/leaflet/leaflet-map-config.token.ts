// leaflet-map-config.token.ts
import { InjectionToken } from '@angular/core';
import { LatLngExpression } from 'leaflet';

export type LeafletMapConfig = {
  zoom: number;
  center: LatLngExpression;
  tileUrl: string;
}

export const LEAFLET_MAP_CONFIG = new InjectionToken<LeafletMapConfig>('LEAFLET_MAP_CONFIG');
