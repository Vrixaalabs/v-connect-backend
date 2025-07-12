import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createContext, schema } from './graphql/context';
import { authMiddleware } from './middleware/auth0';

dotenv.config();

const startServer = async () => {
  try {
    // MongoDB Connection
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/user-profile-dev');
    console.log('✅ Connected to MongoDB');

    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(authMiddleware);

    const server = new ApolloServer({
      schema,
      context: createContext,
      introspection: true
    });

    await server.start();
    server.applyMiddleware({ app, cors: false }); // `cors` already handled by express

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
};

startServer();
