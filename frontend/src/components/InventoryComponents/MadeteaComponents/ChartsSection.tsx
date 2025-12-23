import { useState } from 'react';
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

// Sample data
const generateProductionDispatchData = () => {
  const data = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      production: Math.floor(Math.random() * 200) + 400,
      dispatch: Math.floor(Math.random() * 180) + 350,
      stock: 8500 + (i * 10) + Math.floor(Math.random() * 300),
    });
  }
  return data;
};

const gradeDistribution = [
  { name: 'BOP', value: 3500, color: '#10b981' },
  { name: 'FBOP', value: 2200, color: '#3b82f6' },
  { name: 'OP', value: 1800, color: '#f59e0b' },
  { name: 'Dust', value: 1000, color: '#8b5cf6' },
  { name: 'Others', value: 500, color: '#ec4899' },
];

const ChartsSection = () => {
  const [dateRange, setDateRange] = useState('30');
  const chartData = generateProductionDispatchData();

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
