import { Schema, model, Document } from 'mongoose'

interface IInventory extends Document {
  productName: string
  category: string
  price: number
  quantityInStock: number
  totalValue: number
  quantityOrdered: number
  quantityDelivered: number
  status: string
}

const inventorySchema = new Schema<IInventory>({
  productName: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  quantityInStock: { type: Number, required: true },
  totalValue: { type: Number, required: true },
  quantityOrdered: { type: Number, default: 0 },
  quantityDelivered: { type: Number, default: 0 },
  status: { type: String, enum: ['published', 'unpublished'], default: 'published' }
})

const Inventory = model<IInventory>('Inventory', inventorySchema)
export default Inventory
