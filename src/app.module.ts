import { Module, MiddlewareConsumer } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TenantContextMiddleware } from './common/middleware/tenant-context.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationModule } from './organization/organization.module';
import { TenantModule } from './tenant/tenant.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { PlatformUserModule } from './platform-user/platform-user.module';
import { RedisModule } from './common/redis/redis.module';
@Module({
  imports: [
    UserModule,
    OrganizationModule,
    SubscriptionModule,
    TenantModule,
    PlatformUserModule,
    RedisModule,
    MongooseModule.forRoot('mongodb://localhost:27017/platform', { connectionName: 'platform' }),
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantContextMiddleware)
      .exclude('/me', '/organizations', '/tenant-domains', '/subscriptions')
      .forRoutes('*');
  }
}
