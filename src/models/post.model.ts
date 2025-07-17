import { Schema, model, Document, Types } from 'mongoose';
import { IUser } from './user.model';

export interface IComment {
  author: Types.ObjectId | IUser;
  content: string;
  timestamp: Date;
}

export interface IShare {
  sharedBy: Types.ObjectId | IUser;
  sharedWith: Types.ObjectId;
  timestamp: Date;
}

export interface IPost extends Document {
  author: Types.ObjectId | IUser;
  content: string;
  media?: string[];
  likes: Types.ObjectId[];
  comments: IComment[];
  timestamp: Date;
  shares: IShare[];
}

const commentSchema = new Schema<IComment>({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const shareSchema = new Schema<IShare>({
  sharedBy: { type: Schema.Types.ObjectId, required: true},
  sharedWith: { type: Schema.Types.ObjectId, required: true},
  timestamp: { type: Date, default: Date.now },
})

const postSchema = new Schema<IPost>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    media: [{ type: String }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [commentSchema],
    timestamp: { type: Date, default: Date.now },
    shares: [shareSchema],
  },
  { timestamps: true }
);

export const Post = model<IPost>('Post', postSchema); 
