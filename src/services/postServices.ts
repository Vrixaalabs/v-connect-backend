import { Post } from '../models/post.model.ts';

const createPostService = async (content, media, user) => {
  if (!user || !user._id) {
    throw new Error('User not authenticated');
  }

  const post = await Post.create({
    author: user._id,
    content,
    media,
    timestamp: new Date(),
  });

  return post.populate('author');
};

const addCommentService = async (postId, content, user) => {
  if (!user || !user._id) {
    throw new Error('User not authenticated');
  }

  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');

  post.comments.push({
    author: user._id,
    content,
    timestamp: new Date(),
  });

  await post.save();
  return post.populate('author comments.author likes');
};

const likePostService = async (postId, user) => {
  if (!user || !user._id) {
    throw new Error('User not authenticated');
  }

  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');

  const alreadyLiked = post.likes.includes(user._id);
  if (alreadyLiked) {
    post.likes = post.likes.filter((id) => id.toString() !== user._id.toString());
  } else {
    post.likes.push(user._id);
  }

  await post.save();
  return post.populate('author comments.author likes');
};

const deletePostService = async (postId, user) => {
  if (!user || !user._id) {
    throw new Error('User not authenticated');
  }

  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');

  if (post.author.toString() !== user._id.toString()) {
    throw new Error('Not authorized to delete this post');
  }

  await post.deleteOne();
  return true;
};

export {
  createPostService,
  addCommentService,
  likePostService,
  deletePostService,
};
