import { Request } from 'express'
import invoiceModel from '../models/database/invoice.model'
import logger from '../configs/logger'
import { FilterQuery } from 'mongoose'
// import createTimestamp from '../config/createTimestamp'
// import logger from '../config/winston'
// import { ICustomer } from '../models/database/driver.model'
// import { ITimeStamp } from '../models/interfaces/timeStamp.interface'

interface IInvoiceService {
  createData(data: any): Promise<any>
  getData(req: Request): Promise<{ total: number; data: any[] }>
  getDataById(req: Request): Promise<any>
  updateDataById(req: Request): Promise<any>
  deleteDataById(req: Request): Promise<any>
  //getLocation(req: Request): Promise<any>
}
const InvoiceService: IInvoiceService = {
  async createData(data: any) {
    try {
      const createdData = await invoiceModel.create(data)
      return createdData
    } catch (error) {
      logger.error('Error creating data:', error) // Xử lý lỗi cụ thể
      throw error
    }
  },
  async getData(req: Request) {
    const allowedFields = ['orderCode', 'quantity', 'orderType', 'customerId', 'productId', 'supplierId', 'orderDate']
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const conditions: FilterQuery<any>[] = allowedFields
      .map((field) => {
        if (
          field === 'orderCode' ||
          field === 'quantity' ||
          field === 'orderType' ||
          field === 'customerId' ||
          field === 'productId' ||
          field === 'supplierId' ||
          field === 'orderDate'
        ) {
          if (req.query[field]) {
            return { [field]: { $regex: req.query[field], $options: 'i' } }
          }
        } else if (req.query[field]) {
          return { [field]: req.query[field] }
        }
      })
      .filter((condition): condition is FilterQuery<any> => condition !== null)

    const startDate = new Date(req.query.startDate as string)
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date()
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      endDate.setDate(endDate.getDate() + 1)
      conditions.push({
        createdAt: {
          $gte: startDate,
          $lt: endDate
        }
      })
    }

    const _data = await invoiceModel.find({ $and: conditions }).skip(skip).limit(limit).lean().exec()
    const count = await invoiceModel.countDocuments({ $and: conditions })
    const totalPages = Math.ceil(count / limit)
    return {
      total: count,
      data: _data,
      totalPages,
      limit,
      currentPage: page
    }
  },

  async getDataById(req: Request) {
    try {
      const dataId = req.params.id
      const data = await invoiceModel.findById(dataId)
      return data
    } catch (error) {
      logger.error('Error creating data:', error) // Xử lý lỗi cụ thể
      throw error
    }
  },
  async updateDataById(req: Request) {
    try {
      const dataId = req.body.id ? req.body.id : req.params.id
      const data = req.body
      const updatedData = await invoiceModel.findByIdAndUpdate(dataId, data, { new: true })
      return updatedData
    } catch (error) {
      logger.error('Error creating data:', error) // Xử lý lỗi cụ thể
      throw error
    }
  },

  async deleteDataById(req: Request) {
    try {
      const dataId = req.body.id ? req.body.id : req.params.id
      await invoiceModel.findByIdAndDelete(dataId)
    } catch (error) {
      logger.error('Error creating data:', error) // Xử lý lỗi cụ thể
      throw error
    }
  }
  // async getLocation(req: Request) {
  //   try {
  //     const dataId = req.params.id
  //     const data = await invoiceModel.findById(dataId)
  //     let result
  //     if(data !== null) {
  //       result = { data.location, data.trackingTime }
  //     }
  //     return result
  //   } catch (error) {
  //     logger.error('Error creating data:', error) // Xử lý lỗi cụ thể
  //     throw error
  //   }
  // }
}

export default InvoiceService
