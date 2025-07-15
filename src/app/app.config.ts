import {
  ApplicationConfig
} from "@angular/core";
import { provideRouter } from "@angular/router";

import { provideLeafletMap } from "@core/leaflet/ provide-leaflet-map";
import { provideCore } from "@core/providers/core";
import { provideFirebase } from "@core/providers/firebase";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideCore(),
    provideFirebase(),
    provideLeafletMap(),
  ],
};
