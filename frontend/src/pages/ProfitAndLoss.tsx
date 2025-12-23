import { useState, useEffect, useMemo, useRef } from "react";
import PeriodSelector from "../components/ProfitLossComponents/PeriodSelector";
import PLStatement from "../components/ProfitLossComponents/PLStatement";
import ExportUtils from "../components/ProfitLossComponents/ExportUtils";
import type { Transaction } from "../utils/Interfaces";

const ProfitAndLoss = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [showComparison, setShowComparison] = useState<boolean>(true);
  const statementRef = useRef<HTMLDivElement>(null!);

  // Load transactions from localStorage
  useEffect(() => {
    const storedTransactions = localStorage.getItem("galathura_transactions");
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }

    // Set default period to current month
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    setFromDate(firstDay.toISOString().split("T")[0]);
    setToDate(lastDay.toISOString().split("T")[0]);
  }, []);

  // Filter transactions for current period
  const currentPeriodTransactions = useMemo(() => {
    if (!fromDate || !toDate) return [];

    return transactions.filter((txn) => {
      const txnDate = new Date(txn.date);
      const from = new Date(fromDate);
      const to = new Date(toDate);
      return txnDate >= from && txnDate <= to;
    });
  }, [transactions, fromDate, toDate]);

  // Calculate previous period transactions for comparison
  const previousPeriodTransactions = useMemo(() => {
    if (!fromDate || !toDate || !showComparison) return [];

    const from = new Date(fromDate);
    const to = new Date(toDate);
    const periodDays =
      Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Calculate previous period dates (same duration, going backwards)
    const prevTo = new Date(from);
    prevTo.setDate(prevTo.getDate() - 1);

    const prevFrom = new Date(prevTo);
    prevFrom.setDate(prevFrom.getDate() - periodDays + 1);

    return transactions.filter((txn) => {
      const txnDate = new Date(txn.date);
      return txnDate >= prevFrom && txnDate <= prevTo;
    });
  }, [transactions, fromDate, toDate, showComparison]);

  // Format period label
  const periodLabel = useMemo(() => {
    if (!fromDate || !toDate) return "";

    const from = new Date(fromDate);
    const to = new Date(toDate);

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return `${from.toLocaleDateString(
      "en-US",
      options
    )} - ${to.toLocaleDateString("en-US", options)}`;
  }, [fromDate, toDate]);

  // Format previous period label
  const previousPeriodLabel = useMemo(() => {
    if (!fromDate || !toDate || !showComparison) return "";

    const from = new Date(fromDate);
    const to = new Date(toDate);
    const periodDays =
      Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const prevTo = new Date(from);
    prevTo.setDate(prevTo.getDate() - 1);

    const prevFrom = new Date(prevTo);
    prevFrom.setDate(prevFrom.getDate() - periodDays + 1);

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return `${prevFrom.toLocaleDateString(
      "en-US",
      options
    )} - ${prevTo.toLocaleDateString("en-US", options)}`;
  }, [fromDate, toDate, showComparison]);

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          Profit & Loss Statement
        </h1>
        <p className="mt-2 text-gray-600">
          Generate formal tea factory P&L statements with period comparison
        </p>
      </div>

      {/* Period Selector */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <PeriodSelector
          onPeriodChange={(from, to) => {
            setFromDate(from);
            setToDate(to);
          }}
        />

        {/* Comparison Toggle */}
        <div className="mt-4 flex items-center gap-3">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showComparison}
              onChange={(e) => setShowComparison(e.target.checked)}
              className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Show comparison with previous period
            </span>
          </label>
          {showComparison && previousPeriodLabel && (
            <span className="text-sm text-gray-500">
              (vs. {previousPeriodLabel})
            </span>
          )}
        </div>
      </div>

      {/* Export Buttons */}
      {currentPeriodTransactions.length > 0 && (
        <ExportUtils statementRef={statementRef} periodLabel={periodLabel} />
      )}

      {/* P&L Statement */}
      {currentPeriodTransactions.length > 0 ? (
        <div ref={statementRef}>
          <PLStatement
            transactions={currentPeriodTransactions}
            fromDate={fromDate}
            toDate={toDate}
            comparisonTransactions={
              showComparison ? previousPeriodTransactions : undefined
            }
            showComparison={showComparison}
          />
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center shadow">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No Transaction Data Available
          </h3>
          <p className="text-gray-600 mb-4">
            No transactions found for the selected period ({periodLabel}).
          </p>
          <p className="text-sm text-gray-500">
            Please add income and expense transactions from the{" "}
            <span className="font-semibold">Expenses & Income</span> page to
            generate the P&L statement.
          </p>
        </div>
      )}

      {/* Info Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">
                Tea Factory Format
              </h4>
              <p className="text-sm text-gray-600">
                This P&L follows proper tea factory accounting standards with
                Cost of Production and Operating Expenses clearly separated.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-green-600 flex-shrink-0 mt-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <div>
              <h4 className="font-semibold text-green-900 mb-1">
                Period Comparison
              </h4>
              <p className="text-sm text-green-700">
                Compare current period with the previous equivalent period.
                Visual indicators show performance trends.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">
                Export Options
              </h4>
              <p className="text-sm text-gray-600">
                Print to PDF for formal reporting or export to CSV for further
                analysis in Excel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitAndLoss;
