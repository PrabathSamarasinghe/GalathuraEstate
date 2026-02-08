import { useState, useEffect, useMemo } from "react";
import type { Employee, AttendanceFormData } from "../../utils/Interfaces";
import { Department, Shift, AttendanceStatus, EmployeeStatus } from "../../utils/enums";

interface BulkAttendanceEntryProps {
  employees: Employee[];
  selectedDate: string;
  onSubmit: (records: AttendanceFormData[]) => void;
  existingRecords: Map<string, AttendanceFormData>; // employeeId -> existing record
}

const BulkAttendanceEntry = ({
  employees,
  selectedDate,
  onSubmit,
  existingRecords,
}: BulkAttendanceEntryProps) => {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | "">("" );
  const [selectedShift, setSelectedShift] = useState<Shift>(Shift.FULL_DAY);
  const [attendanceData, setAttendanceData] = useState<Map<string, AttendanceFormData>>(
    new Map()
  );

  // Filter active employees by department
  const filteredEmployees = useMemo(() => {
    return employees.filter(
      (emp) =>
        emp.status === EmployeeStatus.ACTIVE &&
        (!selectedDepartment || emp.department === selectedDepartment)
    );
  }, [employees, selectedDepartment]);

  // Initialize attendance data from existing records or defaults
  useEffect(() => {
    const newData = new Map<string, AttendanceFormData>();
    filteredEmployees.forEach((emp) => {
      const existing = existingRecords.get(emp.id);
      if (existing) {
        newData.set(emp.id, existing);
      } else {
        newData.set(emp.id, {
          employeeId: emp.id,
          date: selectedDate,
          shift: selectedShift,
          status: AttendanceStatus.PRESENT,
          otHours: 0,
          remarks: "",
        });
      }
    });
    setAttendanceData(newData);
  }, [filteredEmployees, selectedDate, selectedShift, existingRecords]);

  const handleStatusChange = (employeeId: string, status: AttendanceStatus) => {
    setAttendanceData((prev) => {
      const newData = new Map(prev);
      const record = newData.get(employeeId);
      if (record) {
        newData.set(employeeId, {
          ...record,
          status,
          otHours: status !== AttendanceStatus.PRESENT ? 0 : record.otHours,
        });
      }
      return newData;
    });
  };

  const handleOTChange = (employeeId: string, otHours: number) => {
    setAttendanceData((prev) => {
      const newData = new Map(prev);
      const record = newData.get(employeeId);
      if (record && record.status === AttendanceStatus.PRESENT) {
        newData.set(employeeId, { ...record, otHours });
      }
      return newData;
    });
  };

  const handleRemarksChange = (employeeId: string, remarks: string) => {
    setAttendanceData((prev) => {
      const newData = new Map(prev);
      const record = newData.get(employeeId);
      if (record) {
        newData.set(employeeId, { ...record, remarks });
      }
      return newData;
    });
  };

  const handleBulkStatusChange = (status: AttendanceStatus) => {
    setAttendanceData((prev) => {
      const newData = new Map(prev);
      filteredEmployees.forEach((emp) => {
        const record = newData.get(emp.id);
        if (record) {
          newData.set(emp.id, {
            ...record,
            status,
            otHours: status !== AttendanceStatus.PRESENT ? 0 : record.otHours,
          });
        }
      });
      return newData;
    });
  };

  const handleSubmit = () => {
    const records = Array.from(attendanceData.values()).map((record) => ({
      ...record,
      shift: selectedShift,
      date: selectedDate,
    }));
    onSubmit(records);
  };

  const summary = useMemo(() => {
    let present = 0;
    let absent = 0;
    let halfDay = 0;
    let withOT = 0;

    attendanceData.forEach((record) => {
      if (record.status === AttendanceStatus.PRESENT) present++;
      else if (record.status === AttendanceStatus.ABSENT) absent++;
      else if (record.status === AttendanceStatus.HALF_DAY) halfDay++;
      if (record.otHours > 0) withOT++;
    });

    return { present, absent, halfDay, withOT };
  }, [attendanceData]);

  if (filteredEmployees.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800">
          {selectedDepartment
            ? `No active employees found in ${selectedDepartment} department.`
            : "Please select a department to mark attendance."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department / Section <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value as Department | "")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select Department</option>
              {Object.values(Department).map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shift <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value as Shift)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              {Object.values(Shift).map((shift) => (
                <option key={shift} value={shift}>
                  {shift}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="text"
              value={new Date(selectedDate).toLocaleDateString()}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedDepartment && (
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700 mr-2">
              Mark All as:
            </span>
            <button
              onClick={() => handleBulkStatusChange(AttendanceStatus.PRESENT)}
              className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
            >
              Present
            </button>
            <button
              onClick={() => handleBulkStatusChange(AttendanceStatus.ABSENT)}
              className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
            >
              Absent
            </button>
            <button
              onClick={() => handleBulkStatusChange(AttendanceStatus.HALF_DAY)}
              className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition"
            >
              Half Day
            </button>
          </div>
        )}

        {/* Summary */}
        {selectedDepartment && (
          <div className="flex flex-wrap gap-3 sm:gap-4 mt-4 text-xs sm:text-sm">
            <span className="text-gray-600">
              Total: <strong>{filteredEmployees.length}</strong>
            </span>
            <span className="text-green-600">
              Present: <strong>{summary.present}</strong>
            </span>
            <span className="text-red-600">
              Absent: <strong>{summary.absent}</strong>
            </span>
            <span className="text-yellow-600">
              Half Day: <strong>{summary.halfDay}</strong>
            </span>
            <span className="text-blue-600">
              With OT: <strong>{summary.withOT}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Attendance Table */}
      {selectedDepartment && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Emp ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    OT Hours
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => {
                  const record = attendanceData.get(employee.id);
                  if (!record) return null;

                  return (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {employee.id}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {employee.fullName}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={record.status}
                          onChange={(e) =>
                            handleStatusChange(
                              employee.id,
                              e.target.value as AttendanceStatus
                            )
                          }
                          className="text-sm px-2 py-1 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
                        >
                          {Object.values(AttendanceStatus).map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          max="12"
                          step="0.5"
                          value={record.otHours}
                          onChange={(e) =>
                            handleOTChange(
                              employee.id,
                              parseFloat(e.target.value) || 0
                            )
                          }
                          disabled={record.status !== AttendanceStatus.PRESENT}
                          className="w-20 text-sm px-2 py-1 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={record.remarks || ""}
                          onChange={(e) =>
                            handleRemarksChange(employee.id, e.target.value)
                          }
                          placeholder="Optional"
                          className="w-full text-sm px-2 py-1 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 px-4 py-3 border-t flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition font-medium"
            >
              Save Attendance
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkAttendanceEntry;
