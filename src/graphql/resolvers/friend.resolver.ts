import { Resolver, Query, Mutation, Arg, Ctx, Authorized } from 'type-graphql';
import { User } from '../../models/user.model';
import { UserType } from '../types/user.type';
import { sendNotification } from '../../utils/sendNotification';
import { pubsub } from '../../utils/pubsub';

@Resolver()
export class FriendResolver {
  @Authorized()
  @Query(() => [UserType])
  async getMyFriends(@Ctx() { user }: { user: any }): Promise<UserType[]> {
    const currentUser = await User.findById(user.id).populate('friends');
    return currentUser?.friends || [];
  }

  @Authorized()
  @Query(() => [UserType])
  async getFriendRequests(@Ctx() { user }: { user: any }): Promise<UserType[]> {
    const currentUser = await User.findById(user.id).populate('friendRequests');
    return currentUser?.friendRequests || [];
  }

  @Authorized()
  @Query(() => [UserType])
  async getSentFriendRequests(@Ctx() { user }: { user: any }): Promise<UserType[]> {
    const currentUser = await User.findById(user.id).populate('sentFriendRequests');
    return currentUser?.sentFriendRequests || [];
  }

  @Authorized()
  @Mutation(() => String)
  async sendFriendRequest(
    @Arg('userId') userId: string,
    @Ctx() { user }: { user: any }
  ): Promise<string> {
    if (user.id === userId) {
      throw new Error('Cannot send friend request to yourself');
    }

    const [currentUser, targetUser] = await Promise.all([
      User.findById(user.id),
      User.findById(userId)
    ]);

    if (!targetUser) {
      throw new Error('User not found');
    }

    if (currentUser?.friends.includes(userId)) {
      throw new Error('Already friends');
    }

    if (currentUser?.sentFriendRequests.includes(userId)) {
      throw new Error('Friend request already sent');
    }

    if (currentUser?.friendRequests.includes(userId)) {
      throw new Error('This user has already sent you a friend request');
    }

    // Add to sent requests
    await User.findByIdAndUpdate(user.id, {
      $addToSet: { sentFriendRequests: userId }
    });

    // Add to received requests
    await User.findByIdAndUpdate(userId, {
      $addToSet: { friendRequests: user.id }
    });

    // Send notification
    await sendNotification({
      userId,
      type: 'friend_request',
      message: `${currentUser?.name} sent you a friend request.`,
      link: '/friends',
      pubsub,
    });

    return 'Friend request sent successfully';
  }

  @Authorized()
  @Mutation(() => String)
  async acceptFriendRequest(
    @Arg('userId') userId: string,
    @Ctx() { user }: { user: any }
  ): Promise<string> {
    const [currentUser, senderUser] = await Promise.all([
      User.findById(user.id),
      User.findById(userId)
    ]);

    if (!senderUser) {
      throw new Error('User not found');
    }

    if (!currentUser?.friendRequests.includes(userId)) {
      throw new Error('No friend request from this user');
    }

    // Remove from friend requests
    await User.findByIdAndUpdate(user.id, {
      $pull: { friendRequests: userId }
    });

    await User.findByIdAndUpdate(userId, {
      $pull: { sentFriendRequests: user.id }
    });

    // Add to friends list for both users
    await User.findByIdAndUpdate(user.id, {
      $addToSet: { friends: userId }
    });

    await User.findByIdAndUpdate(userId, {
      $addToSet: { friends: user.id }
    });

    // Send notification
    await sendNotification({
      userId,
      type: 'friend_accept',
      message: `${currentUser?.name} accepted your friend request.`,
      link: '/friends',
      pubsub,
    });

    return 'Friend request accepted';
  }

  @Authorized()
  @Mutation(() => String)
  async rejectFriendRequest(
    @Arg('userId') userId: string,
    @Ctx() { user }: { user: any }
  ): Promise<string> {
    const currentUser = await User.findById(user.id);

    if (!currentUser?.friendRequests.includes(userId)) {
      throw new Error('No friend request from this user');
    }

    // Remove from friend requests
    await User.findByIdAndUpdate(user.id, {
      $pull: { friendRequests: userId }
    });

    await User.findByIdAndUpdate(userId, {
      $pull: { sentFriendRequests: user.id }
    });

    return 'Friend request rejected';
  }

  @Authorized()
  @Mutation(() => String)
  async cancelFriendRequest(
    @Arg('userId') userId: string,
    @Ctx() { user }: { user: any }
  ): Promise<string> {
    const currentUser = await User.findById(user.id);

    if (!currentUser?.sentFriendRequests.includes(userId)) {
      throw new Error('No friend request sent to this user');
    }

    // Remove from sent friend requests
    await User.findByIdAndUpdate(user.id, {
      $pull: { sentFriendRequests: userId }
    });

    await User.findByIdAndUpdate(userId, {
      $pull: { friendRequests: user.id }
    });

    return 'Friend request cancelled';
  }

  @Authorized()
  @Mutation(() => String)
  async removeFriend(
    @Arg('userId') userId: string,
    @Ctx() { user }: { user: any }
  ): Promise<string> {
    const currentUser = await User.findById(user.id);

    if (!currentUser?.friends.includes(userId)) {
      throw new Error('Not friends with this user');
    }

    // Remove from friends list for both users
    await User.findByIdAndUpdate(user.id, {
      $pull: { friends: userId }
    });

    await User.findByIdAndUpdate(userId, {
      $pull: { friends: user.id }
    });

    return 'Friend removed';
  }
}
