interface FinancialMetrics {
  income: number;
  expenses: number;
  netProfit: number;
}

interface AttendanceMetrics {
  present: number;
  total: number;
  otWorkers: number;
}

interface FinancialKPIsProps {
  financialMetrics: FinancialMetrics;
  todayAttendance: AttendanceMetrics;
  periodView: 'today' | 'mtd' | 'ytd';
}

const FinancialKPIs = ({ financialMetrics, todayAttendance, periodView }: FinancialKPIsProps) => {
  const periodLabel = periodView === 'today' ? 'Today' : periodView === 'mtd' ? 'This Month' : 'This Year';

  return (
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
        <p className="text-xs text-gray-500 mt-1">{periodLabel}</p>
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
        <p className="text-xs text-gray-500 mt-1">{periodLabel}</p>
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
  );
};

export default FinancialKPIs;
