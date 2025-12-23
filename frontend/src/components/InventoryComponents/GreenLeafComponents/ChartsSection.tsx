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

// Sample data - replace with actual data from your API
const generateIntakeData = () => {
  const data = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      intake: Math.floor(Math.random() * 500) + 800,
      madeTea: Math.floor(Math.random() * 120) + 180,
    });
  }
  return data;
};

const supplierData = [
  { name: 'Estate A', value: 4500, color: '#10b981' },
  { name: 'Estate B', value: 3200, color: '#3b82f6' },
  { name: 'Smallholders', value: 2800, color: '#f59e0b' },
  { name: 'Estate C', value: 1500, color: '#8b5cf6' },
];

const ChartsSection = () => {
  const [dateRange, setDateRange] = useState('30');
  const chartData = generateIntakeData();

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
        {/* Daily Intake Trend */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Green Leaf Intake</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="intake"
                stroke="#10b981"
                strokeWidth={2}
                name="Intake (kg)"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Intake vs Made Tea */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Intake vs Made Tea Output</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="intake" fill="#10b981" name="Green Leaf (kg)" />
              <Bar dataKey="madeTea" fill="#3b82f6" name="Made Tea (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Supplier Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Supplier-wise Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={supplierData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {supplierData.map((entry, index) => (
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
