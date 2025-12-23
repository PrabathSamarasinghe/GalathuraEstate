import { useState, useEffect, useMemo } from 'react';
import type { Transaction, AttendanceRecord, Employee } from '../utils/Interfaces';
import { TransactionType, EmployeeStatus } from '../utils/enums';
import DashboardHeader from '../components/DashboardComponents/DashboardHeader';
import AlertsSection from '../components/DashboardComponents/AlertsSection';
import FinancialKPIs from '../components/DashboardComponents/FinancialKPIs';
import ProductionKPIs from '../components/DashboardComponents/ProductionKPIs';
import ExpenseChart from '../components/DashboardComponents/ExpenseChart';
import AttendanceBreakdown from '../components/DashboardComponents/AttendanceBreakdown';
import ActivityFeed from '../components/DashboardComponents/ActivityFeed';
import QuickActions from '../components/DashboardComponents/QuickActions';

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [periodView, setPeriodView] = useState<'today' | 'mtd' | 'ytd'>('today');
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const storedTransactions = localStorage.getItem('galathura_transactions');
    const storedAttendance = localStorage.getItem('galathura_attendance');
    const storedEmployees = localStorage.getItem('galathura_employees');

    if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
    if (storedAttendance) setAttendance(JSON.parse(storedAttendance));
    if (storedEmployees) setEmployees(JSON.parse(storedEmployees));
  }, []);

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

  // Calculate financial metrics
  const financialMetrics = useMemo(() => {
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
  }, [filteredTransactions]);

  // Today's attendance metrics
  const todayAttendance = useMemo(() => {
    const todayRecords = attendance.filter(a => a.date === dateRanges.today);
    const activeEmployees = employees.filter(e => e.status === EmployeeStatus.ACTIVE);
    
    return {
      total: activeEmployees.length,
      present: todayRecords.filter(a => a.status === 'Present').length,
      absent: activeEmployees.length - todayRecords.length,
      halfDay: todayRecords.filter(a => a.status === 'Half Day').length,
      onLeave: todayRecords.filter(a => a.status === 'On Leave').length,
      otWorkers: todayRecords.filter(a => a.otHours > 0).length,
      totalOTHours: todayRecords.reduce((sum, a) => sum + a.otHours, 0),
      totalWages: todayRecords.reduce((sum, a) => sum + a.calculatedWage, 0),
    };
  }, [attendance, employees, dateRanges.today]);

  // Inventory metrics (mock data - replace with actual localStorage data when available)
  const inventoryMetrics = useMemo(() => ({
    greenLeaf: {
      today: 0, // Will be calculated from actual data
      thisMonth: 0,
    },
    madeTea: {
      today: 0,
      currentStock: 0,
    },
    firewood: {
      currentStock: 0,
      daysRemaining: 0,
      todayConsumption: 0,
    },
    packingMaterials: {
      lowStock: false,
    },
  }), []);

  // Recent activity
  const recentActivity = useMemo(() => {
    const todayTransactions = transactions
      .filter(t => t.date === dateRanges.today)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    
    return todayTransactions;
  }, [transactions, dateRanges.today]);

  // Alerts
  const alerts = useMemo(() => {
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
  }, [inventoryMetrics, financialMetrics, todayAttendance, periodView]);

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