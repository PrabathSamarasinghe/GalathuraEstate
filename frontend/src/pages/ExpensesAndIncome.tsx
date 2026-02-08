import { useState, useMemo } from "react";
import type {
  Transaction,
  TransactionFormData,
  TransactionSummary,
} from "../utils/Interfaces";
import { TransactionType } from "../utils/enums";
import TransactionForm from "../components/TransactionComponents/TransactionForm";
import TransactionSummaryCard from "../components/TransactionComponents/TransactionSummaryCard";
import TransactionTable from "../components/TransactionComponents/TransactionTable";
import { useMutation, useQuery } from "@apollo/client";
import toast from "react-hot-toast";
import { GET_TRANSACTIONS, CREATE_TRANSACTION, UPDATE_TRANSACTION, DELETE_TRANSACTION } from "../graphql/queries";
import Loading from "../components/Loading";
import { toGraphQLEnum } from "../utils/enumMappings";

const ExpensesAndIncome = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();

  // GraphQL queries and mutations
  const { data, loading, error, refetch } = useQuery(GET_TRANSACTIONS, {
    fetchPolicy: 'cache-and-network',
  });

  const [createTransaction] = useMutation(CREATE_TRANSACTION, {
    onCompleted: () => refetch(),
  });

  const [updateTransaction] = useMutation(UPDATE_TRANSACTION, {
    onCompleted: () => refetch(),
  });

  const [deleteTransaction] = useMutation(DELETE_TRANSACTION, {
    onCompleted: () => refetch(),
  });

  const transactions: Transaction[] = data?.transactions || [];

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

  const handleSubmit = async (formData: TransactionFormData) => {
    const input = {
      date: formData.date,
      type: toGraphQLEnum.transactionType(formData.type),
      category: formData.category,
      description: formData.description,
      amount: formData.amount,
      paymentType: toGraphQLEnum.paymentType(formData.paymentType),
      referenceNo: formData.referenceNo,
      remarks: formData.remarks,
    };

    try {
      if (editingTransaction) {
        await updateTransaction({ variables: { id: editingTransaction.id, input } });
      } else {
        await createTransaction({ variables: { input } });
      }
      handleCloseForm();
    } catch (err) {
      console.error("Error saving transaction:", err);
      toast.error("Failed to save transaction. Please try again.");
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = async (transactionId: string) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await deleteTransaction({ variables: { id: transactionId } });
      } catch (err) {
        console.error("Error deleting transaction:", err);
        toast.error("Failed to delete transaction.");
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(undefined);
  };

  const handleAddNew = () => {
    setEditingTransaction(undefined);
    setShowForm(true);
  };

  if (loading && !data) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading transactions: {error.message}</p>
        <button onClick={() => refetch()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
            Expenses & Income Entry
          </h1>
          <p className="mt-2 text-gray-600 text-sm md:text-base">
            Track all expenses and income transactions
          </p>
        </div>
        {!showForm && (
          <button
            onClick={handleAddNew}
            className="px-4 md:px-6 py-2 md:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-sm text-sm md:text-base whitespace-nowrap"
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
