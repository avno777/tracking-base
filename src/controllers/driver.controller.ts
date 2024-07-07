import { Request, Response } from 'express'
import driverService from '../services/driver.service' // Đảm bảo rằng bạn đã import đúng service
import { IRequest } from '../models/interfaces/req.interface'

const DriverController = {
  createData: async function (req: IRequest, res: Response): Promise<void> {
    try {
      const createdData = await driverService.createData(req)
      res.status(201).json({ message: 'Create new elevator data successfully', createdData })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },
  getData: async function (req: IRequest, res: Response): Promise<void> {
    try {
      const _data = await driverService.getData(req)
      res.status(200).json({ message: 'Get elevator data successfully', _data })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },
  getDataById: async function (req: IRequest, res: Response): Promise<void> {
    try {
      const data = await driverService.getDataById(req)
      if (!data) {
        res.status(404).json({ message: 'Card not found' })
      }
      res.status(200).json({ message: 'Get elevator data by id successfully', data })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },
  updateDataById: async function (req: IRequest, res: Response): Promise<void> {
    try {
      const updatedData = await driverService.updateDataById(req)
      if (!updatedData) {
        res.status(404).json({ message: 'Card not found' })
      }
      res.status(200).json({ message: 'Update elevator data successfully', updatedData })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },
  deleteDataById: async function (req: IRequest, res: Response): Promise<void> {
    try {
      const deletedData = await driverService.deleteDataById(req)
      if (!deletedData) {
        res.status(404).json({ message: 'Citizen data not found' })
      }
      res.status(200).json({ message: 'Delete citizen data successfully' })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
}

export default DriverController
