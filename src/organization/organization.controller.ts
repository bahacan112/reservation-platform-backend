// src/organization/organization.controller.ts
import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthUser } from '../auth/auth-user.decorator';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly orgService: OrganizationService) {}

  @Post()
  async create(@Body() body: any) {
    return this.orgService.create(body);
  }

  @Get()
  async findAll() {
    return this.orgService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.orgService.findById(id);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  getMyOrganizations(@AuthUser() user: any) {
    return this.orgService.findByOwner(user.sub); // ✅ async'e gerek yok
  }
}
