import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { preloadAllConnections } from './tenant/tenant-db.service';
import { preloadTenantDomains } from './tenant/preload-domains'; // ekle
import { TenantDomainService } from './tenant/tenant-domain.service'; // ekle

async function bootstrap() {
  await preloadAllConnections(); // organizasyon DB bağlantılarını hazırla

  const app = await NestFactory.create(AppModule);

  const domainService = app.get(TenantDomainService); // domain eşleşme servisini al
  await preloadTenantDomains(domainService); // custom domainleri cache'e al

  await app.listen(3000);
}
bootstrap().catch((err) => console.error(err));
