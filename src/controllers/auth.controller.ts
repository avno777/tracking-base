import { Request, Response, NextFunction } from 'express'
import authService from '../services/auth.service'

const AuthController = {
  registerController: async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { fullname, email, password } = req.body
      const user = await authService.findByKeyword({ email }, 'email')
      if (user) {
        return res.status(404).json({ message: 'Username existed' })
      }
      const hashedPassword = await authService.hashedPassword(password)
      const newUser = await authService.createUser({
        fullname,
        email,
        password: hashedPassword
      })

      return res.status(201).json({ message: 'User registered successfully', newUser })
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  },
  loginController: async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { email, password } = req.body
      console.log('email', email)
      const user = await authService.findByKeyword({ email }, 'email')
      console.log('user', user)

      if (!user) {
        return res.status(404).json({ message: 'Username not found' })
      }
      if (!(await authService.isPasswordMatch(user, password))) {
        return res.status(401).json({ message: 'Invalid password' })
      }
      if (!user._id) {
        throw new Error('User ID is undefined')
      }
      //const tokens = await authService.generateTokens(user._id, user.role)
      const { accessToken, refreshToken } = await authService.generateTokens(user._id, user.role)

      await authService.pushRefreshToken(user._id, refreshToken)
      return res.status(200).json({ message: 'Login successful', accessToken, user })
    } catch (error: any) {
      console.log('error', error)
      return res.status(500).json({ error: error, message: 'Login failed' })
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
  }
}

export default AuthController
