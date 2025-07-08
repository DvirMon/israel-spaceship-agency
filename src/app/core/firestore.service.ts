import { inject, Inject, Injectable, Optional } from "@angular/core";
import {
  Firestore,
  collectionData,
  CollectionReference,
  collection,
} from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { COLLECTION_KEY } from "./tokens/collection.tokens";

@Injectable()
export class FirestoreService {
    private firestore = inject(Firestore);
    
    private readonly collectionToken = inject(COLLECTION_KEY) 


  /**
   * Get all documents from a collection as an Observable
   * @param collectionPath Path to the Firestore collection (optional, defaults to injected token)
   */
  getCollection<T>(collectionPath?: string): Observable<T[]> {
    const path = collectionPath || this.collectionToken;
    if (!path) throw new Error("No collection path provided or injected");
    const colRef = collection(this.firestore, path) as CollectionReference<T>;
    return collectionData(colRef) as Observable<T[]>;
  }

  /**
   * Get all documents from a collection as a Promise
   * @param collectionPath Path to the Firestore collection (optional, defaults to injected token)
   */
  async getCollectionOnce<T>(collectionPath?: string): Promise<T[]> {
    const path = collectionPath || this.collectionToken;

      console.log("Collection path:", path);
    if (!path) throw new Error("No collection path provided or injected");
    const colRef = collection(this.firestore, path) as CollectionReference<T>;
    return (await collectionData(colRef).toPromise()) as T[];
  }
}
