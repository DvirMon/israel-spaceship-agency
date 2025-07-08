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
    getDocs,
    updateDoc,
} from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { COLLECTION_KEY } from "./tokens/collection.tokens";

@Injectable()
export class FirestoreService {
  private firestore = inject(Firestore);

  private readonly collectionToken = inject(COLLECTION_KEY);

  loadCollection<T>(collectionPath?: string): Observable<T[]> {
    const path = collectionPath || this.collectionToken;
    if (!path) throw new Error("No collection path provided or injected");
    const colRef = collection(this.firestore, path) as CollectionReference<T>;
    return collectionData(colRef) as Observable<T[]>;
  }

  async fetchCollection(): Promise<DocumentData[]> {
    const snapshot = await getDocs(collection(this.firestore, "candidates"));
    return snapshot.docs.map((doc) => doc.data());
  }

  async addDocument<T>(data: T, collectionPath?: string): Promise<string> {
    const path = collectionPath || this.collectionToken;
    if (!path) throw new Error("No collection path provided or injected");
    const colRef = collection(this.firestore, path) as CollectionReference<T>;
    const docRef = await addDoc(colRef, data);
    return docRef.id;
  }

  async updateDocument<T>(
    id: string,
    data: Partial<T>,
    collectionPath?: string
  ): Promise<void> {
    const path = collectionPath || this.collectionToken;
    if (!path) throw new Error("No collection path provided or injected");
    const docRef = doc(this.firestore, path, id);
    await updateDoc(docRef, data);
    return;
  }

  getDocumentById<T>(
    id: string,
    collectionPath?: string
  ): Observable<T | undefined> {
    const path = collectionPath || this.collectionToken;
    if (!path) throw new Error("No collection path provided or injected");
    const docRef = doc(this.firestore, path, id);
    return docData(docRef) as Observable<T | undefined>;
  }
}
