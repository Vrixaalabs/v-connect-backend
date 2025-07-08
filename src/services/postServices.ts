import { Post } from '../models/post.model.ts';

const TEST_USER_ID = '64ea6aabc20e1b6a8b2b4f12';

const createPostService = async (content, media, user) => {
  if (!user) {
    user = { id: TEST_USER_ID };
  }

  const post = await Post.create({
    author: user.id,
    content,
    media,
    timestamp: new Date(),
  });

  return post.populate('author');
};

const addCommentService = async (postId, content, user) => {
  if (!user) {
    user = { id: TEST_USER_ID };
  }

  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');

  post.comments.push({
    author: user.id,
    content,
    timestamp: new Date(),
  });

  await post.save();
  return post.populate('author comments.author likes');
};

const likePostService = async (postId, user) => {
  if (!user) {
    user = { id: TEST_USER_ID };
  }

  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');

  const alreadyLiked = post.likes.includes(user.id);
  if (alreadyLiked) {
    post.likes = post.likes.filter((id) => id.toString() !== user.id);
  } else {
    post.likes.push(user.id);
  }

  await post.save();
  return post.populate('author comments.author likes');
};

const deletePostService = async (postId, user) => {
  if (!user) {
    user = { id: TEST_USER_ID };
  }

  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');

  if (post.author.toString() !== user.id) {
    throw new Error('Not authorized to delete');
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
