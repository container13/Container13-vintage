import { Configuration } from "../models/Configuration";
import { ConfigurationAdapter } from "../adapters/ConfigurationAdapter";

export class ConfigurationService {
  constructor(
    private readonly adapter: ConfigurationAdapter
  ) {}

  async getConfiguration(id: string): Promise<Configuration | null> {
    return this.adapter.load(id);
  }

  async updateConfiguration(configuration: Configuration): Promise<void> {
    await this.adapter.save(configuration);
  }
}
