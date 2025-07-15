import { ApolloServer } from 'apollo-server';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { typeDefs } from './schema/typeDefs';
import { exploreResolvers } from './resolvers/exploreResolvers';
import { verifyJWT } from './utils/auth';

dotenv.config();

const server = new ApolloServer({
  typeDefs,
  resolvers: exploreResolvers,
  context: ({ req }) => {
    const token = req.headers.authorization?.split(" ")[1];
    const user = token ? verifyJWT(token) : null;
    return { user };
  }
});

mongoose.connect(process.env.MONGODB_URI!).then(() => {
  console.log("✅ MongoDB connected");
  server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`🚀 Server running at ${url}`);
  });
});
