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
  profileImage?: File | null | string;
  geo: { latitude: number; longitude: number };
  // profileImageUrl: string;
  registeredAt: Date;
  expiresAt: Date;
};
export type CandidateFireStore = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  age: number;
  city: string;
  hobbies: string;
  motivation: string;
  profileImage: File | null | string;
  geo: GeoPoint;
  // profileImageUrl: string;
  registeredAt: Timestamp;
  expiresAt: Timestamp;
};
