import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs";

export function isMobile() {
  const breakpointObserver = inject(BreakpointObserver);

  const isMatch$ = breakpointObserver
    .observe([Breakpoints.Handset])
    .pipe(map((result) => result.matches));

  return toSignal(isMatch$);
}
