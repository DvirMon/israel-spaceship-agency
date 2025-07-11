import { CandidateStore } from "@core/models/candidate.model";
export type PersonalInfoModel = Pick<
  CandidateStore,
  "fullName" | "email" | "phone" | "age" | "city"
>;

export type AdditionalInfoModel = Pick<
  CandidateStore,
  "hobbies" | "motivation"
>;
export type CandidateForm = PersonalInfoModel &
  Partial<AdditionalInfoModel> & { profileImage: File | string | undefined };

type RegisterMetadata = {
  geo: { latitude: number; longitude: number };
  profileImageUrl: Date;
  registeredAt: Date;
};
