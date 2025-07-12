import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLInputObjectType,
  GraphQLBoolean,
} from 'graphql';

// GraphQL Types
export const PortfolioEntryType = new GraphQLObjectType({
  name: 'PortfolioEntry',
  fields: () => ({
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    link: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLString) },
  }),
});

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID) },
    auth0Id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    avatarUrl: { type: GraphQLString },
    bio: { type: GraphQLString },
    department: { type: GraphQLString },
    degree: { type: GraphQLString },
    graduationYear: { type: GraphQLInt },
    linkedin: { type: GraphQLString },
    github: { type: GraphQLString },
    portfolio: { type: new GraphQLList(PortfolioEntryType) },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
});

export const UserProfileResultType = new GraphQLObjectType({
  name: 'UserProfileResult',
  fields: () => ({
    user: { type: UserType },
    isOwner: { type: new GraphQLNonNull(GraphQLBoolean) },
  }),
});

export const UpdatePortfolioEntryInputType = new GraphQLInputObjectType({
  name: 'UpdatePortfolioEntryInput',
  fields: () => ({
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    link: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLString) },
  }),
});

export const AddPortfolioEntryInputType = new GraphQLInputObjectType({
  name: 'AddPortfolioEntryInput',
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    link: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLString) },
  }),
});

export const UpdateUserInputType = new GraphQLInputObjectType({
  name: 'UpdateUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    avatarUrl: { type: GraphQLString },
    bio: { type: GraphQLString },
    department: { type: GraphQLString },
    degree: { type: GraphQLString },
    graduationYear: { type: GraphQLInt },
    linkedin: { type: GraphQLString },
    github: { type: GraphQLString },
    portfolio: { type: new GraphQLList(UpdatePortfolioEntryInputType) },
  }),
});

// TypeScript Types for Data Models (Mongoose compatible)
export interface User {
  _id?: any; // Mongoose ObjectId compatibility
  auth0Id: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  bio?: string;
  department?: string;
  degree?: string;
  graduationYear?: number;
  linkedin?: string;
  github?: string;
  portfolio?: PortfolioEntry[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PortfolioEntry {
  title?: string;
  description?: string;
  link?: string;
  tags?: string[];
}

export interface UserProfileResult {
  user?: User;
  isOwner: boolean;
}

export interface UpdatePortfolioEntryInput {
  title?: string;
  description?: string;
  link?: string;
  tags?: string[];
}

export interface AddPortfolioEntryInput {
  title: string;
  description?: string;
  link?: string;
  tags?: string[];
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  avatarUrl?: string;
  bio?: string;
  department?: string;
  degree?: string;
  graduationYear?: number;
  linkedin?: string;
  github?: string;
  portfolio?: UpdatePortfolioEntryInput[];
}

// TypeScript Types for Resolver Args
export interface GetUserProfileArgs {
  userId: string;
}

export interface UpdateMyProfileArgs {
  input: UpdateUserInput;
}

export interface AddPortfolioEntryArgs {
  input: AddPortfolioEntryInput;
}

export interface UpdatePortfolioEntryArgs {
  index: number;
  input: UpdatePortfolioEntryInput;
}

export interface DeletePortfolioEntryArgs {
  index: number;
}
