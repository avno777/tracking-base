import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import fs from 'fs'
import crypto from 'crypto'
import dotenv from 'dotenv'
import accountModel from '../models/database/accounts.models'
import { IAccount } from '../models/database/accounts.models'
import { redis as redisClient } from '../configs/redis'
import { config } from '../configs/config'

dotenv.config()
interface UserBody {
  fullname: string
  email: string
  password: string
}

let privateKey: crypto.KeyObject
let publicKey0: crypto.KeyObject
let publicKey1: crypto.KeyObject

const AuthService = {
  updatePrivateKey: async () => {
    const privateKeyString = await fs.readFileSync('privateKey.pem', 'utf8')
    privateKey = crypto.createPrivateKey(privateKeyString)
  },
  updatePublicKey: async () => {
    const publicKeyString = await redisClient.lrange('publicKeys', 0, -1)
    publicKey0 = crypto.createPublicKey(publicKeyString[0])
    publicKey1 = crypto.createPublicKey(publicKeyString[1])
  },
  hashedPassword: async (password: string): Promise<string> => {
    const salt: string = await bcrypt.genSalt(10)
    const hashedPassword: string = await bcrypt.hash(password, salt)
    return hashedPassword
  },

  isPasswordMatch: async (user: IAccount, password: string): Promise<boolean> => {
    const isMatch: boolean = await bcrypt.compare(password, user.password)
    return isMatch
  },

  findByKeyword: async (keyword: object, fields: string): Promise<IAccount | null> => {
    const allowedFields: string[] = ['_id', 'email']
    const keywordKeys: string[] = Object.keys(keyword)

    const invalidFields: string[] = keywordKeys.filter((key) => !allowedFields.includes(key))
    if (invalidFields.length > 0) {
      throw new Error(`Invalid fields: ${invalidFields.join(', ')}`)
    }

    const user: IAccount | null = await accountModel.findOne(keyword).lean().select(fields)
    return user
  },

  createUser: async (userBody: UserBody): Promise<IAccount> => {
    const newUser: UserBody = {
      fullname: userBody.fullname,
      email: userBody.email,
      password: userBody.password
    }

    const user: IAccount = await accountModel.create(newUser)
    return user
  },

  // setLogin: async (username: string): Promise<void> => {
  //   await accountModel.updateOne({ username }, { isLogin: true })
  // },

  generateTokens: async (_id: string, role: string) => {
    const [accessToken, refreshToken] = await Promise.all([
      jwt.sign({ _id, role }, privateKey, { expiresIn: config.jwt.accessExpirationMinutes, algorithm: 'RS256' }),
      jwt.sign({ _id, role }, privateKey, { expiresIn: config.jwt.refreshExpirationDays, algorithm: 'RS256' })
    ])

    return {
      accessToken,
      refreshToken
    }
  },
  pushRefreshToken: async (_id: string, refreshToken: string) => {
    await accountModel.updateOne(
      { _id },
      {
        $push: {
          refreshTokens: {
            $each: [refreshToken],
            $slice: -2
          }
        }
      }
    )
  },

  logout: async (email: string) => {
    await accountModel.updateMany({ email }, { $unset: { refreshTokens: 1 } })
  },

  refreshToken: async (refreshToken: string) => {
    let decoded: any

    try {
      decoded = jwt.verify(refreshToken, publicKey0, { algorithms: ['RS256'] })
    } catch (error) {
      decoded = jwt.verify(refreshToken, publicKey1, { algorithms: ['RS256'] })
    }

    const accessToken = jwt.sign({ _id: decoded._id }, privateKey, {
      expiresIn: config.jwt.accessExpirationMinutes,
      algorithm: 'RS256'
    })
    return accessToken
  },

  changePassword: async (email: string, password: string) => {
    const hashPassword = await AuthService.hashedPassword(password)
    await accountModel.updateOne({ email }, { password: hashPassword })
  },

  verifyAccessToken: async (accessToken: string) => {
    try {
      return jwt.verify(accessToken, publicKey0, { algorithms: ['RS256'] })
    } catch (error) {
      return jwt.verify(accessToken, publicKey1, { algorithms: ['RS256'] })
    }
  }
}

export default AuthService
