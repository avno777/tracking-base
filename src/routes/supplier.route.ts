import express, { Router } from 'express'
import supplierController from '../controllers/supplier.controller'
import { authMiddleware, authorizeRoles } from '../middlewares/auth.middleware'

const router: Router = express.Router()

router.post('/', authMiddleware, supplierController.createData)

router.get('/', authMiddleware, supplierController.getData)

router.get('/:id', authMiddleware, supplierController.getDataById)

router.put('/:id', authMiddleware, supplierController.updateDataById)

router.delete('/:id', authMiddleware, supplierController.deleteDataById)

export default router
