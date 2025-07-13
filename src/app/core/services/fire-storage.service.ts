import { inject, Injectable } from "@angular/core";
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from "@angular/fire/storage";
import { from, Observable, switchMap } from "rxjs";

@Injectable({ providedIn: "root" })
export class FireStorage {
  private readonly storage = inject(Storage);

  private storagePath = "gs://israel-spaceship-agency.firebasestorage.app";

  generateStoragePath(
    basePath: string,
    file: File | Blob,
    options?: { entityId?: string; prefix?: string }
  ): string {
    const extension = this.getFileExtension(file);
    const id = options?.entityId ?? "uuid()";
    const prefix = options?.prefix ? `${options.prefix}_` : "";

    return `${basePath}/${prefix}${id}${extension}`;
  }

  getFileExtension(file: File | Blob): string {
    if ("name" in file && file.name) {
      const match = file.name.match(/\.[a-z0-9]+$/i);
      return match ? match[0] : "";
    }

    const mime = file.type;
    const ext = mime.split("/")[1];
    return ext ? `.${ext}` : "";
  }

  uploadFile(file: Blob): Observable<string> {
    const path = this.generateStoragePath("candidates", file, {
      entityId: "candidateId",
      prefix: "profile",
    });

    const fileRef = ref(this.storage, path);

    return from(uploadBytes(fileRef, file)).pipe(
      switchMap(() => from(getDownloadURL(fileRef)))
    );
  }
}
