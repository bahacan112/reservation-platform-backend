// src/platform-user/platform-user.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthUser } from '../auth/auth-user.decorator';
import { PlatformUserService } from './platform-user.service';

@Controller('me')
@UseGuards(JwtAuthGuard)
export class PlatformUserController {
  constructor(private readonly userService: PlatformUserService) {}

  @Get()
  async getMe(@AuthUser() user: any) {
    const dbUser = await this.userService.findOrCreateFromToken(user);
    return dbUser;
  }
}
