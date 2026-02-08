interface StockSummaryProps {
  totalStock: number;
  todayProduction: number;
  thisMonthProduction: number;
  thisMonthDispatch: number;
  gradeStocks: {
    grade: string;
    quantity: number;
    isOverstocked?: boolean;
    isLowStock?: boolean;
  }[];
  estimatedValue: number;
}

const StockSummary = ({
  totalStock,
  todayProduction,
  thisMonthProduction,
  thisMonthDispatch,
  gradeStocks,
  estimatedValue,
}: StockSummaryProps) => {
  return (
    <div className="space-y-4">
      {/* Main Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-4">
          <div className="text-sm font-medium text-gray-600 mb-1">Total Stock</div>
          <div className="text-2xl font-bold text-gray-800">{totalStock.toLocaleString()} kg</div>
          <div className="text-xs text-gray-500 mt-1">all grades</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-4">
          <div className="text-sm font-medium text-gray-600 mb-1">Today's Production</div>
          <div className="text-2xl font-bold text-green-700">{todayProduction} kg</div>
          <div className="text-xs text-gray-500 mt-1">added to stock</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-4">
          <div className="text-sm font-medium text-gray-600 mb-1">Month Production</div>
          <div className="text-2xl font-bold text-gray-800">{thisMonthProduction.toLocaleString()} kg</div>
          <div className="text-xs text-gray-500 mt-1">this month</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-4">
          <div className="text-sm font-medium text-gray-600 mb-1">Month Dispatch</div>
          <div className="text-2xl font-bold text-blue-700">{thisMonthDispatch.toLocaleString()} kg</div>
          <div className="text-xs text-gray-500 mt-1">this month</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-4">
          <div className="text-sm font-medium text-gray-600 mb-1">Estimated Value</div>
          <div className="text-2xl font-bold text-purple-700">Rs. {estimatedValue.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">current stock</div>
        </div>
      </div>

      {/* Grade-wise Stock */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-4">
        <h3 className="text-md font-semibold text-gray-800 mb-4">Grade-wise Stock Distribution</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {gradeStocks.map((grade) => (
            <div
              key={grade.grade}
              className={`rounded-lg p-3 border-2 ${
                grade.isOverstocked
                  ? 'bg-red-50 border-red-400'
                  : grade.isLowStock
                  ? 'bg-yellow-50 border-yellow-400'
                  : 'bg-gray-50 border-gray-300'
              }`}
            >
              <div className="text-xs font-medium text-gray-600 mb-1">{grade.grade}</div>
              <div className="text-lg font-bold text-gray-800">{grade.quantity}</div>
              <div className="text-xs text-gray-500 mt-1">kg</div>
              {grade.isOverstocked && (
                <div className="text-xs text-red-600 font-semibold mt-1">Overstocked</div>
              )}
              {grade.isLowStock && (
                <div className="text-xs text-yellow-600 font-semibold mt-1">Low Stock</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockSummary;
