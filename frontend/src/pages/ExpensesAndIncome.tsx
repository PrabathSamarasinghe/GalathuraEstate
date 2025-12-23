import { useState, useEffect, useMemo } from "react";
import type {
  Transaction,
  TransactionFormData,
  TransactionSummary,
} from "../utils/Interfaces";
import { TransactionType } from "../utils/enums";
import TransactionForm from "../components/TransactionComponents/TransactionForm";
import TransactionSummaryCard from "../components/TransactionComponents/TransactionSummaryCard";
import TransactionTable from "../components/TransactionComponents/TransactionTable";

const ExpensesAndIncome = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();

  // Load transactions from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("galathura_transactions");
    if (stored) {
      try {
        setTransactions(JSON.parse(stored));
      } catch (error) {
        console.error("Error loading transactions:", error);
      }
    }
  }, []);

  // Save transactions to localStorage
  useEffect(() => {
    if (transactions.length > 0 || localStorage.getItem("galathura_transactions")) {
      localStorage.setItem("galathura_transactions", JSON.stringify(transactions));
    }
  }, [transactions]);

  // Generate transaction ID
  const generateTransactionId = (): string => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `TXN${timestamp}${random}`;
  };

  // Calculate summary
  const summary: TransactionSummary = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    let todayExpenses = 0;
    let todayIncome = 0;
    let monthExpenses = 0;
    let monthIncome = 0;
    const categoryMap = new Map<string, number>();

    transactions.forEach((txn) => {
      const amount = txn.amount;

      // Today's totals
      if (txn.date === today) {
        if (txn.type === TransactionType.EXPENSE) {
          todayExpenses += amount;
        } else {
          todayIncome += amount;
        }
      }

      // This month's totals
      if (txn.date.startsWith(currentMonth)) {
        if (txn.type === TransactionType.EXPENSE) {
          monthExpenses += amount;
          // Category totals (only expenses for P&L)
          const current = categoryMap.get(txn.category) || 0;
          categoryMap.set(txn.category, current + amount);
        } else {
          monthIncome += amount;
        }
      }
    });

    const categoryTotals = Array.from(categoryMap.entries()).map(
      ([category, total]) => ({ category, total })
    );

    return {
      todayExpenses,
      todayIncome,
      monthExpenses,
      monthIncome,
      categoryTotals,
    };
  }, [transactions]);

  const handleSubmit = (data: TransactionFormData) => {
    if (editingTransaction) {
      // Update existing transaction
      setTransactions((prev) =>
        prev.map((txn) =>
          txn.id === editingTransaction.id
            ? {
                ...data,
                id: editingTransaction.id,
                createdAt: editingTransaction.createdAt,
                createdBy: editingTransaction.createdBy,
                lastEditedAt: new Date().toISOString(),
              }
            : txn
        )
      );
    } else {
      // Add new transaction
      const newTransaction: Transaction = {
        ...data,
        id: generateTransactionId(),
        createdAt: new Date().toISOString(),
      };
      setTransactions((prev) => [...prev, newTransaction]);
    }
    handleCloseForm();
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = (transactionId: string) => {
    setTransactions((prev) => prev.filter((txn) => txn.id !== transactionId));
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(undefined);
  };

  const handleAddNew = () => {
    setEditingTransaction(undefined);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Expenses & Income Entry
          </h1>
          <p className="mt-2 text-gray-600">
            Track all expenses and income transactions
          </p>
        </div>
        {!showForm && (
          <button
            onClick={handleAddNew}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-sm"
          >
            + Add Transaction
          </button>
        )}
      </div>

      {/* Summary Cards */}
      {!showForm && <TransactionSummaryCard summary={summary} />}

      {/* Form or Table */}
      {showForm ? (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {editingTransaction ? "Edit Transaction" : "Add New Transaction"}
          </h2>
          <TransactionForm
            transaction={editingTransaction}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
          />
        </div>
      ) : (
        <>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Transaction Ledger
            </h2>
            <TransactionTable
              transactions={transactions}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>

          {/* Info Panel */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              📊 Transaction Guidelines
            </h3>
            <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
              <li>All transactions are categorized for automatic P&L generation</li>
              <li>Use standard descriptions to maintain consistent reporting</li>
              <li>Reference numbers help track invoices and receipts</li>
              <li>
                Category-wise totals are calculated automatically for the current
                month
              </li>
              <li>
                Filter by date range to generate custom period reports
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default ExpensesAndIncome;
