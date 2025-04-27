import { Schema } from 'mongoose';

export const SubscriptionSchema = new Schema(
  {
    tenantSlug: { type: String, required: true }, // ✅
    plan: { type: String, enum: ['trial', 'basic', 'pro', 'enterprise'], required: true },
    status: { type: String, enum: ['active', 'expired', 'canceled'], required: true, default: 'active' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    note: { type: String },
  },
  {
    timestamps: true,
  },
);
