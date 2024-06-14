import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import fs from 'fs'
import crypto from 'crypto'
import mongoose from 'mongoose'
import accountModel from '../models/database/accounts.models'
import { IAccount } from '../models/database/accounts.models'
import { config } from '../config/config'

// let privateKey: crypto.KeyObject
// let publicKey0: crypto.KeyObject
// let publicKey1: crypto.KeyObject

// const authService = {
//   updatePrivateKey: async () => {
//     const privateKeyString =
//       'avsndbihfvaiusdfhbgosaiudfhvgsuifodhvaoiwusdfhgvauisdnbfvus9dhbnvi23ier89122jh4rt890yw3rcvn3hn897yc'
//     privateKey = crypto.createPrivateKey(privateKeyString)
//   },
//   updatePublicKey: async () => {
//     const publicKeyString = [
//       'dfqojiwihj4rfu8394tryuq98wcrehtg98qwrh9tgbnwq39q8tqy43797htrc9834yt9823yi24h39ur23249rtyu9384ytr928342ch9t2345nt982324598cty238945tcynm83w45ctyh832224mx29354ytc893245yn893472hn57tg84352cn5g7yc783245ynmx278tgy',
//       'ncaweuisofhqpwejqf890q343cumrx89234ytxc77822y534xt978y2938745yxtg872x2x345tyg78972345yutg9822xy3u45t8g9324y78t9yu3245789tygh783t452yhtgtg78532452yhtg9734yt942m325gh93452g7n'
//     ]
//     publicKey0 = crypto.createPublicKey(publicKeyString[0])
//     publicKey1 = crypto.createPublicKey(publicKeyString[1])
//   },

//   findByKeyword: async (keyword: object, fields: string): Promise<User | null> => {
//     const allowedFields: string[] = ['_id', 'email']
//     const keywordKeys: string[] = Object.keys(keyword)

//     const invalidFields: string[] = keywordKeys.filter((key) => !allowedFields.includes(key))
//     if (invalidFields.length > 0) {
//       throw new Error(`Invalid fields: ${invalidFields.join(', ')}`)
//     }

//     const user: User | null = await accountModel.findOne(keyword).lean().select(fields)
//     return user
//   },

//   updateOneUser: async (criteria: Record<string, unknown>, update: Record<string, unknown>) => {
//     const allowedFields = ['email', 'phone', '_id', 'username', 'otp']

//     const invalidFields = _.difference(_.keys(criteria), allowedFields)
//     if (!_.isEmpty(invalidFields)) {
//       throw new Error(`Invalid fields: ${invalidFields.join(', ')}`)
//     }

//     const user = await accountModel.updateOne(criteria, update)
//     return user
//   },

//   updateManyUser: async (criteria: Record<string, unknown>, update: Record<string, unknown>) => {
//     const allowedFields = ['email', 'phone', '_id', 'username', 'otp']

//     const invalidFields = _.difference(_.keys(criteria), allowedFields)
//     if (!_.isEmpty(invalidFields)) {
//       throw new Error(`Invalid fields: ${invalidFields.join(', ')}`)
//     }

//     const user = await accountModel.updateMany(criteria, update)
//     return user
//   },

//   isPasswordMatch: async (user: any, password: string) => {
//     return bcrypt.compare(password, user.password)
//   },

//   pushRefreshToken: async (_id: mongoose.Types.ObjectId, refreshToken: string) => {
//     await accountModel.updateOne(
//       { _id },
//       {
//         $push: {
//           refreshTokens: {
//             $each: [refreshToken],
//             $slice: -2
//           }
//         }
//       }
//     )
//   },

//   hashPassword: async (password: string) => {
//     const salt = await bcrypt.genSalt(10)
//     const hashPassword = await bcrypt.hash(password, salt)
//     return hashPassword
//   },

//   createUser: async (userBody: any) => {
//     const timestamp = Math.floor(new Date().getTime())
//     const randomNum = Math.floor(Math.random() * 1000)

//     const [nameColor, randomGradientColor, username, hashPassword] = await Promise.all([
//       randomColor({ luminosity: 'dark' }),
//       getRandomColor(),
//       `${timestamp}${randomNum}`,
//       authService.hashPassword(userBody.password)
//     ])

//     const newUser = {
//       ...userBody,
//       password: hashPassword,
//       username,
//       nameColor,
//       avatarColor: randomGradientColor.name
//     }

//     const user = await accountModel.create(newUser)

//     // Assume authService.otpVerifyAccount is a method that exists
//     await authService.otpVerifyAccount(user)

//     return user
//   },

//   generateTokens: async (_id: mongoose.Types.ObjectId) => {
//     const [accessToken, refreshToken] = await Promise.all([
//       jwt.sign({ _id }, privateKey, { expiresIn: config.jwt.accessExpirationMinutes, algorithm: 'RS256' }),
//       jwt.sign({ _id }, privateKey, { expiresIn: config.jwt.refreshExpirationDays, algorithm: 'RS256' })
//     ])

//     return {
//       accessToken,
//       refreshToken
//     }
//   },

//   logout: async (email: string) => {
//     await accountModel.updateMany({ email }, { $unset: { refreshTokens: 1 } })
//   },

//   refreshToken: async (refreshToken: string) => {
//     let decoded: any

//     try {
//       decoded = jwt.verify(refreshToken, publicKey0, { algorithms: ['RS256'] })
//     } catch (error) {
//       decoded = jwt.verify(refreshToken, publicKey1, { algorithms: ['RS256'] })
//     }

//     const accessToken = jwt.sign({ _id: decoded._id }, privateKey, {
//       expiresIn: config.jwt.accessExpirationMinutes,
//       algorithm: 'RS256'
//     })
//     return accessToken
//   },

//   changePassword: async (email: string, password: string) => {
//     const hashPassword = await authService.hashPassword(password)
//     await accountModel.updateOne({ email }, { password: hashPassword })
//   },

//   verifyAccessToken: async (accessToken: string) => {
//     try {
//       return jwt.verify(accessToken, publicKey0, { algorithms: ['RS256'] })
//     } catch (error) {
//       return jwt.verify(accessToken, publicKey1, { algorithms: ['RS256'] })
//     }
//   }
// }

import dotenv from 'dotenv'

dotenv.config()

const secretKey: string = process.env.JWT_SECRET_KEY as string

interface UserBody {
  fullname: string
  email: string
  password: string
}

let privateKey: crypto.KeyObject
let publicKey0: crypto.KeyObject
let publicKey1: crypto.KeyObject

export const AuthService = {
  updatePrivateKey: async () => {
    const privateKeyString =
      'avsndbihfvaiusdfhbgosaiudfhvgsuifodhvaoiwusdfhgvauisdnbfvus9dhbnvi23ier89122jh4rt890yw3rcvn3hn897yc'
    privateKey = crypto.createPrivateKey(privateKeyString)
  },
  updatePublicKey: async () => {
    const publicKeyString = [
      'dfqojiwihj4rfu8394tryuq98wcrehtg98qwrh9tgbnwq39q8tqy43797htrc9834yt9823yi24h39ur23249rtyu9384ytr928342ch9t2345nt982324598cty238945tcynm83w45ctyh832224mx29354ytc893245yn893472hn57tg84352cn5g7yc783245ynmx278tgy',
      'ncaweuisofhqpwejqf890q343cumrx89234ytxc77822y534xt978y2938745yxtg872x2x345tyg78972345yutg9822xy3u45t8g9324y78t9yu3245789tygh783t452yhtgtg78532452yhtg9734yt942m325gh93452g7n'
    ]
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
