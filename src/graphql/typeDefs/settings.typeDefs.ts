import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLInputObjectType,
} from 'graphql';

/**
 * Output Type: NotificationPreferences
 */
export const NotificationPreferencesType = new GraphQLObjectType({
  name: 'NotificationPreferences',
  fields: {
    friendRequest: { type: new GraphQLNonNull(GraphQLBoolean) },
    eventInvite: { type: new GraphQLNonNull(GraphQLBoolean) },
    alumniStatus: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
});

/**
 * Output Type: UserSettings
 */
export const UserSettingsType = new GraphQLObjectType({
  name: 'UserSettings',
  fields: {
    profileVisibility: { type: new GraphQLNonNull(GraphQLString) },
    friendRequestPermission: { type: new GraphQLNonNull(GraphQLString) },
    notifications: { type: new GraphQLNonNull(NotificationPreferencesType) },
  },
});

/**
 * Input Type: NotificationPreferencesInput
 */
export const NotificationPreferencesInput = new GraphQLInputObjectType({
  name: 'NotificationPreferencesInput',
  fields: {
    friendRequest: { type: GraphQLBoolean },
    eventInvite: { type: GraphQLBoolean },
    alumniStatus: { type: GraphQLBoolean },
  },
});

/**
 * Input Type: UpdateSettingsInput
 */
export const UpdateSettingsInput = new GraphQLInputObjectType({
  name: 'UpdateSettingsInput',
  fields: {
    profileVisibility: { type: GraphQLString },
    friendRequestPermission: { type: GraphQLString },
    notifications: { type: NotificationPreferencesInput },
  },
});
