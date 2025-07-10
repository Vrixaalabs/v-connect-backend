import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { postResolvers } from './resolvers/postResolvers';
import { userResolvers } from './resolvers/userResolvers';
import { PostType } from './typeDefs/post.types';
import { UserType } from './typeDefs/user.types';
import { friendRequestResolvers } from './resolvers/friendRequestResolvers';

// Combine Query
const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    // Post Queries
    posts: postResolvers.Query.posts,
    post: postResolvers.Query.post,

    // User Queries
    users: userResolvers.Query.users,
    me: userResolvers.Query.me,

    // UserSearch and FriendRequest Queries
    searchUsers: friendRequestResolvers.Query.searchUsers,
    getFriendRequests: friendRequestResolvers.Query.getFriendRequests
  },
});

// Combine Mutation
const RootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // Post Mutations
    createPost: postResolvers.Mutation.createPost,
    addComment: postResolvers.Mutation.addComment,
    likePost: postResolvers.Mutation.likePost,
    deletePost: postResolvers.Mutation.deletePost,

    // User Mutations
    login: userResolvers.Mutation.login,

    // FriendRequest Mutations
    sendFriendRequest: friendRequestResolvers.Mutation.sendFriendRequest,
    respondToFriendRequest: friendRequestResolvers.Mutation.respondToFriendRequest
  },
});

// Final schema
export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
