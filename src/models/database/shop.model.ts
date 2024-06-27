import mongoose, { Schema, Document } from 'mongoose'

interface IShop extends Document {
  shopName: string
  address?: string
  hotline?: string
  email?: string
  description?: string
}

const shopSchema: Schema = new Schema({
  shopName: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  hotline: {
    type: String
  },
  email: {
    type: String
  },
  description: {
    type: String
  }
})

const ShopModel = mongoose.model<IShop>('ShopModel', shopSchema)
export default ShopModel
