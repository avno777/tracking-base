import { Request, Response } from 'express'
import customerService from '../services/customer.service' // Đảm bảo rằng bạn đã import đúng service
import { IRequest } from '../models/interfaces/req.interface'

const CustomerController = {
  createData: async function (req: IRequest, res: Response): Promise<void> {
    try {
      const createdData = await customerService.createData(req)
      res.status(201).json({ message: 'Create new  data successfully', createdData })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },
  getData: async function (req: IRequest, res: Response): Promise<void> {
    try {
      const _data = await customerService.getData(req)
      res.status(200).json({ message: 'Get data successfully', _data })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },
  getDataById: async function (req: IRequest, res: Response): Promise<void> {
    try {
      const data = await customerService.getDataById(req)
      if (!data) {
        res.status(404).json({ message: 'Data not found' })
      }
      res.status(200).json({ message: 'Get data successfully', data })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },
  updateDataById: async function (req: IRequest, res: Response): Promise<void> {
    try {
      const updatedData = await customerService.updateDataById(req)
      if (!updatedData) {
        res.status(404).json({ message: 'Data not found' })
      }
      res.status(200).json({ message: 'Update data successfully', updatedData })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },
  deleteDataById: async function (req: IRequest, res: Response): Promise<void> {
    try {
      const deletedData = await customerService.deleteDataById(req)
      if (!deletedData) {
        res.status(404).json({ message: 'Data not found' })
      }
      res.status(200).json({ message: 'Delete data successfully' })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
}

export default CustomerController
