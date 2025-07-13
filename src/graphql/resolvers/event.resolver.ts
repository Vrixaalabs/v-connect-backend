import { Resolver, Query, Mutation, Arg, Ctx, Authorized } from 'type-graphql';
import { Event, IEvent } from '../../models/event.model';
import { User } from '../../models/user.model';
import { EventType } from '../types/event.type';
import { sendNotification } from '../../utils/sendNotification';
import { pubsub } from '../../utils/pubsub';

@Resolver(() => EventType)
export class EventResolver {
  @Authorized()
  @Query(() => [EventType])
  async getEvents(@Ctx() { user }: { user: any }): Promise<IEvent[]> {
    return Event.find().populate('createdBy').populate('attendees');
  }

  @Authorized()
  @Query(() => [EventType])
  async getMyEvents(@Ctx() { user }: { user: any }): Promise<IEvent[]> {
    return Event.find({ createdBy: user.id }).populate('createdBy').populate('attendees');
  }

  @Authorized()
  @Mutation(() => EventType)
  async createEvent(
    @Arg('title') title: string,
    @Arg('description') description: string,
    @Arg('date') date: Date,
    @Arg('location') location: string,
    @Arg('maxAttendees', () => Number, { nullable: true }) maxAttendees?: number,
    @Ctx() { user }: { user: any }
  ): Promise<IEvent> {
    const event = await Event.create({
      title,
      description,
      date,
      location,
      createdBy: user.id,
      maxAttendees,
    });

    return event.populate('createdBy');
  }

  @Authorized()
  @Mutation(() => String)
  async approveEvent(
    @Arg('eventId') eventId: string,
    @Ctx() { user }: { user: any }
  ): Promise<string> {
    // In a real app, you'd check if the user is an admin
    const event = await Event.findById(eventId).populate('createdBy');
    
    if (!event) {
      throw new Error('Event not found');
    }

    if (event.status !== 'pending') {
      throw new Error('Event is not pending approval');
    }

    event.status = 'approved';
    await event.save();

    // Send notification to event creator
    await sendNotification({
      userId: event.createdBy.id,
      type: 'event_approved',
      message: `Your event "${event.title}" was approved.`,
      link: `/events/${event.id}`,
      pubsub,
    });

    return 'Event approved successfully';
  }

  @Authorized()
  @Mutation(() => String)
  async rejectEvent(
    @Arg('eventId') eventId: string,
    @Ctx() { user }: { user: any }
  ): Promise<string> {
    // In a real app, you'd check if the user is an admin
    const event = await Event.findById(eventId).populate('createdBy');
    
    if (!event) {
      throw new Error('Event not found');
    }

    if (event.status !== 'pending') {
      throw new Error('Event is not pending approval');
    }

    event.status = 'rejected';
    await event.save();

    // Send notification to event creator
    await sendNotification({
      userId: event.createdBy.id,
      type: 'event_approved', // Using same type for rejection
      message: `Your event "${event.title}" was rejected.`,
      link: `/events/${event.id}`,
      pubsub,
    });

    return 'Event rejected successfully';
  }

  @Authorized()
  @Mutation(() => String)
  async joinEvent(
    @Arg('eventId') eventId: string,
    @Ctx() { user }: { user: any }
  ): Promise<string> {
    const event = await Event.findById(eventId);
    
    if (!event) {
      throw new Error('Event not found');
    }

    if (event.status !== 'approved') {
      throw new Error('Event is not approved');
    }

    if (event.attendees.includes(user.id)) {
      throw new Error('Already attending this event');
    }

    if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
      throw new Error('Event is full');
    }

    await Event.findByIdAndUpdate(eventId, {
      $addToSet: { attendees: user.id }
    });

    return 'Successfully joined event';
  }

  @Authorized()
  @Mutation(() => String)
  async leaveEvent(
    @Arg('eventId') eventId: string,
    @Ctx() { user }: { user: any }
  ): Promise<string> {
    const event = await Event.findById(eventId);
    
    if (!event) {
      throw new Error('Event not found');
    }

    if (!event.attendees.includes(user.id)) {
      throw new Error('Not attending this event');
    }

    await Event.findByIdAndUpdate(eventId, {
      $pull: { attendees: user.id }
    });

    return 'Successfully left event';
  }
} 