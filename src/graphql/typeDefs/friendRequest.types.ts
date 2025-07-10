import {
    GraphQLID,
    GraphQLString,
    GraphQLBoolean,
    GraphQLEnumType,
    GraphQLObjectType,
    GraphQLNonNull
} from 'graphql'
import { UserType } from './user.types'

export const ConnectionStatusType = new GraphQLEnumType({
    name: 'ConnectionStatus',
    values: {
        PENDING: { value: 'PENDING' },
        ACCEPTED: { value: 'ACCEPTED' },
        DECLINED: { value: 'DECLINED' }
    }
})

export const FriendRequestType = new GraphQLObjectType({
    name: 'FriendRequest',
    fields: (): Record<string, any> => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        sender: { type: new GraphQLNonNull(UserType) },
        receiver: { type: new GraphQLNonNull(UserType) },
        status: { type: new GraphQLNonNull(ConnectionStatusType) },
        timeStamp: { type: new GraphQLNonNull(GraphQLString) },
        deleted: { type: new GraphQLNonNull(GraphQLBoolean) }
    })
})