import { Post } from '../models/Post';
import { Group } from '../models/Group';
import { User } from '../models/User';

export const exploreResolvers = {
  Query: {
    getTrendingPosts: async (_: any, { limit }: any) => {
      const since = new Date();
      since.setDate(since.getDate() - 7);

      return await Post.aggregate([
        { $match: { timestamp: { $gte: since } } },
        {
          $addFields: {
            engagementScore: { $add: ['$likes', { $size: '$comments' }] }
          }
        },
        { $sort: { engagementScore: -1 } },
        { $limit: limit },
        {
          $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: '_id',
            as: 'author'
          }
        },
        { $unwind: '$author' }
      ]);
    },

    getSuggestedGroups: async (_: any, { limit }: any, { user }: any) => {
  const currentUser = await User.findById(user.id);

  if (!currentUser) {
    throw new Error("User not found");
  }

  return await Group.find({
    _id: { $nin: currentUser.groups }
  })
    .sort({ isOfficial: -1 })
    .limit(limit)
    .populate('members');
},
    getPopularGroups: async (_: any, { limit }: any) => {
      return await Group.aggregate([
        { $addFields: { memberCount: { $size: '$members' } } },
        { $sort: { memberCount: -1 } },
        { $limit: limit }
      ]);
    }
  }
};
