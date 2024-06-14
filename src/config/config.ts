import dotenv from 'dotenv'
import path from 'path'
import Joi from 'joi'

dotenv.config({ path: path.join(__dirname, '../../.env') })

interface EnvVars {
  NODE_ENV: 'production' | 'development'
  PORT: number
  MONGODB_URL: string
  MONGODB_NAME: string
  JWT_ACCESS_EXPIRATION_MINUTES: string
  JWT_REFRESH_EXPIRATION_DAYS: string
  SMTP_HOST: string
  SMTP_PORT: number
  SMTP_USERNAME: string
  SMTP_PASSWORD: string
  EMAIL_FROM: string
  REDIS_HOST: string
  REDIS_PORT: number
  REDIS_PASSWORD: string
  OTP_EXPIRE_MINUTE: number
  SOCKET_PORT: number
}

const envVarsSchema = Joi.object<EnvVars>()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development').required(),
    PORT: Joi.number().default(5000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    MONGODB_NAME: Joi.string().required().description('Mongo DB Name'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.string().description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.string().description('days after which refresh tokens expire')
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
    options: {
      dbName: envVars.MONGODB_NAME
    }
  },
  jwt: {
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS
  }
}
