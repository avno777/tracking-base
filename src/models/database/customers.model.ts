import mongoose, { Schema, Document } from 'mongoose'

export interface ICustomer extends Document {
  _id?: string
  fullname: string
  email: string
  phone?: string
  address?: string
  company?: string
  status?: string
}

const customerSchema: Schema = new Schema(
  {
    fullname: {
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
    address: {
      type: String
    },
    company: {
      type: String
    },
    status: {
      type: String
    }
  },
  { versionKey: false, timestamps: true }
)

const CustomerModel = mongoose.model<ICustomer>('CustomerModel', customerSchema)
export default CustomerModel
