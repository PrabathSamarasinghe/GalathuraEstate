import type { Context } from '../index.js';
import type { Prisma } from '@prisma/client';

interface TransactionFilterInput {
  dateFrom?: string;
  dateTo?: string;
  type?: string;
  category?: string;
  paymentType?: string;
  searchTerm?: string;
}

interface TransactionInput {
  date: string;
  type: string;
  category: string;
  description: string;
  amount: number;
  paymentType: string;
  referenceNo?: string;
  remarks?: string;
}

export const transactionResolvers = {
  Query: {
    transactions: async (
      _: unknown,
      { filter, limit = 100, offset = 0 }: { filter?: TransactionFilterInput; limit?: number; offset?: number },
      { prisma }: Context
    ) => {
      const where: Prisma.TransactionWhereInput = {};

      if (filter) {
        if (filter.dateFrom && filter.dateTo) {
          where.date = {
            gte: new Date(filter.dateFrom),
            lte: new Date(filter.dateTo),
          };
        } else if (filter.dateFrom) {
          where.date = { gte: new Date(filter.dateFrom) };
        } else if (filter.dateTo) {
          where.date = { lte: new Date(filter.dateTo) };
        }
        
        if (filter.type) where.type = filter.type as any;
        if (filter.category) where.category = filter.category;
        if (filter.paymentType) where.paymentType = filter.paymentType as any;
        if (filter.searchTerm) {
          where.OR = [
            { description: { contains: filter.searchTerm } },
            { referenceNo: { contains: filter.searchTerm } },
          ];
        }
      }

      return prisma.transaction.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { date: 'desc' },
      });
    },

    transaction: async (_: unknown, { id }: { id: string }, { prisma }: Context) => {
      return prisma.transaction.findUnique({ where: { id } });
    },

    nextTransactionId: async (_: unknown, __: unknown, { prisma }: Context) => {
      const lastTransaction = await prisma.transaction.findFirst({
        orderBy: { id: 'desc' },
      });

      if (lastTransaction) {
        const lastNum = parseInt(lastTransaction.id.slice(3));
        return `TXN${String(lastNum + 1).padStart(6, '0')}`;
      }

      return 'TXN000001';
    },

    transactionSummary: async (
      _: unknown,
      { dateFrom, dateTo }: { dateFrom?: string; dateTo?: string },
      { prisma }: Context
    ) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      // Today's transactions
      const todayTransactions = await prisma.transaction.findMany({
        where: { date: today },
      });

      const todayExpenses = todayTransactions
        .filter(t => t.type === 'Expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const todayIncome = todayTransactions
        .filter(t => t.type === 'Income')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      // Month's transactions
      const monthTransactions = await prisma.transaction.findMany({
        where: {
          date: { gte: monthStart, lte: monthEnd },
        },
      });

      const monthExpenses = monthTransactions
        .filter(t => t.type === 'Expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const monthIncome = monthTransactions
        .filter(t => t.type === 'Income')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      // Category totals
      const categoryTotals = monthTransactions.reduce((acc, t) => {
        const existing = acc.find(c => c.category === t.category);
        if (existing) {
          existing.total += Number(t.amount);
          existing.count += 1;
        } else {
          acc.push({ category: t.category, total: Number(t.amount), count: 1 });
        }
        return acc;
      }, [] as { category: string; total: number; count: number }[]);

      return {
        todayExpenses,
        todayIncome,
        monthExpenses,
        monthIncome,
        netProfit: monthIncome - monthExpenses,
        categoryTotals,
      };
    },

    profitLossStatement: async (
      _: unknown,
      { dateFrom, dateTo }: { dateFrom: string; dateTo: string },
      { prisma }: Context
    ) => {
      const transactions = await prisma.transaction.findMany({
        where: {
          date: {
            gte: new Date(dateFrom),
            lte: new Date(dateTo),
          },
        },
      });

      const getTotal = (category: string) =>
        transactions
          .filter(t => t.category === category)
          .reduce((sum, t) => sum + Number(t.amount), 0);

      // Income
      const madeTeaSales = getTotal('Made Tea Sales');
      const otherIncome = getTotal('Other Income');
      const totalIncome = madeTeaSales + otherIncome;

      // Cost of Production
      const greenLeafCost = getTotal('Green Leaf Cost');
      const laborCost = getTotal('Labor Cost');
      const fuelPower = getTotal('Fuel & Power');
      const packingMaterials = getTotal('Packing Materials');
      const totalCostOfProduction = greenLeafCost + laborCost + fuelPower + packingMaterials;

      // Gross Profit
      const grossProfit = totalIncome - totalCostOfProduction;
      const grossProfitMargin = totalIncome > 0 ? (grossProfit / totalIncome) * 100 : 0;

      // Operating Expenses
      const factoryOverheads = getTotal('Factory Overheads');
      const maintenanceRepairs = getTotal('Maintenance & Repairs');
      const transportHandling = getTotal('Transport & Handling');
      const administrative = getTotal('Administrative Expenses');
      const totalOperatingExpenses = factoryOverheads + maintenanceRepairs + transportHandling + administrative;

      // Operating Profit
      const operatingProfit = grossProfit - totalOperatingExpenses;
      const operatingProfitMargin = totalIncome > 0 ? (operatingProfit / totalIncome) * 100 : 0;

      // Financial Expenses
      const financialExpenses = getTotal('Financial Expenses');

      // Net Profit
      const netProfit = operatingProfit - financialExpenses;
      const netProfitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

      return {
        madeTeaSales,
        otherIncome,
        totalIncome,
        greenLeafCost,
        laborCost,
        fuelPower,
        packingMaterials,
        totalCostOfProduction,
        grossProfit,
        grossProfitMargin,
        factoryOverheads,
        maintenanceRepairs,
        transportHandling,
        administrative,
        totalOperatingExpenses,
        operatingProfit,
        operatingProfitMargin,
        financialExpenses,
        netProfit,
        netProfitMargin,
      };
    },
  },

  Mutation: {
    createTransaction: async (
      _: unknown,
      { input }: { input: TransactionInput },
      { prisma, user }: Context
    ) => {
      // Generate transaction ID
      const lastTransaction = await prisma.transaction.findFirst({
        orderBy: { id: 'desc' },
      });

      let newId = 'TXN000001';
      if (lastTransaction) {
        const lastNum = parseInt(lastTransaction.id.slice(3));
        newId = `TXN${String(lastNum + 1).padStart(6, '0')}`;
      }

      const transaction = await prisma.transaction.create({
        data: {
          id: newId,
          date: new Date(input.date),
          type: input.type as any,
          category: input.category,
          description: input.description,
          amount: input.amount,
          paymentType: input.paymentType as any,
          referenceNo: input.referenceNo,
          remarks: input.remarks,
          createdById: user?.id,
        },
      });

      // Log activity
      await prisma.activityLog.create({
        data: {
          activityType: 'TRANSACTION_CREATED',
          description: `${input.type} of Rs. ${input.amount} - ${input.category}`,
          userId: user?.id,
          entityType: 'transaction',
          entityId: transaction.id,
        },
      });

      return transaction;
    },

    updateTransaction: async (
      _: unknown,
      { id, input }: { id: string; input: TransactionInput },
      { prisma, user }: Context
    ) => {
      return prisma.transaction.update({
        where: { id },
        data: {
          date: new Date(input.date),
          type: input.type as any,
          category: input.category,
          description: input.description,
          amount: input.amount,
          paymentType: input.paymentType as any,
          referenceNo: input.referenceNo,
          remarks: input.remarks,
          lastEditedById: user?.id,
          lastEditedAt: new Date(),
        },
      });
    },

    deleteTransaction: async (
      _: unknown,
      { id }: { id: string },
      { prisma }: Context
    ) => {
      await prisma.transaction.delete({ where: { id } });
      return true;
    },
  },
};
