
import { useState, useMemo } from "react";
import toast from "react-hot-toast";
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
import { useMutation, useQuery } from "@apollo/client";
import { 
  GET_EMPLOYEES, 
  GET_ATTENDANCE_RECORDS, 
  GET_ATTENDANCE_SUMMARY,
  CREATE_BULK_ATTENDANCE,
  UPDATE_ATTENDANCE,
  DELETE_ATTENDANCE 
} from "../graphql/queries";
import Loading from "../components/Loading";
import { toGraphQLEnum, fromGraphQLEnum } from "../utils/enumMappings";

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [view, setView] = useState<"entry" | "records">("entry");
  const [, setEditingRecord] = useState<AttendanceRecord | undefined>();

  // GraphQL queries
  const { data: employeesData, loading: employeesLoading } = useQuery(GET_EMPLOYEES, {
    fetchPolicy: 'cache-and-network',
  });

  const { data: attendanceData, loading: attendanceLoading, refetch: refetchAttendance } = useQuery(GET_ATTENDANCE_RECORDS, {
    fetchPolicy: 'cache-and-network',
  });

  const { data: summaryData, refetch: refetchSummary } = useQuery(GET_ATTENDANCE_SUMMARY, {
    variables: { date: selectedDate },
    fetchPolicy: 'cache-and-network',
  });

  // GraphQL mutations
  const [createBulkAttendance] = useMutation(CREATE_BULK_ATTENDANCE, {
    onCompleted: () => {
      refetchAttendance();
      refetchSummary();
    },
  });

  const [_updateAttendance] = useMutation(UPDATE_ATTENDANCE, {
    onCompleted: () => {
      refetchAttendance();
      refetchSummary();
    },
  });

  const [deleteAttendance] = useMutation(DELETE_ATTENDANCE, {
    onCompleted: () => {
      refetchAttendance();
      refetchSummary();
    },
  });

  // Map employees from GraphQL
  const employees: Employee[] = (employeesData?.employees || []).map((emp: Employee) => ({
    ...emp,
    designation: fromGraphQLEnum.designation(emp.designation),
    employmentType: fromGraphQLEnum.employmentType(emp.employmentType),
    payType: fromGraphQLEnum.payType(emp.payType),
  }));

  // Map attendance records from GraphQL
  const attendanceRecords: AttendanceRecord[] = (attendanceData?.attendanceRecords || []).map((record: AttendanceRecord & { employee?: Employee }) => ({
    id: record.id,
    employeeId: record.employeeId,
    employeeName: record.employee?.fullName || '',
    department: record.employee?.department || '',
    date: record.date,
    shift: fromGraphQLEnum.shift(record.shift),
    status: fromGraphQLEnum.attendanceStatus(record.status),
    otHours: record.otHours,
    calculatedWage: record.calculatedWage,
    remarks: record.remarks,
    markedAt: record.markedAt,
  }));

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
          status: record.status as AttendanceStatus,
          otHours: record.otHours,
          remarks: record.remarks,
        });
      });
    return map;
  }, [attendanceRecords, selectedDate]);

  // Use summary from GraphQL or calculate from local data
  const dailySummary: AttendanceSummary = useMemo(() => {
    // If GraphQL summary is available, use it
    if (summaryData?.attendanceSummary) {
      return summaryData.attendanceSummary;
    }

    // Otherwise calculate from local records (fallback)
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
  }, [summaryData, attendanceRecords, selectedDate, employees]);

  // Handle bulk attendance submission
  const handleBulkSubmit = async (formRecords: AttendanceFormData[]) => {
    try {
      // Get shift from first record (all records should have the same date/shift)
      const firstRecord = formRecords[0];
      if (!firstRecord) {
        toast.error("No attendance records to save.");
        return;
      }

      // Convert form records to GraphQL input format with enum mappings
      const records = formRecords.map((formData) => ({
        employeeId: formData.employeeId,
        status: toGraphQLEnum.attendanceStatus(formData.status),
        otHours: formData.otHours,
        remarks: formData.remarks,
      }));

      await createBulkAttendance({
        variables: {
          input: {
            date: firstRecord.date,
            shift: toGraphQLEnum.shift(firstRecord.shift),
            records,
          },
        },
      });

      toast.success(`Attendance saved successfully for ${formRecords.length} employees!`);
    } catch (err) {
      console.error("Error saving attendance:", err);
      toast.error("Failed to save attendance. Please try again.");
    }
  };

  // Handle edit record
  const handleEdit = (record: AttendanceRecord) => {
    setEditingRecord(record);
    setSelectedDate(record.date);
    setView("entry");
  };

  // Handle delete record
  const handleDelete = async (recordId: string) => {
    if (window.confirm("Are you sure you want to delete this attendance record?")) {
      try {
        await deleteAttendance({ variables: { id: recordId } });
      } catch (err) {
        console.error("Error deleting attendance:", err);
        toast.error("Failed to delete attendance record.");
      }
    }
  };

  const activeEmployees = employees.filter(
    (emp) => emp.status === EmployeeStatus.ACTIVE
  );

  // Loading state
  const isLoading = employeesLoading || attendanceLoading;

  if (isLoading && !employeesData && !attendanceData) {
    return <Loading />;
  }

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
