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

interface IntakeRecord {
  id: string;
  date: string;
  supplier: string;
  supplierType: string;
  netWeight: number;
}

interface ChartsSectionProps {
  intakes?: IntakeRecord[];
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

const ChartsSection = ({ intakes = [] }: ChartsSectionProps) => {
  const [dateRange, setDateRange] = useState('30');

  // Generate chart data from intakes
  const chartData = useMemo(() => {
    const days = parseInt(dateRange);
    const today = new Date();
    const data: { date: string; intake: number; madeTea: number }[] = [];
    
    // Create a map of dates to aggregate intakes
    const dateMap = new Map<string, { intake: number; madeTea: number }>();
    
    // Initialize all days in range
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dateMap.set(dateStr, { intake: 0, madeTea: 0 });
    }
    
    // Aggregate intakes by date
    intakes.forEach(intake => {
      const existing = dateMap.get(intake.date);
      if (existing) {
        existing.intake += intake.netWeight;
        // Estimate made tea output (~22% conversion ratio)
        existing.madeTea += intake.netWeight * 0.22;
      }
    });
    
    // Convert map to array with formatted dates
    dateMap.forEach((value, key) => {
      const date = new Date(key);
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        intake: Math.round(value.intake),
        madeTea: Math.round(value.madeTea),
      });
    });
    
    return data;
  }, [intakes, dateRange]);

  // Generate supplier distribution data
  const supplierData = useMemo(() => {
    const supplierMap = new Map<string, number>();
    
    intakes.forEach(intake => {
      const current = supplierMap.get(intake.supplier) || 0;
      supplierMap.set(intake.supplier, current + intake.netWeight);
    });
    
    const data: { name: string; value: number; color: string }[] = [];
    let colorIndex = 0;
    supplierMap.forEach((value, name) => {
      data.push({
        name,
        value: Math.round(value),
        color: COLORS[colorIndex % COLORS.length],
      });
      colorIndex++;
    });
    
    // If no data, return default
    if (data.length === 0) {
      return [{ name: 'No Data', value: 1, color: '#e5e7eb' }];
    }
    
    return data.sort((a, b) => b.value - a.value).slice(0, 6);
  }, [intakes]);

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
