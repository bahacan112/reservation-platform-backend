// src/tenant/tenant-domain.schema.ts
import { Schema } from 'mongoose';

export const TenantDomainSchema = new Schema(
  {
    tenantSlug: { type: String, required: true },
    organizationId: { type: String, required: true },
    domain: { type: String, required: true, unique: true },
    createdBy: { type: String },
  },
  { timestamps: true },
);
