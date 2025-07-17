import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { postResolvers } from './resolvers/postResolvers';
import { userResolvers } from './resolvers/userResolvers';
import { PostType } from './typeDefs/post.types';
import { UserType } from './typeDefs/user.types';

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
  },
});

// Combine Mutation
const RootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // Post Mutations
    createPost: postResolvers.Mutation.createPost,
    updatePost: postResolvers.Mutation.updatePost,
    addComment: postResolvers.Mutation.addComment,
    updateComment: postResolvers.Mutation.updateComment,
    deleteComment: postResolvers.Mutation.deleteComment,
    likePost: postResolvers.Mutation.likePost,
    deletePost: postResolvers.Mutation.deletePost,
    sharePost: postResolvers.Mutation.sharePost,

    // User Mutations
    login: userResolvers.Mutation.login,
  },
});

// Final schema
export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
