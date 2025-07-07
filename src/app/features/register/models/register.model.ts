import { FormGroup, FormControl } from "@angular/forms";

export type CandidateRegistration = PersonalInfoModel & AdditionalInfoModel;

export type PersonalInfoModel = {
  fullName: string;
  email: string;
  phone: string;
  age: number;
  city: string;
};

export type AdditionalInfoModel = {
  hobbies: string;
  motivation: string; //
  profileImage: File;
};

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
