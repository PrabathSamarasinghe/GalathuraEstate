import type { TransactionSummary } from "../../utils/Interfaces";

interface TransactionSummaryCardProps {
  summary: TransactionSummary;
}

const TransactionSummaryCard = ({ summary }: TransactionSummaryCardProps) => {
  const netToday = summary.todayIncome - summary.todayExpenses;
  const netMonth = summary.monthIncome - summary.monthExpenses;

  return (
    <div className="space-y-4">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Today's Expenses</p>
          <p className="text-2xl font-bold text-red-600">
            Rs. {summary.todayExpenses.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Today's Income</p>
          <p className="text-2xl font-bold text-green-600">
            Rs. {summary.todayIncome.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Today's Net</p>
          <p
            className={`text-2xl font-bold ${
              netToday >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            Rs. {netToday.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">This Month's Net</p>
          <p
            className={`text-2xl font-bold ${
              netMonth >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            Rs. {netMonth.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          This Month's Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Total Expenses</span>
              <span className="text-lg font-bold text-red-600">
                Rs. {summary.monthExpenses.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full"
                style={{
                  width: `${
                    summary.monthExpenses + summary.monthIncome > 0
                      ? (summary.monthExpenses /
                          (summary.monthExpenses + summary.monthIncome)) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Total Income</span>
              <span className="text-lg font-bold text-green-600">
                Rs. {summary.monthIncome.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width: `${
                    summary.monthExpenses + summary.monthIncome > 0
                      ? (summary.monthIncome /
                          (summary.monthExpenses + summary.monthIncome)) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category-wise Breakdown */}
      {summary.categoryTotals.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Category-wise Totals (This Month)
          </h3>
          <div className="space-y-2">
            {summary.categoryTotals
              .sort((a, b) => b.total - a.total)
              .map((cat) => (
                <div
                  key={cat.category}
                  className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                >
                  <span className="text-sm text-gray-700">{cat.category}</span>
                  <span className="text-sm font-semibold text-gray-900">
                    Rs. {cat.total.toLocaleString()}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionSummaryCard;
