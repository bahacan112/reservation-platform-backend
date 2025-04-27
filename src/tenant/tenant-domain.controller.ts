import { Controller, Post, Body } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TenantDomainService } from './tenant-domain.service';
import { SubscriptionService } from '../subscription/subscription.service';

@Controller('tenant-domains')
export class TenantDomainController {
  constructor(
    @InjectModel('TenantDomain', 'platform') private readonly model: Model<any>,
    private readonly cacheService: TenantDomainService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @Post()
  async add(
    @Body() body: { domain: string; tenantSlug: string; organizationId: string; createdBy?: string; mongoUri?: string },
  ) {
    const tenantCount = await this.model.countDocuments({ organizationId: body.organizationId });
    const now = new Date();

    const plan = tenantCount === 0 ? 'trial' : 'inactive';
    const startDate = plan === 'trial' ? now : undefined;
    const endDate = plan === 'trial' ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) : undefined;

    // ✅ mongoUri otomatik üret (eğer frontendten gelmezse)
    const mongoUri = body.mongoUri || `mongodb://localhost:27017/db_${body.tenantSlug}`;

    // ✅ İlk tenant için subscription kaydı oluştur
    if (plan === 'trial' && startDate && endDate) {
      await this.subscriptionService.create({
        tenantSlug: body.tenantSlug,
        organizationId: body.organizationId,
        plan: 'trial',
        startDate,
        endDate,
        note: 'Otomatik deneme süresi',
      });
    }

    const created = await this.model.create({
      ...body,
      mongoUri, // ✅ artık mongoUri de kaydediliyor
      plan,
      startDate,
      endDate,
      manuallyActivated: false,
    });

    // ✅ Redis cache'e de mongoUri ile birlikte yazıyoruz
    await this.cacheService.addDomain({
      domain: body.domain,
      tenantSlug: body.tenantSlug,
      organizationId: body.organizationId,
      mongoUri,
      plan,
      endDate,
    });

    return created;
  }
}
