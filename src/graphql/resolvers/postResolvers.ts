import { Post } from '../../models/post.model.ts';
import { createPostService, addCommentService, likePostService, deletePostService } from '../../services/postServices.ts';

export const postResolvers = {
  Query: {
    posts: async (_parent, { limit = 10, offset = 0 }) => {
      return Post.find()
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .populate('author')
        .populate('comments.author')
        .populate('likes');
    },
    post: async (_parent, { id }) => {
      return Post.findById(id)
        .populate('author')
        .populate('comments.author')
        .populate('likes');
    }
  },
  Mutation: {
    createPost: async (_parent, { content, media }, { user }) => {
      return createPostService(content, media, user);
    },
    addComment: async (_parent, { postId, content }, { user }) => {
        return addCommentService(postId, content, user);
    },
    likePost: async (_parent, { postId }, { user }) => {
      return likePostService(postId, user);
    },
    deletePost: async (_parent, { postId }, { user }) => {
      return deletePostService(postId, user);
    }
  }
};
