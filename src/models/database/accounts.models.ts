import mongoose, { Schema, Document } from 'mongoose'

export interface IAccount extends Document {
  _id?: string
  fullname: string
  email: string
  password: string
  avatarUrl?: string
  role: 'Retailers' | 'Logistic ' | 'Manufacturing' | 'Admin'
  refreshToken?: [string]
  phone?: string
  nationCode?: string
  address?: string
  city?: string
  country?: string
  state?: string
  isAdmin?: boolean
  isActive?: boolean
  isDeleted?: boolean
  otp?: number
  otpTime?: Date
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
      enum: ['Retailers', 'Logistic', 'Manufacturing', 'Admin'],
      default: 'Retailers'
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
    },
    isAdmin: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    otp: { type: String, length: 6, select: false },
    otpTime: Date
  },
  { versionKey: false, timestamps: true }
)

const AccountModel = mongoose.model<IAccount>('AccountModel', accountSchema)
export default AccountModel
