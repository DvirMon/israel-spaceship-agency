import { inject, resource, Signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import {
  AbstractControl,
  FormGroup,
  FormSubmittedEvent,
  NonNullableFormBuilder,
  Validators,
} from "@angular/forms";
import { FireStorage } from "@core/services/fire-storage.service";
import { filter, map, mergeAll, Observable, of, withLatestFrom } from "rxjs";

export function createRegistrationForm() {
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

    // Additional Information fields
    hobbies: nfb.control("", []),
    motivation: nfb.control("", []),
    profileImage: nfb.control<File | string>(""),
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
    map(([_, value]) => value)
    // distinctUntilChanged((a, b) => compareCandidates(a, b))
  );
}

export function fileToUrl<T, K extends keyof T>(
  key: K
): (source$: Observable<T>) => Observable<Omit<T, K> & { [P in K]: string }> {
  const storage = inject(FireStorage);

  return (source$) =>
    source$.pipe(
      map((data) => {
        const file = data[key];

        if (typeof file === "string") {
          return of({
            ...data,
            [key]: file,
          });
        }

        if (file instanceof File) {
          return storage.uploadFile(file).pipe(
            map((uploaded) => ({
              ...data,
              [key]: uploaded,
            }))
          );
        }

        return of({
          ...data,
          [key]: "",
        });
      }),
      mergeAll()
    );
}

export function fileToUrlResource<T extends object>(
  value: Signal<T>,
  key: keyof T
) {
  const storage = inject(FireStorage);

  return resource({
    defaultValue: { ...value(), [key]: "" },
    params: () => value(),
    loader: async ({ params: value }) => {
      const file = value[key];
      if (typeof file === "string") return value;

      if (file instanceof File) {
        const imageUrl = storage.upload(value[key] as File);
        return {
          ...value,
          [key]: imageUrl,
        };
      }

      return value;
    },
  });
}
