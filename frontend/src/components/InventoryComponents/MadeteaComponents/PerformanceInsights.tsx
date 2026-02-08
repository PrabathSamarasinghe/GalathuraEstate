interface GradePerformance {
  grade: string;
  production: number;
  dispatch: number;
  stock: number;
  contributionPercent: number;
}

const gradePerformance: GradePerformance[] = [
  { grade: 'BOP', production: 4200, dispatch: 3800, stock: 3500, contributionPercent: 38 },
  { grade: 'FBOP', production: 2800, dispatch: 2400, stock: 2200, contributionPercent: 25 },
  { grade: 'OP', production: 2200, dispatch: 1900, stock: 1800, contributionPercent: 20 },
  { grade: 'Dust', production: 1300, dispatch: 1100, stock: 1000, contributionPercent: 12 },
  { grade: 'Others', production: 500, dispatch: 450, stock: 500, contributionPercent: 5 },
];

const PerformanceInsights = () => {
  const totalProduction = gradePerformance.reduce((sum, g) => sum + g.production, 0);
  const totalDispatch = gradePerformance.reduce((sum, g) => sum + g.dispatch, 0);
  const avgYield = 22.3;
  const dispatchRate = totalProduction > 0 ? (totalDispatch / totalProduction) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Performance & Yield Insights</h3>

      <div className="grid grid-cols-2 gap-6">
        {/* Key Performance Metrics */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Average Yield Percentage</span>
              <span className="text-2xl font-bold text-green-700">{avgYield}%</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="text-green-600">↑ 0.3%</span> vs last month
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Dispatch Rate (This Month)</span>
              <span className="text-2xl font-bold text-blue-700">{dispatchRate.toFixed(1)}%</span>
            </div>
            <div className="text-xs text-gray-600">
              {totalDispatch.toLocaleString()} kg dispatched of {totalProduction.toLocaleString()} kg produced
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Production Efficiency</span>
              <span className="text-2xl font-bold text-purple-700">96.5%</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              Minimal wastage • Optimal grading
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Green Leaf to Made Tea</span>
              <span className="text-2xl font-bold text-amber-700">4.5:1</span>
            </div>
            <div className="text-xs text-gray-600">
              Average conversion ratio • Industry standard: 4.5:1
            </div>
          </div>
        </div>

        {/* Grade Performance Table */}
        <div>
          <h4 className="text-md font-semibold text-gray-700 mb-4">Grade Contribution & Performance</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-3 py-2 font-medium text-gray-600 border-b">Grade</th>
                  <th className="px-3 py-2 font-medium text-gray-600 border-b text-right">Production</th>
                  <th className="px-3 py-2 font-medium text-gray-600 border-b text-right">Dispatch</th>
                  <th className="px-3 py-2 font-medium text-gray-600 border-b text-right">Stock</th>
                  <th className="px-3 py-2 font-medium text-gray-600 border-b text-right">Contribution</th>
                </tr>
              </thead>
              <tbody>
                {gradePerformance.map((grade, index) => (
                  <tr
                    key={grade.grade}
                    className={`hover:bg-gray-50 ${
                      index !== gradePerformance.length - 1 ? 'border-b border-gray-200' : ''
                    }`}
                  >
                    <td className="px-3 py-2 font-semibold text-gray-800">{grade.grade}</td>
                    <td className="px-3 py-2 text-right text-gray-700">{grade.production}</td>
                    <td className="px-3 py-2 text-right text-gray-700">{grade.dispatch}</td>
                    <td className="px-3 py-2 text-right font-semibold text-gray-800">{grade.stock}</td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${grade.contributionPercent}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-700 font-medium">{grade.contributionPercent}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Insights & Recommendations */}
      <div className="mt-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-l-4 border-indigo-600 rounded-md p-4">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <div className="font-semibold text-indigo-900 mb-2">Key Insights & Recommendations</div>
            <ul className="space-y-1 text-sm text-indigo-800">
              <li>• BOP grade leads with 38% contribution - maintain consistent quality</li>
              <li>• Yield percentage at 22.3% exceeds target - excellent processing efficiency</li>
              <li>• Dispatch rate at {dispatchRate.toFixed(1)}% indicates healthy stock movement</li>
              <li>• All grade stocks are within optimal levels - no overstocking concerns</li>
              <li>• Green leaf to made tea ratio aligns with industry standards</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceInsights;
