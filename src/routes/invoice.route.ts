import express, { Router } from 'express'
import invoiceController from '../controllers/invoice.controller'
import { authMiddleware, authorizeRoles } from '../middlewares/auth.middleware'

const router: Router = express.Router()

router.post('/', authMiddleware, invoiceController.createData)

router.get('/', authMiddleware, invoiceController.getData)

router.get('/:id', authMiddleware, invoiceController.getDataById)

router.put('/:id', authMiddleware, invoiceController.updateDataById)

router.delete('/:id', authMiddleware, invoiceController.deleteDataById)

export default router
