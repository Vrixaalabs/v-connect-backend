import { Schema, model, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  createdBy: Schema.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  attendees: Schema.Types.ObjectId[];
  maxAttendees?: number;
}

const eventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  maxAttendees: { type: Number },
}, {
  timestamps: true,
});

export const Event = model<IEvent>('Event', eventSchema); 