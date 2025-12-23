interface Transaction {
  id: string;
  date: string;
  time: string;
  reference: string;
  type: 'production' | 'dispatch';
  inflow: number;
  outflow: number;
  balance: number;
  grade: string;
  details?: string;
}

const sampleTransactions: Transaction[] = [
  {
    id: '1',
    date: '2025-12-23',
    time: '15:00',
    reference: 'DISP-231223-003',
    type: 'dispatch',
    inflow: 0,
    outflow: 350,
    balance: 8650,
    grade: 'BOP',
    details: 'Auction Lot #456',
  },
  {
    id: '2',
    date: '2025-12-23',
    time: '14:00',
    reference: 'BATCH-231223-002',
    type: 'production',
    inflow: 450,
    outflow: 0,
    balance: 9000,
    grade: 'Mixed',
    details: 'Daily production',
  },
  {
    id: '3',
    date: '2025-12-23',
    time: '10:30',
    reference: 'DISP-231223-002',
    type: 'dispatch',
    inflow: 0,
    outflow: 200,
    balance: 8550,
    grade: 'FBOP',
    details: 'Broker - ABC Ltd',
  },
  {
    id: '4',
    date: '2025-12-23',
    time: '08:00',
    reference: 'BATCH-231223-001',
    type: 'production',
    inflow: 520,
    outflow: 0,
    balance: 8750,
    grade: 'Mixed',
    details: 'Morning batch',
  },
  {
    id: '5',
    date: '2025-12-22',
    time: '16:30',
    reference: 'DISP-221223-001',
    type: 'dispatch',
    inflow: 0,
    outflow: 400,
    balance: 8230,
    grade: 'OP',
    details: 'Auction Lot #455',
  },
];

const InventoryLedger = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-300 bg-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Made Tea Inventory Ledger</h3>
        <div className="flex gap-2 text-sm">
          <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
            Filter by Date
          </button>
          <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
            Filter by Grade
          </button>
          <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
            Filter by Buyer
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-sm">
              <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-300">Date</th>
              <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-300">Time</th>
              <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-300">Reference</th>
              <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-300">Type</th>
              <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-300 text-right">
                Inflow (kg)
              </th>
              <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-300 text-right">
                Outflow (kg)
              </th>
              <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-300 text-right">
                Balance (kg)
              </th>
              <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-300">Grade</th>
              <th className="px-4 py-3 font-medium text-gray-600 border-b border-gray-300">Details</th>
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
                <td className="px-4 py-3 text-gray-700 font-mono text-xs">{transaction.reference}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.type === 'production'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {transaction.type === 'production' ? '↑ Production' : '↓ Dispatch'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-medium text-green-600">
                  {transaction.inflow > 0 ? `+${transaction.inflow}` : '-'}
                </td>
                <td className="px-4 py-3 text-right font-medium text-blue-600">
                  {transaction.outflow > 0 ? `-${transaction.outflow}` : '-'}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-gray-800">
                  {transaction.balance.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                    {transaction.grade}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 text-xs">{transaction.details || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryLedger;
