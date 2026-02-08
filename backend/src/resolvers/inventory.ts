import type { Context } from '../index.js';

interface FirewoodTransactionInput {
  date: string;
  time: string;
  type: string;
  quantity: number;
  factory?: string;
  supervisor?: string;
  remarks?: string;
}

interface PackingMaterialsTransactionInput {
  date: string;
  time: string;
  type: string;
  quantity: number;
  materialType?: string;
  factory?: string;
  supervisor?: string;
  remarks?: string;
}

interface GreenLeafIntakeInput {
  date: string;
  time: string;
  supplier: string;
  supplierType: string;
  vehicleNumber: string;
  grossWeight: number;
  tareWeight: number;
  quality?: string;
  session: string;
  remarks?: string;
}

interface ProductionBatchInput {
  batchNumber: string;
  date: string;
  greenLeafUsed: number;
  madeTeaProduced: number;
}

interface DispatchRecordInput {
  date: string;
  dispatchNumber: string;
  grade: string;
  quantity: number;
  destination: string;
  buyer?: string;
  vehicleNumber?: string;
  invoiceNumber?: string;
  remarks?: string;
}

export const inventoryResolvers = {
  Query: {
    // Firewood
    firewoodTransactions: async (
      _: unknown,
      { dateFrom, dateTo, limit = 100, offset = 0 }: { dateFrom?: string; dateTo?: string; limit?: number; offset?: number },
      { prisma }: Context
    ) => {
      const where: any = {};
      if (dateFrom && dateTo) {
        where.date = { gte: new Date(dateFrom), lte: new Date(dateTo) };
      }

      return prisma.firewoodTransaction.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: [{ date: 'desc' }, { time: 'desc' }],
      });
    },

    firewoodSummary: async (_: unknown, __: unknown, { prisma }: Context) => {
      const latestTransaction = await prisma.firewoodTransaction.findFirst({
        orderBy: [{ date: 'desc' }, { time: 'desc' }],
      });

      const currentStock = latestTransaction ? Number(latestTransaction.runningBalance) : 0;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayTransactions = await prisma.firewoodTransaction.findMany({
        where: { date: today, type: 'outflow' },
      });

      const todayConsumption = todayTransactions.reduce(
        (sum, t) => sum + Number(t.quantity),
        0
      );

      // Calculate 30-day average
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const monthTransactions = await prisma.firewoodTransaction.findMany({
        where: { date: { gte: thirtyDaysAgo }, type: 'outflow' },
      });

      const totalConsumption = monthTransactions.reduce(
        (sum, t) => sum + Number(t.quantity),
        0
      );
      const averageDailyConsumption = totalConsumption / 30;

      const lowStockThreshold = 500;
      const daysRemaining = averageDailyConsumption > 0 ? currentStock / averageDailyConsumption : 999;

      return {
        currentStock,
        todayConsumption,
        averageDailyConsumption,
        daysRemaining,
        lowStockThreshold,
        isLowStock: currentStock < lowStockThreshold,
      };
    },

    // Packing Materials
    packingMaterialsTransactions: async (
      _: unknown,
      { dateFrom, dateTo, limit = 100, offset = 0 }: { dateFrom?: string; dateTo?: string; limit?: number; offset?: number },
      { prisma }: Context
    ) => {
      const where: any = {};
      if (dateFrom && dateTo) {
        where.date = { gte: new Date(dateFrom), lte: new Date(dateTo) };
      }

      return prisma.packingMaterialsTransaction.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: [{ date: 'desc' }, { time: 'desc' }],
      });
    },

    packingMaterialsSummary: async (_: unknown, __: unknown, { prisma }: Context) => {
      const latestTransaction = await prisma.packingMaterialsTransaction.findFirst({
        orderBy: [{ date: 'desc' }, { time: 'desc' }],
      });

      const currentStock = latestTransaction ? Number(latestTransaction.runningBalance) : 0;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayTransactions = await prisma.packingMaterialsTransaction.findMany({
        where: { date: today, type: 'outflow' },
      });

      const todayConsumption = todayTransactions.reduce(
        (sum, t) => sum + Number(t.quantity),
        0
      );

      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const monthTransactions = await prisma.packingMaterialsTransaction.findMany({
        where: { date: { gte: thirtyDaysAgo }, type: 'outflow' },
      });

      const totalConsumption = monthTransactions.reduce(
        (sum, t) => sum + Number(t.quantity),
        0
      );
      const averageDailyConsumption = totalConsumption / 30;

      const lowStockThreshold = 1000;
      const daysRemaining = averageDailyConsumption > 0 ? currentStock / averageDailyConsumption : 999;

      return {
        currentStock,
        todayConsumption,
        averageDailyConsumption,
        daysRemaining,
        lowStockThreshold,
        isLowStock: currentStock < lowStockThreshold,
      };
    },

    // Green Leaf
    greenLeafIntakes: async (
      _: unknown,
      { dateFrom, dateTo, limit = 100, offset = 0 }: { dateFrom?: string; dateTo?: string; limit?: number; offset?: number },
      { prisma }: Context
    ) => {
      const where: any = {};
      if (dateFrom && dateTo) {
        where.date = { gte: new Date(dateFrom), lte: new Date(dateTo) };
      }

      return prisma.greenLeafIntake.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: [{ date: 'desc' }, { time: 'desc' }],
      });
    },

    greenLeafSummary: async (_: unknown, __: unknown, { prisma }: Context) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayIntakes = await prisma.greenLeafIntake.findMany({
        where: { date: today },
      });

      const todayIntake = todayIntakes.reduce(
        (sum, i) => sum + Number(i.netWeight),
        0
      );

      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthIntakes = await prisma.greenLeafIntake.findMany({
        where: { date: { gte: monthStart } },
      });

      const thisMonthIntake = monthIntakes.reduce(
        (sum, i) => sum + Number(i.netWeight),
        0
      );

      const daysInMonth = today.getDate();
      const averageDailyIntake = thisMonthIntake / daysInMonth;

      // Get production data for conversion ratio
      const monthProduction = await prisma.productionBatch.findMany({
        where: { date: { gte: monthStart } },
      });

      const totalGreenLeafUsed = monthProduction.reduce(
        (sum, p) => sum + Number(p.greenLeafUsed),
        0
      );
      const totalMadeTeaProduced = monthProduction.reduce(
        (sum, p) => sum + Number(p.madeTeaProduced),
        0
      );

      const conversionRatio = totalGreenLeafUsed > 0
        ? (totalMadeTeaProduced / totalGreenLeafUsed) * 100
        : 22;

      // Calculate unprocessed leaf (simplified)
      const unprocessedLeaf = thisMonthIntake - totalGreenLeafUsed;

      return {
        todayIntake,
        thisMonthIntake,
        averageDailyIntake,
        conversionRatio,
        unprocessedLeaf: Math.max(0, unprocessedLeaf),
      };
    },

    // Production Batches
    productionBatches: async (
      _: unknown,
      { dateFrom, dateTo, limit = 100, offset = 0 }: { dateFrom?: string; dateTo?: string; limit?: number; offset?: number },
      { prisma }: Context
    ) => {
      const where: any = {};
      if (dateFrom && dateTo) {
        where.date = { gte: new Date(dateFrom), lte: new Date(dateTo) };
      }

      return prisma.productionBatch.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { date: 'desc' },
      });
    },

    productionBatch: async (_: unknown, { id }: { id: string }, { prisma }: Context) => {
      return prisma.productionBatch.findUnique({ where: { id } });
    },

    // Made Tea
    madeTeaStocks: async (_: unknown, __: unknown, { prisma }: Context) => {
      const stocks = await prisma.madeTeaStock.findMany();
      return stocks.map(s => ({
        ...s,
        quantity: Number(s.quantity),
        stockStatus: Number(s.quantity) > 4000 ? 'Overstocked' : Number(s.quantity) < 800 ? 'Low Stock' : 'Normal',
      }));
    },

    madeTeaTransactions: async (
      _: unknown,
      { dateFrom, dateTo, grade, limit = 100, offset = 0 }: { dateFrom?: string; dateTo?: string; grade?: string; limit?: number; offset?: number },
      { prisma }: Context
    ) => {
      const where: any = {};
      if (dateFrom && dateTo) {
        where.date = { gte: new Date(dateFrom), lte: new Date(dateTo) };
      }
      if (grade) where.grade = grade;

      return prisma.madeTeaTransaction.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: [{ date: 'desc' }, { time: 'desc' }],
      });
    },

    madeTeaSummary: async (_: unknown, __: unknown, { prisma }: Context) => {
      const stocks = await prisma.madeTeaStock.findMany();
      const totalStock = stocks.reduce((sum, s) => sum + Number(s.quantity), 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

      const todayTransactions = await prisma.madeTeaTransaction.findMany({
        where: { date: today },
      });

      const todayProduction = todayTransactions
        .filter(t => t.type === 'production')
        .reduce((sum, t) => sum + Number(t.inflow), 0);

      const monthTransactions = await prisma.madeTeaTransaction.findMany({
        where: { date: { gte: monthStart } },
      });

      const thisMonthProduction = monthTransactions
        .filter(t => t.type === 'production')
        .reduce((sum, t) => sum + Number(t.inflow), 0);

      const thisMonthDispatch = monthTransactions
        .filter(t => t.type === 'dispatch')
        .reduce((sum, t) => sum + Number(t.outflow), 0);

      // Estimated value (average Rs. 500 per kg)
      const estimatedValue = totalStock * 500;

      return {
        totalStock,
        todayProduction,
        thisMonthProduction,
        thisMonthDispatch,
        gradeStocks: stocks.map(s => ({
          ...s,
          quantity: Number(s.quantity),
          stockStatus: Number(s.quantity) > 4000 ? 'Overstocked' : Number(s.quantity) < 800 ? 'Low Stock' : 'Normal',
        })),
        estimatedValue,
      };
    },

    // Dispatch
    dispatchRecords: async (
      _: unknown,
      { dateFrom, dateTo, grade, limit = 100, offset = 0 }: { dateFrom?: string; dateTo?: string; grade?: string; limit?: number; offset?: number },
      { prisma }: Context
    ) => {
      const where: any = {};
      if (dateFrom && dateTo) {
        where.date = { gte: new Date(dateFrom), lte: new Date(dateTo) };
      }
      if (grade) where.grade = grade;

      return prisma.dispatchRecord.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { date: 'desc' },
      });
    },

    dispatchRecord: async (_: unknown, { id }: { id: string }, { prisma }: Context) => {
      return prisma.dispatchRecord.findUnique({ where: { id } });
    },
  },

  Mutation: {
    createFirewoodTransaction: async (
      _: unknown,
      { input }: { input: FirewoodTransactionInput },
      { prisma, user }: Context
    ) => {
      // Get current balance
      const latest = await prisma.firewoodTransaction.findFirst({
        orderBy: [{ date: 'desc' }, { time: 'desc' }],
      });

      const currentBalance = latest ? Number(latest.runningBalance) : 0;
      const newBalance = input.type === 'inflow'
        ? currentBalance + input.quantity
        : currentBalance - input.quantity;

      const [hours, minutes] = input.time.split(':').map(Number);
      const timeDate = new Date();
      timeDate.setHours(hours, minutes, 0, 0);

      return prisma.firewoodTransaction.create({
        data: {
          date: new Date(input.date),
          time: timeDate,
          type: input.type as any,
          quantity: input.quantity,
          factory: input.factory,
          supervisor: input.supervisor,
          remarks: input.remarks,
          runningBalance: newBalance,
          createdById: user?.id,
        },
      });
    },

    deleteFirewoodTransaction: async (
      _: unknown,
      { id }: { id: string },
      { prisma }: Context
    ) => {
      await prisma.firewoodTransaction.delete({ where: { id } });
      return true;
    },

    createPackingMaterialsTransaction: async (
      _: unknown,
      { input }: { input: PackingMaterialsTransactionInput },
      { prisma, user }: Context
    ) => {
      const latest = await prisma.packingMaterialsTransaction.findFirst({
        orderBy: [{ date: 'desc' }, { time: 'desc' }],
      });

      const currentBalance = latest ? Number(latest.runningBalance) : 0;
      const newBalance = input.type === 'inflow'
        ? currentBalance + input.quantity
        : currentBalance - input.quantity;

      const [hours, minutes] = input.time.split(':').map(Number);
      const timeDate = new Date();
      timeDate.setHours(hours, minutes, 0, 0);

      return prisma.packingMaterialsTransaction.create({
        data: {
          date: new Date(input.date),
          time: timeDate,
          type: input.type as any,
          quantity: input.quantity,
          materialType: input.materialType,
          factory: input.factory,
          supervisor: input.supervisor,
          remarks: input.remarks,
          runningBalance: newBalance,
          createdById: user?.id,
        },
      });
    },

    deletePackingMaterialsTransaction: async (
      _: unknown,
      { id }: { id: string },
      { prisma }: Context
    ) => {
      await prisma.packingMaterialsTransaction.delete({ where: { id } });
      return true;
    },

    createGreenLeafIntake: async (
      _: unknown,
      { input }: { input: GreenLeafIntakeInput },
      { prisma, user }: Context
    ) => {
      const netWeight = input.grossWeight - input.tareWeight;

      const [hours, minutes] = input.time.split(':').map(Number);
      const timeDate = new Date();
      timeDate.setHours(hours, minutes, 0, 0);

      return prisma.greenLeafIntake.create({
        data: {
          date: new Date(input.date),
          time: timeDate,
          supplier: input.supplier,
          supplierType: input.supplierType as any,
          vehicleNumber: input.vehicleNumber,
          grossWeight: input.grossWeight,
          tareWeight: input.tareWeight,
          netWeight,
          quality: input.quality,
          session: input.session as any,
          remarks: input.remarks,
          createdById: user?.id,
        },
      });
    },

    deleteGreenLeafIntake: async (
      _: unknown,
      { id }: { id: string },
      { prisma }: Context
    ) => {
      await prisma.greenLeafIntake.delete({ where: { id } });
      return true;
    },

    createProductionBatch: async (
      _: unknown,
      { input }: { input: ProductionBatchInput },
      { prisma, user }: Context
    ) => {
      const yieldPercentage = (input.madeTeaProduced / input.greenLeafUsed) * 100;

      return prisma.productionBatch.create({
        data: {
          batchNumber: input.batchNumber,
          date: new Date(input.date),
          greenLeafUsed: input.greenLeafUsed,
          madeTeaProduced: input.madeTeaProduced,
          yieldPercentage,
          createdById: user?.id,
        },
      });
    },

    deleteProductionBatch: async (
      _: unknown,
      { id }: { id: string },
      { prisma }: Context
    ) => {
      await prisma.productionBatch.delete({ where: { id } });
      return true;
    },

    createDispatchRecord: async (
      _: unknown,
      { input }: { input: DispatchRecordInput },
      { prisma, user }: Context
    ) => {
      // Update made tea stock
      await prisma.madeTeaStock.update({
        where: { grade: input.grade as any },
        data: { quantity: { decrement: input.quantity } },
      });

      // Create made tea transaction
      const stock = await prisma.madeTeaStock.findUnique({
        where: { grade: input.grade as any },
      });

      const now = new Date();
      await prisma.madeTeaTransaction.create({
        data: {
          date: new Date(input.date),
          time: now,
          reference: input.dispatchNumber,
          type: 'dispatch',
          grade: input.grade as any,
          outflow: input.quantity,
          balance: stock ? Number(stock.quantity) : 0,
          details: `Dispatch to ${input.destination}`,
          createdById: user?.id,
        },
      });

      return prisma.dispatchRecord.create({
        data: {
          date: new Date(input.date),
          dispatchNumber: input.dispatchNumber,
          grade: input.grade as any,
          quantity: input.quantity,
          destination: input.destination,
          buyer: input.buyer,
          vehicleNumber: input.vehicleNumber,
          invoiceNumber: input.invoiceNumber,
          remarks: input.remarks,
          createdById: user?.id,
        },
      });
    },

    deleteDispatchRecord: async (
      _: unknown,
      { id }: { id: string },
      { prisma }: Context
    ) => {
      await prisma.dispatchRecord.delete({ where: { id } });
      return true;
    },
  },

  // Field resolvers for date/time formatting
  FirewoodTransaction: {
    date: (parent: { date: Date }) => {
      return parent.date instanceof Date 
        ? parent.date.toISOString().split('T')[0]
        : parent.date;
    },
    time: (parent: { time: Date }) => {
      if (parent.time instanceof Date) {
        return parent.time.toISOString().split('T')[1]?.substring(0, 5) || '00:00';
      }
      return parent.time;
    },
  },

  PackingMaterialsTransaction: {
    date: (parent: { date: Date }) => {
      return parent.date instanceof Date 
        ? parent.date.toISOString().split('T')[0]
        : parent.date;
    },
    time: (parent: { time: Date }) => {
      if (parent.time instanceof Date) {
        return parent.time.toISOString().split('T')[1]?.substring(0, 5) || '00:00';
      }
      return parent.time;
    },
  },

  GreenLeafIntake: {
    date: (parent: { date: Date }) => {
      return parent.date instanceof Date 
        ? parent.date.toISOString().split('T')[0]
        : parent.date;
    },
    time: (parent: { time: Date }) => {
      if (parent.time instanceof Date) {
        return parent.time.toISOString().split('T')[1]?.substring(0, 5) || '00:00';
      }
      return parent.time;
    },
  },

  MadeTeaTransaction: {
    date: (parent: { date: Date }) => {
      return parent.date instanceof Date 
        ? parent.date.toISOString().split('T')[0]
        : parent.date;
    },
    time: (parent: { time: Date }) => {
      if (parent.time instanceof Date) {
        return parent.time.toISOString().split('T')[1]?.substring(0, 5) || '00:00';
      }
      return parent.time;
    },
  },
};
