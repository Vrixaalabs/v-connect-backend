import mongoose, { Schema, model, Document } from 'mongoose';

/** ✅ Step 1: Add Settings Interfaces */
export interface NotificationPreferences {
  friendRequest: boolean;
  eventInvite: boolean;
  alumniStatus: boolean;
}

export interface UserSettings {
  profileVisibility: 'public' | 'university' | 'private';
  friendRequestPermission: 'everyone' | 'university_only' | 'no_one';
  notifications: NotificationPreferences;
}

/** ✅ Step 2: IUser Interface including `settings` */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  department: string;
  batch: string;
  interests: string[];
  isAlumni: boolean;
  profilePicture?: string;
  friends: mongoose.Types.ObjectId[];
  auth0Id: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  settings: UserSettings;
}

/** ✅ Step 3: Sub-schemas */
const notificationPreferencesSchema = new mongoose.Schema(
  {
    friendRequest: { type: Boolean, default: true },
    eventInvite: { type: Boolean, default: true },
    alumniStatus: { type: Boolean, default: true },
  },
  { _id: false }
);

const settingsSchema = new mongoose.Schema(
  {
    profileVisibility: {
      type: String,
      enum: ['public', 'university', 'private'],
      default: 'public',
    },
    friendRequestPermission: {
      type: String,
      enum: ['everyone', 'university_only', 'no_one'],
      default: 'everyone',
    },
    notifications: {
      type: notificationPreferencesSchema,
      default: () => ({}),
    },
  },
  { _id: false }
);

/** ✅ Step 4: Main User Schema */
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: false, unique: true },
    password: { type: String, required: false },
    department: { type: String, required: true },
    batch: { type: String, required: true },
    interests: [{ type: String }],
    isAlumni: { type: Boolean, default: false },
    profilePicture: { type: String },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    settings: {
      type: settingsSchema,
      default: () => ({}),
    },
    auth0Id: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

/** ✅ Step 5: Export model */
export const User = model<IUser>('User', userSchema);
