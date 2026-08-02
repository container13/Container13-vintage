import { Setting } from "../models/Configuration";

export class SettingsManager {
  getSetting(key: string): Setting | null {
    return null;
  }

  updateSetting(setting: Setting): boolean {
    return true;
  }
}
