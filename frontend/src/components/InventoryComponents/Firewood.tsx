import SummarySection from "./FirewoodComponents/SummarySection";
import ChartsSection from "./FirewoodComponents/ChartsSection";
import InventoryTable from "./FirewoodComponents/InventoryTable";
import TransactionForm from "./FirewoodComponents/TransactionForm";

const Firewood = () => {
  // Sample data - replace with actual data from your API
  const currentStock = 1155;
  const todayConsumption = 45;
  const averageDailyConsumption = 52.3;
  const lowStockThreshold = 500;

  return (
    <div className="space-y-6 pb-8">
      {/* Summary Cards */}
      <SummarySection
        stock={currentStock}
        todayConsumption={todayConsumption}
        averageDailyConsumption={averageDailyConsumption}
        lowStockThreshold={lowStockThreshold}
      />

      {/* Charts Section */}
      <ChartsSection />

      {/* Transaction Ledger and Form */}
      <div className="grid gap-6">
        <InventoryTable />
        <TransactionForm itemName="Firewood" currentStock={currentStock} />
      </div>
    </div>
  );
};

export default Firewood;
