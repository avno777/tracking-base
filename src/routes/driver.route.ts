import express, { Router } from 'express'
import driverController from '../controllers/driver.controller'
import { authMiddleware, authorizeRoles } from '../middlewares/auth.middleware'

const router: Router = express.Router()

router.post('/', authMiddleware, driverController.createData)

router.get('/', authMiddleware, driverController.getData)

router.get('/:id', authMiddleware, driverController.getDataById)

router.put('/:id', authMiddleware, driverController.updateDataById)

router.delete('/:id', authMiddleware, driverController.deleteDataById)

export default router
