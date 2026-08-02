import { ConfigurationContainer } from "../container/ConfigurationContainer";

describe("Configuration Flow", () => {
  it("should save and load configuration through services", async () => {
    const container = new ConfigurationContainer(true);

    const configuration = {
      id: "test-config",
      companyId: "company-1",
      settings: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await container.configurationService.updateConfiguration(configuration);

    const result =
      await container.configurationService.getConfiguration("test-config");

    expect(result?.id).toBe("test-config");
  });
});
