import { inject } from "@angular/core";
import {
  AbstractControl,
  FormGroup,
  FormSubmittedEvent,
  NonNullableFormBuilder,
  Validators,
} from "@angular/forms";
import { StorageService } from "@core/services/fire-storage.service";
import {
  distinctUntilChanged,
  filter,
  map,
  mergeAll,
  Observable,
  of,
  withLatestFrom,
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
    profileImage: nfb.control<File | string | null | undefined>(""),
  });
}

export function formSubmitEffect<
  T extends { [K in keyof T]: AbstractControl<any> }
>(form: FormGroup<T>) {
  return form.events.pipe(
    filter(
      (event): event is FormSubmittedEvent =>
        event instanceof FormSubmittedEvent
    ),
    withLatestFrom(form.valueChanges),
    map(([_, value]) => value),
    distinctUntilChanged((a, b) => compareCandidates(a, b))
  );
}

export function toFormData<T extends Record<string, any>>(
  orderedKeys?: (keyof T)[]
) {
  return (source$: Observable<T>) =>
    source$.pipe(
      map((data) => {
        const formData = new FormData();
        const keys = orderedKeys ?? (Object.keys(data) as (keyof T)[]);

        for (const key of keys) {
          const value = data[key] as unknown;

          if (value instanceof Blob || value instanceof File) {
            formData.append(key as string, value);
          } else if (value !== undefined && value !== null) {
            formData.append(key as string, value.toString());
          } else {
            formData.append(key as string, "");
          }
        }

        return formData;
      })
    );
}
export function fileToUrl<T, K extends keyof T>(key: K) {
  const storage = inject(StorageService);

  return (source$: Observable<T>) =>
    source$.pipe(
      map((data): Observable<T> => {
        const file = data[key];

        if (file instanceof File) {
          return storage.uploadFile(file).pipe(
            map((uploaded) => ({
              ...data,
              [key]: uploaded as T[K],
            }))
          );
        }

        return of(data);
      }),
      mergeAll() // 👈 flatten Observable<Observable<T>> to Observable<T>
    );
}