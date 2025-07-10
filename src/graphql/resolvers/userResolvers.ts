import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../models/user.model';
import { UserType, GraphQLContext } from '../typeDefs/user.types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function generateToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1d' });
}

export const userResolvers = {
  Query: {
    users: {
      type: new GraphQLList(UserType),
      resolve: async () => {
        return await User.find();
      },
    },

    me: {
      type: UserType,
      resolve: async (_parent: unknown, _args: unknown, context: GraphQLContext) => {
        return context.user || null;
      },
    },
  },

  Mutation: {
    login: {
      type: GraphQLString, // return JWT token as string
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_parent: any, { email, password }: any) => {
        const user = await User.findOne({ email });
        if (!user) throw new Error('User not found');

        const isMatch = await bcrypt.compare(password, user.password || '');
        if (!isMatch) throw new Error('Invalid credentials');

        return generateToken(user.id);
      },
    },
  },
};
