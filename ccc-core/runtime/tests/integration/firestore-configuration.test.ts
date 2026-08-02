import { describe, expect, it } from "vitest";
import { createFirebaseTestDb } from "./FirebaseTestHelper";
import { doc, getDoc, setDoc } from "firebase/firestore";

describe("Firestore Real CRUD Execution", () => {
  it("should write and read a test document", async () => {
    const db = createFirebaseTestDb();

    const path = "configuration-tests/container13";
    const reference = doc(db, path);

    const data = {
      companyId: "container13",
      settings: {
        theme: "dark"
      }
    };

    await setDoc(reference, data);

    const snapshot = await getDoc(reference);

    expect(snapshot.exists()).toBe(true);
    expect(snapshot.data()?.companyId).toBe("container13");
  });
});
