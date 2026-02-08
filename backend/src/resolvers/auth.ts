import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { Context } from '../index.js';

export const authResolvers = {
  Query: {
    me: async (_: unknown, __: unknown, { prisma, user }: Context) => {
      if (!user) return null;
      return prisma.user.findUnique({ where: { id: user.id } });
    },
  },
  Mutation: {
    login: async (
      _: unknown,
      { username, password }: { username: string; password: string },
      { prisma }: Context
    ) => {
      console.log('🔐 Login attempt for username:', username);
      
      try {
        // Find user by username OR email
        console.log('📊 Querying database for user...');
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { username: username },
              { email: username },
            ],
          },
        });
        console.log('✅ Database query completed. User found:', !!user);
      
        if (!user) {
          console.warn('⚠️ User not found:', username);
          throw new Error('Invalid username or password');
        }

        console.log('🔑 Verifying password...');
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
          console.warn('⚠️ Invalid password for user:', username);
          throw new Error('Invalid username or password');
        }

        console.log('📝 Updating last login...');
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });

        console.log('🎟️ Generating JWT token...');
        const token = jwt.sign(
          { userId: user.id, username: user.username, role: user.role },
          process.env.JWT_SECRET!,
          { expiresIn: '24h' }
        );

        console.log('✅ Login successful for user:', username);
        return { token, user };
      } catch (error) {
        console.error('❌ Login error:', error);
        throw error;
      }
    },

    register: async (
      _: unknown,
      { username, email, password, fullName }: { username: string; email: string; password: string; fullName: string },
      { prisma }: Context
    ) => {
      const existingUser = await prisma.user.findFirst({
        where: { OR: [{ username }, { email }] },
      });

      if (existingUser) {
        throw new Error('Username or email already exists');
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          username,
          email,
          passwordHash,
          fullName,
          role: 'user',
        },
      });

      const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      return { token, user };
    },
  },
};
