interface IntakeRecord {
  id: string;
  date: string;
  time: string;
  supplier: string;
  supplierType: 'estate' | 'smallholder';
  vehicleNumber: string;
  grossWeight: number;
  tareWeight: number;
  netWeight: number;
  quality: string;
  session: 'AM' | 'PM';
  remarks?: string;
}

// Sample intake data - replace with actual data from your API
const sampleIntakes: IntakeRecord[] = [
  {
    id: '1',
    date: '2025-12-23',
    time: '14:30',
    supplier: 'Estate A',
    supplierType: 'estate',
    vehicleNumber: 'ABC-1234',
    grossWeight: 1250,
    tareWeight: 50,
    netWeight: 1200,
    quality: 'Grade A',
    session: 'PM',
    remarks: 'Good quality',
  },
  {
    id: '2',
    date: '2025-12-23',
    time: '10:15',
    supplier: 'Smallholder - Perera',
    supplierType: 'smallholder',
    vehicleNumber: 'XYZ-5678',
    grossWeight: 580,
    tareWeight: 30,
    netWeight: 550,
    quality: 'Grade B',
    session: 'AM',
    remarks: '',
  },
  {
    id: '3',
    date: '2025-12-23',
    time: '08:45',
    supplier: 'Estate B',
    supplierType: 'estate',
    vehicleNumber: 'DEF-9012',
    grossWeight: 1820,
    tareWeight: 70,
    netWeight: 1750,
    quality: 'Grade A',
    session: 'AM',
    remarks: 'Premium quality',
  },
  {
    id: '4',
    date: '2025-12-22',
    time: '15:20',
    supplier: 'Estate C',
    supplierType: 'estate',
    vehicleNumber: 'GHI-3456',
    grossWeight: 980,
    tareWeight: 45,
    netWeight: 935,
    quality: 'Grade B',
    session: 'PM',
    remarks: 'Some moisture',
  },
  {
    id: '5',
    date: '2025-12-22',
    time: '09:30',
    supplier: 'Smallholder - Silva',
    supplierType: 'smallholder',
    vehicleNumber: 'JKL-7890',
    grossWeight: 420,
    tareWeight: 25,
    netWeight: 395,
    quality: 'Grade A',
    session: 'AM',
    remarks: '',
  },
];

const IntakeTable = () => {
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
            {sampleIntakes.map((intake, index) => (
              <tr
                key={intake.id}
                className={`hover:bg-gray-50 transition-colors ${
                  index !== sampleIntakes.length - 1 ? 'border-b border-gray-200' : ''
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
                      intake.supplierType === 'estate' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {intake.supplierType === 'estate' ? 'Estate' : 'Small'}
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
                    intake.quality === 'Grade A' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {intake.quality}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 text-xs">{intake.remarks || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IntakeTable;
