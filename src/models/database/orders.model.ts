import { Schema, model, Document } from 'mongoose'

interface IOrder extends Document {
  _id?: string
  orderCode?: string
  customerId?: Schema.Types.ObjectId
  product?: string
  supplierId?: Schema.Types.ObjectId
  quantity?: number
  totalAmount?: number
  status?: number
  orderType?: number
  orderDate: Date
  location?: {
    type: string
    coordinates: number[]
  }
  trackingTime?: string
}

const orderSchema = new Schema<IOrder>({
  orderCode: { type: String, required: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  product: { type: String, required: true },
  supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
  quantity: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: Number, enum: [1, 2, 3, 4], default: 1 }, //1: ordered. 2:'processing', 3: 'delivering', 4: 'delivered'
  orderType: { type: Number, enum: [11, 12], default: 'home delivery' }, //11: home delivery, 12: pick up
  orderDate: { type: Date, default: Date.now },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  },
  trackingTime: { type: String }
})

orderSchema.index({ location: '2dsphere' })

const Order = model<IOrder>('Order', orderSchema)
export default Order
