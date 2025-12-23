import { useState, useMemo } from "react";
import type { Employee, EmployeeFilters } from "../../utils/Interfaces";
import {
  Department,
  EmploymentType,
  EmployeeStatus,
} from "../../utils/enums";

interface EmployeeTableProps {
  employees: Employee[];
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDeactivate: (employeeId: string) => void;
}

const EmployeeTable = ({
  employees,
  onView,
  onEdit,
  onDeactivate,
}: EmployeeTableProps) => {
  const [filters, setFilters] = useState<EmployeeFilters>({
    department: "",
    employmentType: "",
    status: "",
    searchTerm: "",
  });

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Employee;
    direction: "asc" | "desc";
  } | null>(null);

  // Filter and sort employees
  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = [...employees];

    // Apply filters
    if (filters.department) {
      filtered = filtered.filter((emp) => emp.department === filters.department);
    }
    if (filters.employmentType) {
      filtered = filtered.filter(
        (emp) => emp.employmentType === filters.employmentType
      );
    }
    if (filters.status) {
      filtered = filtered.filter((emp) => emp.status === filters.status);
    }
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (emp) =>
          emp.fullName.toLowerCase().includes(searchLower) ||
          emp.id.toLowerCase().includes(searchLower) ||
          emp.nicNumber.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if ((aValue ?? "") < (bValue ?? "")) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if ((aValue ?? "") > (bValue ?? "")) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [employees, filters, sortConfig]);

  const handleSort = (key: keyof Employee) => {
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

  const getSortIcon = (key: keyof Employee) => {
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
      department: "",
      employmentType: "",
      status: "",
      searchTerm: "",
    });
  };

  const thClasses =
    "px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition";
  const tdClasses = "px-6 py-4 whitespace-nowrap text-sm text-gray-900";

  return (
    <div className="space-y-4">
      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              name="searchTerm"
              placeholder="Name, ID, or NIC..."
              value={filters.searchTerm}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section
            </label>
            <select
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Sections</option>
              {Object.values(Department).map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employment Type
            </label>
            <select
              name="employmentType"
              value={filters.employmentType}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Types</option>
              {Object.values(EmploymentType).map((type) => (
                <option key={type} value={type}>
                  {type}
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
              {Object.values(EmployeeStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-600">
            Showing {filteredAndSortedEmployees.length} of {employees.length}{" "}
            employees
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
                <th
                  onClick={() => handleSort("id")}
                  className={thClasses}
                >
                  Employee ID {getSortIcon("id")}
                </th>
                <th
                  onClick={() => handleSort("fullName")}
                  className={thClasses}
                >
                  Name {getSortIcon("fullName")}
                </th>
                <th
                  onClick={() => handleSort("department")}
                  className={thClasses}
                >
                  Section {getSortIcon("department")}
                </th>
                <th
                  onClick={() => handleSort("employmentType")}
                  className={thClasses}
                >
                  Employment Type {getSortIcon("employmentType")}
                </th>
                <th
                  onClick={() => handleSort("rate")}
                  className={thClasses}
                >
                  Wage Rate {getSortIcon("rate")}
                </th>
                <th
                  onClick={() => handleSort("status")}
                  className={thClasses}
                >
                  Status {getSortIcon("status")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No employees found matching the filters.
                  </td>
                </tr>
              ) : (
                filteredAndSortedEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className={tdClasses}>
                      <span className="font-medium text-green-600">
                        {employee.id}
                      </span>
                    </td>
                    <td className={tdClasses}>
                      <div className="font-medium">{employee.fullName}</div>
                      <div className="text-gray-500 text-xs">
                        {employee.nicNumber}
                      </div>
                    </td>
                    <td className={tdClasses}>{employee.department}</td>
                    <td className={tdClasses}>{employee.employmentType}</td>
                    <td className={tdClasses}>
                      <div className="font-medium">Rs. {employee.rate.toFixed(2)}</div>
                      <div className="text-gray-500 text-xs">
                        {employee.payType}
                      </div>
                    </td>
                    <td className={tdClasses}>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          employee.status === EmployeeStatus.ACTIVE
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {employee.status}
                      </span>
                    </td>
                    <td className={tdClasses}>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onView(employee)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                          title="View Details"
                        >
                          View
                        </button>
                        <button
                          onClick={() => onEdit(employee)}
                          className="text-green-600 hover:text-green-800 font-medium"
                          title="Edit Employee"
                        >
                          Edit
                        </button>
                        {employee.status === EmployeeStatus.ACTIVE && (
                          <button
                            onClick={() => onDeactivate(employee.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                            title="Deactivate Employee"
                          >
                            Deactivate
                          </button>
                        )}
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

export default EmployeeTable;
