// src/subscription/subscription.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SubscriptionService {
  constructor(@InjectModel('Subscription', 'platform') private model: Model<any>) {}
  async create(data: {
    tenantSlug: string;
    organizationId: string;
    plan: string;
    startDate: Date;
    endDate: Date;
    note?: string;
  }) {
    return this.model.create({ ...data, status: 'active' });
  }

  async findAllByTenant(tenantSlug: string) {
    return this.model.find({ tenantSlug }).sort({ startDate: -1 });
  }

  async getCurrentPlan(tenantSlug: string) {
    return this.model
      .findOne({
        tenantSlug,
        status: 'active',
        endDate: { $gt: new Date() },
      })
      .sort({ endDate: -1 });
  }
}
