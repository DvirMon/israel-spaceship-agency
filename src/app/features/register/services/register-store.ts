import { Injectable, inject, signal } from "@angular/core";
import { LocalStorage } from "@core/services/local-storage.service";
import { CandidateForm } from "../models/register.model";
import { RegisterHttp } from "./register-http";
import { registrationDataEquals } from "../utils/utils";

@Injectable()
export class RegisterStore {
  private readonly localStorage = inject(LocalStorage);
  private readonly http = inject(RegisterHttp);

  readonly candidate = signal<CandidateForm | null>(
    this.initializeRegistrationFlow(),
    {
      equal: registrationDataEquals,
    }
  );

  registrationSuccess = signal<string | null>(null, {
    equal: () => false, // Always emit, never consider values equal
  });

  submitCandidateData(registrationData: CandidateForm): void {
    const existingUuid = this.localStorage.getItem<string>("registration-uuid");

    // Determine if this is a new registration or an update
    const operation$ = existingUuid
      ? this.http.updateCandidate(registrationData)
      : this.http.submitRegistration(registrationData);

    operation$.subscribe({
      next: () => {
        if (!existingUuid) {
          const mockUuid = "mock-uuid-12345-67890-abcdef";
          const saveSuccess = this.localStorage.setItem(
            "registration-uuid",
            mockUuid
          );

          if (saveSuccess) {
            console.log("Mock UUID saved to local storage:", mockUuid);
          } else {
            console.warn("Failed to save UUID to local storage");
          }
        }

        this.registrationSuccess.set(registrationData.fullName);
      },
      error: (error) => {
        console.error("Registration/Update failed:", error);
      },
    });
  }

  /**
   * Initialize the registration flow by checking localStorage
   * Returns mock data if UUID exists, null otherwise
   */
  private initializeRegistrationFlow(): CandidateForm | null {
    const existingUuid = this.localStorage.getItem<string>("registration-uuid");

    if (existingUuid) {
      console.log("Found existing registration UUID:", existingUuid);

      // Create mock data for existing registration
      const mockData: CandidateForm = {
        fullName: "John Doe",
        email: "john.doe@example.com",
        phone: "050-1234567",
        age: 28,
        city: "Tel Aviv",
        hobbies:
          "Reading, hiking, photography, and learning new technologies. I enjoy spending time outdoors and exploring different cultures.",
        motivation:
          "I am passionate about innovation and technology. The IISa Program represents an incredible opportunity to develop my skills, collaborate with like-minded individuals, and contribute to meaningful projects that can make a real impact on society.",
        profileImage: null,
      };

      return mockData;
    } else {
      return null;
    }
  }
}
