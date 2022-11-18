import { Injectable } from '@nestjs/common';

// import { DefaultToken } from '../modules/network/entities/default-token.entity';
// import { Network } from '../modules/network/entities/network.entity';
import { parseJSON } from '../shared/helpers/utils.helper';
import { RedisService } from '../shared/redis/redis.service';
import { ECacheKey } from './cache.constant';

@Injectable()
export class CacheService {
  constructor(private readonly cache: RedisService) {}

  async getAsJson(key: string): Promise<Record<string, unknown> | null> {
    const data = (await this.cache.get(key)) as any;
    return parseJSON(data);
  }

  async set(key: string, value: string): Promise<void> {
    await this.cache.set(key, value);
  }

  async deleteCache(key: string): Promise<void> {
    await this.cache.del(key);
  }

  async getCachedOrFetch<T>(key: string): Promise<T> {
    const cachedData = await this.getAsJson(key);
    if (cachedData) return cachedData as T;

    let data = null;

    switch (key) {
      case ECacheKey.NETWORK:
        data = await this.getNetworks();
        break;
      case ECacheKey.DEFAULT_TOKEN:
        data = await this.getDefaultToken();
        break;
      default: {
        throw new Error(`${key} is not cached`);
      }
    }

    await this.set(key, JSON.stringify(data));
    return data;
  }

  //return current network info in multichain platform
  private async getNetworks(): Promise<any> {
    return [];
    // return this.networkRepository.find({
    //   where: {
    //     isEnabled: true,
    //   },
    // });
  }

  //return current token info in multichain platform
  private async getDefaultToken(): Promise<any> {
    return [];
    // return this.defaultTokenRepository.find({
    //   where: {
    //     isEnabled: true,
    //   },
    // });
  }
}
