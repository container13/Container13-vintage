import { doc, getDoc, setDoc } from "firebase/firestore";
import { FirebaseFirestore } from "../firebase/FirebaseFirestore";

export class FirestoreClient {
  constructor(
    private readonly firestore: FirebaseFirestore
  ) {}

  async get(path: string): Promise<unknown> {
    const db = this.firestore.getInstance();

    if (!db) {
      throw new Error("Firestore is not initialized");
    }

    const snapshot = await getDoc(doc(db, path));

    return snapshot.exists() ? snapshot.data() : null;
  }

  async set(path: string, data: unknown): Promise<void> {
    const db = this.firestore.getInstance();

    if (!db) {
      throw new Error("Firestore is not initialized");
    }

    await setDoc(doc(db, path), data as Record<string, unknown>);
  }
}
