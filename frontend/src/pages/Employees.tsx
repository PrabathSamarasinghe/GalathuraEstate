
import { useState } from "react";
import toast from "react-hot-toast";
import type { Employee, EmployeeFormData } from "../utils/Interfaces";
import { EmployeeStatus } from "../utils/enums";
import EmployeeForm from "../components/EmployeeComponents/EmployeeForm";
import EmployeeTable from "../components/EmployeeComponents/EmployeeTable";
import ViewEmployeeModal from "../components/EmployeeComponents/ViewEmployeeModal";
import { useMutation, useQuery } from "@apollo/client";
import { GET_EMPLOYEES, CREATE_EMPLOYEE, UPDATE_EMPLOYEE, DELETE_EMPLOYEE } from "../graphql/queries";
import Loading from "../components/Loading";
import { toGraphQLEnum, fromGraphQLEnum } from "../utils/enumMappings";

const Employees = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>();
  const [viewingEmployee, setViewingEmployee] = useState<Employee | undefined>();

  // GraphQL queries and mutations
  const { data, loading, error, refetch } = useQuery(GET_EMPLOYEES, {
    fetchPolicy: 'cache-and-network',
  });

  const [createEmployee] = useMutation(CREATE_EMPLOYEE, {
    onCompleted: () => refetch(),
  });

  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE, {
    onCompleted: () => refetch(),
  });

  const [_deleteEmployee] = useMutation(DELETE_EMPLOYEE, {
    onCompleted: () => refetch(),
  });

  const employees: Employee[] = (data?.employees || []).map((emp: Employee) => ({
    ...emp,
    designation: fromGraphQLEnum.designation(emp.designation),
    employmentType: fromGraphQLEnum.employmentType(emp.employmentType),
    payType: fromGraphQLEnum.payType(emp.payType),
  }));

  const handleSubmit = async (formData: EmployeeFormData) => {
    const input = {
      fullName: formData.fullName,
      nicNumber: formData.nicNumber,
      contactNumber: formData.contactNumber,
      address: formData.address,
      department: toGraphQLEnum.department(formData.department),
      designation: toGraphQLEnum.designation(formData.designation),
      employmentType: toGraphQLEnum.employmentType(formData.employmentType),
      joinDate: formData.joinDate,
      status: toGraphQLEnum.status(formData.status),
      payType: toGraphQLEnum.payType(formData.payType),
      rate: formData.rate,
      otRate: formData.otRate,
    };

    try {
      if (editingEmployee) {
        await updateEmployee({ variables: { id: editingEmployee.id, input } });
      } else {
        await createEmployee({ variables: { input } });
      }
      handleCloseForm();
    } catch (err) {
      console.error("Error saving employee:", err);
      toast.error("Failed to save employee. Please try again.");
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleView = (employee: Employee) => {
    setViewingEmployee(employee);
  };

  const handleDeactivate = async (employeeId: string) => {
    if (window.confirm("Are you sure you want to deactivate this employee?")) {
      try {
        await updateEmployee({
          variables: {
            id: employeeId,
            input: { status: EmployeeStatus.INACTIVE }
          }
        });
      } catch (err) {
        console.error("Error deactivating employee:", err);
        toast.error("Failed to deactivate employee.");
      }
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

  if (loading && !data) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading employees: {error.message}</p>
        <button onClick={() => refetch()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Retry
        </button>
      </div>
    );
  }

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
