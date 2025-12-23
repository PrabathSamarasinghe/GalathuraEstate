import { useState, useMemo } from "react";
import type { AttendanceRecord, AttendanceFilters } from "../../utils/Interfaces";
import { Department, Shift, AttendanceStatus } from "../../utils/enums";

interface AttendanceTableProps {
  records: AttendanceRecord[];
  onEdit: (record: AttendanceRecord) => void;
  onDelete: (recordId: string) => void;
}

const AttendanceTable = ({ records, onEdit, onDelete }: AttendanceTableProps) => {
  const [filters, setFilters] = useState<AttendanceFilters>({
    date: "",
    department: "",
    shift: "",
    status: "",
    searchTerm: "",
  });

  const [sortConfig, setSortConfig] = useState<{
    key: keyof AttendanceRecord;
    direction: "asc" | "desc";
  } | null>(null);

  // Filter and sort records
  const filteredAndSortedRecords = useMemo(() => {
    let filtered = [...records];

    // Apply filters
    if (filters.date) {
      filtered = filtered.filter((record) => record.date === filters.date);
    }
    if (filters.department) {
      filtered = filtered.filter((record) => record.department === filters.department);
    }
    if (filters.shift) {
      filtered = filtered.filter((record) => record.shift === filters.shift);
    }
    if (filters.status) {
      filtered = filtered.filter((record) => record.status === filters.status);
    }
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (record) =>
          record.employeeId.toLowerCase().includes(searchLower) ||
          record.employeeName.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if ((aValue as any) < (bValue as any)) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if ((aValue as any) > (bValue as any)) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [records, filters, sortConfig]);

  const handleSort = (key: keyof AttendanceRecord) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const getSortIcon = (key: keyof AttendanceRecord) => {
    if (sortConfig?.key !== key) {
      return <span className="text-gray-400">⇅</span>;
    }
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      date: "",
      department: "",
      shift: "",
      status: "",
      searchTerm: "",
    });
  };

  const handleDeleteClick = (recordId: string, employeeName: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete attendance record for ${employeeName}? This action cannot be undone.`
      )
    ) {
      onDelete(recordId);
    }
  };

  const getStatusBadgeClass = (status: AttendanceStatus) => {
    switch (status) {
      case AttendanceStatus.PRESENT:
        return "bg-green-100 text-green-800";
      case AttendanceStatus.ABSENT:
        return "bg-red-100 text-red-800";
      case AttendanceStatus.HALF_DAY:
        return "bg-yellow-100 text-yellow-800";
      case AttendanceStatus.ON_LEAVE:
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const thClasses =
    "px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition";
  const tdClasses = "px-4 py-3 whitespace-nowrap text-sm text-gray-900";

  return (
    <div className="space-y-4">
      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              name="searchTerm"
              placeholder="Name or ID..."
              value={filters.searchTerm}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Departments</option>
              {Object.values(Department).map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shift
            </label>
            <select
              name="shift"
              value={filters.shift}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Shifts</option>
              {Object.values(Shift).map((shift) => (
                <option key={shift} value={shift}>
                  {shift}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Status</option>
              {Object.values(AttendanceStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-600">
            Showing {filteredAndSortedRecords.length} of {records.length} records
          </p>
          <button
            onClick={clearFilters}
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th onClick={() => handleSort("date")} className={thClasses}>
                  Date {getSortIcon("date")}
                </th>
                <th onClick={() => handleSort("employeeId")} className={thClasses}>
                  Employee ID {getSortIcon("employeeId")}
                </th>
                <th onClick={() => handleSort("employeeName")} className={thClasses}>
                  Name {getSortIcon("employeeName")}
                </th>
                <th onClick={() => handleSort("department")} className={thClasses}>
                  Section {getSortIcon("department")}
                </th>
                <th onClick={() => handleSort("shift")} className={thClasses}>
                  Shift {getSortIcon("shift")}
                </th>
                <th onClick={() => handleSort("status")} className={thClasses}>
                  Status {getSortIcon("status")}
                </th>
                <th onClick={() => handleSort("otHours")} className={thClasses}>
                  OT Hours {getSortIcon("otHours")}
                </th>
                <th onClick={() => handleSort("calculatedWage")} className={thClasses}>
                  Wage {getSortIcon("calculatedWage")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Remarks
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-8 text-center text-gray-500">
                    No attendance records found matching the filters.
                  </td>
                </tr>
              ) : (
                filteredAndSortedRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition">
                    <td className={tdClasses}>
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className={tdClasses}>
                      <span className="font-medium text-green-600">
                        {record.employeeId}
                      </span>
                    </td>
                    <td className={tdClasses}>{record.employeeName}</td>
                    <td className={tdClasses}>{record.department}</td>
                    <td className={tdClasses}>
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {record.shift}
                      </span>
                    </td>
                    <td className={tdClasses}>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                          record.status
                        )}`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className={tdClasses}>
                      {record.otHours > 0 ? (
                        <span className="font-medium text-blue-600">
                          {record.otHours} hrs
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className={tdClasses}>
                      <span className="font-medium text-green-600">
                        Rs. {record.calculatedWage.toFixed(2)}
                      </span>
                    </td>
                    <td className={tdClasses}>
                      <span className="text-xs text-gray-600">
                        {record.remarks || "-"}
                      </span>
                    </td>
                    <td className={tdClasses}>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEdit(record)}
                          className="text-green-600 hover:text-green-800 font-medium"
                          title="Edit Record"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(record.id, record.employeeName)}
                          className="text-red-600 hover:text-red-800 font-medium"
                          title="Delete Record"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTable;
