import { Configuration } from "../../models/Configuration";
import { ConfigurationAdapter } from "../ConfigurationAdapter";

export class FakeConfigurationAdapter implements ConfigurationAdapter {
  private configuration: Configuration | null = null;

  async load(id: string): Promise<Configuration | null> {
    if (this.configuration?.id === id) {
      return this.configuration;
    }

    return null;
  }

  async save(configuration: Configuration): Promise<void> {
    this.configuration = configuration;
  }
}
