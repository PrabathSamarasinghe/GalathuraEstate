import { useState } from "react";
import toast from "react-hot-toast";

interface PeriodSelectorProps {
  onPeriodChange: (fromDate: string, toDate: string) => void;
}

const PeriodSelector = ({ onPeriodChange }: PeriodSelectorProps) => {
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const handleCustomApply = () => {
    if (!fromDate || !toDate) {
      toast.error("Please select both From and To dates");
      return;
    }
    if (fromDate > toDate) {
      toast.error("From date cannot be after To date");
      return;
    }
    onPeriodChange(fromDate, toDate);
  };

  const handlePreset = (preset: "month" | "quarter" | "year" | "lastMonth") => {
    const today = new Date();
    let from: Date;
    let to: Date;

    switch (preset) {
      case "month":
        // Current month
        from = new Date(today.getFullYear(), today.getMonth(), 1);
        to = today;
        break;
      case "lastMonth":
        // Previous month
        from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        to = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of previous month
        break;
      case "quarter":
        // Current quarter
        const currentQuarter = Math.floor(today.getMonth() / 3);
        from = new Date(today.getFullYear(), currentQuarter * 3, 1);
        to = today;
        break;
      case "year":
        // Current year
        from = new Date(today.getFullYear(), 0, 1);
        to = today;
        break;
    }

    const fromStr = from.toISOString().split("T")[0];
    const toStr = to.toISOString().split("T")[0];
    setFromDate(fromStr);
    setToDate(toStr);
    onPeriodChange(fromStr, toStr);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Period</h3>
      
      {/* Quick Presets */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Select:
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handlePreset("month")}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm font-medium"
          >
            This Month
          </button>
          <button
            onClick={() => handlePreset("lastMonth")}
            className="px-4 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition text-sm font-medium"
          >
            Last Month
          </button>
          <button
            onClick={() => handlePreset("quarter")}
            className="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition text-sm font-medium"
          >
            This Quarter
          </button>
          <button
            onClick={() => handlePreset("year")}
            className="px-4 py-2 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition text-sm font-medium"
          >
            This Year
          </button>
        </div>
      </div>

      {/* Custom Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Date
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To Date
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div>
          <button
            onClick={handleCustomApply}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition font-medium"
          >
            Apply Custom Range
          </button>
        </div>
      </div>

      {fromDate && toDate && (
        <p className="mt-3 text-sm text-gray-600">
          Selected Period: <strong>{new Date(fromDate).toLocaleDateString()}</strong> to{" "}
          <strong>{new Date(toDate).toLocaleDateString()}</strong>
        </p>
      )}
    </div>
  );
};

export default PeriodSelector;
