import { useState, useMemo } from 'react';
import type { Transaction } from '../utils/Interfaces';
import { TransactionType } from '../utils/enums';
import DashboardHeader from '../components/DashboardComponents/DashboardHeader';
import AlertsSection from '../components/DashboardComponents/AlertsSection';
import ProductionKPIs from '../components/DashboardComponents/ProductionKPIs';
import ExpenseChart from '../components/DashboardComponents/ExpenseChart';
import AttendanceBreakdown from '../components/DashboardComponents/AttendanceBreakdown';
import ActivityFeed from '../components/DashboardComponents/ActivityFeed';
import QuickActions from '../components/DashboardComponents/QuickActions';
import { useQuery } from "@apollo/client";
import { GET_DASHBOARD_KPIS, GET_TRANSACTIONS } from "../graphql/queries";
import Loading from "../components/Loading";

interface DashboardKPIs {
  todayAttendance: {
    totalEmployees: number;
    presentCount: number;
    absentCount: number;
    halfDayCount: number;
    onLeaveCount: number;
    otCount: number;
    totalManDays: number;
    totalOTHours: number;
    totalWages: number;
  };
  financialSummary: {
    todayExpenses: number;
    todayIncome: number;
    monthExpenses: number;
    monthIncome: number;
    netProfit: number;
    categoryTotals: { category: string; total: number; count: number }[];
  };
  firewoodStatus: {
    currentStock: number;
    todayConsumption: number;
    averageDailyConsumption: number;
    daysRemaining: number;
    lowStockThreshold: number;
    isLowStock: boolean;
  };
  packingMaterialsStatus: {
    currentStock: number;
    todayConsumption: number;
    averageDailyConsumption: number;
    daysRemaining: number;
    lowStockThreshold: number;
    isLowStock: boolean;
  };
  greenLeafStatus: {
    todayIntake: number;
    thisMonthIntake: number;
    averageDailyIntake: number;
    conversionRatio: number;
    unprocessedLeaf: number;
  };
  madeTeaStatus: {
    totalStock: number;
    todayProduction: number;
    thisMonthProduction: number;
    thisMonthDispatch: number;
    gradeStocks: { grade: string; quantity: number; stockStatus: string }[];
    estimatedValue: number;
  };
  recentActivities: { id: string; activityType: string; description: string; createdAt: string }[];
  alerts: { type: string; message: string; severity: string }[];
}

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [periodView, setPeriodView] = useState<'today' | 'mtd' | 'ytd'>('today');

  // GraphQL queries
  const { data: dashboardData, loading: dashboardLoading } = useQuery(GET_DASHBOARD_KPIS, {
    variables: { date: selectedDate },
    fetchPolicy: 'cache-and-network',
  });

  const { data: transactionsData, loading: transactionsLoading } = useQuery(GET_TRANSACTIONS, {
    fetchPolicy: 'cache-and-network',
  });

  const kpis: DashboardKPIs | null = dashboardData?.dashboardKPIs || null;
  const transactions: Transaction[] = transactionsData?.transactions || [];

  const isLoading = dashboardLoading || transactionsLoading;

  // Calculate date ranges
  const dateRanges = useMemo(() => {
    const now = new Date(selectedDate);
    const today = selectedDate;
    
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    
    const yearStart = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
    const yearEnd = new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0];

    return { today, monthStart, monthEnd, yearStart, yearEnd };
  }, [selectedDate]);

  // Filter transactions by period
  const filteredTransactions = useMemo(() => {
    const { today, monthStart, monthEnd, yearStart, yearEnd } = dateRanges;
    
    return transactions.filter(txn => {
      const txnDate = txn.date;
      switch (periodView) {
        case 'today':
          return txnDate === today;
        case 'mtd':
          return txnDate >= monthStart && txnDate <= monthEnd;
        case 'ytd':
          return txnDate >= yearStart && txnDate <= yearEnd;
        default:
          return false;
      }
    });
  }, [transactions, periodView, dateRanges]);

  // Calculate financial metrics from filtered transactions or use KPIs
  const financialMetrics = useMemo(() => {
    if (periodView === 'today' && kpis) {
      // Use dashboard KPIs for today's view
      const expensesByCategory: Record<string, number> = {};
      kpis.financialSummary.categoryTotals.forEach(ct => {
        expensesByCategory[ct.category] = ct.total;
      });
      
      return {
        income: kpis.financialSummary.todayIncome,
        expenses: kpis.financialSummary.todayExpenses,
        netProfit: kpis.financialSummary.netProfit,
        expensesByCategory,
      };
    }
    
    // Calculate from filtered transactions for MTD/YTD
    const income = filteredTransactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = filteredTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const netProfit = income - expenses;

    // Category-wise expenses
    const expensesByCategory: Record<string, number> = {};
    filteredTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .forEach(t => {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
      });

    return { income, expenses, netProfit, expensesByCategory };
  }, [filteredTransactions, kpis, periodView]);

  // Today's attendance metrics from KPIs
  const todayAttendance = useMemo(() => {
    if (kpis?.todayAttendance) {
      return {
        total: kpis.todayAttendance.totalEmployees,
        present: kpis.todayAttendance.presentCount,
        absent: kpis.todayAttendance.absentCount,
        halfDay: kpis.todayAttendance.halfDayCount,
        onLeave: kpis.todayAttendance.onLeaveCount,
        otWorkers: kpis.todayAttendance.otCount,
        totalOTHours: kpis.todayAttendance.totalOTHours,
        totalWages: kpis.todayAttendance.totalWages,
      };
    }
    return {
      total: 0,
      present: 0,
      absent: 0,
      halfDay: 0,
      onLeave: 0,
      otWorkers: 0,
      totalOTHours: 0,
      totalWages: 0,
    };
  }, [kpis]);

  // Inventory metrics from KPIs
  const inventoryMetrics = useMemo(() => ({
    greenLeaf: {
      today: kpis?.greenLeafStatus?.todayIntake || 0,
      thisMonth: kpis?.greenLeafStatus?.thisMonthIntake || 0,
    },
    madeTea: {
      today: kpis?.madeTeaStatus?.todayProduction || 0,
      currentStock: kpis?.madeTeaStatus?.totalStock || 0,
    },
    firewood: {
      currentStock: kpis?.firewoodStatus?.currentStock || 0,
      daysRemaining: kpis?.firewoodStatus?.daysRemaining || 0,
      todayConsumption: kpis?.firewoodStatus?.todayConsumption || 0,
    },
    packingMaterials: {
      lowStock: kpis?.packingMaterialsStatus?.isLowStock || false,
    },
  }), [kpis]);

  // Recent activity from KPIs or transactions
  const recentActivity = useMemo(() => {
    // Return recent activities from KPIs if available
    if (kpis?.recentActivities && kpis.recentActivities.length > 0) {
      return kpis.recentActivities.slice(0, 5).map(act => ({
        id: act.id,
        description: act.description,
        date: selectedDate,
        type: 'Income' as const,
        category: act.activityType as any,
        amount: 0,
        paymentType: 'Cash' as const,
        createdAt: act.createdAt,
      }));
    }
    
    // Fallback to filtered transactions
    const todayTransactions = transactions
      .filter(t => t.date === dateRanges.today)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    
    return todayTransactions;
  }, [transactions, dateRanges.today, kpis, selectedDate]);

  // Alerts from KPIs or calculated
  const alerts = useMemo(() => {
    // Use alerts from KPIs if available
    if (kpis?.alerts && kpis.alerts.length > 0) {
      return kpis.alerts.map(a => ({
        type: (a.severity === 'high' ? 'error' : a.severity === 'medium' ? 'warning' : 'info') as 'warning' | 'error' | 'info',
        message: a.message,
      }));
    }
    
    const alertsList: Array<{ type: 'warning' | 'error' | 'info'; message: string }> = [];
    
    // Low firewood stock
    if (inventoryMetrics.firewood.daysRemaining > 0 && inventoryMetrics.firewood.daysRemaining < 5) {
      alertsList.push({ type: 'warning', message: `Firewood stock low: ${inventoryMetrics.firewood.daysRemaining} days remaining` });
    }
    
    // High expense spike (20% above average)
    if (periodView === 'today' && financialMetrics.expenses > 100000) {
      alertsList.push({ type: 'warning', message: `High daily expenses: Rs. ${financialMetrics.expenses.toLocaleString()}` });
    }
    
    // Attendance not marked
    if (todayAttendance.present === 0 && todayAttendance.total > 0) {
      alertsList.push({ type: 'error', message: 'Attendance not marked for today' });
    }
    
    // Packing materials low
    if (inventoryMetrics.packingMaterials.lowStock) {
      alertsList.push({ type: 'warning', message: 'Packing materials stock low' });
    }

    return alertsList;
  }, [inventoryMetrics, financialMetrics, todayAttendance, periodView, kpis]);

  if (isLoading && !dashboardData && !transactionsData) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <DashboardHeader
        selectedDate={selectedDate}
        periodView={periodView}
        onDateChange={setSelectedDate}
        onPeriodChange={setPeriodView}
      />

      {/* Alerts Section */}
      <AlertsSection alerts={alerts} />

      {/* Financial KPIs */}
      {/* <FinancialKPIs
        financialMetrics={financialMetrics}
        todayAttendance={todayAttendance}
        periodView={periodView}
      /> */}

      {/* Production & Stock KPIs */}
      <ProductionKPIs inventoryMetrics={inventoryMetrics} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Expense Breakdown */}
          <ExpenseChart
            expensesByCategory={financialMetrics.expensesByCategory}
            totalExpenses={financialMetrics.expenses}
          />

          {/* Attendance Summary */}
          <AttendanceBreakdown todayAttendance={todayAttendance} />
        </div>

        {/* Right Column - Activity & Quick Actions */}
        <div className="space-y-6">
          {/* Today's Activity */}
          <ActivityFeed recentActivity={recentActivity} />

          {/* Quick Actions */}
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;