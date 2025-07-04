import { Resolver, Mutation, Arg, Ctx, Query } from "type-graphql";
import { Event } from "../../models/event.model";
import { User } from "../../models/user.model";
import { InputType, Field } from "type-graphql";    
 // Adjust the import path as necessary
import { isTopAdmin, isInstitutionalAdmin, isDepartmentAdmin } from "../../utils/roleValidation";
// Import your EventInput and EventType classes from your GraphQL schema/types
import { EventInput } from "../types/EventInput"; 
import { EventType } from "../types/EventType";// Adjust the import path as necessary
@Resolver()
export class EventResolver {
  @Mutation(() => EventType)
  async createEvent(@Arg("input") input: EventInput, @Ctx() { user }: any) {
    const isOrganizer = input.organizers.includes(user.id);
    if (!isOrganizer) throw new Error("You must be listed as an organizer");

    for (const dept of input.departments) {
      const hasDeptOrganizer = await User.exists({
        _id: { $in: input.organizers },
        departments: dept
      });
      if (!hasDeptOrganizer) {
        throw new Error(`At least one organizer must be from department ${dept}`);
      }
    }

    const event = new Event({
      ...input,
      createdBy: user.id,
      isApproved: false
    });

    await event.save();
await event.populate(['organizers', 'createdBy']);
return event;
  }

  @Mutation(() => EventType)
  async joinEvent(@Arg("eventId") eventId: string, @Ctx() { user }: any) {
    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");

    if (!event.attendees.includes(user.id)) {
      event.attendees.push(user.id);
      await event.save();
    }

    return event.populate('attendees');
  }

  @Mutation(() => EventType)
  async approveEvent(@Arg("id") id: string, @Ctx() { user }: any) {
    const event = await Event.findById(id);
    if (!event) throw new Error("Event not found");

    const isAllowed = event.departments.some((d: string) =>
      isDepartmentAdmin(user, d)
    );

    if (!isAllowed && !isTopAdmin(user) && !isInstitutionalAdmin(user)) {
      throw new Error("Not authorized to approve this event");
    }

    event.isApproved = true;
    await event.save();
    return event.populate('organizers');
  }

  @Query(() => [EventType])
  async getAllEvents(@Ctx() { user }: any) {
    if (isTopAdmin(user) || isInstitutionalAdmin(user)) {
      return await Event.find().populate('organizers');
    }
    return await Event.find({ isApproved: true }).populate('organizers');
  }

  @Query(() => [EventType])
  async getMyEvents(@Ctx() { user }: any) {
    return await Event.find({
      $or: [
        { organizers: user.id },
        { attendees: user.id }
      ]
    }).populate('organizers');
  }
}