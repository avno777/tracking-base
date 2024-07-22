import bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import fs from 'fs'
import crypto from 'crypto'
import dotenv from 'dotenv'
import _ from 'lodash'
import accountModel from '../models/database/accounts.models'
import { IAccount } from '../models/database/accounts.models'
import { redis as redisClient } from '../configs/redis'
import { config } from '../configs/config'
import { sendEmail } from './email.service'
import { getRandomOTP } from '~/helpers/getOtp'
import { emailTemplate } from '~/utils/emailTemplate'

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

    const user: IAccount | null = await accountModel.findOne(keyword).lean()
    console.log('user', user)
    return user
  },
  findByCriteria: async (criteria: Record<string, any>, fields: string): Promise<any> => {
    const allowedFields = ['email', 'phone', '_id', 'username']

    const invalidFields = _.difference(_.keys(criteria), allowedFields)
    if (!_.isEmpty(invalidFields)) {
      throw new Error(`Invalid fields: ${invalidFields.join(', ')}`)
    }
    const user = await accountModel.findOne(criteria).lean().select(fields)
    return user
  },

  createUser: async (userBody: UserBody): Promise<IAccount> => {
    const newUser: UserBody = {
      fullname: userBody.fullname,
      email: userBody.email,
      password: userBody.password
    }

    const user: IAccount = await accountModel.create(newUser)
    await AuthService.otpVerifyAccount(user)
    return user
  },

  // setLogin: async (username: string): Promise<void> => {
  //   await accountModel.updateOne({ username }, { isLogin: true })
  // },

  generateTokens: async (_id: string) => {
    const [accessToken, refreshToken] = await Promise.all([
      jwt.sign({ _id }, privateKey, { expiresIn: config.jwt.accessExpirationMinutes, algorithm: 'RS256' }),
      jwt.sign({ _id }, privateKey, { expiresIn: config.jwt.refreshExpirationDays, algorithm: 'RS256' })
    ])

    return {
      accessToken,
      refreshToken
    }
  },
  pushRefreshToken: async (_id: string, refreshToken: string) => {
    console.log('id', _id)
    console.log('refreshToken', refreshToken)
    return await accountModel.updateOne(
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
    await accountModel.updateMany({ email }, { $unset: { refreshToken: 1 } })
  },

  // refreshToken: async (refreshToken: string) => {
  //   let decoded: any

  //   try {
  //     decoded = jwt.verify(refreshToken, publicKey0, { algorithms: ['RS256'] })
  //   } catch (error) {
  //     decoded = jwt.verify(refreshToken, publicKey1, { algorithms: ['RS256'] })
  //   }

  //   const accessToken = jwt.sign({ _id: decoded._id }, privateKey, {
  //     expiresIn: config.jwt.accessExpirationMinutes,
  //     algorithm: 'RS256'
  //   })
  //   return accessToken
  // },

  refreshToken: async (refreshToken: string) => {
    let decoded: any

    try {
      decoded = jwt.verify(refreshToken, publicKey0, { algorithms: ['RS256'] })
    } catch (error) {
      try {
        decoded = jwt.verify(refreshToken, publicKey1, { algorithms: ['RS256'] })
      } catch (error) {
        throw new Error('Invalid refresh token')
      }
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
  updateOneUser: async (criteria: any, update: any) => {
    const allowedFields = ['email', 'phone', '_id', 'username', 'address', 'city', 'country', 'state']

    const invalidFields = _.difference(_.keys(criteria), allowedFields)
    if (!_.isEmpty(invalidFields)) {
      throw new Error(`Invalid fields: ${invalidFields.join(', ')}`)
    }

    const user = await accountModel.updateOne(criteria, update)
    return user
  },
  verifyAccessToken: async (accessToken: string) => {
    try {
      return jwt.verify(accessToken, publicKey0, { algorithms: ['RS256'] })
    } catch (error) {
      return jwt.verify(accessToken, publicKey1, { algorithms: ['RS256'] })
    }
  },
  otpVerifyAccount: async (user: { email: string; fullname: string }): Promise<void> => {
    const otp: number = getRandomOTP()
    const otpTime = new Date()
    otpTime.setMinutes(otpTime.getMinutes() + config.otp.exTime)

    await accountModel.updateOne({ email: user.email }, { otp, otpTime })

    await sendEmail(
      user.email,
      `${otp} là mã kích hoạt tài khoản của bạn`,
      emailTemplate.getOtpHtml(otp, user.fullname)
    )
  },

  otpForGot: async (email: string): Promise<void> => {
    const otp: number = getRandomOTP()
    const otpTime = new Date()
    otpTime.setMinutes(otpTime.getMinutes() + config.otp.exTime)

    await accountModel.updateOne({ email }, { otp, otpTime })
    const { fullname } = await AuthService.findByCriteria({ email }, 'fullname')
    await sendEmail(email, `${otp} là mã OTP khôi phục mật khẩu của bạn`, emailTemplate.getOtpHtml(otp, fullname))
  }
}

export default AuthService
