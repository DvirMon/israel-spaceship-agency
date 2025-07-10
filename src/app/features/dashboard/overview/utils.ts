import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { computed, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs";

export function getChartView() {
  const breakpointObserver = inject(BreakpointObserver);

  const chartBreakPoint$ = breakpointObserver.observe([
    Breakpoints.Medium, // ≥ 900px
    Breakpoints.Small, // ≥ 600px
    Breakpoints.XSmall, // < 600px
    "(max-width: 440px)",
  ]);

  const chartWidth$ = chartBreakPoint$.pipe(
    map((state) => {
      if (state.breakpoints["(max-width: 440px)"]) return 320; // custom narrow
      if (state.breakpoints[Breakpoints.XSmall]) return 420; // < 600px
      if (state.breakpoints[Breakpoints.Small]) return 0; // ≥ 600px
      if (state.breakpoints[Breakpoints.Medium]) return 420; // ≥ 900px

      return 0; // default fallback
    })
  );

  const chartWidth = toSignal(chartWidth$);

  const show = computed(() => {
    const width = chartWidth();
    return width !== undefined && width > 0;
  });

  const view = computed(() => [chartWidth(), 400] as [number, number]);

  return {
    show,
    view,
  };
}
