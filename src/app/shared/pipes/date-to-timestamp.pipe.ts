import { Pipe, PipeTransform } from "@angular/core";
import { Timestamp } from "@angular/fire/firestore";

@Pipe({
  name: "timestampToDate",
})
export class TimestampToDatePipe implements PipeTransform {
  transform(value: unknown): Date {
    if (value instanceof Date) return value;
    if (value instanceof Timestamp) return value.toDate();
    return new Date();
  }
}
