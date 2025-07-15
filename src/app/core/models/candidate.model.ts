import { GeoPoint, Timestamp } from "@angular/fire/firestore";

// The source of truth for candidate types
export type CandidateStore = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  age: number;
  city: string;
  hobbies?: string;
  motivation?: string;
  profileImage?: string;
  geo: GeoPoint;
  registeredAt: Timestamp;
  expiresAt: Timestamp;
};
