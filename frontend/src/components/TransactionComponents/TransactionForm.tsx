import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import type { TransactionFormData } from "../../utils/Interfaces";
import {
  TransactionType,
  ExpenseCategory,
  IncomeCategory,
  PaymentType,
  ExpenseDescriptions,
  IncomeDescriptions,
} from "../../utils/enums";

interface TransactionFormProps {
  transaction?: TransactionFormData & { id?: string };
  onSubmit: (data: TransactionFormData) => void;
  onCancel: () => void;
}

const TransactionForm = ({
  transaction,
  onSubmit,
  onCancel,
}: TransactionFormProps) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    date: new Date().toISOString().split("T")[0],
    type: TransactionType.EXPENSE,
    category: ExpenseCategory.GREEN_LEAF_COST,
    description: "",
    amount: 0,
    paymentType: PaymentType.CASH,
    referenceNo: "",
    remarks: "",
  });

  const [availableDescriptions, setAvailableDescriptions] = useState<string[]>([]);

  useEffect(() => {
    if (transaction) {
      setFormData(transaction);
    }
  }, [transaction]);

  // Update available descriptions when type or category changes
  useEffect(() => {
    if (formData.type === TransactionType.EXPENSE) {
      const descriptions =
        ExpenseDescriptions[formData.category as ExpenseCategory] || [];
      setAvailableDescriptions(descriptions as any);
    } else {
      const descriptions =
        IncomeDescriptions[formData.category as IncomeCategory] || [];
      setAvailableDescriptions(descriptions as any);
    }
    // Reset description if not in new list
    if (!availableDescriptions.includes(formData.description)) {
      setFormData((prev) => ({ ...prev, description: "" }));
    }
  }, [formData.type, formData.category]);

  const handleTypeChange = (type: TransactionType) => {
    setFormData((prev) => ({
      ...prev,
      type,
      category:
        type === TransactionType.EXPENSE
          ? ExpenseCategory.GREEN_LEAF_COST
          : IncomeCategory.MADE_TEA_SALES,
      description: "",
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }
    if (!formData.description) {
      toast.error("Please select a description");
      return;
    }
    onSubmit(formData);
  };

  const inputClasses =
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 px-3 py-2 border";
  const labelClasses = "block text-sm font-medium text-gray-700";

  const categories =
    formData.type === TransactionType.EXPENSE
      ? Object.values(ExpenseCategory)
      : Object.values(IncomeCategory);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Transaction Type Toggle */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Transaction Type
        </h3>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleTypeChange(TransactionType.EXPENSE)}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition ${
              formData.type === TransactionType.EXPENSE
                ? "bg-red-100 text-red-700 border-2 border-red-500"
                : "bg-gray-100 text-gray-600 border-2 border-gray-300 hover:bg-gray-200"
            }`}
          >
            🔴 Expense
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange(TransactionType.INCOME)}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition ${
              formData.type === TransactionType.INCOME
                ? "bg-green-100 text-green-700 border-2 border-green-500"
                : "bg-gray-100 text-gray-600 border-2 border-gray-300 hover:bg-gray-200"
            }`}
          >
            🟢 Income
          </button>
        </div>
      </div>

      {/* Transaction Details */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
          Transaction Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className={labelClasses}>
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="category" className={labelClasses}>
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className={inputClasses}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className={labelClasses}>
              Description <span className="text-red-500">*</span>
            </label>
            <select
              id="description"
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              className={inputClasses}
            >
              <option value="">-- Select Description --</option>
              {availableDescriptions.map((desc) => (
                <option key={desc} value={desc}>
                  {desc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="amount" className={labelClasses}>
              Amount (Rs.) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              required
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="paymentType" className={labelClasses}>
              Payment Type <span className="text-red-500">*</span>
            </label>
            <select
              id="paymentType"
              name="paymentType"
              required
              value={formData.paymentType}
              onChange={handleChange}
              className={inputClasses}
            >
              {Object.values(PaymentType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="referenceNo" className={labelClasses}>
              Reference No (Optional)
            </label>
            <input
              type="text"
              id="referenceNo"
              name="referenceNo"
              value={formData.referenceNo}
              onChange={handleChange}
              placeholder="Invoice/Receipt No"
              className={inputClasses}
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="remarks" className={labelClasses}>
              Remarks (Optional)
            </label>
            <textarea
              id="remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows={3}
              placeholder="Additional notes..."
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
          className={`px-6 py-2 text-white rounded-md transition ${
            formData.type === TransactionType.EXPENSE
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {transaction?.id ? "Update Transaction" : "Add Transaction"}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
