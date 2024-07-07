import express, { Router } from 'express'
import productController from '../controllers/product.controller'
import { authMiddleware, authorizeRoles } from '../middlewares/auth.middleware'

const router: Router = express.Router()

router.post('/', authMiddleware, productController.createData)

router.get('/', authMiddleware, productController.getData)

router.get('/:id', authMiddleware, productController.getDataById)

router.put('/:id', authMiddleware, productController.updateDataById)

router.delete('/:id', authMiddleware, productController.deleteDataById)

export default router
