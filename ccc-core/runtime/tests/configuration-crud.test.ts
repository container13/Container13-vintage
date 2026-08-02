import { describe, expect, it } from "vitest";
import { createConfigurationRuntime } from "../src/configuration";

describe("Configuration CRUD Flow", () => {
  it("should create, save and load configuration", async () => {
    const runtime = createConfigurationRuntime(true);

    const configuration = {
      id: "crud-test-config",
      companyId: "container13",
      settings: [
        {
          key: "theme",
          value: "dark"
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await runtime.configurationService.updateConfiguration(configuration);

    const result =
      await runtime.configurationService.getConfiguration(
        "crud-test-config"
      );

    expect(result?.id).toBe("crud-test-config");
    expect(result?.companyId).toBe("container13");
    expect(result?.settings[0].value).toBe("dark");
  });
});
