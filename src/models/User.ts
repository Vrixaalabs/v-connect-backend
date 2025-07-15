import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
});

export const User = mongoose.model('User', userSchema);
