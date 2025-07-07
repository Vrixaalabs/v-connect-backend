import mongoose, { Document, Schema, model } from 'mongoose';
import { IUser } from './user.model';

export interface IGroup extends Document {
  id: string;
  name: string;
  type: 'club' | 'hostel';
  isOfficial: boolean;
  chatMode: 'formal' | 'informal';

  members: (mongoose.Types.ObjectId | IUser)[];
  admins: (mongoose.Types.ObjectId | IUser)[];
  requests: (mongoose.Types.ObjectId | IUser)[];
  
  description?: string;
  createdBy: mongoose.Types.ObjectId | IUser;
}

const groupSchema = new Schema<IGroup>({
  name: { type: String, required: true },
  type: { type: String, enum: ['club', 'hostel'], required: true },
  isOfficial: { type: Boolean, default: false },
  chatMode: { type: String, enum: ['formal', 'informal'], default: 'informal' },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  admins: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  requests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  description: String,
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export const Group = model<IGroup>('Group', groupSchema);