import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import movieSchema from "./schemas/schema.js";
import movieResolvers from "./resolvers/resolvers.js";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;

const DB_CONNECTION = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@cluster0.${process.env.CLUSTER_ID}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    await mongoose.connect(DB_CONNECTION);
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

async function startServer() {
  const server = new ApolloServer({
    typeDefs: movieSchema,
    resolvers: movieResolvers,
  });

  await server.start();

  app.use("/graphql", cors(), express.json(), expressMiddleware(server));

  app.listen(PORT, async () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    await connectDB();
  });
}

startServer();
