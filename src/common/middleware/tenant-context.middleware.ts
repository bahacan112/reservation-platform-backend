// src/common/middleware/tenant-context.middleware.ts
import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantDomainService } from '../../tenant/tenant-domain.service';

@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  constructor(private readonly tenantDomainService: TenantDomainService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const host = req.headers.host?.split(':')[0] || '';
    const tenant = await this.tenantDomainService.resolve(host);

    console.log('HOST:', host);
    console.log('Resolved Tenant:', tenant);

    if (!tenant) {
      throw new ForbiddenException('Tanımsız tenant domain veya geçersiz plan');
    }

    req['organizationId'] = tenant.organizationId;
    req['tenantSlug'] = tenant.tenantSlug;
    next();
  }
}
