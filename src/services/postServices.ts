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

const updatePostService = async (postId, content, media, user) => {
  if (!user || !user._id) {
    throw new Error('User not authenticated');
  }

  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');

  if (post.author.toString() !== user._id.toString()) {
    throw new Error('Not authorized to update this post');
  }

  if (content !== undefined) post.content = content;
  if (media !== undefined) post.media = media;
  post.updatedAt = new Date();

  await post.save();

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

const updateCommentService = async (postId, commentId, newContent, user) => {
  if (!user || !user._id) {
    throw new Error('User not authenticated');
  }

  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');

  const comment = post.comments.id(commentId);
  if (!comment) throw new Error('Comment not found');

  if (comment.author.toString() !== user._id.toString()) {
    throw new Error('Not authorized to update this comment');
  }

  comment.content = newContent;
  comment.timestamp = new Date(); // Optionally track updates

  await post.save();
  return post.populate('author comments.author likes');
};

const deleteCommentService = async (postId, commentId, user) => {
  if (!user || !user._id) {
    throw new Error('User not authenticated');
  }

  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');

  const comment = post.comments.id(commentId);
  if (!comment) throw new Error('Comment not found');

  if (comment.author.toString() !== user._id.toString()) {
    throw new Error('Not authorized to delete this comment');
  }

  comment.remove();
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

const sharePostService = async (
  postId: string,
  receivers: string[],
  user: User
): Promise<boolean> => {
  if (!user || !user._id) {
    throw new Error('User not authenticated');
  }

  const originalPost = await Post.findById(postId);
  if (!originalPost) {
    throw new Error('Post not found');
  }

  // Prevent sharing to self
  const validReceivers = receivers.filter(
    (receiverId) => receiverId !== user._id.toString()
  );

  if (validReceivers.length === 0) return false;

  // Append share records
  validReceivers.forEach((receiverId) => {
    originalPost.shares.push({
      sharedBy: user._id,
      sharedWith: receiverId,
      timestamp: new Date(),
    });
  });

  await originalPost.save();
  return true;
};

export {
  createPostService,
  updatePostService,
  addCommentService,
  updateCommentService,
  deleteCommentService,
  likePostService,
  deletePostService,
  sharePostService,
};
