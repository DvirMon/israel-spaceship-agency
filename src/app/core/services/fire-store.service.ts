import { inject, Injectable } from "@angular/core";
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  doc,
  docData,
  DocumentData,
  Firestore,
  updateDoc,
} from "@angular/fire/firestore";
import { from, map, Observable, throwError } from "rxjs";
import { COLLECTION_KEY } from "../tokens/collection.tokens";

@Injectable({
  providedIn: "root",
})
export class FireStore<T extends DocumentData> {
  private firestore = inject(Firestore);

  private readonly collectionToken = inject(COLLECTION_KEY, { optional: true });

  loadCollection(collectionPath?: string): Observable<T[]> {
    const path = collectionPath || this.collectionToken;
    if (!path) throw new Error("No collection path provided or injected");
    const colRef = collection(this.firestore, path) as CollectionReference<T>;
    return collectionData(colRef, { idField: "id" }) as Observable<T[]>;
  }

  createDocument<T extends object>(data: T, collectionPath?: string) {
    const path = collectionPath || this.collectionToken;
    if (!path) {
      return throwError(
        () => new Error("No collection path provided or injected")
      );
    }

    const colRef = collection(this.firestore, path) as CollectionReference<T>;

    return from(addDoc(colRef, data)).pipe(
      map((docRef) => ({
        ...data,
        id: docRef.id,
      })),
    );
  }

  updateDocument<T>(id: string, data: Partial<T>, collectionPath?: string) {
    const path = collectionPath || this.collectionToken;
    if (!path) throw new Error("No collection path provided or injected");
    const docRef = doc(this.firestore, path, id);
    return from(updateDoc(docRef, data));
  }

  getDocumentById(
    id: string,
    collectionPath?: string
  ): Observable<T | undefined> {
    const path = collectionPath || this.collectionToken;
    if (!path) throw new Error("No collection path provided or injected");
    const docRef = doc(this.firestore, path, id);
    return docData(docRef, { idField: "id" }) as Observable<T | undefined>;
  }
}
