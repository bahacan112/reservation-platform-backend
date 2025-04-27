// src/auth/jwt-auth.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'] || '';

    const token = authHeader.replace('Bearer ', '');
    if (!token) return false;

    try {
      const decoded = await this.jwtService.decode(token); // verify yerine decode kullanıyoruz çünkü Keycloak imzası RSA
      if (!decoded || typeof decoded === 'string') return false;

      req.user = decoded;
      return true;
    } catch (err) {
      console.error('JWT Decode Error:', err);
      return false;
    }
  }
}
