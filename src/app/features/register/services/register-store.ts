import {
  Injectable,
  computed,
  inject,
  linkedSignal,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { CandidateStore } from "@core/models/candidate-store.model";
import { LocalStorage } from "@core/services/local-storage.service";
import { of } from "rxjs";

@Injectable()
export class RegisterStore {
  private readonly localStorage = inject(LocalStorage);

  private readonly existingUuid = signal(
    this.localStorage.getItem<string>("registration-uuid")
  );

  readonly storeCandidate = toSignal(this.initializeRegistrationFlow());

  readonly candidate = linkedSignal(() => {
    const candidate = this.storeCandidate();

    if (!candidate) return null;

    return candidate;
  });

  readonly isUpdateFlow = computed(() => {
    const candidate = this.candidate();
    if (candidate === null) return false;

    return Object(candidate).hasOwnProperty("id");
  });

  private initializeRegistrationFlow() {
    if (this.existingUuid()) {
      // Create mock data for existing registration
      const mockData = {
        fullName: "John Doe",
        email: "john.doe@example.com",
        phone: "050-1234567",
        age: 28,
        city: "Tel Aviv",
        hobbies:
          "Reading, hiking, photography, and learning new technologies. I enjoy spending time outdoors and exploring different cultures.",
        motivation:
          "I am passionate about innovation and technology. The IISa Program represents an incredible opportunity to develop my skills, collaborate with like-minded individuals, and contribute to meaningful projects that can make a real impact on society.",
        profileImage: undefined,
        id: this.existingUuid(),
      } as CandidateStore;

      return of(mockData);
    } else {
      return of(null);
    }
  }
}
