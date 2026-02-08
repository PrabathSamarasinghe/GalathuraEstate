interface SummarySectionProps {
  stock: number;
  todayConsumption: number;
  averageDailyConsumption: number;
  lowStockThreshold: number;
}

const SummarySection = ({
  stock,
  todayConsumption,
  averageDailyConsumption,
  lowStockThreshold,
}: SummarySectionProps) => {
  const daysRemaining = averageDailyConsumption > 0 
    ? Math.floor(stock / averageDailyConsumption) 
    : Infinity;
  
  const isLowStock = stock <= lowStockThreshold;
  const isNearlyLowStock = stock <= lowStockThreshold * 1.5 && !isLowStock;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Current Stock */}
      <div className={`bg-white rounded-lg shadow-sm border p-4 ${
        isLowStock ? 'border-red-500 border-2' : isNearlyLowStock ? 'border-yellow-500' : 'border-gray-300'
      }`}>
        <div className="text-sm font-medium text-gray-600 mb-1">Current Stock</div>
        <div className="text-2xl font-bold text-gray-800">{stock} kg</div>
        {isLowStock && (
          <div className="text-xs text-red-600 font-semibold mt-1 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Low Stock!
          </div>
        )}
        {isNearlyLowStock && (
          <div className="text-xs text-yellow-600 font-semibold mt-1">Approaching Low Stock</div>
        )}
      </div>

      {/* Today's Consumption */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-4">
        <div className="text-sm font-medium text-gray-600 mb-1">Today's Consumption</div>
        <div className="text-2xl font-bold text-gray-800">{todayConsumption} kg</div>
        <div className="text-xs text-gray-500 mt-1">as of now</div>
      </div>

      {/* Days Remaining */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-4">
        <div className="text-sm font-medium text-gray-600 mb-1">Days Remaining</div>
        <div className="text-2xl font-bold text-gray-800">
          {daysRemaining === Infinity ? '∞' : daysRemaining}
        </div>
        <div className="text-xs text-gray-500 mt-1">at current rate</div>
      </div>

      {/* Average Daily Usage */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-4">
        <div className="text-sm font-medium text-gray-600 mb-1">Avg. Daily Usage</div>
        <div className="text-2xl font-bold text-gray-800">
          {averageDailyConsumption.toFixed(1)} kg
        </div>
        <div className="text-xs text-gray-500 mt-1">last 30 days</div>
      </div>
    </div>
  );
};

export default SummarySection;
