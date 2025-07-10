import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from "@angular/core";
import { provideRouter } from "@angular/router";

import { provideHttpClient } from "@angular/common/http";
import {
  getAnalytics,
  provideAnalytics,
  ScreenTrackingService,
} from "@angular/fire/analytics";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { getFirestore, provideFirestore } from "@angular/fire/firestore";
import { getStorage, provideStorage } from "@angular/fire/storage";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { environment } from "../environments/environment";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideHttpClient(),
  ],
};
