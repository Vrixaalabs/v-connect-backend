import mongoose from 'mongoose';
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: Date,
  time: String,
  location: String,
  coverImage: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  organizers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  departments: [String], // e.g. ["SOE", "SOM"]
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isApproved: { type: Boolean, default: false }
});
export const Event = mongoose.model('Event', eventSchema);