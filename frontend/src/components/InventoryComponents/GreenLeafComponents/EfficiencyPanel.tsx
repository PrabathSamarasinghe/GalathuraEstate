interface SupplierPerformance {
  name: string;
  totalSupply: number;
  avgQuality: number;
  conversionRate: number;
  rank: number;
}

const topSuppliers: SupplierPerformance[] = [
  { name: 'Estate A', totalSupply: 4500, avgQuality: 9.2, conversionRate: 22.5, rank: 1 },
  { name: 'Estate B', totalSupply: 3200, avgQuality: 8.8, conversionRate: 21.8, rank: 2 },
  { name: 'Smallholder - Perera', totalSupply: 2100, avgQuality: 8.5, conversionRate: 21.2, rank: 3 },
  { name: 'Estate C', totalSupply: 1500, avgQuality: 8.3, conversionRate: 20.8, rank: 4 },
];

const EfficiencyPanel = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Efficiency & Insights</h3>

      <div className="grid grid-cols-2 gap-6">
        {/* Key Metrics */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Average Yield (Last 30 Days)</span>
              <span className="text-2xl font-bold text-green-700">22.3%</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="inline-flex items-center gap-1">
                <span className="text-green-600">↑ 0.5%</span> vs expected (22%)
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Expected vs Actual Yield</span>
              <div className="text-right">
                <div className="text-xs text-gray-600">Expected: 22%</div>
                <div className="text-lg font-bold text-blue-700">Actual: 22.3%</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '101.4%' }}></div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Peak Intake Days</span>
              <span className="text-lg font-bold text-orange-700">Mon, Wed</span>
            </div>
            <div className="text-xs text-gray-600">
              Consider increasing production capacity on these days
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Quality Rejection Rate</span>
              <span className="text-lg font-bold text-purple-700">2.3%</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="text-green-600">↓ 0.8%</span> improvement this month
            </div>
          </div>
        </div>

        {/* Supplier Performance Rankings */}
        <div>
          <h4 className="text-md font-semibold text-gray-700 mb-4">Top Performing Suppliers</h4>
          <div className="space-y-3">
            {topSuppliers.map((supplier) => (
              <div
                key={supplier.name}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-green-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      supplier.rank === 1
                        ? 'bg-yellow-400 text-yellow-900'
                        : supplier.rank === 2
                        ? 'bg-gray-300 text-gray-800'
                        : supplier.rank === 3
                        ? 'bg-orange-400 text-orange-900'
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      #{supplier.rank}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{supplier.name}</div>
                      <div className="text-xs text-gray-500">{supplier.totalSupply.toLocaleString()} kg supplied</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Quality:</span>
                    <span className="font-semibold text-gray-800">{supplier.avgQuality}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Conversion:</span>
                    <span className="font-semibold text-green-700">{supplier.conversionRate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actionable Insights */}
      <div className="mt-6 bg-gradient-to-r from-green-50 to-teal-50 border-l-4 border-green-600 rounded-md p-4">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <div>
            <div className="font-semibold text-green-900 mb-2">Key Recommendations</div>
            <ul className="space-y-1 text-sm text-green-800">
              <li>• Estate A consistently delivers best quality - consider increasing partnership</li>
              <li>• Yield is 0.5% above target - excellent performance this period</li>
              <li>• Wastage rate decreased by 0.8% - quality control improvements working well</li>
              <li>• Consider scheduling more production on Monday and Wednesday (peak intake days)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EfficiencyPanel;
