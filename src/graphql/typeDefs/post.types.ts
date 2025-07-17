import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} from 'graphql';

import { UserType } from './user.types';

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

export const ShareType = new GraphQLObjectType({
  name: 'Share',
  fields: () => ({
    sharedBy: {
      type: new GraphQLNonNull(UserType),
      resolve: (parent) => {
        const user = parent.sharedBy;

        if (!user) return null;

        if (typeof user === 'object' && user._id) {
          return {
            ...user,
            id: user._id.toString(), // needed by GraphQL ID scalar
            _id: user._id.toString()
          };
        }

        return {
          id: user.toString(),
          _id: user.toString()
        };
      },
    },
    sharedWith: {
      type: new GraphQLNonNull(UserType),
      resolve: (parent) => {
        const user = parent.sharedWith;

        if (!user) return null;

        if (typeof user === 'object' && user._id) {
          return {
            ...user,
            id: user._id.toString(),
            _id: user._id.toString()
          };
        }

        return {
          id: user.toString(),
          _id: user.toString()
        };
      },
    },
    timestamp: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    author: { type: new GraphQLNonNull(UserType) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    media: { type: new GraphQLList(GraphQLString) },
    likes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
    },
    comments: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(CommentType))),
    },
    timestamp: { type: new GraphQLNonNull(GraphQLString) },
    createdAt: { type: new GraphQLNonNull(GraphQLString) },
    updatedAt: { type: new GraphQLNonNull(GraphQLString) },
    shares: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ShareType))),
    },
  }),
});

// TypeScript Types for Resolver Args
export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface PostsArgs {
  limit?: string;
  offset?: string;
}

export interface PostArgs {
  id: string;
}

export interface CreatePostArgs {
  content: string;
  media?: string[];
}

export interface UpdatePostArgs {
  postId: string;
  content?: string;
  media?: string[];
}
export interface AddCommentArgs {
  postId: string;
  content: string;
}

export interface UpdateCommentArgs {
  postId: string;
  commentId: string;
  content: string;
}

export interface DeleteCommentArgs {
  postId: string;
  commentId: string;
}

export interface LikePostArgs {
  postId: string;
}

export interface DeletePostArgs {
  postId: string;
}

export interface SharePostArgs {
  postId: string;
  receivers: string[];
}
