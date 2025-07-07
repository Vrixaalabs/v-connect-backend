import mongoose, { Document, Schema, model } from 'mongoose';
import { IUser } from './user.model';

export interface IGroup extends Document {
  name: string;
  type: 'club' | 'hostel';
  isOfficial: boolean;
  chatMode: 'formal' | 'informal';
  members: (IUser['_id'] | IUser)[];
  admins: (IUser['_id'] | IUser)[];
  requests: (IUser['_id'] | IUser)[];
  description?: string;
  createdBy: IUser['_id'] | IUser;
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