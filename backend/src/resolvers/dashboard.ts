import type { Context } from '../index.js';

export const dashboardResolvers = {
  Query: {
    dashboardKPIs: async (
      _: unknown,
      { date }: { date?: string },
      { prisma }: Context
    ) => {
      const targetDate = date ? new Date(date) : new Date();
      targetDate.setHours(0, 0, 0, 0);

      const monthStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);

      // Attendance Summary
      const attendanceRecords = await prisma.attendanceRecord.findMany({
        where: { date: targetDate },
      });

      const totalEmployees = await prisma.employee.count({
        where: { status: 'Active' },
      });

      const presentCount = attendanceRecords.filter(r => r.status === 'Present').length;
      const absentCount = attendanceRecords.filter(r => r.status === 'Absent').length;
      const halfDayCount = attendanceRecords.filter(r => r.status === 'HalfDay').length;
      const onLeaveCount = attendanceRecords.filter(r => r.status === 'OnLeave').length;
      const otCount = attendanceRecords.filter(r => Number(r.otHours) > 0).length;
      const totalManDays = presentCount + (halfDayCount * 0.5);
      const totalOTHours = attendanceRecords.reduce((sum, r) => sum + Number(r.otHours), 0);
      const totalWages = attendanceRecords.reduce((sum, r) => sum + Number(r.calculatedWage), 0);

      const todayAttendance = {
        totalEmployees,
        presentCount,
        absentCount,
        halfDayCount,
        onLeaveCount,
        otCount,
        totalManDays,
        totalOTHours,
        totalWages,
      };

      // Financial Summary
      const todayTransactions = await prisma.transaction.findMany({
        where: { date: targetDate },
      });

      const monthTransactions = await prisma.transaction.findMany({
        where: { date: { gte: monthStart } },
      });

      const todayExpenses = todayTransactions
        .filter(t => t.type === 'Expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const todayIncome = todayTransactions
        .filter(t => t.type === 'Income')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const monthExpenses = monthTransactions
        .filter(t => t.type === 'Expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const monthIncome = monthTransactions
        .filter(t => t.type === 'Income')
        .reduce((sum, t) => sum + Number(t.amount), 0);

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

      const financialSummary = {
        todayExpenses,
        todayIncome,
        monthExpenses,
        monthIncome,
        netProfit: monthIncome - monthExpenses,
        categoryTotals,
      };

      // Firewood Status
      const latestFirewood = await prisma.firewoodTransaction.findFirst({
        orderBy: [{ date: 'desc' }, { time: 'desc' }],
      });

      const firewoodStock = latestFirewood ? Number(latestFirewood.runningBalance) : 0;

      const thirtyDaysAgo = new Date(targetDate);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const firewoodConsumption = await prisma.firewoodTransaction.findMany({
        where: { date: { gte: thirtyDaysAgo }, type: 'outflow' },
      });

      const firewoodTodayConsumption = await prisma.firewoodTransaction.findMany({
        where: { date: targetDate, type: 'outflow' },
      });

      const firewoodAvgConsumption = firewoodConsumption.reduce(
        (sum, t) => sum + Number(t.quantity),
        0
      ) / 30;

      const firewoodStatus = {
        currentStock: firewoodStock,
        todayConsumption: firewoodTodayConsumption.reduce((sum, t) => sum + Number(t.quantity), 0),
        averageDailyConsumption: firewoodAvgConsumption,
        daysRemaining: firewoodAvgConsumption > 0 ? firewoodStock / firewoodAvgConsumption : 999,
        lowStockThreshold: 500,
        isLowStock: firewoodStock < 500,
      };

      // Packing Materials Status
      const latestPacking = await prisma.packingMaterialsTransaction.findFirst({
        orderBy: [{ date: 'desc' }, { time: 'desc' }],
      });

      const packingStock = latestPacking ? Number(latestPacking.runningBalance) : 0;

      const packingConsumption = await prisma.packingMaterialsTransaction.findMany({
        where: { date: { gte: thirtyDaysAgo }, type: 'outflow' },
      });

      const packingTodayConsumption = await prisma.packingMaterialsTransaction.findMany({
        where: { date: targetDate, type: 'outflow' },
      });

      const packingAvgConsumption = packingConsumption.reduce(
        (sum, t) => sum + Number(t.quantity),
        0
      ) / 30;

      const packingMaterialsStatus = {
        currentStock: packingStock,
        todayConsumption: packingTodayConsumption.reduce((sum, t) => sum + Number(t.quantity), 0),
        averageDailyConsumption: packingAvgConsumption,
        daysRemaining: packingAvgConsumption > 0 ? packingStock / packingAvgConsumption : 999,
        lowStockThreshold: 1000,
        isLowStock: packingStock < 1000,
      };

      // Green Leaf Status
      const todayIntakes = await prisma.greenLeafIntake.findMany({
        where: { date: targetDate },
      });

      const monthIntakes = await prisma.greenLeafIntake.findMany({
        where: { date: { gte: monthStart } },
      });

      const todayIntake = todayIntakes.reduce((sum, i) => sum + Number(i.netWeight), 0);
      const thisMonthIntake = monthIntakes.reduce((sum, i) => sum + Number(i.netWeight), 0);
      const daysInMonth = targetDate.getDate();
      const averageDailyIntake = thisMonthIntake / daysInMonth;

      const greenLeafStatus = {
        todayIntake,
        thisMonthIntake,
        averageDailyIntake,
        conversionRatio: 22,
        unprocessedLeaf: 0,
      };

      // Made Tea Status
      const madeTeaStocks = await prisma.madeTeaStock.findMany();
      const totalStock = madeTeaStocks.reduce((sum, s) => sum + Number(s.quantity), 0);

      const todayMadeTeaTransactions = await prisma.madeTeaTransaction.findMany({
        where: { date: targetDate },
      });

      const monthMadeTeaTransactions = await prisma.madeTeaTransaction.findMany({
        where: { date: { gte: monthStart } },
      });

      const todayProduction = todayMadeTeaTransactions
        .filter(t => t.type === 'production')
        .reduce((sum, t) => sum + Number(t.inflow), 0);

      const thisMonthProduction = monthMadeTeaTransactions
        .filter(t => t.type === 'production')
        .reduce((sum, t) => sum + Number(t.inflow), 0);

      const thisMonthDispatch = monthMadeTeaTransactions
        .filter(t => t.type === 'dispatch')
        .reduce((sum, t) => sum + Number(t.outflow), 0);

      const madeTeaStatus = {
        totalStock,
        todayProduction,
        thisMonthProduction,
        thisMonthDispatch,
        gradeStocks: madeTeaStocks.map(s => ({
          ...s,
          quantity: Number(s.quantity),
          stockStatus: Number(s.quantity) > 4000 ? 'Overstocked' : Number(s.quantity) < 800 ? 'Low Stock' : 'Normal',
        })),
        estimatedValue: totalStock * 500,
      };

      // Recent Activities
      const recentActivities = await prisma.activityLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
      });

      // Alerts
      const alerts = [];
      
      if (firewoodStatus.isLowStock) {
        alerts.push({
          type: 'warning',
          message: `Firewood stock low: ${firewoodStatus.daysRemaining.toFixed(1)} days remaining`,
          severity: 'warning',
        });
      }

      if (packingMaterialsStatus.isLowStock) {
        alerts.push({
          type: 'warning',
          message: `Packing materials stock low: ${packingMaterialsStatus.daysRemaining.toFixed(1)} days remaining`,
          severity: 'warning',
        });
      }

      const unmarkedEmployees = totalEmployees - attendanceRecords.length;
      if (unmarkedEmployees > 0) {
        alerts.push({
          type: 'info',
          message: `${unmarkedEmployees} employees have unmarked attendance today`,
          severity: 'info',
        });
      }

      return {
        todayAttendance,
        financialSummary,
        firewoodStatus,
        packingMaterialsStatus,
        greenLeafStatus,
        madeTeaStatus,
        recentActivities,
        alerts,
      };
    },

    activityLogs: async (
      _: unknown,
      { limit = 50, offset = 0 }: { limit?: number; offset?: number },
      { prisma }: Context
    ) => {
      return prisma.activityLog.findMany({
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      });
    },
  },
};
