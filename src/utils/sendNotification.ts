import { PubSubEngine } from 'type-graphql';
import { Notification } from '../models/notification.model';

interface SendNotificationParams {
  userId: string;
  type: 'friend_request' | 'friend_accept' | 'event_invite' | 'event_approved' | 'alumni_status';
  message: string;
  link?: string;
  pubsub: PubSubEngine;
}

export const sendNotification = async ({
  userId,
  type,
  message,
  link = '',
  pubsub,
}: SendNotificationParams) => {
  const notification = await new Notification({
    user: userId,
    type,
    message,
    link,
  }).save();

  await pubsub.publish(`NOTIFICATION_RECEIVED_${userId}`, notification);

  return notification;
};
