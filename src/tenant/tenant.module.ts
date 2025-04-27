// src/tenant/tenant.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TenantDomainService } from './tenant-domain.service';
import { TenantDomainController } from './tenant-domain.controller';
import { TenantDomainSchema } from './tenant-domain.schema';
import { SubscriptionModule } from '../subscription/subscription.module'; // ✅ burası
import { RedisModule } from '../common/redis/redis.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'TenantDomain', schema: TenantDomainSchema }], 'platform'),
    SubscriptionModule, // ✅ burası eklendi
    RedisModule,
  ],
  providers: [TenantDomainService],
  controllers: [TenantDomainController],
  exports: [TenantDomainService],
})
export class TenantModule {}
