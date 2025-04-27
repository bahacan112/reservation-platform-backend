// src/platform-user/platform-user.module.ts
import { Module } from '@nestjs/common';
import { PlatformUserService } from './platform-user.service';
import { PlatformUserController } from './platform-user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PlatformUserSchema } from './platform-user.schema';
import { AuthModule } from '../auth/auth.module'; // ✅ EKLE

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'PlatformUser', schema: PlatformUserSchema }], 'platform'),
    AuthModule, // ✅ BURAYA EKLE
  ],
  providers: [PlatformUserService],
  controllers: [PlatformUserController],
  exports: [PlatformUserService],
})
export class PlatformUserModule {}
