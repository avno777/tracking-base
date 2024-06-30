import * as cron from 'node-cron'
import * as fs from 'fs'
import * as crypto from 'crypto'
import AuthService from '../services/auth.service'
import { redis as redisClient } from '../configs/redis'

//const { redis: redisClient } = redisConfig
const PUBLIC_KEYS_KEY = 'publicKeys'

async function addPublicKeyToRedis(publicKey: any) {
  const publicKeyString = publicKey.toString()
  const publicKeys = await redisClient.lrange(PUBLIC_KEYS_KEY, 0, -1)

  if (publicKeys.length === 2) {
    await redisClient.lpop(PUBLIC_KEYS_KEY)
  }

  await redisClient.rpush(PUBLIC_KEYS_KEY, publicKeyString)
}

// Define the cron job function
async function generateKeyPairAndSave() {
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  })

  await addPublicKeyToRedis(publicKey)
  await fs.writeFileSync('privateKey.pem', privateKey)

  await AuthService.updatePrivateKey()
  await AuthService.updatePublicKey()
}

// Run the cron job immediately when the application starts
generateKeyPairAndSave()

// Schedule the cron job to run at midnight every Sunday
cron.schedule('0 0 * * 0', generateKeyPairAndSave)
