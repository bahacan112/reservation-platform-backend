import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  async create(
    @Body()
    body: {
      tenantSlug: string;
      organizationId: string; // 🔥 bu alan eksikti
      plan: string;
      startDate: string;
      endDate: string;
      note?: string;
    },
  ) {
    return this.subscriptionService.create({
      tenantSlug: body.tenantSlug,
      organizationId: body.organizationId,
      plan: body.plan,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      note: body.note,
    });
  }

  @Get()
  async list(@Query('tenantSlug') tenantSlug: string) {
    return this.subscriptionService.findAllByTenant(tenantSlug);
  }

  @Get('current')
  async current(@Query('tenantSlug') tenantSlug: string) {
    return this.subscriptionService.getCurrentPlan(tenantSlug);
  }
}
