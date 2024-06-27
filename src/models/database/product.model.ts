import { Schema, model, Document } from 'mongoose'

interface IProduct extends Document {
  productCode: string
  productName: string
  inventoryId: Schema.Types.ObjectId
  status: string
  dateAdded: Date
}

const productSchema = new Schema<IProduct>({
  productCode: { type: String, required: true },
  productName: { type: String, required: true },
  inventoryId: { type: Schema.Types.ObjectId, ref: 'Inventory', required: true },
  status: { type: String, required: true },
  dateAdded: { type: Date, default: Date.now }
})

const Product = model<IProduct>('Product', productSchema)
export default Product
