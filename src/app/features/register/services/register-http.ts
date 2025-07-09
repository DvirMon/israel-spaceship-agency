import { Injectable } from "@angular/core";
import { CandidateForm } from "../models/register.model";
import { Observable, of, delay } from "rxjs";

@Injectable()
export class RegisterHttp {
  submitRegistration(data: CandidateForm): Observable<void> {
    console.log("Registration submitted:", data);

    // In a real application, you would:
    // 1. Create FormData for file upload
    // 2. Send HTTP request to backend
    // 3. Handle response and errors

    // Mock observable with delay to simulate API call
    return of(void 0).pipe(delay(1000));
  }

  /**
   * Update existing candidate registration data
   * @param data - Updated registration data
   * @returns Observable<void> - Completes when update is successful
   */
  updateCandidate(data: CandidateForm): Observable<void> {
    console.log("Candidate registration updated:", data);

    // In a real application, you would:
    // 1. Create FormData for file upload
    // 2. Send HTTP PUT/PATCH request to backend
    // 3. Handle response and errors

    // Mock observable with delay to simulate API call
    return of(void 0).pipe(delay(1000));
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
