import mongoose, { Schema, Document } from 'mongoose'

export interface ICustomer extends Document {
  _id?: string
  fullname: string
  email: string
  password: string
  phone?: string
  nationCode?: string
  address?: string
  status?: string
  company?: string
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
    contract: {
      type: String
    },
    license: { type: String },
    vehicle: { type: String },
    availability: { type: String }
  },
  { versionKey: false, timestamps: true }
)

const CustomerModel = mongoose.model<ICustomer>('CustomerModel', customerSchema)
export default CustomerModel
