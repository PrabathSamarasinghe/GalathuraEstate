interface ExpenseChartProps {
  expensesByCategory: Record<string, number>;
  totalExpenses: number;
}

const ExpenseChart = ({ expensesByCategory, totalExpenses }: ExpenseChartProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Expenses by Category</h3>
      {Object.keys(expensesByCategory).length > 0 ? (
        <div className="space-y-3">
          {Object.entries(expensesByCategory)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 6)
            .map(([category, amount]) => {
              const percentage = (amount / totalExpenses) * 100;
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
  );
};

export default ExpenseChart;
