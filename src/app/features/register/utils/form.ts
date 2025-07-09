import { inject } from "@angular/core";
import {
  FormGroup,
  FormSubmittedEvent,
  NonNullableFormBuilder,
  Validators,
} from "@angular/forms";
import {
  distinctUntilChanged,
  filter,
  map,
  withLatestFrom
} from "rxjs";
import { imageFileValidator } from "../../../shared/components/file-upload/file.upload.utils";
import { compareCandidates } from "./utils";

export function createPersonalInfoForm() {
  const nfb = inject(NonNullableFormBuilder);
  return nfb.group({
    fullName: nfb.control("", [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(/^[a-zA-ZÀ-ÿ'.\- ]+$/),
    ]),
    email: nfb.control("", [Validators.required, Validators.email]),
    phone: nfb.control("", [
      Validators.required,
      Validators.pattern(/^(05[02-68]\d{7}|\+9725[02-68]\d{7})$/),
    ]),
    age: nfb.control<number | undefined>(undefined, [
      Validators.required,
      Validators.min(18),
      Validators.max(99),
    ]),
    city: nfb.control("", [Validators.required]),
  });
}

export function createAdditionalInfoForm() {
  const fnb = inject(NonNullableFormBuilder);

  return fnb.group({
    hobbies: fnb.control(""),
    motivation: fnb.control("djskdjsk"),
    profileImage: fnb.control<File | undefined>(undefined, [
      imageFileValidator(),
    ]),
  });
}

export function createRegistrationForm() {
  const nfb = inject(NonNullableFormBuilder);

  return nfb.group({
    // Personal Information fields
    fullName: nfb.control(""),
    email: nfb.control("", []),
    phone: nfb.control("", []),
    age: nfb.control<number | undefined>(undefined, []),
    city: nfb.control("", []),
    // Additional Information fields
    hobbies: nfb.control("", []),
    motivation: nfb.control("", []),
    profileImage: nfb.control<File | string | null>(""),
  });
}

// TODO - fix first submit on update
export function formSubmitEffect(form: FormGroup) {
  return form.events.pipe(
    filter((event) => event instanceof FormSubmittedEvent),
    withLatestFrom(form.valueChanges),
    map(([event, value]) => value),
    distinctUntilChanged((a, b) => compareCandidates(a, b))
  );
}
