import { Resolver, Query, Mutation, Arg, Ctx, Authorized, ID } from 'type-graphql';
import { Group } from '../../models/group.model';
import { GroupMessage } from '../../models/groupMessage.model';
import { GroupType, GroupMessageType } from '../types/group.type';
import { IUser } from '../../models/user.model';

// Define a type for our context, similar to how your middleware sets it
interface IContext {
  user: IUser;
}

// Helper function to fix nested populated objects
const fixLeanObject = (doc: any) => {
  if (!doc) return null;
  return {
    ...doc,
    id: doc._id.toString(),
  };
};

@Resolver()
export class GroupResolver {

  // ✅ Get all groups
  @Authorized()
  @Query(() => [GroupType])
  async getGroups(): Promise<GroupType[]> {
    const groupsFromDb = await Group.find()
      .populate(['members', 'admins', 'requests'])
      .lean(); // Use plain .lean()

    // Manually map the results to guarantee the 'id' field exists.
    return groupsFromDb.map(group => ({
      ...group,
      id: group._id.toString(),
      members: group.members.map(fixLeanObject), // Fix nested members
      admins: group.admins.map(fixLeanObject),   // Fix nested admins
      requests: group.requests.map(fixLeanObject), // Fix nested requests
    }));
  }

  // ✅ Get all messages for a specific group
  @Authorized()
  @Query(() => [GroupMessageType])
  async getGroupMessages(
    @Arg('groupId', () => ID) groupId: string
  ): Promise<GroupMessageType[]> {
    const messagesFromDb = await GroupMessage.find({ groupId })
      .populate('sender')
      .sort({ createdAt: 'asc' })
      .lean(); // Use plain .lean()

    // Manually map the results to the exact shape GraphQL expects.
    return messagesFromDb.map(msg => ({
      ...msg,
      id: msg._id.toString(),
      sender: fixLeanObject(msg.sender) // Fix the populated sender object
    }));
  }

  // ✅ Create a new group
  @Authorized()
  @Mutation(() => GroupType)
  async createGroup(
    @Arg('name') name: string,
    @Arg('type') type: string,
    @Arg('description', { nullable: true }) description: string,
    @Ctx() { user }: IContext
  ): Promise<GroupType> {
    const group = new Group({
      name, type, description,
      createdBy: user._id,
      members: [user._id],
      admins: [user._id],
      isOfficial: false
    });
    
    await group.save();
    
    // We must populate the fields to return the full User objects
    const populatedGroup = await group.populate(['members', 'admins']);

    // Manually convert and fix the object
    const groupObject = populatedGroup.toObject();
    return {
      ...groupObject,
      id: groupObject._id.toString(),
      members: groupObject.members.map(fixLeanObject),
      admins: groupObject.admins.map(fixLeanObject),
    };
  }

  // ✅ Request to join a group
  @Authorized()
  @Mutation(() => String)
  async requestJoinGroup(
    @Arg('groupId', () => ID) groupId: string,
    @Ctx() { user }: IContext
  ): Promise<string> {
    const group = await Group.findById(groupId);
    if (!group) throw new Error("Group not found");
    if (group.members.some(id => id.toString() === user._id.toString())) throw new Error("Already a member");
    if (group.requests.some(id => id.toString() === user._id.toString())) throw new Error("Request already sent");

    group.requests.push(user._id);
    await group.save();
    return "Join request sent";
  }

  // ✅ Approve a join request (Admin only)
  @Authorized()
  @Mutation(() => String)
  async approveGroupRequest(
    @Arg('groupId', () => ID) groupId: string,
    @Arg('userId', () => ID) userId: string,
    @Ctx() { user }: IContext
  ): Promise<string> {
    const group = await Group.findById(groupId);
    if (!group) throw new Error("Group not found");
    if (!group.admins.some(id => id.toString() === user._id.toString())) throw new Error("Only admins can approve requests");
    if (!group.members.some(id => id.toString() === userId)) {
        group.members.push(userId as any);
    }
    group.requests = group.requests.filter((id) => id.toString() !== userId);
    await group.save();
    return "User added to group";
  }

  // ✅ Send a message to a group
  @Authorized()
  @Mutation(() => GroupMessageType)
  async sendGroupMessage(
    @Arg('groupId', () => ID) groupId: string,
    @Arg('content') content: string,
    @Ctx() { user }: IContext
  ): Promise<GroupMessageType> {
    const group = await Group.findById(groupId);
    if (!group) throw new Error("Group not found");
    if (!group.members.some(id => id.toString() === user._id.toString())) throw new Error("You are not a member of this group");
    if (group.chatMode === 'formal' && !group.admins.some(id => id.toString() === user._id.toString())) {
      throw new Error("Only admins can send messages in formal mode");
    }

    const message = new GroupMessage({ groupId, sender: user._id, content });
    await message.save();

    const populatedMessage = await message.populate('sender');
    // Manually convert and fix the object
    const messageObject = populatedMessage.toObject();
    return {
      ...messageObject,
      id: messageObject._id.toString(),
      sender: fixLeanObject(messageObject.sender),
    };
  }

  // ✅ Toggle chat mode (Admin only)
  @Authorized()
  @Mutation(() => String)
  async toggleChatMode(
    @Arg('groupId', () => ID) groupId: string,
    @Ctx() { user }: IContext
  ): Promise<string> {
    const group = await Group.findById(groupId);
    if (!group) throw new Error("Group not found");
    if (!group.admins.some(id => id.toString() === user._id.toString())) throw new Error("Only admins can toggle chat mode");

    group.chatMode = group.chatMode === 'formal' ? 'informal' : 'formal';
    await group.save();
    return `Chat mode set to ${group.chatMode}`;
  }
}