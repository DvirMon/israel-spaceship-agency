import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { computed, inject, isDevMode } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { map, tap } from "rxjs";

const widthMap: [string, number][] = [
  ["(max-width: 380px)", 300],
  ["(max-width: 420px)", 340],
  ["(max-width: 460px)", 380],
  ["(max-width: 520px)", 440],
  [Breakpoints.XSmall, 480],
  [Breakpoints.Small, 0],
  [Breakpoints.Medium, 440],
];

export function chartView(breakpoints: string[] = []) {
  const breakpointObserver = inject(BreakpointObserver);

  const defaultBreakpoints = [
    Breakpoints.XSmall, // < 600px
    "(max-width: 520px)",
    "(max-width: 450px)",
    "(max-width: 420px)",
    "(max-width: 380px)",
  ];

  const customAliases = new Set(breakpoints.map((bp) => bp));

  const target = [
    ...defaultBreakpoints.filter((bp) => !customAliases.has(bp)),
    ...breakpoints,
  ];
  const chartBreakPoint$ = breakpointObserver.observe(target);

  const chartWidth$ = chartBreakPoint$.pipe(
    map((state) => {
 
      const activeWidth = widthMap.find(([query]) => state.breakpoints[query]);
      return activeWidth?.[1] ?? 0;
    }),
   
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
