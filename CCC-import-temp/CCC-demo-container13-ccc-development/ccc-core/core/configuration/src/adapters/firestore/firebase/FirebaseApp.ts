import { initializeApp, FirebaseApp as FirebaseSDKApp } from "firebase/app";

export class FirebaseApp {
  private app: FirebaseSDKApp | null = null;

  initialize(config: Record<string, unknown>): FirebaseSDKApp {
    if (!this.app) {
      this.app = initializeApp(config);
    }

    return this.app;
  }

  getInstance(): FirebaseSDKApp | null {
    return this.app;
  }
}
