import mongoose, { Schema, Document } from 'mongoose';

export interface IRequest extends Document {
  studentId: string;
  documentType: string;
  purpose: string;
  status: 'Pending' | 'Approved' | 'Declined' | 'Ready';
  createdAt: Date;
}

const requestSchema: Schema = new Schema<IRequest>(
  {
    studentId: { type: String, required: true },
    documentType: { type: String, required: true },
    purpose: { type: String, required: true },
    numberOfCopies: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Declined', 'Ready'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

export const RequestModel = mongoose.model<IRequest>('Request', requestSchema);