import type { Employee } from "../../utils/Interfaces";

interface ViewEmployeeModalProps {
  employee: Employee;
  onClose: () => void;
}

const ViewEmployeeModal = ({ employee, onClose }: ViewEmployeeModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Employee Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">
              Basic Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Employee ID</p>
                <p className="font-medium text-green-600">{employee.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium">{employee.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">NIC / ID Number</p>
                <p className="font-medium">{employee.nicNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Contact Number</p>
                <p className="font-medium">{employee.contactNumber}</p>
              </div>
              {employee.address && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium">{employee.address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Work Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">
              Work Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Department / Section</p>
                <p className="font-medium">{employee.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Designation / Role</p>
                <p className="font-medium">{employee.designation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Employment Type</p>
                <p className="font-medium">{employee.employmentType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Join Date</p>
                <p className="font-medium">
                  {new Date(employee.joinDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    employee.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {employee.status}
                </span>
              </div>
            </div>
          </div>

          {/* Wage Configuration */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">
              Wage Configuration
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Pay Type</p>
                <p className="font-medium">{employee.payType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Rate</p>
                <p className="font-medium text-green-600">
                  Rs. {employee.rate.toFixed(2)}
                </p>
              </div>
              {employee.otRate && employee.otRate > 0 && (
                <div>
                  <p className="text-sm text-gray-600">OT Rate</p>
                  <p className="font-medium">Rs. {employee.otRate.toFixed(2)}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployeeModal;
