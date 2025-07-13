import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  type: 'friend_request' | 'friend_accept' | 'event_invite' | 'event_approved' | 'alumni_status';
  message: string;
  link?: string;
  read: boolean;
  timestamp: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['friend_request', 'friend_accept', 'event_invite', 'event_approved', 'alumni_status'],
      required: true,
    },
    message: { type: String, required: true },
    link: String,
    read: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
