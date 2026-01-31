import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { typeDefs } from './schema/typeDefs.js';
import { resolvers } from './resolvers/index.js';

dotenv.config();

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  user: { id: string; username: string; role: string } | null;
}

async function startServer() {
  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: parseInt(process.env.PORT || '4000') },
    context: async ({ req }): Promise<Context> => {
      const token = req.headers.authorization?.replace('Bearer ', '');
      let user = null;

      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            userId: string;
            username: string;
            role: string;
          };
          user = {
            id: decoded.userId,
            username: decoded.username,
            role: decoded.role,
          };
        } catch (error) {
          // Invalid token - user remains null
        }
      }

      return { prisma, user };
    },
  });

  console.log(`🚀 Server ready at: ${url}`);
  console.log(`📊 GraphQL Playground available at: ${url}`);
}

startServer().catch(console.error);
