// src/organization/organization.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationSchema } from './organization.schema';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { AuthModule } from '../auth/auth.module'; // AuthModule'ü ekleyin
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Organization', schema: OrganizationSchema }], 'platform'), // 🔥 platform bağlantısını burada belirt
    AuthModule, // AuthModule'ü ekleyin
  ],
  providers: [OrganizationService],
  controllers: [OrganizationController],
  exports: [OrganizationService],
})
export class OrganizationModule {}
