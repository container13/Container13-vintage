import { Configuration } from "../models/Configuration";

export class ConfigurationValidator {
  validate(configuration: Configuration): boolean {
    if (!configuration.id) return false;
    if (!configuration.companyId) return false;

    return true;
  }
}
