import { createFirebaseTestConnection } from "./FirebaseTestConnection";

export class FirebaseRuntimeClient {
  private readonly connection;

  constructor() {
    this.connection = createFirebaseTestConnection();
  }

  getConnection() {
    return this.connection;
  }

  async save(path: string, data: unknown): Promise<void> {
    // Final Firestore SDK write will connect here.
  }

  async load(path: string): Promise<unknown> {
    // Final Firestore SDK read will connect here.
    return null;
  }
}
