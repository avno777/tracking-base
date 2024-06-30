import mongoose, { Schema, Document } from 'mongoose'

export interface IAccount extends Document {
  _id?: string
  fullname: string
  email: string
  password: string
  avatarUrl?: string
  role: 'customer' | 'admin' | 'supervisor'
  refreshToken?: [string]
  phone?: string
  nationCode?: string
  address?: string
  city?: string
  country?: string
  state?: string
}

const accountSchema: Schema = new Schema(
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
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['customer', 'admin', 'supervisor'],
      default: 'admin'
    },
    phone: {
      type: String
    },
    nationCode: {
      type: String
    },
    address: {
      type: String
    },
    city: {
      type: String
    },
    country: {
      type: String
    },
    state: {
      type: String
    },
    refreshToken: {
      type: [String],
      select: false
    }
  },
  { versionKey: false, timestamps: true }
)

const AccountModel = mongoose.model<IAccount>('AccountModel', accountSchema)
export default AccountModel
