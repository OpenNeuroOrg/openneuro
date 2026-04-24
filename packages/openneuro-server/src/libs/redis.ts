/*eslint no-console: ["error", { allow: ["log"] }] */

// dependencies --------------------------------------------------
import Redis from "ioredis"
import Redlock from "redlock"
import config from "../config"

let _redis: Redis | null = null
let _redlock: Redlock | null = null

export function getRedis(): Redis {
  if (!_redis) _redis = new Redis(config.redis)
  return _redis
}

export function getRedlock(): Redlock {
  if (!_redlock) _redlock = new Redlock([getRedis()])
  return _redlock
}
