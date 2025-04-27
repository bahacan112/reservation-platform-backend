// src/user/user.schema.ts
import { Schema } from 'mongoose';

export const UserSchema = new Schema(
  {
    organizationId: { type: String, required: true },
    tenantSlug: { type: String }, // örnek: "acente1"
    name: String,
    email: { type: String, required: true }, // ❌ unique kaldırıldı
    password: String,
  },
  {
    timestamps: true,
  },
);

// ✅ Composite index: aynı org içinde aynı tenant'ta aynı email olamaz
UserSchema.index({ organizationId: 1, tenantSlug: 1, email: 1 }, { unique: true });
