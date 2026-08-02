import { Configuration } from "../../models/Configuration";

export class FirestoreConfigurationMapper {
  static fromFirestore(data: unknown): Configuration {
    return data as Configuration;
  }

  static toFirestore(configuration: Configuration): unknown {
    return configuration;
  }
}
