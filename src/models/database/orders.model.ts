import { Schema, model, Document } from 'mongoose'

interface IOrder extends Document {
  orderCode: string
  customerId: Schema.Types.ObjectId
  productId: Schema.Types.ObjectId
  supplierId: Schema.Types.ObjectId
  quantity: number
  totalAmount: number
  status?: string
  orderType: string
  orderDate: Date
  location: {
    type: string
    coordinates: number[]
  }
  trackingTime: string
}

const orderSchema = new Schema<IOrder>({
  orderCode: { type: String, required: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
  quantity: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['ordered', 'processing', 'delivering', 'delivered'], default: 'ordered' },
  orderType: { type: String, enum: ['home delivery', 'pick up'], default: 'home delivery' },
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
