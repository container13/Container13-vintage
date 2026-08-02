import { describe, expect, it } from "vitest";
import { FirebaseRuntimeClient } from "../../src/firebase/FirebaseRuntimeClient";

describe("Firebase Runtime Client", () => {
  it("should initialize firebase runtime connection", () => {
    const client = new FirebaseRuntimeClient();

    expect(client.getConnection().connected).toBe(true);
  });
});
