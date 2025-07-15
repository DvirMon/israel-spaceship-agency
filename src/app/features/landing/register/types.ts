
export type CandidateForm = {
  fullName: string;
  email: string;
  phone: string;
  age: number;
  city: string;
  hobbies?: string;
  motivation?: string;
  profileImage?: File | string;
};
