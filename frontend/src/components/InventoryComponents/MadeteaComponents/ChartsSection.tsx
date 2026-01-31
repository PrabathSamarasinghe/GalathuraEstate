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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface MadeTeaTransaction {
  id: string;
  date: string;
  type: string;
  grade: string;
  inflow: number;
  outflow: number;
  balance: number;
}

interface GradeStock {
  grade: string;
  quantity: number;
}

interface ChartsSectionProps {
  transactions?: MadeTeaTransaction[];
  gradeStocks?: GradeStock[];
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

const ChartsSection = ({ transactions = [], gradeStocks = [] }: ChartsSectionProps) => {
  const [dateRange, setDateRange] = useState('30');

  // Generate chart data from transactions
  const chartData = useMemo(() => {
    const days = parseInt(dateRange);
    const today = new Date();
    const data: { date: string; production: number; dispatch: number; stock: number }[] = [];
    
    // Create a map of dates to aggregate transactions
    const dateMap = new Map<string, { production: number; dispatch: number; stock: number }>();
    
    // Initialize all days in range
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dateMap.set(dateStr, { production: 0, dispatch: 0, stock: 0 });
    }
    
    // Aggregate transactions by date
    transactions.forEach(txn => {
      const existing = dateMap.get(txn.date);
      if (existing) {
        if (txn.type === 'production' || txn.type === 'PRODUCTION') {
          existing.production += txn.inflow;
        } else {
          existing.dispatch += txn.outflow;
        }
        existing.stock = txn.balance;
      }
    });
    
    // Convert map to array with formatted dates
    dateMap.forEach((value, key) => {
      const date = new Date(key);
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        production: value.production,
        dispatch: value.dispatch,
        stock: value.stock,
      });
    });
    
    return data;
  }, [transactions, dateRange]);

  // Generate grade distribution data
  const gradeDistribution = useMemo(() => {
    if (gradeStocks.length === 0) {
      return [
        { name: 'BOP', value: 0, color: COLORS[0] },
        { name: 'FBOP', value: 0, color: COLORS[1] },
        { name: 'OP', value: 0, color: COLORS[2] },
        { name: 'Dust', value: 0, color: COLORS[3] },
        { name: 'Others', value: 0, color: COLORS[4] },
      ];
    }
    
    return gradeStocks.map((stock, index) => ({
      name: stock.grade,
      value: stock.quantity,
      color: COLORS[index % COLORS.length],
    }));
  }, [gradeStocks]);

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
      <div className="grid grid-cols-3 gap-4">
        {/* Production vs Dispatch */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Production vs Dispatch</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="production" fill="#10b981" name="Production (kg)" />
              <Bar dataKey="dispatch" fill="#3b82f6" name="Dispatch (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stock Level Over Time */}
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
                stroke="#8b5cf6"
                strokeWidth={2}
                name="Stock (kg)"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Grade Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Grade-wise Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={gradeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent = 0 }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {gradeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;
