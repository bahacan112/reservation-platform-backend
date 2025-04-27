import { Controller, Get, Post, Req, Body, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll(@Req() req: Request) {
    const organizationId = req.headers['x-organization-id'] as string;

    if (!organizationId) {
      throw new BadRequestException('Organization ID missing');
    }

    return this.userService.findAll(organizationId);
  }

  @Post()
  async create(@Req() req: Request, @Body() body: any) {
    const organizationId = req.headers['x-organization-id'] as string;
    const tenantSlug = req.headers.host?.split('.')[0];

    if (!organizationId || !tenantSlug) {
      throw new BadRequestException('Missing organization or tenant info');
    }

    return this.userService.create(organizationId, {
      ...body,
      tenantSlug,
    });
  }
  @Get('by-tenant')
  async getByTenant(@Req() req: Request) {
    const organizationId = req.headers['x-organization-id'] as string;
    const tenantSlug = req.headers.host?.split('.')[0];

    if (!organizationId || !tenantSlug) {
      throw new BadRequestException('Missing organization or tenant info');
    }

    const model = await this.userService.getModel(organizationId);
    return model.find({ organizationId, tenantSlug });
  }
}
