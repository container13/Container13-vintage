import { environment } from "./Environment";

export interface FirebaseEnvironment {
  projectId: string;
  environment: string;
}

export function getFirebaseEnvironment(): FirebaseEnvironment {
  return {
    projectId: "ccc-project",
    environment
  };
}
