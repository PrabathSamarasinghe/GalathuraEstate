
import { useState, useEffect } from "react";
import type { Employee, EmployeeFormData } from "../utils/Interfaces";
import { EmployeeStatus } from "../utils/enums";
import EmployeeForm from "../components/EmployeeComponents/EmployeeForm";
import EmployeeTable from "../components/EmployeeComponents/EmployeeTable";
import ViewEmployeeModal from "../components/EmployeeComponents/ViewEmployeeModal";

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>();
  const [viewingEmployee, setViewingEmployee] = useState<Employee | undefined>();

  // Load employees from localStorage on mount
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

  // Save employees to localStorage whenever they change
  useEffect(() => {
    if (employees.length > 0 || localStorage.getItem("galathura_employees")) {
      localStorage.setItem("galathura_employees", JSON.stringify(employees));
    }
  }, [employees]);

  // Generate employee ID
  const generateEmployeeId = (): string => {
    const prefix = "EMP";
    const year = new Date().getFullYear().toString().slice(-2);
    const count = employees.length + 1;
    const id = `${prefix}${year}${count.toString().padStart(4, "0")}`;
    return id;
  };

  const handleSubmit = (data: EmployeeFormData) => {
    if (editingEmployee) {
      // Update existing employee
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === editingEmployee.id ? { ...data, id: editingEmployee.id } : emp
        )
      );
    } else {
      // Add new employee
      const newEmployee: Employee = {
        ...data,
        id: generateEmployeeId(),
      };
      setEmployees((prev) => [...prev, newEmployee]);
    }
    handleCloseForm();
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleView = (employee: Employee) => {
    setViewingEmployee(employee);
  };

  const handleDeactivate = (employeeId: string) => {
    if (window.confirm("Are you sure you want to deactivate this employee?")) {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === employeeId ? { ...emp, status: EmployeeStatus.INACTIVE } : emp
        )
      );
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEmployee(undefined);
  };

  const handleAddNew = () => {
    setEditingEmployee(undefined);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Employee Management</h1>
          <p className="mt-2 text-gray-600">
            Manage your workforce and employee records
          </p>
        </div>
        {!showForm && (
          <button
            onClick={handleAddNew}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-sm"
          >
            + Add New Employee
          </button>
        )}
      </div>

      {/* Statistics Cards */}
      {!showForm && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Employees</p>
            <p className="text-3xl font-bold text-gray-900">{employees.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Active</p>
            <p className="text-3xl font-bold text-green-600">
              {employees.filter((e) => e.status === EmployeeStatus.ACTIVE).length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Inactive</p>
            <p className="text-3xl font-bold text-gray-600">
              {employees.filter((e) => e.status === EmployeeStatus.INACTIVE).length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Permanent Staff</p>
            <p className="text-3xl font-bold text-gray-800">
              {employees.filter((e) => e.employmentType === "Permanent").length}
            </p>
          </div>
        </div>
      )}

      {/* Form or Table */}
      {showForm ? (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {editingEmployee ? "Edit Employee" : "Add New Employee"}
          </h2>
          <EmployeeForm
            employee={editingEmployee}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
          />
        </div>
      ) : (
        <EmployeeTable
          employees={employees}
          onView={handleView}
          onEdit={handleEdit}
          onDeactivate={handleDeactivate}
        />
      )}

      {/* View Modal */}
      {viewingEmployee && (
        <ViewEmployeeModal
          employee={viewingEmployee}
          onClose={() => setViewingEmployee(undefined)}
        />
      )}
    </div>
  );
};

export default Employees;
