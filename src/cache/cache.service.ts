import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async setCache(key: string, value: string): Promise<void> {
    await this.cacheManager.set(key, value);
  }

  async getCache(key: string): Promise<string> {
    return (await this.cacheManager.get(key)) as string;
  }

  async deleteCache(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async getOrSetCache<T>(key: string, callback: () => Promise<T>): Promise<T> {
    const cachedValue = await this.cacheManager.get<T>(key);
    if (cachedValue) return cachedValue;
    const result = await callback();
    await this.cacheManager.set(key, result);
    return result;
  }
}
