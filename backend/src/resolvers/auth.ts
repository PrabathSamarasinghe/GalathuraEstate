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
      // Find user by username OR email
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { username: username },
            { email: username },
          ],
        },
      });
      
      if (!user) {
        throw new Error('Invalid username or password');
      }

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        throw new Error('Invalid username or password');
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });

      const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      return { token, user };
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
