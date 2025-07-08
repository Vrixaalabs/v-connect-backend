import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} from 'graphql';
import { UserType } from './user.types'; // ✅ Import instead of redefining

// Comment GraphQL Object Type
export const CommentType = new GraphQLObjectType({
  name: 'Comment',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    author: { type: new GraphQLNonNull(UserType) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    timestamp: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

// Post GraphQL Object Type
export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    author: { type: new GraphQLNonNull(UserType) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    media: { type: new GraphQLList(GraphQLString) },
    likes: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))) },
    comments: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(CommentType))) },
    timestamp: { type: new GraphQLNonNull(GraphQLString) },
    createdAt: { type: new GraphQLNonNull(GraphQLString) },
    updatedAt: { type: new GraphQLNonNull(GraphQLString) },
  }),
});
