import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { typeDefs } from './schema/typeDefs.js';
import { resolvers } from './resolvers/index.js';

dotenv.config();

// Log environment configuration (sanitized)
console.log('🔧 Environment Configuration:');
console.log('  NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('  PORT:', process.env.PORT || '4000');
console.log('  JWT_SECRET:', process.env.JWT_SECRET ? '✓ Set' : '✗ Not set');
console.log('  FRONTEND_URL:', process.env.FRONTEND_URL || 'not set');

const dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
  // Sanitize URL for logging
  const sanitized = dbUrl.replace(/:\/\/([^:]+):([^@]+)@/, '://***:***@');
  console.log('  DATABASE_URL:', sanitized);
} else {
  console.error('  DATABASE_URL: ✗ Not set!');
}

console.log('\n📦 Initializing Prisma Client...');
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Test database connection
prisma.$connect()
  .then(() => console.log('✅ Database connected successfully'))
  .catch((error) => {
    console.error('❌ Database connection failed:', error.message);
    console.error('Full error:', error);
  });

export interface Context {
  prisma: PrismaClient;
  user: { id: string; username: string; role: string } | null;
}

async function startServer() {
  console.log('\n🚀 Starting Apollo Server...');
  
  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
    formatError: (error) => {
      console.error('❌ GraphQL Error:', {
        message: error.message,
        path: error.path,
        extensions: error.extensions,
      });
      return error;
    },
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
          console.log('✅ Authenticated user:', user.username);
        } catch (error) {
          console.warn('⚠️ Invalid token received');
        }
      }

      return { prisma, user };
    },
  });

  console.log('\n✅ Server ready!');
  console.log(`🚀 Server URL: ${url}`);
  console.log(`📊 GraphQL Playground: ${url}`);
  console.log('\n📝 Logs:');
}

startServer().catch(console.error);
