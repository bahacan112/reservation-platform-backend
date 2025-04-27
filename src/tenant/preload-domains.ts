// src/tenant/preload-domains.ts
import mongoose from 'mongoose';
import { TenantDomainService } from './tenant-domain.service';

export async function preloadTenantDomains(tenantDomainService: TenantDomainService) {
  const conn = await mongoose.createConnection('mongodb://localhost:27017/platform').asPromise();
  const schema = new mongoose.Schema({
    domain: String,
    tenantSlug: String,
    organizationId: String,
  });

  const Model = conn.model('TenantDomain', schema);

  const domains = await Model.find().lean();

  tenantDomainService.preload(domains as any); // tipler sadeleştirilebilir
}
