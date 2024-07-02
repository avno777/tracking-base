import express, { Router } from 'express'
import orderController from '../controllers/order.controller'
import { authMiddleware, authorizeRoles } from '../middlewares/auth.middleware'

const router: Router = express.Router()

router.post('/', authMiddleware, orderController.createData)

router.get('/', authMiddleware, orderController.getData)

router.get('/:id', authMiddleware, orderController.getDataById)

router.put('/:id', authMiddleware, orderController.updateDataById)

router.delete('/:id', authMiddleware, orderController.deleteDataById)

export default router
