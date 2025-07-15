import { provideHttpClient } from "@angular/common/http";
import { makeEnvironmentProviders, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";

export function provideCore() {
  return makeEnvironmentProviders([
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideAnimationsAsync(),
    provideHttpClient(),
  ]);
}
