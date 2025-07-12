import { ApolloServer } from 'apollo-server-express';
import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createContext, schema } from './graphql/context';
import { connectDB } from './db';
import { authMiddleware } from './middleware/auth';

dotenv.config();

const startServer = async () => {
  await connectDB();

  const app: Application = express();

 
  app.use(cors());
  app.use(express.json());
  app.use(authMiddleware);

  const server = new ApolloServer({
    schema,
    context: createContext,
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startServer();
