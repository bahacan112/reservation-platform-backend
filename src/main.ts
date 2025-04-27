import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { preloadAllConnections } from './tenant/tenant-db.service';
import { preloadTenantDomains } from './tenant/preload-domains';
import { TenantDomainService } from './tenant/tenant-domain.service';

async function bootstrap() {
  await preloadAllConnections();

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // Her yerden istek al
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // İzin verilen HTTP metodlar
    credentials: true, // İstersen cookie/token desteği de ver
  });

  const domainService = app.get(TenantDomainService);
  await preloadTenantDomains(domainService);

  await app.listen(3000);
}
bootstrap().catch((err) => console.error(err));
