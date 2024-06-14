import express, { Router } from 'express'
import authController from '../controllers/auth.controller'
import { authMiddleware, authorizeRoles } from '../middlewares/auth.middleware'

const router: Router = express.Router()

router.post('/register', authController.registerController)
router.post('/login', authController.loginController)
router.post(
  '/change-password',
  authMiddleware,
  authorizeRoles('admin', 'super-admin', 'owner'),
  authController.changePasswordController
)
router.post('/logout', authMiddleware, authController.logoutController)

export default router
