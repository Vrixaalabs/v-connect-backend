import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  Subscription,
  Root,
  PubSub,
  PubSubEngine,
} from 'type-graphql';
import { Notification, INotification } from '../../models/notification.model';
import { NotificationType } from '../types/notification.type';
import { User } from '../../models/user.model';

const NOTIFICATION_RECEIVED = 'NOTIFICATION_RECEIVED';

@Resolver(() => NotificationType)
export class NotificationResolver {
  @Query(() => [NotificationType])
  async getMyNotifications(
    @Ctx() { user }: { user: any },
    @Arg('limit', () => Number, { nullable: true }) limit?: number,
    @Arg('offset', () => Number, { nullable: true }) offset?: number
  ): Promise<INotification[]> {
    const query = Notification.find({ user: user.id }).sort({ timestamp: -1 });
    if (limit !== undefined) query.limit(limit);
    if (offset !== undefined) query.skip(offset);
    return query.exec();
  }

  @Query(() => Number)
  async getUnreadNotificationCount(@Ctx() { user }: { user: any }): Promise<number> {
    return await Notification.countDocuments({ user: user.id, read: false });
  }

  @Mutation(() => String)
  async markNotificationAsRead(
    @Arg('notificationId') notificationId: string,
    @Ctx() { user }: { user: any }
  ): Promise<string> {
    const note = await Notification.findOne({ _id: notificationId, user: user.id });
    if (!note) throw new Error('Notification not found.');
    note.read = true;
    await note.save();
    return 'Notification marked as read.';
  }

  @Mutation(() => String)
  async markAllNotificationsAsRead(@Ctx() { user }: { user: any }): Promise<string> {
    await Notification.updateMany({ user: user.id, read: false }, { $set: { read: true } });
    return 'All notifications marked as read.';
  }

  @Subscription(() => NotificationType, {
    topics: ({ context }) => {
      if (!context.user) throw new Error('Unauthorized');
      return `${NOTIFICATION_RECEIVED}_${context.user.id}`;
    },
    filter: ({ payload, context }) => {
      return payload.user.toString() === context.user.id;
    },
  })
  notificationReceived(@Root() payload: NotificationType): NotificationType {
    return payload;
  }
}
