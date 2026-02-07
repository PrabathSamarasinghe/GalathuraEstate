import { useMemo } from 'react';

interface GreenLeafIntake {
  id: string;
  date: string;
  supplier: string;
  supplierType: string;
  grossWeight: number;
  tareWeight: number;
  netWeight: number;
  quality?: string;
  session: string;
}

interface ProductionBatch {
  id: string;
  date: string;
  batchNumber: string;
  greenLeafUsed: number;
  madeTeaProduced: number;
  yieldPercentage: number;
}

interface EfficiencyPanelProps {
  intakes?: GreenLeafIntake[];
  batches?: ProductionBatch[];
}

const EfficiencyPanel = ({ intakes = [], batches = [] }: EfficiencyPanelProps) => {
  const metrics = useMemo(() => {
    // Average yield from production batches
    const totalLeafUsed = batches.reduce((sum, b) => sum + Number(b.greenLeafUsed), 0);
    const totalMadeTea = batches.reduce((sum, b) => sum + Number(b.madeTeaProduced), 0);
    const avgYield = totalLeafUsed > 0 ? (totalMadeTea / totalLeafUsed) * 100 : 0;
    const expectedYield = 22;
    const yieldDiff = avgYield - expectedYield;

    // Peak intake days
    const dayTotals: Record<string, number> = {};
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    intakes.forEach((intake) => {
      const day = dayNames[new Date(intake.date).getDay()];
      dayTotals[day] = (dayTotals[day] || 0) + Number(intake.netWeight);
    });
    const sortedDays = Object.entries(dayTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([day]) => day);
    const peakDays = sortedDays.length > 0 ? sortedDays.join(', ') : 'N/A';

    // Supplier performance
    const supplierMap: Record<string, { totalSupply: number; count: number }> = {};
    intakes.forEach((intake) => {
      const key = intake.supplier;
      if (!supplierMap[key]) {
        supplierMap[key] = { totalSupply: 0, count: 0 };
      }
      supplierMap[key].totalSupply += Number(intake.netWeight);
      supplierMap[key].count += 1;
    });

    const topSuppliers = Object.entries(supplierMap)
      .map(([name, data]) => ({
        name,
        totalSupply: data.totalSupply,
        deliveries: data.count,
      }))
      .sort((a, b) => b.totalSupply - a.totalSupply)
      .slice(0, 4)
      .map((s, i) => ({ ...s, rank: i + 1 }));

    return { avgYield, expectedYield, yieldDiff, peakDays, topSuppliers };
  }, [intakes, batches]);

  const hasData = intakes.length > 0 || batches.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Efficiency & Insights</h3>

      {!hasData ? (
        <div className="text-center py-8 text-gray-500">
          No data available yet. Add green leaf intakes and production batches to see insights.
        </div>
      ) : (
      <div className="grid grid-cols-2 gap-6">
        {/* Key Metrics */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Average Yield</span>
              <span className="text-2xl font-bold text-green-700">{metrics.avgYield.toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              {metrics.yieldDiff >= 0 ? (
                <span className="text-green-600">↑ {metrics.yieldDiff.toFixed(1)}%</span>
              ) : (
                <span className="text-red-600">↓ {Math.abs(metrics.yieldDiff).toFixed(1)}%</span>
              )}
              <span>vs expected ({metrics.expectedYield}%)</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Expected vs Actual Yield</span>
              <div className="text-right">
                <div className="text-xs text-gray-600">Expected: {metrics.expectedYield}%</div>
                <div className="text-lg font-bold text-blue-700">Actual: {metrics.avgYield.toFixed(1)}%</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${metrics.avgYield >= metrics.expectedYield ? 'bg-blue-600' : 'bg-orange-500'}`}
                style={{ width: `${Math.min((metrics.avgYield / metrics.expectedYield) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Peak Intake Days</span>
              <span className="text-lg font-bold text-orange-700">{metrics.peakDays}</span>
            </div>
            <div className="text-xs text-gray-600">
              Consider increasing production capacity on these days
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Total Intake Records</span>
              <span className="text-lg font-bold text-purple-700">{intakes.length}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span>{batches.length} production batches recorded</span>
            </div>
          </div>
        </div>

        {/* Supplier Performance Rankings */}
        <div>
          <h4 className="text-md font-semibold text-gray-700 mb-4">Top Performing Suppliers</h4>
          {metrics.topSuppliers.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              No supplier data available yet.
            </div>
          ) : (
          <div className="space-y-3">
            {metrics.topSuppliers.map((supplier) => (
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
                    <span className="text-gray-600">Deliveries:</span>
                    <span className="font-semibold text-gray-800">{supplier.deliveries}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg per delivery:</span>
                    <span className="font-semibold text-green-700">{(supplier.totalSupply / supplier.deliveries).toFixed(0)} kg</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>
      )}

      {/* Actionable Insights */}
      {hasData && (
      <div className="mt-6 bg-gradient-to-r from-green-50 to-teal-50 border-l-4 border-green-600 rounded-md p-4">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <div>
            <div className="font-semibold text-green-900 mb-2">Key Recommendations</div>
            <ul className="space-y-1 text-sm text-green-800">
              {metrics.topSuppliers.length > 0 && (
                <li>• {metrics.topSuppliers[0].name} is the top supplier with {metrics.topSuppliers[0].totalSupply.toLocaleString()} kg — consider strengthening partnership</li>
              )}
              {metrics.yieldDiff >= 0 ? (
                <li>• Yield is {metrics.yieldDiff.toFixed(1)}% above target — excellent performance</li>
              ) : (
                <li>• Yield is {Math.abs(metrics.yieldDiff).toFixed(1)}% below target — investigate quality or process issues</li>
              )}
              {metrics.peakDays !== 'N/A' && (
                <li>• Consider scheduling more production on {metrics.peakDays} (peak intake days)</li>
              )}
              <li>• {batches.length} production batch{batches.length !== 1 ? 'es' : ''} recorded from {intakes.length} intake{intakes.length !== 1 ? 's' : ''}</li>
            </ul>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default EfficiencyPanel;
