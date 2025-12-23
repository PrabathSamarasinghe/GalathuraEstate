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
} from 'recharts';

// Sample data - replace with actual data from your API
const generateSampleData = () => {
  const data = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      inflow: Math.floor(Math.random() * 500) + 100,
      outflow: Math.floor(Math.random() * 400) + 150,
      stock: 5000 - (i * 20) + Math.floor(Math.random() * 200),
    });
  }
  return data;
};

const ChartsSection = () => {
  const [dateRange, setDateRange] = useState('30');
  const chartData = generateSampleData();

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
              <Bar dataKey="inflow" fill="#10b981" name="Inflow (units)" />
              <Bar dataKey="outflow" fill="#ef4444" name="Outflow (units)" />
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
                name="Stock (units)"
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
