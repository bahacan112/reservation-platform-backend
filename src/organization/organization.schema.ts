// src/organization/organization.schema.ts
import { Schema } from 'mongoose';

export const OrganizationSchema = new Schema(
  {
    _id: { type: String, required: true }, // örn: aspasia
    name: { type: String, required: true },
    mongoUri: { type: String, required: true, unique: true }, // <== burada unique
    ownerUserId: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);
