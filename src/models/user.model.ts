import mongoose, { Schema, model, Document } from 'mongoose';
import { UserGraphQL } from '../graphql/typeDefs/user.types';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    department: string;
    batch: string;
    interests: string[];
    isAlumni: boolean;
    profilePicture?: string;
    friends: mongoose.Types.ObjectId;
    auth0Id: string; // <-- Add this
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: false, unique: true },
    password: { type: String, required: false },
    department: { type: String, required: true },
    batch: { type: String, required: true },
    interests: [{ type: String }],
    isAlumni: { type: Boolean, default: false },
    profilePicture: { type: String },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    auth0Id: { type: String, required: true, unique: true }, // <-- Add this
}, {
    timestamps: true,
});

export const User = model<IUser>('User', userSchema);
