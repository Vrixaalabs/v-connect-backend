import { GraphQLError, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import { FriendRequestType } from "../typeDefs/friendRequest.types";
import { FriendRequest } from "../../models/friendRequestModel";
import { User } from "../../models/user.model";
import { UserType } from "../typeDefs/user.types";

export const friendRequestResolvers = {
    Query: {
        searchUsers: {
            type: new GraphQLNonNull(
                new GraphQLList(
                    new GraphQLNonNull(UserType)
                )
            ),
            args: {
                query: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: async (_: any, { query }: any, { user }: any) => {
                return await User.find({
                    _id: { $ne: user.id },
                    name: { $regex: query, $options: 'i' }
                }).populate(['friends'])
            }
        },
        getFriendRequests: {
            type: new GraphQLNonNull(new GraphQLList(FriendRequestType)),
            resolve: async (_: any, __: any, { user }: any) => {
                return await FriendRequest.find({
                    receiver: user.id,
                    status: 'PENDING'
                }).populate(['sender', 'receiver'])
            }
        }
    },

    Mutation: {
        sendFriendRequest: {
            type: FriendRequestType,
            args: {
                receiverId: { type: new GraphQLNonNull(GraphQLID) },
            },
            resolve: async (_: unknown, { receiverId }: any, { user }: any) => {
                if (!user)
                    throw new GraphQLError('Unauthorized')

                if (user.id === receiverId)
                    throw new GraphQLError('Cannot add yourself')
                
                const existing = await FriendRequest.findOne({ 
                    sender: user.id,
                    receiver: receiverId,
                    status: 'PENDING' 
                })
                if (existing)
                    throw new GraphQLError('Request already sent')

                const request = new FriendRequest({
                    sender: user.id,
                    receiver: receiverId
                })
                await request.save()
                return await request.populate(['sender', 'receiver'])
            }
        },
        respondToFriendRequest: {
            type: GraphQLString,
            args: {
                senderId: { type: new GraphQLNonNull(GraphQLID) },
                action: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: async (_: unknown, { senderId, action }: any, { user }: any) => {
                if (!user)
                    throw new GraphQLError('Unauthorized')

                await FriendRequest.updateOne({
                    sender: senderId,
                    receiver: user.id
                }, {
                    $set: { status: action, deleted: true }
                })

                if (action == 'ACCEPTED') {
                    await User.updateOne({
                        _id: user.id
                    }, {
                        $push: { friends: senderId }
                    })
                    await User.updateOne({
                        _id: senderId
                    }, {
                        $push: { friends: user.id }
                    })
                    return "Friend Request Accepted!"
                } else {
                    return "Friend Request Declined!"
                }
            }
        }
    }
};