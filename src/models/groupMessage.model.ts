import mongoose, { Document, Schema, model } from 'mongoose';
import { IGroup } from './group.model';
import { IUser } from './user.model';

export interface IGroupMessage extends Document {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  groupId: mongoose.Types.ObjectId | IGroup;
  sender: mongoose.Types.ObjectId | IUser;
  content: string;
}

const messageSchema = new Schema<IGroupMessage>({
  groupId: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
}, { timestamps: true });

export const GroupMessage = model<IGroupMessage>('GroupMessage', messageSchema);