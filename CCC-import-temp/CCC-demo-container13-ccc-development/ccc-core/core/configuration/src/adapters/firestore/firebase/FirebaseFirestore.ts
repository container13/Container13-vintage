import { getFirestore, Firestore } from "firebase/firestore";
import { FirebaseApp } from "./FirebaseApp";

export class FirebaseFirestore {
  private firestore: Firestore | null = null;

  constructor(
    private readonly app: FirebaseApp
  ) {}

  initialize(config: Record<string, unknown>): Firestore {
    const firebaseApp = this.app.initialize(config);

    if (!this.firestore) {
      this.firestore = getFirestore(firebaseApp);
    }

    return this.firestore;
  }

  getInstance(): Firestore | null {
    return this.firestore;
  }
}
