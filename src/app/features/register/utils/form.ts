import { inject } from "@angular/core";
import { NonNullableFormBuilder, Validators } from "@angular/forms";
import { imageFileValidator } from "../../../shared/file-upload/file.upload.utils";

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
