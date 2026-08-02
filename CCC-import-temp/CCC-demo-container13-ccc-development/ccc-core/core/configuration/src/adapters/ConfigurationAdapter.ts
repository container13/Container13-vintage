import { Configuration } from "../models/Configuration";

export interface ConfigurationAdapter {
  load(id: string): Promise<Configuration | null>;
  save(configuration: Configuration): Promise<void>;
}
