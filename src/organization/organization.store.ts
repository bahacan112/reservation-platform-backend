// src/organization/organization.store.ts

export interface OrganizationConfig {
  id: string;
  name: string;
  customMongoUri?: string;
}

const organizations: Record<string, OrganizationConfig> = {
  aspasia: {
    id: 'aspasia5',
    name: 'Aspasia Travel5',
    customMongoUri: 'mongodb://localhost:27017/aspasia5-db', // örnek dış Mongo URI
  },
  globaltur: {
    id: 'globaltur',
    name: 'Global Tur',
    // varsayılan local db kullanılacak
  },
};

export function getOrganizationById(id: string): OrganizationConfig | undefined {
  return organizations[id];
}
