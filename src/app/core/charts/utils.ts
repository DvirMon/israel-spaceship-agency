import { ChartData } from "./types";

export function groupToChartData<T>(
  items?: T[],
  groupFn?: (item: T) => string
): ChartData[] {
  if (!groupFn || !items) return [];

  const map = new Map<string, number>();

  for (const item of items) {
    const key = groupFn(item);
    map.set(key, (map.get(key) || 0) + 1);
  }

  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}
