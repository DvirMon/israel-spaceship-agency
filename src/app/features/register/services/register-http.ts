import {
  inject,
  Injectable
} from "@angular/core";
import { CandidateStore } from "@core/models/candidate-store.model";
import { LocalStorage } from "@core/services/local-storage.service";
import { LoadingOverlayService } from "app/shared/components/loading-overlay/loading-overlay.service";
import { withLoadingOverlay } from "app/shared/components/loading-overlay/operator";
import { delay, map, Observable, of, tap, timer } from "rxjs";
import { CandidateForm } from "../models/register.model";

@Injectable()
export class RegisterHttp {
  private readonly localStorage = inject(LocalStorage);

  private readonly overlayService = inject(LoadingOverlayService);
  createCandidate(data: Partial<CandidateForm>): Observable<CandidateStore> {

    // In a real application, you would:
    // 1. Create FormData for file upload
    // 2. Send HTTP request to backend
    // 3. Handle response and errors

    // Mock observable with delay to simulate API call
    return of(data as CandidateStore).pipe(
      delay(1000),
      withLoadingOverlay(this.overlayService),
      map((data) => ({ ...data, id: "data.id" })),
      tap((data) => {
        this.localStorage.setItem("registration-uuid", data.id);
      })
    );
  }

  updateCandidate(data: Partial<CandidateForm>) {

    // In a real application, you would:
    // 1. Create FormData for file upload
    // 2. Send HTTP PUT/PATCH request to backend
    // 3. Handle response and errors

    // Mock observable with delay to simulate API call
    return timer(1000).pipe(
      map(() => null), // mock value
      withLoadingOverlay(this.overlayService)
    );
  }

  private createFormData(data: CandidateForm): FormData {
    const formData = new FormData();

    // Add text fields
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("age", data.age.toString());
    formData.append("city", data.city);
    formData.append("hobbies", data.hobbies);
    formData.append("motivation", data.motivation);

    // Add file
    if (data.profileImage) {
      formData.append("profileImage", data.profileImage);
    }

    return formData;
  }
}
