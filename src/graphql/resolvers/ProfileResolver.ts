import { GraphQLNonNull, GraphQLID, GraphQLInt } from 'graphql';
import { User } from '../../models/Profile.model';
import { 
  UserType, 
  UserProfileResultType, 
  UpdateUserInputType,
  UpdatePortfolioEntryInputType,
  AddPortfolioEntryInputType,
  User as UserTypeInterface,
  AddPortfolioEntryArgs,
  UpdatePortfolioEntryArgs,
  DeletePortfolioEntryArgs
} from '../typeDefs/Profile.type';

export const userResolvers = {
  Query: {
    getMyProfile: {
      type: UserType,
      resolve: async (_parent: unknown, __: unknown, context: { user?: { sub: string } }): Promise<UserTypeInterface | null> => {
        if (!context.user) return null;
        return await User.findOne({ auth0Id: context.user.sub });
      },
    },

    getUserProfile: {
      type: UserProfileResultType,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_parent: unknown, args: any, context: { user?: { sub: string } }): Promise<{ user?: UserTypeInterface; isOwner: boolean }> => {
        const user = await User.findById(args.userId);
        const isOwner = context.user?.sub === user?.auth0Id;
        return { user: user || undefined, isOwner };
      },
    },
  },

  Mutation: {
    updateMyProfile: {
      type: UserType,
      args: {
        input: { type: new GraphQLNonNull(UpdateUserInputType) },
      },
      resolve: async (_parent: unknown, args: any, context: { user?: { sub: string } }): Promise<UserTypeInterface> => {
        if (!context.user) throw new Error('Unauthorized');
        const updatedUser = await User.findOneAndUpdate(
          { auth0Id: context.user.sub },
          args.input,
          { new: true, runValidators: true }
        );
        if (!updatedUser) throw new Error('User not found');
        return updatedUser;
      },
    },

    addPortfolioEntry: {
      type: UserType,
      args: {
        input: { type: new GraphQLNonNull(AddPortfolioEntryInputType) },
      },
      resolve: async (_parent: unknown, args: AddPortfolioEntryArgs, context: { user?: { sub: string } }): Promise<UserTypeInterface> => {
        if (!context.user) throw new Error('Unauthorized');
        
        const user = await User.findOne({ auth0Id: context.user.sub });
        if (!user) throw new Error('User not found');
 
        user.portfolio = user.portfolio || [];
        user.portfolio.push(args.input);
        
        const updatedUser = await user.save();
        return updatedUser;
      },
    },

    updatePortfolioEntry: {
      type: UserType,
      args: {
        index: { type: new GraphQLNonNull(GraphQLInt) },
        input: { type: new GraphQLNonNull(UpdatePortfolioEntryInputType) },
      },
      resolve: async (_parent: unknown, args: UpdatePortfolioEntryArgs, context: { user?: { sub: string } }): Promise<UserTypeInterface> => {
        if (!context.user) throw new Error('Unauthorized');
        
        const user = await User.findOne({ auth0Id: context.user.sub });
        if (!user) throw new Error('User not found');

        if (!user.portfolio || args.index < 0 || args.index >= user.portfolio.length) {
          throw new Error('Invalid portfolio entry index');
        }

   
        user.portfolio[args.index] = {
          ...user.portfolio[args.index],
          ...args.input,
        };
        
        const updatedUser = await user.save();
        return updatedUser;
      },
    },

    deletePortfolioEntry: {
      type: UserType,
      args: {
        index: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: async (_parent: unknown, args: DeletePortfolioEntryArgs, context: { user?: { sub: string } }): Promise<UserTypeInterface> => {
        if (!context.user) throw new Error('Unauthorized');
        
        const user = await User.findOne({ auth0Id: context.user.sub });
        if (!user) throw new Error('User not found');

        if (!user.portfolio || args.index < 0 || args.index >= user.portfolio.length) {
          throw new Error('Invalid portfolio entry index');
        }

 
        user.portfolio.splice(args.index, 1);
        
        const updatedUser = await user.save();
        return updatedUser;
      },
    },
  },
};
