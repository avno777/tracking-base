import Redis from 'ioredis'
import { config } from './config'
import logger from './logger'

const redis = new Redis({
  port: config.redis.port,
  host: config.redis.host,
  password: config.redis.password
})

const publisher = redis.duplicate()
const subscriber = redis.duplicate()

logger.info('Connected to redis server')

export { redis, publisher, subscriber }
