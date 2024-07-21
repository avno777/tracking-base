import express, { Router } from 'express'
import authController from '../controllers/auth.controller'
//import { authMiddleware, authorizeRoles } from '../middlewares/auth.middleware'

const router: Router = express.Router()

router.post('/register', authController.registerController)
router.post('/login', authController.loginController)
router.post('/active', authController.active)
router.post('/refresh-token', authController.refreshTokenController)
router.post('/send-otp-forgot', authController.sendOtpForGot)
router.post('/verify-otp-forGot', authController.verifyOtpForGot)
router.post('/change-password', authController.changePasswordController)
router.post('/reset-password', authController.changePasswordController)
router.post('/logout', authController.logoutController)

export default router
