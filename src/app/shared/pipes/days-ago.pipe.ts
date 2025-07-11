import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "daysAgo",
})
export class DaysAgoPipe implements PipeTransform {
  transform(input: string | Date): number | null {
    const date = input instanceof Date ? input : new Date(input);
    if (isNaN(date.getTime())) return null;

    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}