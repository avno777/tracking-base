import express, { Router } from 'express'
import authController from '../controllers/auth.controller'
import { authMiddleware, authorizeRoles } from '../middlewares/auth.middleware'

const router: Router = express.Router()

router.post('/register', authController.registerController)
router.post('/login', authController.loginController)
router.post('/active', authController.active)
router.post('/refresh-token', authMiddleware, authController.refreshTokenController)
router.post('/send-otp-forgot', authMiddleware, authController.sendOtpForGot)
router.post('/verify-otp-forGot', authMiddleware, authController.verifyOtpForGot)
router.post('/change-password', authMiddleware, authController.changePasswordController)
router.post('/reset-password', authMiddleware, authController.changePasswordController)
router.post('/logout', authMiddleware, authController.logoutController)

export default router
