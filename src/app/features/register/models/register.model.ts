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

type RegisterMetadata = {
  geo: { latitude: number; longitude: number };
  profileImageUrl: Date;
  registeredAt: Date;
};
