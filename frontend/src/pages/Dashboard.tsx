import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Transaction, AttendanceRecord, Employee } from '../utils/Interfaces';
import { TransactionType, ExpenseCategory, IncomeCategory, EmployeeStatus } from '../utils/enums';

const Dashboard = () => {
  const navigate = useNavigate();
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time operational & financial overview</p>
        </div>
        <div className="flex gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <select
            value={periodView}
            onChange={(e) => setPeriodView(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="today">Today</option>
            <option value="mtd">Month to Date</option>
            <option value="ytd">Year to Date</option>
          </select>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border-l-4 flex items-start gap-3 bg-green-50 border-green-500"
            >
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm font-medium text-green-800">{alert.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Revenue</h3>
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-green-600">Rs. {(financialMetrics.income / 1000).toFixed(0)}k</p>
          <p className="text-xs text-gray-500 mt-1">{periodView === 'today' ? 'Today' : periodView === 'mtd' ? 'This Month' : 'This Year'}</p>
        </div>

        {/* Expenses */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Expenses</h3>
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-800">Rs. {(financialMetrics.expenses / 1000).toFixed(0)}k</p>
          <p className="text-xs text-gray-500 mt-1">{periodView === 'today' ? 'Today' : periodView === 'mtd' ? 'This Month' : 'This Year'}</p>
        </div>

        {/* Net Profit/Loss */}
        <div className={`rounded-xl p-6 shadow-lg border ${
          financialMetrics.netProfit >= 0 ? 'bg-gradient-to-br from-green-500 to-green-600 text-white border-green-600' : 'bg-white text-gray-800 border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-sm font-medium ${
              financialMetrics.netProfit >= 0 ? 'opacity-90' : 'text-gray-600'
            }`}>Net {financialMetrics.netProfit >= 0 ? 'Profit' : 'Loss'}</h3>
            <svg className={`w-6 h-6 ${
              financialMetrics.netProfit >= 0 ? 'opacity-80' : 'text-gray-600'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={financialMetrics.netProfit >= 0 ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} />
            </svg>
          </div>
          <p className="text-3xl font-bold">Rs. {(Math.abs(financialMetrics.netProfit) / 1000).toFixed(0)}k</p>
          <p className={`text-xs mt-1 ${
            financialMetrics.netProfit >= 0 ? 'opacity-75' : 'text-gray-500'
          }`}>
            {financialMetrics.income > 0 ? `${((financialMetrics.netProfit / financialMetrics.income) * 100).toFixed(1)}% margin` : 'No income'}
          </p>
        </div>

        {/* Attendance */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Attendance</h3>
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-800">{todayAttendance.present}/{todayAttendance.total}</p>
          <p className="text-xs text-gray-500 mt-1">{todayAttendance.otWorkers} workers on OT</p>
        </div>
      </div>

      {/* Production & Stock KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-5 shadow border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Green Leaf (Today)</p>
              <p className="text-2xl font-bold text-gray-800">{inventoryMetrics.greenLeaf.today.toLocaleString()} kg</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Made Tea Stock</p>
              <p className="text-2xl font-bold text-gray-800">{inventoryMetrics.madeTea.currentStock.toLocaleString()} kg</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Firewood Stock</p>
              <p className="text-2xl font-bold text-gray-800">{inventoryMetrics.firewood.currentStock.toLocaleString()} kg</p>
              <p className="text-xs text-gray-500 mt-1">
                {inventoryMetrics.firewood.daysRemaining > 0 ? `~${inventoryMetrics.firewood.daysRemaining} days remaining` : 'Data unavailable'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Made Tea (Today)</p>
              <p className="text-2xl font-bold text-gray-800">{inventoryMetrics.madeTea.today.toLocaleString()} kg</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Expense Breakdown */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Expenses by Category</h3>
            {Object.keys(financialMetrics.expensesByCategory).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(financialMetrics.expensesByCategory)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 6)
                  .map(([category, amount]) => {
                    const percentage = (amount / financialMetrics.expenses) * 100;
                    return (
                      <div key={category}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700 font-medium">{category}</span>
                          <span className="text-gray-900 font-semibold">Rs. {amount.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% of total</p>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p>No expense data for selected period</p>
              </div>
            )}
          </div>

          {/* Attendance Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Attendance Breakdown</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">{todayAttendance.present}</p>
                <p className="text-sm text-gray-600 mt-1">Present</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-gray-600">{todayAttendance.absent}</p>
                <p className="text-sm text-gray-600 mt-1">Absent</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-gray-600">{todayAttendance.onLeave}</p>
                <p className="text-sm text-gray-600 mt-1">On Leave</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">OT Workers:</span>
                <span className="font-semibold text-gray-800">{todayAttendance.otWorkers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total OT Hours:</span>
                <span className="font-semibold text-gray-800">{todayAttendance.totalOTHours.toFixed(1)}</span>
              </div>
              <div className="flex justify-between col-span-2">
                <span className="text-gray-600">Today's Wages:</span>
                <span className="font-semibold text-gray-800">Rs. {todayAttendance.totalWages.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Activity & Quick Actions */}
        <div className="space-y-6">
          {/* Today's Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Activity</h3>
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      activity.type === TransactionType.INCOME ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.category}</p>
                      <p className={`text-sm font-semibold mt-1 ${
                        activity.type === TransactionType.INCOME ? 'text-green-600' : 'text-gray-700'
                      }`}>
                        {activity.type === TransactionType.INCOME ? '+' : '-'}Rs. {activity.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <svg className="w-10 h-10 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm">No activity today</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/inventory')}
                className="w-full px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Green Leaf Intake
              </button>
              <button
                onClick={() => navigate('/inventory')}
                className="w-full px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Firewood Entry
              </button>
              <button
                onClick={() => navigate('/inventory')}
                className="w-full px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Record Production
              </button>
              <button
                onClick={() => navigate('/attendance')}
                className="w-full px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Mark Attendance
              </button>
              <button
                onClick={() => navigate('/expenses-and-income')}
                className="w-full px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Expense/Income
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
