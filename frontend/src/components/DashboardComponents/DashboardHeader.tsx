interface DashboardHeaderProps {
  selectedDate: string;
  periodView: 'today' | 'mtd' | 'ytd';
  onDateChange: (date: string) => void;
  onPeriodChange: (period: 'today' | 'mtd' | 'ytd') => void;
}

const DashboardHeader = ({
  selectedDate,
  periodView,
  onDateChange,
  onPeriodChange,
}: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Real-time operational & financial overview</p>
      </div>
      <div className="flex gap-3">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        />
        <select
          value={periodView}
          onChange={(e) => onPeriodChange(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        >
          <option value="today">Today</option>
          <option value="mtd">Month to Date</option>
          <option value="ytd">Year to Date</option>
        </select>
      </div>
    </div>
  );
};

export default DashboardHeader;
