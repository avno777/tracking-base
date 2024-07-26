import { Request, Response, NextFunction } from 'express'
import authService from '../services/auth.service'
import { catchAsync } from '~/utils/catchAsync'
import AccountModel from '~/models/database/accounts.models'
import { response200, response201, response400, response500 } from '~/utils/apiResponse'
import jsonRes from '~/utils/jsonRes'

const AuthController = {
  registerController: async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { fullname, email, password } = req.body
      const user = await authService.findByKeyword({ email }, 'email')
      const hashedPassword = await authService.hashedPassword(password)
      if (user && user.isActive === true) {
        //return res.status(404).json({ message: 'Email is already existed and activated !!!' })
        return response400(res, jsonRes.EMAIL_ALREADY_EXISTS)
      } else if (user && user.isActive === false) {
        await authService.changePassword(email, hashedPassword)
        await authService.otpVerifyAccount(user)
        //return res.status(201).json({ message: 'Email is already existed and not activated !!!', email: { email } })
        return response201(res, jsonRes.REGISTERED_SUCCESSFULLY, { email: email })
      }
      const newUser = await authService.createUser({
        fullname,
        email,
        password: hashedPassword
      })
      //console.log(jsonRes.jsonRes.REGISTERED_SUCCESSFULLY.statusCode)
      //return res.status(201).json({ message: 'User registered successfully', email: { email } })
      return response201(res, jsonRes.REGISTERED_SUCCESSFULLY, { email: newUser.email })
    } catch (error: any) {
      //return res.status(500).json({ error: error.message })
      return response500(res, jsonRes.INTERNAL_SERVER_ERROR)
    }
  },
  active: async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { otp, email } = req.body
      // const { error } = await activeSchema.validate({ otp, email });
      // if (error) return response400(res, jsonRes.INVALID_INFORMATION);
      const user = await authService.findByCriteria({ email }, '+otp otpTime isActive fullname email phone')
      if (!user) {
        //return res.status(404).json({ message: 'Account is not registered !!!' })
        return response400(res, jsonRes.ACCOUNT_NOT_REGISTERED)
      }
      // if (user.isDeleted) {
      //   res.status(400).json({ message: 'Account is not registed !!!' })
      //   //return response400(res, jsonRes.ACCOUNT_WAS_DELETED);
      // }
      if (user.isActive) {
        //return res.status(400).json({ message: 'Account was activated !!!' })
        return response400(res, jsonRes.ACCOUNT_WAS_ACTIVED)
      }
      if (user.otp !== otp) {
        //return res.status(400).json({ message: 'Otp is incorrect !!!' })
        return response400(res, jsonRes.OTP_IS_INCORRECT)
      }
      if (user.otpTime < Date.now()) {
        //return res.status(400).json({ message: 'Otp is expired !!!' })
        return response400(res, jsonRes.OTP_EXPIRED)
      }
      const { accessToken, refreshToken } = await authService.generateTokens(user._id)
      //const { _id, fullname, avatarUrl, phone, nationCode, address, city, country, state } = user
      await AccountModel.updateOne({ email }, { isActive: true, $push: { refreshTokens: refreshToken } })
      // return res.status(200).json({
      //   message: 'Activate successfully !!!',
      //   accessToken,
      //   refreshToken
      // })
      return response201(res, jsonRes.ACTIVE_SUCCESSFULLY, {
        accessToken,
        refreshToken
      })
    } catch (error: any) {
      return response500(res, jsonRes.INTERNAL_SERVER_ERROR)
    }
  },
  loginController: async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { email, password } = req.body
      //console.log('email', email)
      const user = await authService.findByKeyword({ email }, 'email')
      //console.log('user', user)
      if (!user) {
        //return res.status(404).json({ message: 'Email not found' })
        return response400(res, jsonRes.ACCOUNT_NOT_REGISTERED)
      }
      //if (user.isDeleted) return response400(res, jsonRes.ACCOUNT_WAS_DELETED);
      if (!user.isActive) {
        //return res.status(400).json({ message: 'Account is not activated !!!' })
        return response400(res, jsonRes.ACCOUNT_NOT_ACTIVATED)
      }
      if (!(await authService.isPasswordMatch(user, password))) {
        //return res.status(402).json({ message: 'Invalid password' })
        return response400(res, jsonRes.PASSWORD_INCORRECT)
      }
      if (!user._id) {
        throw new Error('User ID is undefined')
      }
      //const tokens = await authService.generateTokens(user._id, user.role)
      const { accessToken, refreshToken } = await authService.generateTokens(user._id)
      //console.log('accessToken: ', accessToken)
      //const { _id, fullname, avatarUrl, phone, nationCode, address, city, country, state } = user
      await authService.pushRefreshToken(user._id, refreshToken)
      // return res.status(200).json({
      //   message: 'Login successful !!!',
      //   accessToken: accessToken,
      //   refreshToken: refreshToken
      // })
      return response200(res, jsonRes.LOGIN_SUCCESSFUL, {
        accessToken,
        refreshToken
      })
    } catch (error: any) {
      //return res.status(500).json({ error: error.message })
      return response500(res, jsonRes.INTERNAL_SERVER_ERROR)
    }
  },
  changePasswordController: async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { email, password } = req.body
      const user = await authService.findByKeyword({ email }, 'email')
      if (!user) {
        //return res.status(404).json({ message: 'Email not found' })
        return response400(res, jsonRes.ACCOUNT_NOT_REGISTERED)
      }
      const hashedPassword = await authService.hashedPassword(password)
      await authService.changePassword(email, hashedPassword)
      //return res.status(200).json({ message: 'Password changed successfully' })
      return response200(res, jsonRes.PASSWORD_CHANGE_SUCCESSFULLY)
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  },
  logoutController: async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { email } = req.body
      await authService.logout(email)
      //return res.status(200).json({ message: 'Logout successful' })
      return response200(res, jsonRes.LOGOUT_SUCCESSFULLY)
    } catch (error: any) {
      //return res.status(500).json({ error: error.message })
      return response500(res, jsonRes.INTERNAL_SERVER_ERROR)
    }
  },
  refreshTokenController: async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { refreshToken } = req.body
      const accessToken = await authService.refreshToken(refreshToken)
      //return res.status(200).json({ message: 'Refresh token successfully', accessToken })
      return response200(res, jsonRes.REFRESH_SUCCESSFULLY, { accessToken, refreshToken })
    } catch (error: any) {
      return response500(res, jsonRes.INTERNAL_SERVER_ERROR)
    }
  },
  resetPassword: async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { email, password, newPassword } = req.body
      //const { error } = await resetPasswordSchema.validate({ email, password, newPassword });
      //if (error) return response400(res, jsonRes.INVALID_INFORMATION)
      // const user = await authService.findByCriteria({ email }, '+password')
      // if (!user) return response400(res, jsonRes.ACCOUNT_NOT_REGISTERED)
      const user = await authService.findByKeyword({ email }, 'email')
      if (!user) {
        //return res.status(404).json({ message: 'Email not found' })
        return response400(res, jsonRes.ACCOUNT_NOT_REGISTERED)
      }
      const isPasswordCorrect = await authService.isPasswordMatch(user, password)
      if (!isPasswordCorrect) return response400(res, jsonRes.PASSWORD_INCORRECT)
      const hashPassword = await authService.hashedPassword(newPassword)
      await authService.updateOneUser({ email }, { password: hashPassword })
      //return res.status(200).json({ message: 'Password changed successfully' })
      return response200(res, jsonRes.PASSWORD_CHANGE_SUCCESSFULLY)
    } catch (error: any) {
      return response500(res, jsonRes.INTERNAL_SERVER_ERROR)
    }
  },
  sendOtpForGot: async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { email } = req.body
      // const { error } = await emailSchema.validate({ email })
      // if (error) return response400(res, jsonRes.INVALID_INFORMATION)
      await authService.otpForGot(email)
      //return res.status(200).json({ message: 'Send OTP successfully' })
      return response200(res, jsonRes.SEND_OTP_SUCCESSFULLY)
    } catch (error: any) {
      return response500(res, jsonRes.INTERNAL_SERVER_ERROR)
    }
  },
  verifyOtpForGot: async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { otp, email } = req.body
      // const { error } = await activeSchema.validate({ otp, email })
      // if (error) return response400(res, jsonRes.INVALID_INFORMATION)
      const user = await authService.findByCriteria({ email }, '+otp otpTime isDeleted isActive')
      if (!user) {
        //return res.status(404).json({ message: 'Account is not registered !!!' })
        return response400(res, jsonRes.ACCOUNT_NOT_REGISTERED)
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
        //return res.status(400).json({ message: 'Otp is incorrect !!!' })
        return response400(res, jsonRes.OTP_IS_INCORRECT)
      }
      if (user.otpTime < Date.now()) {
        //return res.status(400).json({ message: 'Otp is expired !!!' })
        return response400(res, jsonRes.OTP_EXPIRED)
      }
      if (!user.isActive) {
        await authService.updateOneUser({ email }, { isActive: true })
      }
      //return res.status(200).json({ message: 'Verify OTP successfully', data: { otp, email } })
      return response200(res, jsonRes.VERIFY_OTP_SUCCESSFULLY, { otp, email })
    } catch (error: any) {
      return response500(res, jsonRes.INTERNAL_SERVER_ERROR)
    }
  }
}

export default AuthController
