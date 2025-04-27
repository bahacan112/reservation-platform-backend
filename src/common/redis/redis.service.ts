// src/common/redis/redis.service.ts
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private _client: Redis | null = null;

  get client(): Redis {
    if (!this._client) {
      this._client = new Redis({
        host: 'localhost',
        port: 6379,
      });
      console.log('✅ Redis bağlantısı client getter içinde başlatıldı');
    }
    return this._client;
  }

  async set(key: string, value: any) {
    return this.client.set(key, JSON.stringify(value));
  }

  async get(key: string) {
    const result = await this.client.get(key);
    return result ? JSON.parse(result) : null;
  }
}
