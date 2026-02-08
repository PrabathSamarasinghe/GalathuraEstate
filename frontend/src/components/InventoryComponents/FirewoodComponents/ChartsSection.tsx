import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Transaction {
  id: string;
  date: string;
  time: string;
  type: string;
  quantity: number;
  runningBalance: number;
}

interface ChartsSectionProps {
  transactions?: Transaction[];
}

const ChartsSection = ({ transactions = [] }: ChartsSectionProps) => {
  const [dateRange, setDateRange] = useState('30');

  // Generate chart data from transactions
  const chartData = useMemo(() => {
    const days = parseInt(dateRange);
    const today = new Date();
    const data: { date: string; inflow: number; outflow: number; stock: number }[] = [];
    
    // Create a map of dates to aggregate transactions
    const dateMap = new Map<string, { inflow: number; outflow: number; stock: number }>();
    
    // Initialize all days in range
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dateMap.set(dateStr, { inflow: 0, outflow: 0, stock: 0 });
    }
    
    // Aggregate transactions by date
    transactions.forEach(txn => {
      const existing = dateMap.get(txn.date);
      if (existing) {
        if (txn.type === 'inflow' || txn.type === 'INFLOW' || txn.type === 'Inflow') {
          existing.inflow += txn.quantity;
        } else {
          existing.outflow += txn.quantity;
        }
        existing.stock = txn.runningBalance;
      }
    });
    
    // Convert map to array with formatted dates
    dateMap.forEach((value, key) => {
      const date = new Date(key);
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        inflow: value.inflow,
        outflow: value.outflow,
        stock: value.stock,
      });
    });
    
    return data;
  }, [transactions, dateRange]);

  return (
    <div className="space-y-4">
      {/* Date Range Filter */}
      <div className="flex justify-end">
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-2 flex gap-2">
          <button
            onClick={() => setDateRange('7')}
            className={`px-4 py-1 rounded-md text-sm font-medium transition-colors ${
              dateRange === '7'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setDateRange('30')}
            className={`px-4 py-1 rounded-md text-sm font-medium transition-colors ${
              dateRange === '30'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setDateRange('90')}
            className={`px-4 py-1 rounded-md text-sm font-medium transition-colors ${
              dateRange === '90'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            90 Days
          </button>
        </div>
      </div>

      {/* Charts Container */}
      <div className="grid grid-cols-2 gap-4">
        {/* Inflow vs Outflow Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Inflow vs Outflow</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="inflow" fill="#10b981" name="Inflow (kg)" />
              <Bar dataKey="outflow" fill="#ef4444" name="Outflow (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stock Level Over Time Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Stock Level Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="stock"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Stock (kg)"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;
