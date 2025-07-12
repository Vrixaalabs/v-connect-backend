import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { postResolvers } from './resolvers/postResolvers';
import { userResolvers } from './resolvers/userResolvers';
import { friendRequestResolvers } from './resolvers/friendRequestResolvers';
import { settingsResolvers } from './resolvers/settings.resolver'; // ✅ Add this

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

    // Friend Request Queries
    searchUsers: friendRequestResolvers.Query.searchUsers,
    getFriendRequests: friendRequestResolvers.Query.getFriendRequests,

    // ✅ Settings Query
    getMySettings: settingsResolvers.Query.getMySettings,
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

    // Friend Request Mutations
    sendFriendRequest: friendRequestResolvers.Mutation.sendFriendRequest,
    respondToFriendRequest: friendRequestResolvers.Mutation.respondToFriendRequest,

    // ✅ Settings Mutation
    updateMySettings: settingsResolvers.Mutation.updateMySettings,
  },
});

// Final schema
export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
