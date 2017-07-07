/*eslint no-console: ["error", { allow: ["log"] }] */

// dependencies --------------------------------------------------
import Redis from 'ioredis';
import config from '../config';

export default {
    redis: new Redis(config.redis),
}
