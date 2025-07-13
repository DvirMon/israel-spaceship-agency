import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { map, of } from "rxjs";

@Injectable({ providedIn: "root" })
export class GeocodingService {
  private http = inject(HttpClient);
  private geoCache = new Map<
    string,
    { lat: number; lng: number; formatted: string }
  >();

  private readonly API_URL = "https://api.opencagedata.com/geocode/v1/json";
  private readonly API_KEY = environment.geo_key;

  loadCoordinates(city: string) {
    if (this.geoCache.has(city)) {
      return of(this.geoCache.get(city)!); // ✅ return cached result
    }

    const params = {
      q: city,
      key: this.API_KEY,
      limit: "1",
      language: "en",
    };

    return this.http.get<any>(this.API_URL, { params }).pipe(
      map((response) => {
        const result = response.results?.[0];
        const geo = result
          ? {
              lat: result.geometry.lat,
              lng: result.geometry.lng,
              formatted: result.formatted,
            }
          : { lat: 0, lng: 0, formatted: "" };

        this.geoCache.set(city, geo); // 💾 cache it
        return geo;
      })
    );
  }
}
