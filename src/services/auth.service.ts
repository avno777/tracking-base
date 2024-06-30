import bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import fs from 'fs'
import crypto from 'crypto'
//import mongoose from 'mongoose'
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

export const AuthService = {
  // updatePrivateKey: async () => {
  //   const privateKeyString =
  //     'avsndbihfvaiusdfhbgosaiudfhvgsuifodhvaoiwusdfhgvauisdnbfvus9dhbnvi23ier89122jh4rt890yw3rcvn3hn897yc'
  //   privateKey = crypto.createPrivateKey(privateKeyString)
  // },
  // updatePublicKey: async () => {
  //   const publicKeyString = [
  //     'dfqojiwihj4rfu8394tryuq98wcrehtg98qwrh9tgbnwq39q8tqy43797htrc9834yt9823yi24h39ur23249rtyu9384ytr928342ch9t2345nt982324598cty238945tcynm83w45ctyh832224mx29354ytc893245yn893472hn57tg84352cn5g7yc783245ynmx278tgy',
  //     'ncaweuisofhqpwejqf890q343cumrx89234ytxc77822y534xt978y2938745yxtg872x2x345tyg78972345yutg9822xy3u45t8g9324y78t9yu3245789tygh783t452yhtgtg78532452yhtg9734yt942m325gh93452g7n'
  //   ]
  //   publicKey0 = crypto.createPublicKey(publicKeyString[0])
  //   publicKey1 = crypto.createPublicKey(publicKeyString[1])
  // },
  updatePrivateKey: async () => {
    const privateKeyString = await fs.readFileSync('privateKey.pem', 'utf8')
    privateKey = crypto.createPrivateKey(privateKeyString)
  },
  updatePublicKey: async () => {
    // const publicKeyString = [
    //   'dfqojiwihj4rfu8394tryuq98wcrehtg98qwrh9tgbnwq39q8tqy43797htrc9834yt9823yi24h39ur23249rtyu9384ytr928342ch9t2345nt982324598cty238945tcynm83w45ctyh832224mx29354ytc893245yn893472hn57tg84352cn5g7yc783245ynmx278tgy',
    //   'ncaweuisofhqpwejqf890q343cumrx89234ytxc77822y534xt978y2938745yxtg872x2x345tyg78972345yutg9822xy3u45t8g9324y78t9yu3245789tygh783t452yhtgtg78532452yhtg9734yt942m325gh93452g7n'
    // ]
    const publicKeyString = await redisClient.lrange('publicKeys', 0, -1)
    publicKey0 = crypto.createPublicKey(publicKeyString[0])
    publicKey1 = crypto.createPublicKey(publicKeyString[1])
  },
  hashedPassword: async (password: string): Promise<string> => {
    const salt: string = await bcrypt.genSalt(10)
    const hashedPassword: string = await bcrypt.hash(password, salt)
    return hashedPassword
  },

  isPasswordMatch: (user: IAccount, password: string) => {
    console.log('user', user.password)
    console.log('password', password)
    return bcrypt.compareSync(password, user.password)
  },

  findByKeyword: async (keyword: object, fields: string): Promise<IAccount | null> => {
    // const allowedFields: string[] = ['_id', 'email']
    // const keywordKeys: string[] = Object.keys(keyword)

    // const invalidFields: string[] = keywordKeys.filter((key) => !allowedFields.includes(key))
    // if (invalidFields.length > 0) {
    //   throw new Error(`Invalid fields: ${invalidFields.join(', ')}`)
    // }

    const user: IAccount | null = await AccountModel.findOne(keyword).lean()
    console.log('user', user)
    return user
  },

  createUser: async (userBody: UserBody): Promise<IAccount> => {
    const newUser: UserBody = {
      fullname: userBody.fullname,
      email: userBody.email,
      password: userBody.password
    }

    const user: IAccount = await AccountModel.create(newUser)
    return user
  },

  // setLogin: async (username: string): Promise<void> => {
  //   await AccountModel.updateOne({ username }, { isLogin: true })
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
    console.log('id', _id)
    console.log('refreshToken', refreshToken)
    return await AccountModel.updateOne(
      { _id },
      {
        $push: {
          refreshToken: {
            $each: [refreshToken],
            $slice: -2
          }
        }
      }
    )
  },

  logout: async (email: string) => {
    await AccountModel.updateMany({ email }, { $unset: { refreshToken: 1 } })
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
    await AccountModel.updateOne({ email }, { password: hashPassword })
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
