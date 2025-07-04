import User from '../models/user.model';
import { isTopAdmin, isInstitutionalAdmin, isDepartmentAdmin } from '../utils/roleValidation';
createEvent: async (_, { input }, { user }) => {
  const isOrganizer = input.organizers.includes(user.id);
  if (!isOrganizer) throw new Error("You must be listed as an organizer");
    // Ensure at least one organizer is from each department
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
  return event.populate('organizers').populate('createdBy');
}
joinEvent: async (_, { eventId }, { user }) => {
  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");

  if (!event.attendees.includes(user.id)) {
    event.attendees.push(user.id);
    await event.save();
  }

  return event.populate('attendees');
}
approveEvent: async (_, { id }, { user }) => {
  const event = await Event.findById(id);
  if (!event) throw new Error("Event not found");

  // Check user is authorized for at least one department
  const isAllowed = event.departments.some((d) =>
    isDepartmentAdmin(user, d)
  );

  if (!isAllowed && !isTopAdmin(user) && !isInstitutionalAdmin(user)) {
    throw new Error("Not authorized to approve this event");
  }

  event.isApproved = true;
  await event.save();
  return event.populate('organizers');
}
getAllEvents: async (_, __, { user }) => {
  if (isTopAdmin(user) || isInstitutionalAdmin(user)) {
    return await Event.find().populate('organizers');
  }
  return await Event.find({ isApproved: true }).populate('organizers');
}
getMyEvents: async (_, __, { user }) => {
  return await Event.find({
    $or: [
      { organizers: user.id },
      { attendees: user.id }
    ]
  }).populate('organizers');
}