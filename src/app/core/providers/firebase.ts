import { makeEnvironmentProviders } from "@angular/core";
import {
  provideAnalytics,
  getAnalytics,
  ScreenTrackingService,
} from "@angular/fire/analytics";
import { provideFirebaseApp, initializeApp } from "@angular/fire/app";
import { provideFirestore, getFirestore } from "@angular/fire/firestore";
import { provideStorage, getStorage } from "@angular/fire/storage";
import { environment } from "environments/environment";

export function provideFirebase() {
  return makeEnvironmentProviders([
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ]);
}
