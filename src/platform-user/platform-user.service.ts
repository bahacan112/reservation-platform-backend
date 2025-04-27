// src/platform-user/platform-user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlatformUserService {
  constructor(
    @InjectModel('PlatformUser', 'platform')
    private userModel: Model<any>,
  ) {}

  async findOrCreateFromToken(decodedToken: { sub: string; email?: string; preferred_username?: string }) {
    let user = await this.userModel.findOne({ keycloakId: decodedToken.sub });

    if (!user) {
      user = await this.userModel.create({
        keycloakId: decodedToken.sub,
        email: decodedToken.email,
        name: decodedToken.preferred_username ?? decodedToken.email,
      });
    }

    return user;
  }
}
