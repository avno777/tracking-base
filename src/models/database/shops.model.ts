import mongoose, { Schema, Document } from 'mongoose'

interface IShop extends Document {
  shopName: string
  accountId: mongoose.Types.ObjectId
}

const shopSchema: Schema = new Schema({
  shopName: {
    type: String,
    required: true
  },
  accountId: {
    type: mongoose.Types.ObjectId,
    ref: 'AccountModel'
  }
})

const ShopModel = mongoose.model<IShop>('ShopModel', shopSchema)
export default ShopModel
