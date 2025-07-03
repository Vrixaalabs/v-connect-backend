import { Resolver, Query, Mutation, Arg, Ctx, Authorized } from 'type-graphql';
import { Post } from '../../models/post.model';
import { PostType } from '../types/post.type';

@Resolver()
export class PostResolver {
  @Query(() => [PostType])
  async posts(
    @Arg('limit', { nullable: true }) limit?: number,
    @Arg('offset', { nullable: true }) offset?: number
  ): Promise<PostType[]> {
    return Post.find()
      .sort({ createdAt: -1 })
      .skip(offset || 0)
      .limit(limit || 10)
      .populate('author')
      .populate('comments.author')
      .populate('likes');
  }

  @Query(() => PostType, { nullable: true })
  async post(@Arg('id') id: string): Promise<PostType | null> {
    return Post.findById(id)
      .populate('author')
      .populate('comments.author')
      .populate('likes');
  }

  @Authorized()
  @Mutation(() => PostType)
  async createPost(
    @Ctx() { user }: { user: any },
    @Arg('content') content: string,
    @Arg('media', () => [String], { nullable: true }) media?: string[]
  ): Promise<PostType> {
    const post = await Post.create({
      author: user.id,
      content,
      media,
      timestamp: new Date()
    });

    return post.populate('author');
  }

  @Authorized()
  @Mutation(() => PostType)
  async addComment(
    @Ctx() { user }: { user: any },
    @Arg('postId') postId: string,
    @Arg('content') content: string
  ): Promise<PostType> {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    post.comments.push({
      author: user.id,
      content,
      timestamp: new Date()
    });

    await post.save();
    return post.populate('author comments.author likes');
  }

  @Authorized()
  @Mutation(() => PostType)
  async likePost(
    @Ctx() { user }: { user: any },
    @Arg('postId') postId: string
  ): Promise<PostType> {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    const userLiked = post.likes.includes(user.id);
    if (userLiked) {
      post.likes = post.likes.filter(id => id.toString() !== user.id);
    } else {
      post.likes.push(user.id);
    }

    await post.save();
    return post.populate('author comments.author likes');
  }

  @Authorized()
  @Mutation(() => Boolean)
  async deletePost(
    @Ctx() { user }: { user: any },
    @Arg('postId') postId: string
  ): Promise<boolean> {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    if (post.author.toString() !== user.id) {
      throw new Error('Not authorized');
    }

    await post.deleteOne();
    return true;
  }
} 