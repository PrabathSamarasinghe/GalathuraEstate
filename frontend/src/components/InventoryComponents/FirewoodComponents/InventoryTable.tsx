interface Transaction {
  id: string;
  date: string;
  time: string;
  type: 'inflow' | 'outflow';
  quantity: number;
  factory?: string;
  supervisor?: string;
  remarks?: string;
  runningBalance: number;
}

// Sample transaction data - replace with actual data from your API
const sampleTransactions: Transaction[] = [
  {
    id: '1',
    date: '2025-12-23',
    time: '14:30',
    type: 'outflow',
    quantity: 45,
    factory: 'Factory A',
    supervisor: 'John Doe',
    remarks: 'Daily production',
    runningBalance: 1155,
  },
  {
    id: '2',
    date: '2025-12-23',
    time: '10:15',
    type: 'inflow',
    quantity: 120,
    remarks: 'Supplier delivery',
    runningBalance: 1200,
  },
  {
    id: '3',
    date: '2025-12-22',
    time: '16:45',
    type: 'outflow',
    quantity: 50,
    factory: 'Factory B',
    supervisor: 'Jane Smith',
    remarks: 'Evening shift',
    runningBalance: 1080,
  },
  {
    id: '4',
    date: '2025-12-22',
    time: '09:00',
    type: 'outflow',
    quantity: 40,
    factory: 'Factory A',
    supervisor: 'John Doe',
    remarks: 'Morning shift',
    runningBalance: 1130,
  },
  {
    id: '5',
    date: '2025-12-21',
    time: '11:30',
    type: 'inflow',
    quantity: 150,
    remarks: 'Weekly stock replenishment',
    runningBalance: 1170,
  },
];

const InventoryTable = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-300 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-sm">
              <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-300">Date</th>
              <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-300">Time</th>
              <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-300">Type</th>
              <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-300 text-right">Quantity (kg)</th>
              <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-300">Factory</th>
              <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-300">Supervisor</th>
              <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-300">Remarks</th>
              <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-300 text-right">Balance (kg)</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {sampleTransactions.map((transaction, index) => (
              <tr
                key={transaction.id}
                className={`hover:bg-gray-50 transition-colors ${
                  index !== sampleTransactions.length - 1 ? 'border-b border-gray-200' : ''
                }`}
              >
                <td className="px-4 py-3 text-gray-700">{transaction.date}</td>
                <td className="px-4 py-3 text-gray-700">{transaction.time}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.type === 'inflow'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {transaction.type === 'inflow' ? '↑ Inflow' : '↓ Outflow'}
                  </span>
                </td>
                <td className={`px-4 py-3 text-right font-medium ${
                  transaction.type === 'inflow' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'inflow' ? '+' : '-'}{transaction.quantity}
                </td>
                <td className="px-4 py-3 text-gray-700">{transaction.factory || '-'}</td>
                <td className="px-4 py-3 text-gray-700">{transaction.supervisor || '-'}</td>
                <td className="px-4 py-3 text-gray-600 text-xs">{transaction.remarks || '-'}</td>
                <td className="px-4 py-3 text-right font-semibold text-gray-800">
                  {transaction.runningBalance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;
