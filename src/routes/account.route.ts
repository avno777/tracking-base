import express, { Router } from 'express'
import accountController from '../controllers/account.controller'
import { authMiddleware, authorizeRoles } from '../middlewares/auth.middleware'

const router: Router = express.Router()

router.post('/', authMiddleware, accountController.createData)

router.get('/', authMiddleware, accountController.getData)

router.get('/user-info', authMiddleware, accountController.getDataById)

router.put('/user-info', authMiddleware, accountController.updateDataById)

router.delete('/user-info', authMiddleware, accountController.deleteDataById)

export default router
