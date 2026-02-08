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
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base">Real-time operational & financial overview</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm md:text-base"
        />
        <select
          value={periodView}
          onChange={(e) => onPeriodChange(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm md:text-base"
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
