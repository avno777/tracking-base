import { Schema, model, Document } from 'mongoose'

interface IInvoice extends Document {
  invoiceCode: string
  customerName: string
  productName: string
  totalAmount: number
  paymentDate: Date
  status: string
}

const invoiceSchema = new Schema<IInvoice>({
  invoiceCode: { type: String, required: true },
  customerName: { type: String, required: true },
  productName: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['paid', 'draft'], default: 'draft' }
})

const Invoice = model<IInvoice>('Invoice', invoiceSchema)
export default Invoice
