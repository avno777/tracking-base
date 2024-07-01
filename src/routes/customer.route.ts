import express, { Router } from 'express'
import customerController from '../controllers/customer.controller'
import { authMiddleware, authorizeRoles } from '../middlewares/auth.middleware'

const router: Router = express.Router()

router.post('/', authMiddleware, customerController.createData)

router.get('/', authMiddleware, customerController.getData)

router.get('/:id', authMiddleware, customerController.getDataById)

router.put('/:id', authMiddleware, customerController.updateDataById)

router.delete('/:id', authMiddleware, customerController.deleteDataById)

export default router
