import { firebaseTestConfig } from "../../firebase-test-config/FirebaseTestConfig";

export function createFirebaseTestConnection() {
  return {
    projectId: firebaseTestConfig.projectId,
    connected: true
  };
}
