import type { AttendanceSummary } from "../../utils/Interfaces";

interface AttendanceSummaryCardProps {
  summary: AttendanceSummary;
  selectedDate: string;
}

const AttendanceSummaryCard = ({
  summary,
  selectedDate,
}: AttendanceSummaryCardProps) => {
  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border border-green-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Attendance Summary
        </h3>
        <span className="text-sm text-gray-600">
          {new Date(selectedDate).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-xs text-gray-600 mb-1">Total Employees</p>
          <p className="text-2xl font-bold text-gray-900">
            {summary.totalEmployees}
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-xs text-green-600 mb-1">Present</p>
          <p className="text-2xl font-bold text-green-600">
            {summary.presentCount}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {summary.totalEmployees > 0
              ? ((summary.presentCount / summary.totalEmployees) * 100).toFixed(1)
              : 0}
            %
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-xs text-red-600 mb-1">Absent</p>
          <p className="text-2xl font-bold text-red-600">
            {summary.absentCount}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {summary.totalEmployees > 0
              ? ((summary.absentCount / summary.totalEmployees) * 100).toFixed(1)
              : 0}
            %
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-xs text-yellow-600 mb-1">Half Day</p>
          <p className="text-2xl font-bold text-yellow-600">
            {summary.halfDayCount}
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-xs text-purple-600 mb-1">On Leave</p>
          <p className="text-2xl font-bold text-purple-600">
            {summary.onLeaveCount}
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-xs text-blue-600 mb-1">With OT</p>
          <p className="text-2xl font-bold text-blue-600">{summary.otCount}</p>
          <p className="text-xs text-gray-500 mt-1">
            {summary.totalOTHours.toFixed(1)} hrs total
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-xs text-indigo-600 mb-1">Total Man-Days</p>
          <p className="text-2xl font-bold text-indigo-600">
            {summary.totalManDays.toFixed(1)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Present + 0.5×Half Day
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-xs text-teal-600 mb-1">Attendance Rate</p>
          <p className="text-2xl font-bold text-teal-600">
            {summary.totalEmployees > 0
              ? ((summary.totalManDays / summary.totalEmployees) * 100).toFixed(1)
              : 0}
            %
          </p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSummaryCard;
