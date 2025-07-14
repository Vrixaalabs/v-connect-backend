import express from "express";
import http from "http";
import { ApolloServer } from "apollo-server-express";
import 'dotenv/config';
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { schema } from "./graphql/index";
import jwt from "jsonwebtoken";
import { User } from "./models/user.model";
import { authMiddleware } from "./middleware/auth";
import { Document } from "mongoose";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(authMiddleware);

interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

interface UserDocument extends Document {
  _id: string;
  // Add other user fields as needed
}

const getUserFromToken = async (
  token: string
): Promise<UserDocument | null> => {
  try {
    if (!token) return null;
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    return (await User.findById(decoded.userId)) as UserDocument | null;
  } catch (err) {
    return null;
  }
};

const startServer = async () => {
  try {
    // MongoDB Connection
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/vconnect"
    );
    console.log("✅ Connected to MongoDB");

    const server = new ApolloServer({
      schema,
      context: async ({ req }) => {
        const token = req.headers.authorization || "";
        const user = await getUserFromToken(token);
        return { user: req.user || null };
      },
      plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground()
      ],
      introspection: true,
    });

    await server.start();

    server.applyMiddleware({ app, cors: false }); // `cors` already handled by express

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
};

startServer();
