import { CandidateForm } from "../models/register.model";

export function compareCandidates(
  a: Partial<CandidateForm> | null,
  b: Partial<CandidateForm> | null
): boolean {
  // If both are null, they're equal
  if (a === null && b === null) return true;

  // If one is null and the other isn't, they're not equal
  if (a === null || b === null) return false;

  // Compare all text fields
  const textFieldsEqual =
    a.fullName === b.fullName &&
    a.email === b.email &&
    a.phone === b.phone &&
    a.age === b.age &&
    a.city === b.city &&
    a.hobbies === b.hobbies &&
    a.motivation === b.motivation;

  // Compare file properties (since File objects can't be directly compared)
  // const fileEqual =
  //   a.profileImage?.name === b.profileImage?.name &&
  //   a.profileImage?.size === b.profileImage?.size &&
  //   a.profileImage?.lastModified === b.profileImage?.lastModified;

  return textFieldsEqual /* && fileEqual */;
}
