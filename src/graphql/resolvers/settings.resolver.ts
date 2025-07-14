import { GraphQLNonNull } from 'graphql';
import { User } from '../../models/user.model';
import {
  UserSettingsType,
  UpdateSettingsInput,
} from '../typeDefs/settings.typeDefs';

type Resolvers = any;
export const settingsResolvers: Resolvers = {
  Query: {
    getMySettings: {
      type: new GraphQLNonNull(UserSettingsType),
      resolve: async (
        _: unknown,
        __: unknown,
        context: { user?: { id: string } }
      ) => {
        const { user } = context;
        if (!user) throw new Error('Not authenticated');

        const me = await User.findById(user.id);
        if (!me) throw new Error('User not found');

        return me.settings;
      },
    },
  },

  Mutation: {
    updateMySettings: {
      type: new GraphQLNonNull(UserSettingsType),
      args: {
        input: { type: new GraphQLNonNull(UpdateSettingsInput) },
      },
      resolve: async (
        _: unknown,
        { input }: { input: any }, // (Optional) You can define a custom TypeScript interface here
        context: { user?: { id: string } }
      ) => {
        const { user } = context;
        if (!user) throw new Error('Not authenticated');

        const updatedUser = await User.findByIdAndUpdate(
          user.id,
          { $set: { settings: input } },
          { new: true }
        );

        if (!updatedUser) throw new Error('Update failed');

        return updatedUser.settings;
      },
    },
  },
};
