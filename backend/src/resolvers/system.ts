import type { Context } from '../index.js';

export const systemResolvers = {
  Query: {
    systemSettings: async (_: unknown, __: unknown, { prisma }: Context) => {
      return prisma.systemSetting.findMany();
    },

    systemSetting: async (
      _: unknown,
      { key }: { key: string },
      { prisma }: Context
    ) => {
      return prisma.systemSetting.findUnique({ where: { key } });
    },
  },

  Mutation: {
    updateSystemSetting: async (
      _: unknown,
      { key, value }: { key: string; value: string },
      { prisma, user }: Context
    ) => {
      return prisma.systemSetting.upsert({
        where: { key },
        update: { value, updatedById: user?.id },
        create: { key, value, updatedById: user?.id },
      });
    },
  },
};
