import 'reflect-metadata';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { pubsub } from './utils/pubsub';

import { UserResolver } from './graphql/resolvers/user.resolver';
import { PostResolver } from './graphql/resolvers/post.resolver';
import { NotificationResolver } from './graphql/resolvers/notification.resolver';
import { FriendResolver } from './graphql/resolvers/friend.resolver';
import { EventResolver } from './graphql/resolvers/event.resolver';
import { AlumniResolver } from './graphql/resolvers/alumni.resolver';
import { authMiddleware } from './middleware/auth';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(authMiddleware);


const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vconnect');
    console.log(' Connected to MongoDB');

    const schema = await buildSchema({
      resolvers: [UserResolver, PostResolver, NotificationResolver, FriendResolver, EventResolver, AlumniResolver],
      validate: false,
      authChecker: ({ context }) => !!context.user,
    });

    const apolloServer = new ApolloServer({
      schema,
      context: ({ req }) => ({ req, user: req.user, pubsub }),
      introspection: true,
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: false });

    const httpServer = http.createServer(app);

    SubscriptionServer.create(
      {
        schema,
        execute,
        subscribe,
        onConnect: async (connectionParams: any) => {
          console.log(' WebSocket connection attempt:', connectionParams);
          const token = connectionParams.authToken;
          if (!token) {
            console.log(' Missing auth token in connection params');
            throw new Error('Missing auth token');
          }
          try {
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            console.log(' WebSocket authenticated for user:', decoded.userId);
            return { user: { id: decoded.userId } }; 
          } catch (err) {
            console.log('Invalid token:', err.message);
            throw new Error('Invalid token');
          }
        },
        onDisconnect: () => console.log(' Subscription disconnected'),
      },
      {
        server: httpServer,
        path: apolloServer.graphqlPath,
      }
    );

    const PORT = process.env.PORT || 4000;
    httpServer.listen(PORT, () => {
      console.log(` GraphQL ready at http://localhost:${PORT}${apolloServer.graphqlPath}`);
      console.log(` Subscriptions ready at ws://localhost:${PORT}${apolloServer.graphqlPath}`);
    });
  } catch (error) {
    console.error(' Server failed to start:', error);
    process.exit(1);
  }
};

startServer();
