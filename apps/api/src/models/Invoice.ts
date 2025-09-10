import mongoose, { Document, Schema } from 'mongoose';

export interface ILineItem {
  description: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

export interface IInvoice extends Document {
  fileId: string;
  fileName: string;
  vendor: {
    name: string;
    address?: string;
    taxId?: string;
  };
  invoice: {
    number: string;
    date: string;
    currency?: string;
    subtotal?: number;
    taxPercent?: number;
    total?: number;
    poNumber?: string;
    poDate?: string;
    lineItems: ILineItem[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const LineItemSchema = new Schema({
  description: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true }
});

const InvoiceSchema = new Schema({
  fileId: { type: String, required: true },
  fileName: { type: String, required: true },
  vendor: {
    name: { type: String, required: true },
    address: { type: String },
    taxId: { type: String }
  },
  invoice: {
    number: { type: String, required: true },
    date: { type: String, required: true },
    currency: { type: String },
    subtotal: { type: Number },
    taxPercent: { type: Number },
    total: { type: Number },
    poNumber: { type: String },
    poDate: { type: String },
    lineItems: [LineItemSchema]
  }
}, {
  timestamps: true
});

export default mongoose.model<IInvoice>('Invoice', InvoiceSchema);