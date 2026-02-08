interface ProductionBatch {
  id: string;
  date: string;
  batchNumber: string;
  greenLeafUsed: number;
  madeTeaProduced: number;
  yieldPercentage: number;
}

interface ProductionConsumptionProps {
  batches?: ProductionBatch[];
}

const ProductionConsumption = ({ batches = [] }: ProductionConsumptionProps) => {
  const totalConsumed = batches.reduce((sum, batch) => sum + Number(batch.greenLeafUsed), 0);
  const totalMadeTea = batches.reduce((sum, batch) => sum + Number(batch.madeTeaProduced), 0);
  const avgYield = totalConsumed > 0 ? (totalMadeTea / totalConsumed) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">Production Consumption (System-Linked)</h3>
        <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
          <div className="text-sm">
            <span className="text-gray-600">Total Consumed Today:</span>
            <span className="ml-2 font-semibold text-gray-800">{totalConsumed} kg</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-600">Avg Yield:</span>
            <span className="ml-2 font-semibold text-green-700">{avgYield.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-sm">
              <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-300">Date</th>
              <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-300">Batch Number</th>
              <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-300 text-right">
                Green Leaf Used (kg)
              </th>
              <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-300 text-right">
                Made Tea (kg)
              </th>
              <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-300 text-right">
                Yield (%)
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {batches.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No production batches recorded yet.
                </td>
              </tr>
            ) : (
              batches.map((batch, index) => (
              <tr
                key={batch.id}
                className={`hover:bg-gray-50 transition-colors ${
                  index !== batches.length - 1 ? 'border-b border-gray-200' : ''
                }`}
              >
                <td className="px-4 py-3 text-gray-700">{batch.date}</td>
                <td className="px-4 py-3 text-gray-700 font-mono text-xs">{batch.batchNumber}</td>
                <td className="px-4 py-3 text-right font-semibold text-red-600">
                  {Number(batch.greenLeafUsed).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-green-600">
                  {Number(batch.madeTeaProduced).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      Number(batch.yieldPercentage) >= 22
                        ? 'bg-green-100 text-green-800'
                        : Number(batch.yieldPercentage) >= 20
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {Number(batch.yieldPercentage).toFixed(1)}%
                  </span>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md px-4 py-3 text-sm text-blue-700">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <div className="font-semibold mb-1">Data Integrity Control</div>
            <div>
              Green leaf consumption is automatically calculated based on production batch records. Manual outflow entries are disabled to maintain accuracy. Only production department can create consumption records through the production management system.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionConsumption;
