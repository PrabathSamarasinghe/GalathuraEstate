import { useState, useEffect } from "react";
import type { EmployeeFormData } from "../../utils/Interfaces";
import {
  Department,
  Designation,
  EmploymentType,
  EmployeeStatus,
  PayType,
} from "../../utils/enums";

interface EmployeeFormProps {
  employee?: EmployeeFormData;
  onSubmit: (data: EmployeeFormData) => void;
  onCancel: () => void;
}

const EmployeeForm = ({ employee, onSubmit, onCancel }: EmployeeFormProps) => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    fullName: "",
    nicNumber: "",
    contactNumber: "",
    address: "",
    department: Department.WITHERING,
    designation: Designation.HELPER,
    employmentType: EmploymentType.PERMANENT,
    joinDate: new Date().toISOString().split("T")[0],
    status: EmployeeStatus.ACTIVE,
    payType: PayType.DAILY_WAGE,
    rate: 0,
    otRate: 0,
  });

  useEffect(() => {
    if (employee) {
      setFormData(employee);
    }
  }, [employee]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rate" || name === "otRate" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClasses =
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 px-3 py-2 border";
  const labelClasses = "block text-sm font-medium text-gray-700";
  const sectionClasses = "bg-white p-6 rounded-lg shadow-sm border border-gray-200";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Details Section */}
      <div className={sectionClasses}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
          Basic Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fullName" className={labelClasses}>
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="nicNumber" className={labelClasses}>
              NIC / ID Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nicNumber"
              name="nicNumber"
              required
              value={formData.nicNumber}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="contactNumber" className={labelClasses}>
              Contact Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              required
              value={formData.contactNumber}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="address" className={labelClasses}>
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              className={inputClasses}
            />
          </div>
        </div>
      </div>

      {/* Work Details Section */}
      <div className={sectionClasses}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
          Work Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="department" className={labelClasses}>
              Department / Section <span className="text-red-500">*</span>
            </label>
            <select
              id="department"
              name="department"
              required
              value={formData.department}
              onChange={handleChange}
              className={inputClasses}
            >
              {Object.values(Department).map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="designation" className={labelClasses}>
              Designation / Role <span className="text-red-500">*</span>
            </label>
            <select
              id="designation"
              name="designation"
              required
              value={formData.designation}
              onChange={handleChange}
              className={inputClasses}
            >
              {Object.values(Designation).map((desig) => (
                <option key={desig} value={desig}>
                  {desig}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="employmentType" className={labelClasses}>
              Employment Type <span className="text-red-500">*</span>
            </label>
            <select
              id="employmentType"
              name="employmentType"
              required
              value={formData.employmentType}
              onChange={handleChange}
              className={inputClasses}
            >
              {Object.values(EmploymentType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="joinDate" className={labelClasses}>
              Join Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="joinDate"
              name="joinDate"
              required
              value={formData.joinDate}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="status" className={labelClasses}>
              Status <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              name="status"
              required
              value={formData.status}
              onChange={handleChange}
              className={inputClasses}
            >
              {Object.values(EmployeeStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Wage Configuration Section */}
      <div className={sectionClasses}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
          Wage Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="payType" className={labelClasses}>
              Pay Type <span className="text-red-500">*</span>
            </label>
            <select
              id="payType"
              name="payType"
              required
              value={formData.payType}
              onChange={handleChange}
              className={inputClasses}
            >
              {Object.values(PayType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="rate" className={labelClasses}>
              Rate (
              {formData.payType === PayType.DAILY_WAGE
                ? "per day"
                : formData.payType === PayType.HOURLY
                ? "per hour"
                : "per month"}
              ) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="rate"
              name="rate"
              required
              min="0"
              step="0.01"
              value={formData.rate}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="otRate" className={labelClasses}>
              OT Rate (Optional)
            </label>
            <input
              type="number"
              id="otRate"
              name="otRate"
              min="0"
              step="0.01"
              value={formData.otRate || ""}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          {employee?.id ? "Update Employee" : "Add Employee"}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
