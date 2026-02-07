interface IntakeRecord {
  id: string;
  date: string;
  time: string;
  supplier: string;
  supplierType: string;
  vehicleNumber?: string;
  grossWeight: number;
  tareWeight: number;
  netWeight: number;
  quality?: string;
  session: string;
  remarks?: string;
}

interface IntakeTableProps {
  intakes?: IntakeRecord[];
}

const IntakeTable = ({ intakes = [] }: IntakeTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-300 bg-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Green Leaf Intake Records</h3>
        <div className="flex gap-2 text-sm">
          <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
            Filter by Date
          </button>
          <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
            Filter by Supplier
          </button>
          <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
            Filter by Quality
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-sm">
              <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-300">Date</th>
              <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-300">Time</th>
              <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-300">Session</th>
              <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-300">Supplier</th>
              <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-300">Vehicle No.</th>
              <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-300 text-right">Gross (kg)</th>
              <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-300 text-right">Tare (kg)</th>
              <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-300 text-right">Net (kg)</th>
              <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-300">Quality</th>
              <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-300">Remarks</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {intakes.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                  No intake records yet. Add your first intake above.
                </td>
              </tr>
            ) : (
              intakes.map((intake, index) => (
                <tr
                  key={intake.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    index !== intakes.length - 1 ? 'border-b border-gray-200' : ''
                  }`}
                >
                  <td className="px-4 py-3 text-gray-700">{intake.date}</td>
                  <td className="px-4 py-3 text-gray-700">{intake.time}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      intake.session === 'AM' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {intake.session}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                        intake.supplierType === 'ESTATE' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {intake.supplierType === 'ESTATE' ? 'Estate' : 'Small'}
                      </span>
                      <span className="text-gray-700">{intake.supplier}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700 font-mono text-xs">{intake.vehicleNumber}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{intake.grossWeight}</td>
                  <td className="px-4 py-3 text-right text-gray-500">{intake.tareWeight}</td>
                  <td className="px-4 py-3 text-right font-semibold text-green-700">{intake.netWeight}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      intake.quality === 'GRADE_A' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {intake.quality?.replace('_', ' ') || intake.quality}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{intake.remarks || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IntakeTable;
