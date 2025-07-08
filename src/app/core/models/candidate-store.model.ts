// The source of truth for candidate types
export type CandidateStore = {
  fullName: string;
  email: string;
  phone: string;
  age: number;
  city: string;
  hobbies: string;
  motivation: string;
  profileImage: File;
  geo: { latitude: number; longitude: number };
  profileImageUrl: string;
  registeredAt: Date;
};
