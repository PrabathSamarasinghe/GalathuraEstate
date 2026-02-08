import { useState, useMemo } from "react";
import type { Transaction, TransactionFilters } from "../../utils/Interfaces";
import {
  TransactionType,
  ExpenseCategory,
  IncomeCategory,
  PaymentType,
} from "../../utils/enums";

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: string) => void;
}

const TransactionTable = ({
  transactions,
  onEdit,
  onDelete,
}: TransactionTableProps) => {
  const [filters, setFilters] = useState<TransactionFilters>({
    dateFrom: "",
    dateTo: "",
    type: "",
    category: "",
    paymentType: "",
    searchTerm: "",
  });

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Transaction;
    direction: "asc" | "desc";
  } | null>(null);

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Apply filters
    if (filters.dateFrom) {
      filtered = filtered.filter((txn) => txn.date >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      filtered = filtered.filter((txn) => txn.date <= filters.dateTo!);
    }
    if (filters.type) {
      filtered = filtered.filter((txn) => txn.type === filters.type);
    }
    if (filters.category) {
      filtered = filtered.filter((txn) => txn.category === filters.category);
    }
    if (filters.paymentType) {
      filtered = filtered.filter((txn) => txn.paymentType === filters.paymentType);
    }
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (txn) =>
          txn.description.toLowerCase().includes(searchLower) ||
          txn.category.toLowerCase().includes(searchLower) ||
          txn.referenceNo?.toLowerCase().includes(searchLower) ||
          txn.remarks?.toLowerCase().includes(searchLower)
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
  }, [transactions, filters, sortConfig]);

  const handleSort = (key: keyof Transaction) => {
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

  const getSortIcon = (key: keyof Transaction) => {
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
      dateFrom: "",
      dateTo: "",
      type: "",
      category: "",
      paymentType: "",
      searchTerm: "",
    });
  };

  const handleDeleteClick = (transactionId: string, description: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete the transaction "${description}"? This action cannot be undone.`
      )
    ) {
      onDelete(transactionId);
    }
  };

  // Calculate totals
  const totals = useMemo(() => {
    const expense = filteredAndSortedTransactions
      .filter((txn) => txn.type === TransactionType.EXPENSE)
      .reduce((sum, txn) => sum + txn.amount, 0);
    const income = filteredAndSortedTransactions
      .filter((txn) => txn.type === TransactionType.INCOME)
      .reduce((sum, txn) => sum + txn.amount, 0);
    return { expense, income, net: income - expense };
  }, [filteredAndSortedTransactions]);

  const thClasses =
    "px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition";
  const tdClasses = "px-4 py-3 whitespace-nowrap text-sm text-gray-900";

  const allCategories = [
    ...Object.values(ExpenseCategory),
    ...Object.values(IncomeCategory),
  ];

  return (
    <div className="space-y-4">
      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              name="searchTerm"
              placeholder="Description, reference..."
              value={filters.searchTerm}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date From
            </label>
            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date To
            </label>
            <input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Types</option>
              {Object.values(TransactionType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Categories</option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment
            </label>
            <select
              name="paymentType"
              value={filters.paymentType}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Payments</option>
              {Object.values(PaymentType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-4 text-sm">
            <span className="text-gray-600">
              Showing {filteredAndSortedTransactions.length} of {transactions.length}{" "}
              records
            </span>
            <span className="text-red-600 font-medium">
              Expenses: Rs. {totals.expense.toLocaleString()}
            </span>
            <span className="text-green-600 font-medium">
              Income: Rs. {totals.income.toLocaleString()}
            </span>
            <span
              className={`font-bold ${
                totals.net >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              Net: Rs. {totals.net.toLocaleString()}
            </span>
          </div>
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
                <th onClick={() => handleSort("type")} className={thClasses}>
                  Type {getSortIcon("type")}
                </th>
                <th onClick={() => handleSort("category")} className={thClasses}>
                  Category {getSortIcon("category")}
                </th>
                <th onClick={() => handleSort("description")} className={thClasses}>
                  Description {getSortIcon("description")}
                </th>
                <th onClick={() => handleSort("amount")} className={thClasses}>
                  Amount {getSortIcon("amount")}
                </th>
                <th onClick={() => handleSort("paymentType")} className={thClasses}>
                  Payment {getSortIcon("paymentType")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Reference
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
              {filteredAndSortedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                    No transactions found matching the filters.
                  </td>
                </tr>
              ) : (
                filteredAndSortedTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition">
                    <td className={tdClasses}>
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className={tdClasses}>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.type === TransactionType.EXPENSE
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className={tdClasses}>
                      <span className="text-xs">{transaction.category}</span>
                    </td>
                    <td className={tdClasses}>{transaction.description}</td>
                    <td className={tdClasses}>
                      <span
                        className={`font-bold ${
                          transaction.type === TransactionType.EXPENSE
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        Rs. {transaction.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className={tdClasses}>
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {transaction.paymentType}
                      </span>
                    </td>
                    <td className={tdClasses}>
                      <span className="text-xs text-gray-600">
                        {transaction.referenceNo || "-"}
                      </span>
                    </td>
                    <td className={tdClasses}>
                      <span className="text-xs text-gray-600">
                        {transaction.remarks || "-"}
                      </span>
                    </td>
                    <td className={tdClasses}>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEdit(transaction)}
                          className="text-green-600 hover:text-green-800 font-medium"
                          title="Edit Transaction"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteClick(transaction.id, transaction.description)
                          }
                          className="text-red-600 hover:text-red-800 font-medium"
                          title="Delete Transaction"
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

export default TransactionTable;
