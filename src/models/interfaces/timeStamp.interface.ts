import { Document } from 'mongoose'
export interface ITimeStamp extends Document {
  createDate?: object
  updateDate?: object
}
