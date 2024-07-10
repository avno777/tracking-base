import { Request, Response } from 'express'
import accountService from '../services/account.service' // Đảm bảo rằng bạn đã import đúng service
import { IRequest } from '../models/interfaces/req.interface'

const AccountController = {
  createData: async function (req: IRequest, res: Response): Promise<void> {
    try {
      const createdData = await accountService.createData(req)
      res.status(201).json({ message: 'Create data successfully', createdData })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },
  getData: async function (req: IRequest, res: Response): Promise<void> {
    try {
      const _data = await accountService.getData(req)
      res.status(200).json({ message: 'Get data successfully', _data })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },
  getDataById: async function (req: IRequest, res: Response): Promise<void> {
    try {
      const dataId: string = req.user?._id ?? ''
      const user = await accountService.getDataById(dataId)
      if (!user) {
        res.status(404).json({ message: 'Data not found' })
      }
      const { _id, fullname, email, avatarUrl, phone, nationCode, address, city, country, state } = user
      res.status(200).json({
        message: 'Get data successfully',
        data: { _id, fullname, email, avatarUrl, phone, nationCode, address, city, country, state }
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },
  updateDataById: async function (req: IRequest, res: Response): Promise<void> {
    try {
      const updatedData = await accountService.updateDataById(req)
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
      const deletedData = await accountService.deleteDataById(req)
      if (!deletedData) {
        res.status(404).json({ message: 'Data not found' })
      }
      res.status(200).json({ message: 'Delete data successfully' })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
}

export default AccountController
