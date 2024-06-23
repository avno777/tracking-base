import * as cron from 'node-cron'
import * as fs from 'fs'
import * as crypto from 'crypto'
import { AuthService } from '../services/auth.service'
import { redis as redisClient } from '../configs/redis'

//const { redis: redisClient } = redisConfig
const PUBLIC_KEYS_KEY = 'publicKeys'

async function addPublicKeyToRedis(publicKey: crypto.KeyObject) {
  const publicKeyString = publicKey.export({ type: 'spki', format: 'pem' }).toString()
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
  const publicKeyObject = crypto.createPublicKey({
    key: Buffer.from(publicKey, 'base64'),
    format: 'der',
    type: 'spki'
  })

  await addPublicKeyToRedis(publicKeyObject)
  await fs.promises.writeFile('privateKey.pem', privateKey)

  await AuthService.updatePrivateKey()
  await AuthService.updatePublicKey()
}

// Run the cron job immediately when the application starts
generateKeyPairAndSave()

// Schedule the cron job to run at midnight every Sunday
cron.schedule('0 0 * * 0', generateKeyPairAndSave)
