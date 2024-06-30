import dotenv from 'dotenv'
import path from 'path'
import Joi from 'joi'

dotenv.config({ path: path.join(__dirname, '../../.env') })

interface EnvVars {
  NODE_ENV: 'production' | 'development'
  PORT: number
  MONGODB_URL: string
  MONGODB_HOST: string
  MONGODB_PORT: number
  MONGODB_NAME: string
  JWT_ACCESS_EXPIRATION_MINUTES: string
  JWT_REFRESH_EXPIRATION_DAYS: string
  REDIS_HOST: string
  REDIS_PORT: number
  REDIS_PASSWORD: string
  LOG_FORMAT: string
  LOG_DIR: string
}

const envVarsSchema = Joi.object<EnvVars>()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development').required(),
    PORT: Joi.number().default(5000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    MONGODB_HOST: Joi.string().required().description('Mongo DB url'),
    MONGODB_PORT: Joi.number().required().default(27017).description('Mongo DB url'),
    MONGODB_NAME: Joi.string().required().description('Mongo DB Name'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.string().description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.string().description('days after which refresh tokens expire'),
    REDIS_HOST: Joi.string().description('Redis host'),
    REDIS_PORT: Joi.number().description('Redis port'),
    REDIS_PASSWORD: Joi.string().description('Redis password'),
    LOG_FORMAT: Joi.string().description('logger format'),
    LOG_DIR: Joi.string().description('logger directory')
  })
  .unknown()

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

export const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL,
    host: envVars.MONGODB_HOST,
    port: envVars.MONGODB_PORT,
    database: envVars.MONGODB_NAME
  },
  jwt: {
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS
  },
  redis: {
    host: envVars.REDIS_HOST,
    port: envVars.REDIS_PORT,
    password: envVars.REDIS_PASSWORD
  },
  log: {
    format: envVars.LOG_FORMAT,
    dir: envVars.LOG_DIR
  }
}
