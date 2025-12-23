
import { useState, useEffect, useMemo } from "react";
import type {
  Employee,
  AttendanceRecord,
  AttendanceFormData,
  AttendanceSummary,
} from "../utils/Interfaces";
import { AttendanceStatus, PayType, EmployeeStatus } from "../utils/enums";
import BulkAttendanceEntry from "../components/AttendanceComponents/BulkAttendanceEntry";
import AttendanceSummaryCard from "../components/AttendanceComponents/AttendanceSummaryCard";
import AttendanceTable from "../components/AttendanceComponents/AttendanceTable";

const Attendance = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [view, setView] = useState<"entry" | "records">("entry");
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | undefined>();

  // Load employees from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("galathura_employees");
    if (stored) {
      try {
        setEmployees(JSON.parse(stored));
      } catch (error) {
        console.error("Error loading employees:", error);
      }
    }
  }, []);

  // Load attendance records from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("galathura_attendance");
    if (stored) {
      try {
        setAttendanceRecords(JSON.parse(stored));
      } catch (error) {
        console.error("Error loading attendance records:", error);
      }
    }
  }, []);

  // Save attendance records to localStorage
  useEffect(() => {
    if (attendanceRecords.length > 0 || localStorage.getItem("galathura_attendance")) {
      localStorage.setItem("galathura_attendance", JSON.stringify(attendanceRecords));
    }
  }, [attendanceRecords]);

  // Calculate wage for an employee based on attendance
  const calculateWage = (
    employee: Employee,
    status: AttendanceStatus,
    otHours: number
  ): number => {
    let baseWage = 0;

    // Calculate base wage based on status
    if (status === AttendanceStatus.PRESENT) {
      if (employee.payType === PayType.DAILY_WAGE) {
        baseWage = employee.rate;
      } else if (employee.payType === PayType.HOURLY) {
        baseWage = employee.rate * 8; // Assuming 8 hours workday
      } else if (employee.payType === PayType.MONTHLY_SALARY) {
        baseWage = employee.rate / 26; // Assuming 26 working days per month
      }
    } else if (status === AttendanceStatus.HALF_DAY) {
      if (employee.payType === PayType.DAILY_WAGE) {
        baseWage = employee.rate * 0.5;
      } else if (employee.payType === PayType.HOURLY) {
        baseWage = employee.rate * 4; // 4 hours for half day
      } else if (employee.payType === PayType.MONTHLY_SALARY) {
        baseWage = (employee.rate / 26) * 0.5;
      }
    }

    // Add OT wages
    let otWage = 0;
    if (otHours > 0 && employee.otRate) {
      otWage = employee.otRate * otHours;
    }

    return baseWage + otWage;
  };

  // Get existing records for selected date
  const existingRecordsMap = useMemo(() => {
    const map = new Map<string, AttendanceFormData>();
    attendanceRecords
      .filter((record) => record.date === selectedDate)
      .forEach((record) => {
        map.set(record.employeeId, {
          employeeId: record.employeeId,
          date: record.date,
          shift: record.shift,
          status: record.status,
          otHours: record.otHours,
          remarks: record.remarks,
        });
      });
    return map;
  }, [attendanceRecords, selectedDate]);

  // Calculate summary for selected date
  const dailySummary: AttendanceSummary = useMemo(() => {
    const dateRecords = attendanceRecords.filter(
      (record) => record.date === selectedDate
    );
    const activeEmployees = employees.filter(
      (emp) => emp.status === EmployeeStatus.ACTIVE
    );

    let presentCount = 0;
    let absentCount = 0;
    let halfDayCount = 0;
    let onLeaveCount = 0;
    let otCount = 0;
    let totalOTHours = 0;

    dateRecords.forEach((record) => {
      if (record.status === AttendanceStatus.PRESENT) presentCount++;
      else if (record.status === AttendanceStatus.ABSENT) absentCount++;
      else if (record.status === AttendanceStatus.HALF_DAY) halfDayCount++;
      else if (record.status === AttendanceStatus.ON_LEAVE) onLeaveCount++;

      if (record.otHours > 0) {
        otCount++;
        totalOTHours += record.otHours;
      }
    });

    const totalManDays = presentCount + halfDayCount * 0.5;

    return {
      totalEmployees: activeEmployees.length,
      presentCount,
      absentCount,
      halfDayCount,
      onLeaveCount,
      otCount,
      totalManDays,
      totalOTHours,
    };
  }, [attendanceRecords, selectedDate, employees]);

  // Generate attendance record ID
  const generateRecordId = (): string => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ATT${timestamp}${random}`;
  };

  // Handle bulk attendance submission
  const handleBulkSubmit = (formRecords: AttendanceFormData[]) => {
    const newRecords: AttendanceRecord[] = [];

    formRecords.forEach((formData) => {
      const employee = employees.find((emp) => emp.id === formData.employeeId);
      if (!employee) return;

      // Check if record already exists
      const existingIndex = attendanceRecords.findIndex(
        (record) =>
          record.employeeId === formData.employeeId && record.date === formData.date
      );

      const calculatedWage = calculateWage(
        employee,
        formData.status,
        formData.otHours
      );

      const record: AttendanceRecord = {
        id: existingIndex >= 0 ? attendanceRecords[existingIndex].id : generateRecordId(),
        employeeId: employee.id,
        employeeName: employee.fullName,
        department: employee.department,
        date: formData.date,
        shift: formData.shift,
        status: formData.status,
        otHours: formData.otHours,
        calculatedWage,
        remarks: formData.remarks,
        markedAt: new Date().toISOString(),
      };

      if (existingIndex >= 0) {
        // Update existing record
        attendanceRecords[existingIndex] = record;
      } else {
        newRecords.push(record);
      }
    });

    if (newRecords.length > 0) {
      setAttendanceRecords((prev) => [...prev, ...newRecords]);
    } else {
      // Trigger re-render for updates
      setAttendanceRecords([...attendanceRecords]);
    }

    alert(`Attendance saved successfully for ${formRecords.length} employees!`);
  };

  // Handle edit record
  const handleEdit = (record: AttendanceRecord) => {
    setEditingRecord(record);
    setSelectedDate(record.date);
    setView("entry");
  };

  // Handle delete record
  const handleDelete = (recordId: string) => {
    setAttendanceRecords((prev) => prev.filter((record) => record.id !== recordId));
  };

  const activeEmployees = employees.filter(
    (emp) => emp.status === EmployeeStatus.ACTIVE
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Attendance Management</h1>
          <p className="mt-2 text-gray-600">
            Mark daily attendance and track workforce presence
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setView("entry")}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              view === "entry"
                ? "bg-green-600 text-white shadow-sm"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Mark Attendance
          </button>
          <button
            onClick={() => setView("records")}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              view === "records"
                ? "bg-green-600 text-white shadow-sm"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            View Records
          </button>
        </div>
      </div>

      {/* Date Selector */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
          <button
            onClick={() => setSelectedDate(new Date().toISOString().split("T")[0])}
            className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition"
          >
            Today
          </button>
        </div>
        {activeEmployees.length === 0 && (
          <div className="text-sm text-gray-600">
            ⚠️ No active employees found. Please add employees first.
          </div>
        )}
      </div>

      {/* Summary Card */}
      <AttendanceSummaryCard summary={dailySummary} selectedDate={selectedDate} />

      {/* Content based on view */}
      {view === "entry" ? (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Bulk Attendance Entry
          </h2>
          {activeEmployees.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center shadow">
              <p className="text-gray-800 text-lg">
                No active employees available. Please add employees from the Employee
                Management page first.
              </p>
            </div>
          ) : (
            <BulkAttendanceEntry
              employees={activeEmployees}
              selectedDate={selectedDate}
              onSubmit={handleBulkSubmit}
              existingRecords={existingRecordsMap}
            />
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Attendance Records
          </h2>
          <AttendanceTable
            records={attendanceRecords}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}

      {/* Rules & Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          📋 Attendance Rules & Guidelines
        </h3>
        <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
          <li>One attendance record per employee per day</li>
          <li>Cannot mark attendance for inactive employees</li>
          <li>OT hours only applicable when status is "Present"</li>
          <li>Wages are automatically calculated based on pay type and attendance status</li>
          <li>Attendance data feeds into Daily Wage Sheet and Monthly Payroll reports</li>
          <li>Half Day = 0.5 Man-Days, Present = 1 Man-Day</li>
        </ul>
      </div>
    </div>
  );
};

export default Attendance;
