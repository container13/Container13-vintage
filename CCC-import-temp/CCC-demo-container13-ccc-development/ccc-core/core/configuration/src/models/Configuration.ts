export interface Configuration {
  id: string;
  companyId: string;
  settings: Setting[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Setting {
  key: string;
  value: unknown;
  type: string;
}
