import { ConfigurationService } from "../services/ConfigurationService";
import { SettingsManager } from "../services/SettingsManager";
import { FirestoreConfigurationAdapter } from "../adapters/firestore/FirestoreConfigurationAdapter";
import { FakeConfigurationAdapter } from "../adapters/test/FakeConfigurationAdapter";
import { FirestoreClient } from "../adapters/firestore/client/FirestoreClient";
import { FirebaseApp } from "../adapters/firestore/firebase/FirebaseApp";
import { FirebaseFirestore } from "../adapters/firestore/firebase/FirebaseFirestore";

export class ConfigurationContainer {
  readonly configurationService: ConfigurationService;
  readonly settingsManager: SettingsManager;

  constructor(useTestAdapter = false) {
    const adapter = useTestAdapter
      ? new FakeConfigurationAdapter()
      : new FirestoreConfigurationAdapter(
          new FirestoreClient(
            new FirebaseFirestore(
              new FirebaseApp()
            )
          )
        );

    this.configurationService = new ConfigurationService(adapter);
    this.settingsManager = new SettingsManager();
  }
}
