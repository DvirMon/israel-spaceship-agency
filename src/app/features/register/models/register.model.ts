import { FormGroup, FormControl } from "@angular/forms";
import { CandidateStore } from "@core/models/candidate-store.model";
export type PersonalInfoModel = Pick<
  CandidateStore,
  "fullName" | "email" | "phone" | "age" | "city"
>;

export type AdditionalInfoModel = Pick<
  CandidateStore,
  "hobbies" | "motivation" | "profileImage"
>;
export type CandidateForm = PersonalInfoModel & AdditionalInfoModel;

// Utility to create FormGroup type
export type PersonalInfoForm = FormGroup<{
  fullName: FormControl<string>;
  age: FormControl<number | undefined>;
  email: FormControl<string>;
  phone: FormControl<string>;
  city: FormControl<string>;
}>;
// Utility to create FormGroup type
export type AdditionalInfoForm = FormGroup<{
  hobbies: FormControl<string>;
  motivation: FormControl<string>;
  profileImage: FormControl<File | undefined>;
}>;

type RegisterMetadata = {
  geo: { latitude: number; longitude: number };
  profileImageUrl: Date;
  registeredAt: Date;
};
