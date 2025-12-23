interface AttendanceMetrics {
  total: number;
  present: number;
  absent: number;
  halfDay: number;
  onLeave: number;
  otWorkers: number;
  totalOTHours: number;
  totalWages: number;
}

interface AttendanceBreakdownProps {
  todayAttendance: AttendanceMetrics;
}

const AttendanceBreakdown = ({ todayAttendance }: AttendanceBreakdownProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Attendance Breakdown</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <p className="text-3xl font-bold text-green-600">{todayAttendance.present}</p>
          <p className="text-sm text-gray-600 mt-1">Present</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-3xl font-bold text-gray-600">{todayAttendance.absent}</p>
          <p className="text-sm text-gray-600 mt-1">Absent</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-3xl font-bold text-gray-600">{todayAttendance.onLeave}</p>
          <p className="text-sm text-gray-600 mt-1">On Leave</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">OT Workers:</span>
          <span className="font-semibold text-gray-800">{todayAttendance.otWorkers}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Total OT Hours:</span>
          <span className="font-semibold text-gray-800">{todayAttendance.totalOTHours.toFixed(1)}</span>
        </div>
        <div className="flex justify-between col-span-2">
          <span className="text-gray-600">Today's Wages:</span>
          <span className="font-semibold text-gray-800">Rs. {todayAttendance.totalWages.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceBreakdown;
