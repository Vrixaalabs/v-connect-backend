import mongoose from "mongoose";

export interface IFriendRequest extends mongoose.Document {
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
    timeStamp: Date;
    deleted: boolean;
}

const friendRequestSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['PENDING', 'ACCEPTED', 'DECLINED'], default: 'PENDING' },
    timeStamp: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false }
}, {
    timestamps: true
})

export const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema, 'friendRequests')