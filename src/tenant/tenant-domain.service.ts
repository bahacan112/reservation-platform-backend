import { Injectable } from '@nestjs/common';
import { RedisService } from '../common/redis/redis.service';

interface TenantInfo {
  tenantSlug: string;
  organizationId: string;
  mongoUri: string; // ✅
  plan: 'trial' | 'active' | 'inactive' | 'expired';
  endDate?: Date;
}

interface TenantInfoWithDomain extends TenantInfo {
  domain: string;
}

@Injectable()
export class TenantDomainService {
  constructor(private readonly redisService: RedisService) {}

  private redisKey(domain: string) {
    return `domain:${domain}`;
  }

  async preload(domains: TenantInfoWithDomain[]) {
    for (const { domain, ...info } of domains) {
      await this.redisService.client.set(this.redisKey(domain), JSON.stringify(info));
    }
    console.log(`✅ Redis domain cache yüklendi (${domains.length} kayıt)`);
  }

  async resolve(host: string): Promise<TenantInfo | undefined> {
    const data = await this.redisService.client.get(this.redisKey(host));
    const tenant = data ? (JSON.parse(data) as TenantInfo) : undefined;

    console.log('🔍 resolve host:', host);
    console.log('📦 cached tenant:', tenant);

    if (!tenant || tenant.plan === 'inactive' || tenant.plan === 'expired') {
      console.log('⛔ tenant geçersiz veya bulunamadı.');
      return;
    }

    if (tenant.endDate && new Date() > new Date(tenant.endDate)) {
      console.log('⛔ tenant süresi dolmuş.', tenant.endDate);
      return;
    }

    console.log('✅ tenant geçerli.');
    return tenant;
  }

  async addDomain(entry: TenantInfoWithDomain) {
    const { domain, tenantSlug, organizationId, plan, mongoUri, endDate } = entry;

    const tenantInfo = {
      tenantSlug,
      organizationId,
      mongoUri, // ✅ mongoUri ekliyoruz
      plan,
      endDate,
    };

    await this.redisService.client.set(this.redisKey(domain), JSON.stringify(tenantInfo));

    console.log(`➕ Redis domain cache eklendi: ${domain}`);
  }
}
