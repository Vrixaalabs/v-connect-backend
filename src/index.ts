import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './src/graphql/resolvers/user.resolver';
import { PostResolver } from './src/graphql/resolvers/post.resolver';
import { authMiddleware } from './src/middleware/auth';

dotenv.config();

const app = express();

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
      resolvers: [UserResolver, PostResolver],
      validate: false,
    });

    const server = new ApolloServer({
      schema,
      context: ({ req }) => {
        return {
          req,
          user: req.user, // Set by auth middleware
        };
      },
    });

    await server.start();
    server.applyMiddleware({ app });

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer(); 