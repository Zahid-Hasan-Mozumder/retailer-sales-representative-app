import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private readonly defaultCacheTtl = 60 * 60 * 1000;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async setCache<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl || this.defaultCacheTtl);
  }

  async getCache<T>(key: string): Promise<T> {
    return (await this.cacheManager.get(key)) as T;
  }

  async deleteCache(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async getOrSetCache<T>(
    key: string,
    callback: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    const cachedValue = await this.cacheManager.get<T>(key);
    if (cachedValue) return cachedValue;
    const result = await callback();
    await this.cacheManager.set(key, result, ttl || this.defaultCacheTtl);
    return result;
  }
}
