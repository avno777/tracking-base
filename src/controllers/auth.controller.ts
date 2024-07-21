import { Request, Response, NextFunction } from 'express'
import authService from '../services/auth.service'
import { catchAsync } from '~/utils/catchAsync'
import AccountModel from '~/models/database/accounts.models'

const AuthController = {
  registerController: async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { fullname, email, password } = req.body
      const user = await authService.findByKeyword({ email }, 'email')
      if (user) {
        return res.status(404).json({ message: 'Email existed !!!' })
      }
      const hashedPassword = await authService.hashedPassword(password)
      const newUser = await authService.createUser({
        fullname,
        email,
        password: hashedPassword
      })

      return res.status(201).json({ message: 'User registered successfully', email: { email } })
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  },
  active: async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { otp, email } = req.body
    // const { error } = await activeSchema.validate({ otp, email });
    // if (error) return response400(res, jsonRes.INVALID_INFORMATION);
    const user = await authService.findByCriteria({ email }, '+otp otpTime isActive fullName email phone')
    if (!user) {
      return res.status(404).json({ message: 'Account is not registed !!!' })
    }
    // if (user.isDeleted) {
    //   res.status(400).json({ message: 'Account is not registed !!!' })
    //   //return response400(res, jsonRes.ACCOUNT_WAS_DELETED);
    // }
    if (user.isActive) {
      return res.status(400).json({ message: 'Account was actived !!!' })
      //return response400(res, jsonRes.ACCOUNT_WAS_ACTIVED);
    }
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Otp is incorrect !!!' })
      //return response400(res, jsonRes.OTP_IS_INCORRECT);
    }
    if (user.otpTime < Date.now()) {
      return res.status(400).json({ message: 'Otp is expired !!!' })
      //return response400(res, jsonRes.OTP_EXPIRED);
    }
    const { accessToken, refreshToken } = await authService.generateTokens(user._id)
    const { _id, fullname, avatarUrl, phone, nationCode, address, city, country, state } = user
    await AccountModel.updateOne({ email }, { isActive: true, $push: { refreshTokens: refreshToken } })
    return res.status(200).json({
      message: 'Active successfully !!!',
      accessToken,
      refreshToken,
      user: { _id, fullname, avatarUrl, phone, nationCode, address, city, country, state }
    })
    // return response201(res, jsonRes.ACTIVE_SUCCESSFULLY, {
    //   accessToken,
    //   refreshToken,
    //   user: { _id, fullName, email, phone, username, avatarUrl, avatarColor, coverImage, nameColor, id: _id },
    // });
  },
  loginController: async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { email, password } = req.body
      console.log('email', email)
      const user = await authService.findByKeyword({ email }, 'email')
      console.log('user', user)
      if (!user) {
        return res.status(404).json({ message: 'Email not found' })
      }
      //if (user.isDeleted) return response400(res, jsonRes.ACCOUNT_WAS_DELETED);
      if (!user.isActive) {
        return res.status(400).json({ message: 'Account is not active !!!' })
      }
      if (!(await authService.isPasswordMatch(user, password))) {
        return res.status(402).json({ message: 'Invalid password' })
      }
      if (!user._id) {
        throw new Error('User ID is undefined')
      }
      //const tokens = await authService.generateTokens(user._id, user.role)
      const { accessToken, refreshToken } = await authService.generateTokens(user._id)
      console.log('accessToken: ', accessToken)
      const { _id, fullname, avatarUrl, phone, nationCode, address, city, country, state } = user
      await authService.pushRefreshToken(user._id, refreshToken)
      return res.status(200).json({
        message: 'Login successful !!!',
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: { _id, fullname, avatarUrl, phone, nationCode, address, city, country, state }
      })
    } catch (error: any) {
      console.log('error', error)
      return res.status(500).json({ error: error.message })
    }
  },
  changePasswordController: async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { email, password } = req.body
      const user = await authService.findByKeyword({ email }, 'email')
      if (!user) {
        return res.status(404).json({ message: 'Username not found' })
      }
      const hashedPassword = await authService.hashedPassword(password)
      await authService.changePassword(email, hashedPassword)
      return res.status(200).json({ message: 'Password changed successfully' })
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  },
  logoutController: async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { email } = req.body
      await authService.logout(email)
      return res.status(200).json({ message: 'Logout successful' })
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  },
  refreshTokenController: async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const accessToken = await authService.refreshToken(req.body.refreshToken)
    return res.status(200).json({ message: 'Refresh token successfully', accessToken })
  },
  resetPassword: async (req: Request, res: Response): Promise<Response | void> => {
    const { email, password, newPassword } = req.body
    //const { error } = await resetPasswordSchema.validate({ email, password, newPassword });
    //if (error) return response400(res, jsonRes.INVALID_INFORMATION)
    // const user = await authService.findByCriteria({ email }, '+password')
    // if (!user) return response400(res, jsonRes.ACCOUNT_NOT_REGISTERED)
    const user = await authService.findByKeyword({ email }, 'email')
    if (!user) {
      return res.status(404).json({ message: 'Username not found' })
    }
    const isPasswordCorrect = await authService.isPasswordMatch(user, password)
    if (!isPasswordCorrect) return res.status(400).json({ message: 'Password incorrect !!!' })
    const hashPassword = await authService.hashedPassword(newPassword)
    await authService.updateOneUser({ email }, { password: hashPassword })
    return res.status(200).json({ message: 'Password changed successfully' })
  },
  sendOtpForGot: async (req: Request, res: Response): Promise<Response | void> => {
    const { email } = req.body
    // const { error } = await emailSchema.validate({ email })
    // if (error) return response400(res, jsonRes.INVALID_INFORMATION)
    await authService.otpForGot(email)
    return res.status(200).json({ message: 'Send OTP successfully' })
    //return response200(res, jsonRes.SEND_OTP_SUCCESSFULLY)
  },

  verifyOtpForGot: async (req: Request, res: Response): Promise<Response | void> => {
    const { otp, email } = req.body
    // const { error } = await activeSchema.validate({ otp, email })
    // if (error) return response400(res, jsonRes.INVALID_INFORMATION)
    const user = await authService.findByCriteria({ email }, '+otp otpTime isDeleted isActive')
    if (!user) {
      return res.status(404).json({ message: 'Account is not registed !!!' })
    }
    // if (user.isDeleted) {
    //   res.status(400).json({ message: 'Account is not registed !!!' })
    //   //return response400(res, jsonRes.ACCOUNT_WAS_DELETED);
    // }
    // if (!user.isActive) {
    //   return res.status(400).json({ message: 'Account is not active !!!' })
    //   return response400(res, jsonRes.ACCOUNT_WAS_ACTIVED);
    // }
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Otp is incorrect !!!' })
      //return response400(res, jsonRes.OTP_IS_INCORRECT);
    }
    if (user.otpTime < Date.now()) {
      return res.status(400).json({ message: 'Otp is expired !!!' })
      //return response400(res, jsonRes.OTP_EXPIRED);
    }
    if (!user.isActive) {
      await authService.updateOneUser({ email }, { isActive: true })
    }
    return res.status(200).json({ message: 'Verify OTP successfully', data: { otp, email } })
    //return response200(res, jsonRes.VERIFY_OTP_SUCCESSFULLY, { otp, email })
  }
}

export default AuthController
