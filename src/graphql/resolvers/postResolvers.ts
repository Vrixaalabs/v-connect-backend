import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';
import { PostType } from '../typeDefs/post.types';
import { Post } from '../../models/post.model';

import {
  createPostService,
  updatePostService,
  addCommentService,
  likePostService,
  deletePostService,
  updateCommentService,
  deleteCommentService,
} from '../../services/postServices';

import {
  PostsArgs,
  PostArgs,
  UpdatePostArgs,
  CreatePostArgs,
  AddCommentArgs,
  UpdateCommentArgs,
  DeleteCommentArgs,
  LikePostArgs,
  DeletePostArgs,
  User,
} from '../typeDefs/post.types';

export const postResolvers = {
  Query: {
    posts: {
      type: new GraphQLList(PostType),
      args: {
        limit: { type: GraphQLString },
        offset: { type: GraphQLString },
      },
      resolve: async (_parent: unknown, args: PostsArgs) => {
        return Post.find()
          .sort({ createdAt: -1 })
          .skip(args.offset || 0)
          .limit(args.limit || 10)
          .populate('author')
          .populate('comments.author')
          .populate('likes');
      },
    },

    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_parent: unknown, args: PostArgs) => {
        return Post.findById(args.id)
          .populate('author')
          .populate('comments.author')
          .populate('likes');
      },
    },
  },

  Mutation: {
    createPost: {
      type: PostType,
      args: {
        content: { type: new GraphQLNonNull(GraphQLString) },
        media: { type: new GraphQLList(GraphQLString) },
      },
      resolve: async (
        _parent: unknown,
        args: CreatePostArgs,
        context: { user: User }
      ) => {
        if (!context.user) throw new Error('Not authenticated');
        return createPostService(args.content, args.media, context.user);
      },
    },
    updatePost: {
      type: PostType,
      args: {
        postId: { type: new GraphQLNonNull(GraphQLID) },
        content: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (
        _parent: unknown,
        args: UpdatePostArgs,
        context: { user: User }
      ) => {
        if (!context.user) throw new Error('Not authenticated');
        return updatePostService(
          args.postId,
          args.content,
          args.media,
          context.user
        );
      },
    },
    
    addComment: {
      type: PostType,
      args: {
        postId: { type: new GraphQLNonNull(GraphQLID) },
        content: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (
        _parent: unknown,
        args: AddCommentArgs,
        context: { user: User }
      ) => {
        if (!context.user) throw new Error('Not authenticated');
        return addCommentService(args.postId, args.content, context.user);
      },
    },

    updateComment: {
      type: PostType,
      args: {
        postId: { type: new GraphQLNonNull(GraphQLID) },
        commentId: { type: new GraphQLNonNull(GraphQLID) },
        content: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (
        _parent: unknown,
        args: { postId: string; commentId: string; content: string },
        context: { user: User }
      ) => {
        if (!context.user) throw new Error('Not authenticated');
        return updateCommentService(
          args.postId,
          args.commentId,
          args.content,
          context.user
        );
      },
    },

    deleteComment: {
      type: PostType,
      args: {
        postId: { type: new GraphQLNonNull(GraphQLID) },
        commentId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (
        _parent: unknown,
        args: { postId: string; commentId: string },
        context: { user: User }
      ) => {
        if (!context.user) throw new Error('Not authenticated');
        return deleteCommentService(args.postId, args.commentId, context.user);
      },
    },

    likePost: {
      type: PostType,
      args: {
        postId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (
        _parent: unknown,
        args: LikePostArgs,
        context: { user: User }
      ) => {
        if (!context.user) throw new Error('Not authenticated');
        return likePostService(args.postId, context.user);
      },
    },

    deletePost: {
      type: GraphQLBoolean,
      args: {
        postId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (
        _parent: unknown,
        args: DeletePostArgs,
        context: { user: User }
      ) => {
        if (!context.user) throw new Error('Not authenticated');
        return deletePostService(args.postId, context.user);
      },
    },
  },
};
