import express, { Router } from 'express'
import inventoryController from '../controllers/inventory.controller'
import { authMiddleware, authorizeRoles } from '../middlewares/auth.middleware'

const router: Router = express.Router()

router.post('/', authMiddleware, inventoryController.createData)

router.get('/', authMiddleware, inventoryController.getData)

router.get('/:id', authMiddleware, inventoryController.getDataById)

router.put('/:id', authMiddleware, inventoryController.updateDataById)

router.delete('/:id', authMiddleware, inventoryController.deleteDataById)

export default router
