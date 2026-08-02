export interface FeatureToggle {
  name: string;
  enabled: boolean;
  rollout?: number;
}
