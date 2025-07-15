import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  content: String,
  likes: Number,
  comments: [{ body: String }],
  timestamp: Date,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export const Post = mongoose.model('Post', postSchema);
