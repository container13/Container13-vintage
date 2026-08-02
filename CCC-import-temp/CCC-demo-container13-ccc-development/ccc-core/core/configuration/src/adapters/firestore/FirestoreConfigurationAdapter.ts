import { Configuration } from "../../models/Configuration";
import { ConfigurationAdapter } from "../ConfigurationAdapter";
import { FirestorePaths } from "./FirestorePaths";
import { FirestoreConfigurationMapper } from "./FirestoreConfigurationMapper";
import { FirestoreClient } from "./client/FirestoreClient";

export class FirestoreConfigurationAdapter implements ConfigurationAdapter {
  private readonly client: FirestoreClient;

  constructor(client: FirestoreClient) {
    this.client = client;
  }

  async load(id: string): Promise<Configuration | null> {
    const path = FirestorePaths.companyConfiguration(id);

    const data = await this.client.get(path);

    if (!data) {
      return null;
    }

    return FirestoreConfigurationMapper.fromFirestore(data);
  }

  async save(configuration: Configuration): Promise<void> {
    const path = FirestorePaths.companyConfiguration(
      configuration.companyId
    );

    const data = FirestoreConfigurationMapper.toFirestore(configuration);

    await this.client.set(path, data);
  }
}
