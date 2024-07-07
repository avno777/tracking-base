import mongoose, { Schema, Document } from 'mongoose'

export interface ISupplier extends Document {
  _id?: string
  name: string
  email: string
  hotline: string
  phone?: string
  address?: string
}

const supplierSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      index: true
    },
    phone: {
      type: String
    },
    hotline: {
      type: String
    },
    address: {
      type: String
    }
  },
  { versionKey: false, timestamps: true }
)

const SupplierModel = mongoose.model<ISupplier>('SupplierModel', supplierSchema)
export default SupplierModel
