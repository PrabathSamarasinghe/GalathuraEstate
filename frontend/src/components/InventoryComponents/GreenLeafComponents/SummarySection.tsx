interface SummarySectionProps {
  todayIntake: number;
  thisMonthIntake: number;
  averageDailyIntake: number;
  conversionRatio: number;
  rejectedWastage: number;
  unprocessedLeaf: number;
}

const SummarySection = ({
  todayIntake,
  thisMonthIntake,
  averageDailyIntake,
  conversionRatio,
  rejectedWastage,
  unprocessedLeaf,
}: SummarySectionProps) => {
  const expectedConversion = 22; // Expected conversion ratio
  const isLowConversion = conversionRatio < expectedConversion - 2;
  const isHighRejection = rejectedWastage > averageDailyIntake * 0.05;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {/* Today's Intake */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-4">
        <div className="text-sm font-medium text-gray-600 mb-1">Today's Intake</div>
        <div className="text-2xl font-bold text-gray-800">{todayIntake} kg</div>
        <div className="text-xs text-gray-500 mt-1">as of now</div>
      </div>

      {/* This Month's Total */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-4">
        <div className="text-sm font-medium text-gray-600 mb-1">This Month</div>
        <div className="text-2xl font-bold text-gray-800">{thisMonthIntake.toLocaleString()} kg</div>
        <div className="text-xs text-gray-500 mt-1">total intake</div>
      </div>

      {/* Average Daily Intake */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-4">
        <div className="text-sm font-medium text-gray-600 mb-1">Avg. Daily Intake</div>
        <div className="text-2xl font-bold text-gray-800">{averageDailyIntake.toFixed(1)} kg</div>
        <div className="text-xs text-gray-500 mt-1">last 30 days</div>
      </div>

      {/* Leaf-to-Tea Conversion */}
      <div className={`bg-white rounded-lg shadow-sm border p-4 ${
        isLowConversion ? 'border-yellow-500 border-2' : 'border-gray-300'
      }`}>
        <div className="text-sm font-medium text-gray-600 mb-1">Conversion Ratio</div>
        <div className="text-2xl font-bold text-gray-800">{conversionRatio.toFixed(1)}%</div>
        <div className="text-xs text-gray-500 mt-1">leaf to made tea</div>
        {isLowConversion && (
          <div className="text-xs text-yellow-600 font-semibold mt-1">Below Expected</div>
        )}
      </div>

      {/* Rejected/Wastage */}
      <div className={`bg-white rounded-lg shadow-sm border p-4 ${
        isHighRejection ? 'border-red-500 border-2' : 'border-gray-300'
      }`}>
        <div className="text-sm font-medium text-gray-600 mb-1">Rejected/Wastage</div>
        <div className="text-2xl font-bold text-gray-800">{rejectedWastage} kg</div>
        <div className="text-xs text-gray-500 mt-1">today</div>
        {isHighRejection && (
          <div className="text-xs text-red-600 font-semibold mt-1 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            High Wastage
          </div>
        )}
      </div>

      {/* Unprocessed Leaf */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-4">
        <div className="text-sm font-medium text-gray-600 mb-1">Unprocessed Leaf</div>
        <div className="text-2xl font-bold text-gray-800">{unprocessedLeaf} kg</div>
        <div className="text-xs text-gray-500 mt-1">awaiting production</div>
      </div>
    </div>
  );
};

export default SummarySection;
