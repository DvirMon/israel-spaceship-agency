import { inject, InjectionToken } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs";

export const IS_MOBILE = new InjectionToken("IS_MOBILE_SIGNAL", {
  providedIn: "root",
  factory: () => {
    const breakpointObserver = inject(BreakpointObserver);
    const isMobile$ = breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.Small,
      Breakpoints.Medium,
    ]);

    return toSignal(
      isMobile$.pipe(
        // Extract only the `matches` boolean
        map((state) => state.matches)
      ),
      { initialValue: false }
    );
  },
});
