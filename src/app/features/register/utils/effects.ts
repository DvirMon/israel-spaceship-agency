import { CandidateStore } from "@core/models/candidate.model";
import { Observable, filter, tap, map, switchMap } from "rxjs";
import { CandidateForm } from "../types";
import { fileToUrl } from "./form";
import { compareCandidates, withCoordinates } from "./utils";
import { inject } from "@angular/core";
import { RegisterService } from "../services/register.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { withTimestamps } from "@shared/operators";

export function updateCandidateEvent(
  submitEvent$: Observable<Partial<CandidateForm>>
) {
  const store = inject(RegisterService).store;
  const http = inject(RegisterService).http;
  const event$ = submitEvent$.pipe(
    filter(() => store.isAllowEdit()),
    tap((val) => console.log("before compare", val)),
    fileToUrl("profileImage"),
    filter((value) => !compareCandidates(value, store.candidate())),
    map(
      (value) =>
        ({
          ...store.candidate(),
          ...value,
        } as CandidateStore)
    ),
    withCoordinates("city"),
    tap((val) => console.log("update", val)),
    switchMap((value) => http.updateCandidate(value))
  );

  return toSignal(event$);
}

export function createCandidateEvent(
  submitEvent$: Observable<Partial<CandidateForm>>
) {
  const store = inject(RegisterService).store;
  const http = inject(RegisterService).http;
  const event$ = submitEvent$.pipe(
    filter(() => !store.isUpdateFlow()),
    map((value) => ({ ...value } as CandidateForm)),
    fileToUrl("profileImage"),
    withCoordinates("city"),
    withTimestamps(),
    // TODO: solve with mergeMap to able using withLoadingOverlay

    switchMap((value) => http.createCandidate(value))
  );
  return toSignal(event$);
}
