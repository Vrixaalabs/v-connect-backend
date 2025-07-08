import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './graphql/resolvers/user.resolver';
import { PostResolver } from './graphql/resolvers/post.resolver';
import { authMiddleware } from './middleware/auth';
import { GroupResolver } from './graphql/resolvers/group.resolver';

dotenv.config();

const app: express.Application = express();

app.use(cors());
app.use(express.json());
app.use(authMiddleware);

const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vconnect');
    console.log('Connected to MongoDB');

    // Create Apollo Server
    const schema = await buildSchema({
      resolvers: [UserResolver, PostResolver,GroupResolver],
      validate: false,
      authChecker: ({ context }) => {
        // Check if user exists in context (set by auth middleware)
        return !!context.user;
      },
    });

    const server = new ApolloServer({
      schema,
      context: ({ req }) => {
        return {
          req,
          user: req.user, // Set by auth middleware
        };
      },
      introspection: true,
    });

    await server.start();
    server.applyMiddleware({ 
      app,
      cors: false // Already handled by express cors middleware
    });

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
      console.log(`📝 Apollo Studio available at http://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer(); 