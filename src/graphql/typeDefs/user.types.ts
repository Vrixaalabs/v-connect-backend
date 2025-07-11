import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

// 1. User object returned in resolvers
export interface UserGraphQL {
  id: string;
  name: string;
  email: string;
  department: string;
  batch: string;
  interests: string[];
  isAlumni: boolean;
  profilePicture?: string;
  friends: UserGraphQL[];
  createdAt: string;
  updatedAt: string;
}

// 2. Optional args for future queries (like getUser(id))
export interface GetUserArgs {
  id: string;
}

// 3. Authenticated user context
export interface GraphQLContext {
  user?: UserGraphQL | null;
}

// 4. GraphQLObjectType for User (used in resolvers)
export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: (): Record<string, any> => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    department: { type: new GraphQLNonNull(GraphQLString) },
    batch: { type: new GraphQLNonNull(GraphQLString) },
    interests: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))) },
    isAlumni: { type: new GraphQLNonNull(GraphQLBoolean) },
    profilePicture: { type: GraphQLString },
    friends: { type: new GraphQLNonNull(new GraphQLList(UserType)) },
    createdAt: { type: new GraphQLNonNull(GraphQLString) },
    updatedAt: { type: new GraphQLNonNull(GraphQLString) },
  }),
});
