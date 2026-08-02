import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "../../firebase-test-config/FirebaseConfig";

export function createFirebaseTestDb() {
  const app = initializeApp(firebaseConfig);
  return getFirestore(app);
}
