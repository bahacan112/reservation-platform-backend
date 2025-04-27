// src/platform-user/platform-user.schema.ts
import { Schema } from 'mongoose';

export const PlatformUserSchema = new Schema(
  {
    keycloakId: { type: String, required: true, unique: true }, // Keycloak UUID
    name: String,
    email: String,
  },
  { timestamps: true },
);
