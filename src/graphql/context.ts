import { ExpressContext } from 'apollo-server-express';
import { mockUsers } from '../middleware/mockauth';
import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { userResolvers } from './resolvers/user.resolver';

 
export interface AuthUser {
  sub: string;
  name?: string;
  email?: string;
}

export interface GraphQLContext {
  user?: AuthUser;
}

export const createContext = async ({ req }: ExpressContext): Promise<GraphQLContext> => {
  const token = req.headers.authorization?.replace('Bearer ', '') || '';
  
 
  if (req.user) {
    return { 
      user: {
        sub: req.user.auth0Id,
        name: req.user.name,
        email: req.user.email,
      }
    };
  }

  // Fallback to mock authentication for development
  const mockUser = mockUsers[token];
  if (mockUser) {
    console.log('✅ Mock authentication successful');
    return { user: mockUser };
  }

  return { user: undefined };
};

 
export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      ...userResolvers.Query,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      ...userResolvers.Mutation,
    },
  }),
});