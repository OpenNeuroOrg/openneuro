import { Redis } from 'ioredis'
import zlib from 'zlib'
import { promisify } from 'util'
import { CacheType } from './types'
export { CacheType } from './types'

const compress = promisify(zlib.brotliCompress)
const decompress = promisify(zlib.brotliDecompress)

/**
 * Given a set of values, produce a key which uniquely identifies them
 * @param composites Values needed to index into this cache
 */
export function cacheKey(
  type: CacheType,
  compositeKeys: Array<string>,
): string {
  return `${type.toString()}:${compositeKeys.join(':')}`
}

/**
 * Cache items related to datasets
 */
export default class CacheItem {
  type: CacheType
  key: string
  expiration = 0
  private redis: Redis
  /**
   *
   * @param redis ioredis client
   * @param type A CacheType value
   * @param compositeKeys Values identifying this cache key
   * @param expiration Seconds to keep this key
   */
  constructor(
    redis: Redis,
    type: CacheType,
    compositeKeys?: Array<string>,
    expiration?: number,
  ) {
    this.redis = redis
    this.type = type
    this.expiration = expiration
    this.key = cacheKey(type, compositeKeys)
  }
  private serialize(value: object): Promise<Buffer> {
    return compress(JSON.stringify(value))
  }
  private async deserialize(value: Buffer): Promise<object> {
    const decompressed = await decompress(value)
    return JSON.parse(decompressed.toString())
  }
  public async get(miss: Function): Promise<object> {
    try {
      const data = await this.redis.getBuffer(this.key)
      if (data) {
        return this.deserialize(data)
      } else {
        // Call the cache miss function if we didn't get anything
        const data = await miss()
        const serialized = await this.serialize(data)
        // Allow for the simple case of aging out keys
        if (this.expiration > 0) {
          this.redis.setex(this.key, this.expiration, serialized)
        } else {
          this.redis.set(this.key, serialized)
        }
        return data
      }
    } catch {
      // Keep going as though we had a cache miss if there is a problem but don't cache it
      // TODO: Sentry reporting doesn't work here but should be fixed
      return miss()
    }
  }
  /**
   * Drop this key from Redis
   */
  public drop(): Promise<number> {
    return this.redis.del(this.key)
  }
}
