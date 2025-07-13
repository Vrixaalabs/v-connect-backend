import { Schema, model, Document } from 'mongoose';

export interface IAlumniVerification extends Document {
  user: Schema.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  documents: string[];
  graduationYear: number;
  degree: string;
  department: string;
  reason?: string;
  verifiedBy?: Schema.Types.ObjectId;
  verifiedAt?: Date;
}

const alumniVerificationSchema = new Schema<IAlumniVerification>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  documents: [{ type: String, required: true }],
  graduationYear: { type: Number, required: true },
  degree: { type: String, required: true },
  department: { type: String, required: true },
  reason: { type: String },
  verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: { type: Date },
}, {
  timestamps: true,
});

export const AlumniVerification = model<IAlumniVerification>('AlumniVerification', alumniVerificationSchema); 