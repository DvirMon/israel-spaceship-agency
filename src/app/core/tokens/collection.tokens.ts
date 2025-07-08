import { InjectionToken, Provider } from "@angular/core";

export const COLLECTION_KEY = new InjectionToken<string>("COLLECTION_KEY");

export function provideCollectionToken(collectionPath: string): Provider {
  return {
    provide: COLLECTION_KEY,
    useValue: collectionPath,
  };
}
