import { Setting } from "../models/Configuration";

export class SettingValidator {
  validate(setting: Setting): boolean {
    return Boolean(setting.key && setting.type);
  }
}
