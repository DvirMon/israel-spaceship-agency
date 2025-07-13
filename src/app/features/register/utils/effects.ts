import { CandidateStore } from "@core/models/candidate.model";
import { Observable, filter, tap, map, switchMap } from "rxjs";
import { CandidateForm } from "../types";
import { fileToUrl } from "./form";
import { compareCandidates, withCoordinates, withLogRegister } from "./utils";
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
    switchMap((value) => http.createCandidate(value)),
    withLogRegister()
  );
  return toSignal(event$);
}
