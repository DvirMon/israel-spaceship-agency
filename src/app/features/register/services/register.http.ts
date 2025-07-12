import { inject, Injectable } from "@angular/core";
import { CandidateStore } from "@core/models/candidate.model";
import { FireStore } from "@core/services/fire-store.service";
import { convertTimestampsToDate } from "@shared/operators";
import { LoadingOverlayService } from "app/shared/components/loading-overlay/loading-overlay.service";
import { withLoadingOverlay } from "app/shared/components/loading-overlay/operator";
import { map, of, take, tap } from "rxjs";

@Injectable()
export class RegisterHttp extends FireStore<CandidateStore> {
  private readonly overlayService = inject(LoadingOverlayService);
  createCandidate(data: Omit<CandidateStore, "id">) {

    return this.createDocument(data).pipe(
      withLoadingOverlay(this.overlayService),
      tap((data) => {
        // this.localStorage.setItem("registration-uuid", data.id);
      })
    );
  }

  updateCandidate(data: CandidateStore) {
    return this.updateDocument(data.id, data).pipe(
      withLoadingOverlay(this.overlayService),
      map(() => data)
    );
  }

  getCandidate(id: string) {
    const candidate = of({
      fullName: "Dvir Monajem",
      email: "dmenajem@gmail.com",
      phone: "0547974643",
      city: "Rosh HaAyin",
      age: 43,
      hobbies: "",
      motivation: "",
      profileImage:
        "https://firebasestorage.googleapis.com/v0/b/israel-spaceship-agency.firebasestorage.app/o/candidates%2Fprofile_candidateId.png?alt=media&token=ce906858-f3d9-4d75-bbe9-dfad3ec27e8d",
      registeredAt: new Date("2025-07-11T07:06:10.000Z"),
      expiresAt: new Date("2025-07-14T07:06:10.000Z"),
      geo: {
        latitude: 32.0952929,
        longitude: 34.9533225,
      },
      id,
    });

    return candidate.pipe(
      take(1),
      map((candidate) => candidate as CandidateStore),
      convertTimestampsToDate(["registeredAt", "expiresAt"]),
      tap((candidate) => {
        console.log(candidate);
      }),
      withLoadingOverlay(this.overlayService)
    );
  }
}
