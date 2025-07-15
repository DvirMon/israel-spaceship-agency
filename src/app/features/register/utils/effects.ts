import { inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { CandidateStore } from "@core/models/candidate.model";
import { withTimestamps } from "@shared/operators";
import { Observable, filter, map, merge, switchMap } from "rxjs";
import { RegisterService } from "../services/register.service";
import { CandidateForm } from "../types";
import { fileToUrl, formSubmitEffect } from "./form";
import { compareCandidates, withCoordinates, withLogRegister } from "./utils";
import { FormGroup } from "@angular/forms";

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

export function isNothingChangedEvent(registerForm: FormGroup) {
  const store = inject(RegisterService).store;

  const isFormUnchangedOnSubmit$ = formSubmitEffect(registerForm).pipe(
    map((value) => compareCandidates(value, store.candidate()))
  );

  const resetValue$ = registerForm.valueChanges.pipe(map(() => false));

  const isNothingChangeStream = merge(isFormUnchangedOnSubmit$, resetValue$);

  const isNothingChanged = toSignal(isNothingChangeStream, {
    initialValue: false,
  });

  return isNothingChanged;
}
