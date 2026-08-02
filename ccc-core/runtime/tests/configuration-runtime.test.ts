import { describe, expect, it } from "vitest";
import { createConfigurationRuntime } from "../src/configuration";

describe("Configuration Runtime Data Flow", () => {
  it("should save and load configuration using test adapter", async () => {
    const runtime = createConfigurationRuntime(true);

    const configuration = {
      id: "test-config",
      companyId: "container13",
      settings: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await runtime.configurationService.updateConfiguration(configuration);

    const result =
      await runtime.configurationService.getConfiguration("test-config");

    expect(result?.id).toBe("test-config");
  });
});
