import { Timestamp } from "@angular/fire/firestore";
import { CandidateStore } from "@core/models/candidate.model";

type AgeFilterFn = (age: number) => boolean;
const ageFilterMap: Record<string, AgeFilterFn> = {
  all: () => true,
  "20-25": (age) => age >= 20 && age <= 25,
  "26-30": (age) => age >= 26 && age <= 30,
  "31-35": (age) => age >= 31 && age <= 35,
  "36-40": (age) => age >= 36 && age <= 40,
  "40+": (age) => age > 40,
};

export function matchesAgeFilter(age: number, filter: string): boolean {
  return (ageFilterMap[filter] || ageFilterMap["all"])(age);
}

type DateFilterFn = (diffDays: number) => boolean;
const dateFilterMap: Record<string, DateFilterFn> = {
  all: () => true,
  "last-week": (d) => d <= 7,
  "last-month": (d) => d <= 30,
  "last-3-months": (d) => d <= 90,
  older: (d) => d > 90,
};

function normalizeDate(dateInput: Date | string | Timestamp): Date | null {
  if (dateInput instanceof Timestamp) return dateInput.toDate();
  if (dateInput instanceof Date) return dateInput;
  if (typeof dateInput === "string") return new Date(dateInput);
  return null;
}

export function matchesDateFilter(dateInput: Date, filter: string): boolean {
  if (filter === "all") return true;

  const date = normalizeDate(dateInput);

  if (!date) return false;

  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return (dateFilterMap[filter] || dateFilterMap["all"])(diffDays);
}

export function matchesSearch(
  candidate: CandidateStore,
  search: string
): boolean {
  if (!search) return true;
  return (
    candidate.fullName.toLowerCase().includes(search) ||
    candidate.email.toLowerCase().includes(search) ||
    candidate.city.toLowerCase().includes(search)
  );
}

export function matchesCity(candidate: CandidateStore, city: string): boolean {
  if (city === "all") return true;
  return candidate.city.toLowerCase().replace(" ", "-") === city;
}
type SortFn = (a: CandidateStore, b: CandidateStore) => number;

const sortMap: Record<string, SortFn> = {
  fullName: (a, b) => a.fullName.localeCompare(b.fullName),
  "fullName-desc": (a, b) => b.fullName.localeCompare(a.fullName),

  registeredAt: (a, b) => b.registeredAt.toMillis() - a.registeredAt.toMillis(),

  "date-desc": (a, b) => a.registeredAt.toMillis() - b.registeredAt.toMillis(),

  age: (a, b) => a.age - b.age,
  "age-desc": (a, b) => b.age - a.age,
};

export function sortCandidateStores(
  candidates: CandidateStore[],
  sortBy: keyof CandidateStore
): CandidateStore[] {
  const sorted = [...candidates];
  const sortFn = sortMap[sortBy] || sortMap["fullName"];
  return sorted.sort(sortFn);
}
