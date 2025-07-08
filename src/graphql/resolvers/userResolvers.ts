import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../../models/user.model.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const generateToken = (userId) =>
  jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1d' });

export const userResolvers = {
  Query: {
    users: async () => {
      return User.find();
    },

    me: async (_parent, _args, { user }) => {
      return user || null;
    }
  },
};
