import type { Transaction } from "../../utils/Interfaces";
import { TransactionType, ExpenseCategory, IncomeCategory } from "../../utils/enums";

interface PLStatementProps {
  transactions: Transaction[];
  fromDate: string;
  toDate: string;
  comparisonTransactions?: Transaction[];
  showComparison?: boolean;
}

interface PLData {
  // Income
  madeTeaSales: number;
  otherIncome: number;
  totalIncome: number;

  // Cost of Production
  greenLeafCost: number;
  laborCost: number;
  fuelPower: number;
  packingMaterials: number;
  totalCostOfProduction: number;

  // Gross Profit
  grossProfit: number;
  grossProfitMargin: number;

  // Operating Expenses
  factoryOverheads: number;
  maintenanceRepairs: number;
  transportHandling: number;
  administrative: number;
  totalOperatingExpenses: number;

  // Operating Profit
  operatingProfit: number;
  operatingProfitMargin: number;

  // Financial Expenses
  financialExpenses: number;

  // Net Profit
  netProfit: number;
  netProfitMargin: number;
}

const PLStatement = ({
  transactions,
  fromDate,
  toDate,
  comparisonTransactions,
  showComparison = false,
}: PLStatementProps) => {
  const calculatePL = (txns: Transaction[]): PLData => {
    const data: PLData = {
      madeTeaSales: 0,
      otherIncome: 0,
      totalIncome: 0,
      greenLeafCost: 0,
      laborCost: 0,
      fuelPower: 0,
      packingMaterials: 0,
      totalCostOfProduction: 0,
      grossProfit: 0,
      grossProfitMargin: 0,
      factoryOverheads: 0,
      maintenanceRepairs: 0,
      transportHandling: 0,
      administrative: 0,
      totalOperatingExpenses: 0,
      operatingProfit: 0,
      operatingProfitMargin: 0,
      financialExpenses: 0,
      netProfit: 0,
      netProfitMargin: 0,
    };

    txns.forEach((txn) => {
      const amount = txn.amount;

      if (txn.type === TransactionType.INCOME) {
        if (txn.category === IncomeCategory.MADE_TEA_SALES) {
          data.madeTeaSales += amount;
        } else if (txn.category === IncomeCategory.OTHER_INCOME) {
          data.otherIncome += amount;
        }
      } else if (txn.type === TransactionType.EXPENSE) {
        switch (txn.category) {
          case ExpenseCategory.GREEN_LEAF_COST:
            data.greenLeafCost += amount;
            break;
          case ExpenseCategory.LABOR_COST:
            data.laborCost += amount;
            break;
          case ExpenseCategory.FUEL_POWER:
            data.fuelPower += amount;
            break;
          case ExpenseCategory.PACKING_MATERIALS:
            data.packingMaterials += amount;
            break;
          case ExpenseCategory.FACTORY_OVERHEADS:
            data.factoryOverheads += amount;
            break;
          case ExpenseCategory.MAINTENANCE_REPAIRS:
            data.maintenanceRepairs += amount;
            break;
          case ExpenseCategory.TRANSPORT_HANDLING:
            data.transportHandling += amount;
            break;
          case ExpenseCategory.ADMINISTRATIVE:
            data.administrative += amount;
            break;
          case ExpenseCategory.FINANCIAL:
            data.financialExpenses += amount;
            break;
        }
      }
    });

    // Calculate totals
    data.totalIncome = data.madeTeaSales + data.otherIncome;
    data.totalCostOfProduction =
      data.greenLeafCost + data.laborCost + data.fuelPower + data.packingMaterials;
    data.grossProfit = data.totalIncome - data.totalCostOfProduction;
    data.grossProfitMargin =
      data.totalIncome > 0 ? (data.grossProfit / data.totalIncome) * 100 : 0;

    data.totalOperatingExpenses =
      data.factoryOverheads +
      data.maintenanceRepairs +
      data.transportHandling +
      data.administrative;
    data.operatingProfit = data.grossProfit - data.totalOperatingExpenses;
    data.operatingProfitMargin =
      data.totalIncome > 0 ? (data.operatingProfit / data.totalIncome) * 100 : 0;

    data.netProfit = data.operatingProfit - data.financialExpenses;
    data.netProfitMargin =
      data.totalIncome > 0 ? (data.netProfit / data.totalIncome) * 100 : 0;

    return data;
  };

  const currentPL = calculatePL(transactions);
  const previousPL = showComparison && comparisonTransactions
    ? calculatePL(comparisonTransactions)
    : null;

  const getChangeIndicator = (current: number, previous: number | null) => {
    if (!previous || previous === 0) return null;
    const change = ((current - previous) / previous) * 100;
    if (Math.abs(change) < 0.01) return null;
    
    return (
      <span
        className={`text-xs ml-2 ${change > 0 ? "text-green-600" : "text-red-600"}`}
      >
        {change > 0 ? "↑" : "↓"} {Math.abs(change).toFixed(1)}%
      </span>
    );
  };

  const rowClasses = "py-2 border-b border-gray-100";
  const labelClasses = "text-sm text-gray-700";
  const amountClasses = "text-sm font-medium text-right";
  const totalClasses = "text-sm font-bold text-right";
  const sectionTotalClasses = "py-2 bg-gray-50 border-y-2 border-gray-300";

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
        <h2 className="text-2xl font-bold">PROFIT & LOSS ACCOUNT</h2>
        <p className="text-sm mt-1 opacity-90">
          Galathura Estate - Tea Factory
        </p>
        <p className="text-sm opacity-90">
          Period: {new Date(fromDate).toLocaleDateString()} to{" "}
          {new Date(toDate).toLocaleDateString()}
        </p>
      </div>

      {/* Statement Body */}
      <div className="p-6">
        {/* INCOME SECTION */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-green-700 mb-3 pb-2 border-b-2 border-green-200">
            🟢 INCOME
          </h3>
          <div className="space-y-1 pl-4">
            <div className={`flex justify-between ${rowClasses}`}>
              <span className={labelClasses}>Sale of Made Tea</span>
              <div className="flex items-center gap-4">
                {showComparison && previousPL && (
                  <span className="text-xs text-gray-500 w-32 text-right">
                    Rs. {previousPL.madeTeaSales.toLocaleString()}
                  </span>
                )}
                <span className={`${amountClasses} w-32`}>
                  Rs. {currentPL.madeTeaSales.toLocaleString()}
                  {getChangeIndicator(currentPL.madeTeaSales, previousPL?.madeTeaSales || null)}
                </span>
              </div>
            </div>
            <div className={`flex justify-between ${rowClasses}`}>
              <span className={labelClasses}>Other Income</span>
              <div className="flex items-center gap-4">
                {showComparison && previousPL && (
                  <span className="text-xs text-gray-500 w-32 text-right">
                    Rs. {previousPL.otherIncome.toLocaleString()}
                  </span>
                )}
                <span className={`${amountClasses} w-32`}>
                  Rs. {currentPL.otherIncome.toLocaleString()}
                  {getChangeIndicator(currentPL.otherIncome, previousPL?.otherIncome || null)}
                </span>
              </div>
            </div>
          </div>
          <div className={`flex justify-between ${sectionTotalClasses} px-4 mt-2`}>
            <span className="text-base font-bold text-gray-900">Total Income (A)</span>
            <div className="flex items-center gap-4">
              {showComparison && previousPL && (
                <span className="text-sm text-gray-600 w-32 text-right">
                  Rs. {previousPL.totalIncome.toLocaleString()}
                </span>
              )}
              <span className="text-base font-bold text-green-600 w-32 text-right">
                Rs. {currentPL.totalIncome.toLocaleString()}
                {getChangeIndicator(currentPL.totalIncome, previousPL?.totalIncome || null)}
              </span>
            </div>
          </div>
        </div>

        {/* COST OF PRODUCTION */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-red-700 mb-3 pb-2 border-b-2 border-red-200">
            🔴 COST OF PRODUCTION
          </h3>
          <div className="space-y-1 pl-4">
            <div className={`flex justify-between ${rowClasses}`}>
              <span className={labelClasses}>Green Leaf Cost</span>
              <div className="flex items-center gap-4">
                {showComparison && previousPL && (
                  <span className="text-xs text-gray-500 w-32 text-right">
                    Rs. {previousPL.greenLeafCost.toLocaleString()}
                  </span>
                )}
                <span className={`${amountClasses} w-32`}>
                  Rs. {currentPL.greenLeafCost.toLocaleString()}
                  {getChangeIndicator(currentPL.greenLeafCost, previousPL?.greenLeafCost || null)}
                </span>
              </div>
            </div>
            <div className={`flex justify-between ${rowClasses}`}>
              <span className={labelClasses}>Factory Labor</span>
              <div className="flex items-center gap-4">
                {showComparison && previousPL && (
                  <span className="text-xs text-gray-500 w-32 text-right">
                    Rs. {previousPL.laborCost.toLocaleString()}
                  </span>
                )}
                <span className={`${amountClasses} w-32`}>
                  Rs. {currentPL.laborCost.toLocaleString()}
                  {getChangeIndicator(currentPL.laborCost, previousPL?.laborCost || null)}
                </span>
              </div>
            </div>
            <div className={`flex justify-between ${rowClasses}`}>
              <span className={labelClasses}>Fuel & Power</span>
              <div className="flex items-center gap-4">
                {showComparison && previousPL && (
                  <span className="text-xs text-gray-500 w-32 text-right">
                    Rs. {previousPL.fuelPower.toLocaleString()}
                  </span>
                )}
                <span className={`${amountClasses} w-32`}>
                  Rs. {currentPL.fuelPower.toLocaleString()}
                  {getChangeIndicator(currentPL.fuelPower, previousPL?.fuelPower || null)}
                </span>
              </div>
            </div>
            <div className={`flex justify-between ${rowClasses}`}>
              <span className={labelClasses}>Packing Materials</span>
              <div className="flex items-center gap-4">
                {showComparison && previousPL && (
                  <span className="text-xs text-gray-500 w-32 text-right">
                    Rs. {previousPL.packingMaterials.toLocaleString()}
                  </span>
                )}
                <span className={`${amountClasses} w-32`}>
                  Rs. {currentPL.packingMaterials.toLocaleString()}
                  {getChangeIndicator(currentPL.packingMaterials, previousPL?.packingMaterials || null)}
                </span>
              </div>
            </div>
          </div>
          <div className={`flex justify-between ${sectionTotalClasses} px-4 mt-2`}>
            <span className="text-base font-bold text-gray-900">
              Total Cost of Production (B)
            </span>
            <div className="flex items-center gap-4">
              {showComparison && previousPL && (
                <span className="text-sm text-gray-600 w-32 text-right">
                  Rs. {previousPL.totalCostOfProduction.toLocaleString()}
                </span>
              )}
              <span className="text-base font-bold text-red-600 w-32 text-right">
                Rs. {currentPL.totalCostOfProduction.toLocaleString()}
                {getChangeIndicator(currentPL.totalCostOfProduction, previousPL?.totalCostOfProduction || null)}
              </span>
            </div>
          </div>
        </div>

        {/* GROSS PROFIT */}
        <div className={`flex justify-between ${sectionTotalClasses} px-4 mb-6 bg-blue-50 border-blue-300`}>
          <span className="text-lg font-bold text-gray-900">
            GROSS PROFIT (A - B)
            <span className="text-sm ml-2 text-gray-600">
              ({currentPL.grossProfitMargin.toFixed(1)}%)
            </span>
          </span>
          <div className="flex items-center gap-4">
            {showComparison && previousPL && (
              <span className="text-sm text-gray-600 w-32 text-right">
                Rs. {previousPL.grossProfit.toLocaleString()}
              </span>
            )}
            <span
              className={`text-lg font-bold w-32 text-right ${
                currentPL.grossProfit >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              Rs. {currentPL.grossProfit.toLocaleString()}
              {getChangeIndicator(currentPL.grossProfit, previousPL?.grossProfit || null)}
            </span>
          </div>
        </div>

        {/* OPERATING EXPENSES */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-orange-700 mb-3 pb-2 border-b-2 border-orange-200">
            🔴 OPERATING EXPENSES
          </h3>
          <div className="space-y-1 pl-4">
            <div className={`flex justify-between ${rowClasses}`}>
              <span className={labelClasses}>Factory Overheads</span>
              <div className="flex items-center gap-4">
                {showComparison && previousPL && (
                  <span className="text-xs text-gray-500 w-32 text-right">
                    Rs. {previousPL.factoryOverheads.toLocaleString()}
                  </span>
                )}
                <span className={`${amountClasses} w-32`}>
                  Rs. {currentPL.factoryOverheads.toLocaleString()}
                  {getChangeIndicator(currentPL.factoryOverheads, previousPL?.factoryOverheads || null)}
                </span>
              </div>
            </div>
            <div className={`flex justify-between ${rowClasses}`}>
              <span className={labelClasses}>Maintenance & Repairs</span>
              <div className="flex items-center gap-4">
                {showComparison && previousPL && (
                  <span className="text-xs text-gray-500 w-32 text-right">
                    Rs. {previousPL.maintenanceRepairs.toLocaleString()}
                  </span>
                )}
                <span className={`${amountClasses} w-32`}>
                  Rs. {currentPL.maintenanceRepairs.toLocaleString()}
                  {getChangeIndicator(currentPL.maintenanceRepairs, previousPL?.maintenanceRepairs || null)}
                </span>
              </div>
            </div>
            <div className={`flex justify-between ${rowClasses}`}>
              <span className={labelClasses}>Transport & Handling</span>
              <div className="flex items-center gap-4">
                {showComparison && previousPL && (
                  <span className="text-xs text-gray-500 w-32 text-right">
                    Rs. {previousPL.transportHandling.toLocaleString()}
                  </span>
                )}
                <span className={`${amountClasses} w-32`}>
                  Rs. {currentPL.transportHandling.toLocaleString()}
                  {getChangeIndicator(currentPL.transportHandling, previousPL?.transportHandling || null)}
                </span>
              </div>
            </div>
            <div className={`flex justify-between ${rowClasses}`}>
              <span className={labelClasses}>Administrative Expenses</span>
              <div className="flex items-center gap-4">
                {showComparison && previousPL && (
                  <span className="text-xs text-gray-500 w-32 text-right">
                    Rs. {previousPL.administrative.toLocaleString()}
                  </span>
                )}
                <span className={`${amountClasses} w-32`}>
                  Rs. {currentPL.administrative.toLocaleString()}
                  {getChangeIndicator(currentPL.administrative, previousPL?.administrative || null)}
                </span>
              </div>
            </div>
          </div>
          <div className={`flex justify-between ${sectionTotalClasses} px-4 mt-2`}>
            <span className="text-base font-bold text-gray-900">
              Total Operating Expenses
            </span>
            <div className="flex items-center gap-4">
              {showComparison && previousPL && (
                <span className="text-sm text-gray-600 w-32 text-right">
                  Rs. {previousPL.totalOperatingExpenses.toLocaleString()}
                </span>
              )}
              <span className="text-base font-bold text-orange-600 w-32 text-right">
                Rs. {currentPL.totalOperatingExpenses.toLocaleString()}
                {getChangeIndicator(currentPL.totalOperatingExpenses, previousPL?.totalOperatingExpenses || null)}
              </span>
            </div>
          </div>
        </div>

        {/* OPERATING PROFIT */}
        <div className={`flex justify-between ${sectionTotalClasses} px-4 mb-6 bg-purple-50 border-purple-300`}>
          <span className="text-lg font-bold text-gray-900">
            OPERATING PROFIT
            <span className="text-sm ml-2 text-gray-600">
              ({currentPL.operatingProfitMargin.toFixed(1)}%)
            </span>
          </span>
          <div className="flex items-center gap-4">
            {showComparison && previousPL && (
              <span className="text-sm text-gray-600 w-32 text-right">
                Rs. {previousPL.operatingProfit.toLocaleString()}
              </span>
            )}
            <span
              className={`text-lg font-bold w-32 text-right ${
                currentPL.operatingProfit >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              Rs. {currentPL.operatingProfit.toLocaleString()}
              {getChangeIndicator(currentPL.operatingProfit, previousPL?.operatingProfit || null)}
            </span>
          </div>
        </div>

        {/* FINANCIAL EXPENSES */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-purple-700 mb-3 pb-2 border-b-2 border-purple-200">
            🔴 FINANCIAL EXPENSES
          </h3>
          <div className="space-y-1 pl-4">
            <div className={`flex justify-between ${rowClasses}`}>
              <span className={labelClasses}>Bank Charges & Interest</span>
              <div className="flex items-center gap-4">
                {showComparison && previousPL && (
                  <span className="text-xs text-gray-500 w-32 text-right">
                    Rs. {previousPL.financialExpenses.toLocaleString()}
                  </span>
                )}
                <span className={`${amountClasses} w-32`}>
                  Rs. {currentPL.financialExpenses.toLocaleString()}
                  {getChangeIndicator(currentPL.financialExpenses, previousPL?.financialExpenses || null)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* NET PROFIT */}
        <div className={`flex justify-between px-4 py-4 bg-gradient-to-r ${
          currentPL.netProfit >= 0
            ? "from-green-100 to-green-50 border-green-400"
            : "from-red-100 to-red-50 border-red-400"
        } border-2 rounded-lg`}>
          <span className="text-xl font-bold text-gray-900">
            NET PROFIT / (LOSS)
            <span className="text-sm ml-2 text-gray-600">
              ({currentPL.netProfitMargin.toFixed(1)}%)
            </span>
          </span>
          <div className="flex items-center gap-4">
            {showComparison && previousPL && (
              <span className="text-base font-semibold text-gray-600 w-32 text-right">
                Rs. {previousPL.netProfit.toLocaleString()}
              </span>
            )}
            <span
              className={`text-xl font-bold w-32 text-right ${
                currentPL.netProfit >= 0 ? "text-green-700" : "text-red-700"
              }`}
            >
              {currentPL.netProfit >= 0 ? "Rs. " : "(Rs. "}
              {Math.abs(currentPL.netProfit).toLocaleString()}
              {currentPL.netProfit < 0 ? ")" : ""}
              {getChangeIndicator(currentPL.netProfit, previousPL?.netProfit || null)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-xs text-gray-600">
        <p>
          Generated on: {new Date().toLocaleDateString()} at{" "}
          {new Date().toLocaleTimeString()}
        </p>
        {showComparison && (
          <p className="mt-1 text-gray-500">
            Comparison data shown in gray | Change indicators: ↑ increase, ↓ decrease
          </p>
        )}
      </div>
    </div>
  );
};

export default PLStatement;
