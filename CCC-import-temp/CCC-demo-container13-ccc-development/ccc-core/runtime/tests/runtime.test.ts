import { describe, expect, it } from "vitest";
import { CCC_RUNTIME_VERSION } from "../src";

describe("CCC Runtime", () => {
  it("should load runtime", () => {
    expect(CCC_RUNTIME_VERSION).toBe("0.1.0");
  });
});
