/*eslint no-console: ["error", { allow: ["log"] }] */

// dependencies --------------------------------------------------
import Redis from "ioredis"
import Redlock from "redlock"
import config from "../config"

export const redis = new Redis(config.redis)
export const redlock = new Redlock([redis])
