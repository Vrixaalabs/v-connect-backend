import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: String,
  isOfficial: Boolean,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

export const Group = mongoose.model('Group', groupSchema);
