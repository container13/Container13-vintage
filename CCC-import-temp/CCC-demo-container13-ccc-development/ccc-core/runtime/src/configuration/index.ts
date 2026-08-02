import { ConfigurationContainer } from "../../../core/configuration/src/container/ConfigurationContainer";

export function createConfigurationRuntime(useTestAdapter = false) {
  const container = new ConfigurationContainer(useTestAdapter);

  return {
    configurationService: container.configurationService
  };
}
