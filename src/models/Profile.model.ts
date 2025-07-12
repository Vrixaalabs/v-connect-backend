import { Schema, model, Document, Types } from 'mongoose';

export interface IPortfolioEntry {
  title?: string;
  description?: string;
  link?: string;
  tags?: string[];
}

export interface IUser extends Document {
  auth0Id: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  bio?: string;
  department?: string;
  degree?: string;
  graduationYear?: number;
  linkedin?: string;
  github?: string;
  portfolio?: IPortfolioEntry[];
}

const PortfolioEntrySchema = new Schema<IPortfolioEntry>({
  title: String,
  description: String,
  link: String,
  tags: [String],
});

const UserSchema = new Schema<IUser>({
  auth0Id: { type: String, required: true, unique: true },
  name: String,
  email: String,
  avatarUrl: String,
  bio: String,
  department: String,
  degree: String,
  graduationYear: Number,
  linkedin: String,
  github: String,
  portfolio: [PortfolioEntrySchema],
}, {
  timestamps: true,  
});

export const User = model<IUser>('User', UserSchema);
