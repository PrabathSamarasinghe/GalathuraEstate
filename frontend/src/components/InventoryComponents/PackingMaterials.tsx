import SummarySection from "./PackingMaterialsComponents/SummarySection";
import ChartsSection from "./PackingMaterialsComponents/ChartsSection";
import InventoryTable from "./PackingMaterialsComponents/InventoryTable";
import TransactionForm from "./PackingMaterialsComponents/TransactionForm";

const PackingMaterials = () => {
  // Sample data - replace with actual data from your API
  const currentStock = 4750;
  const todayConsumption = 250;
  const averageDailyConsumption = 320.5;
  const lowStockThreshold = 1000;

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
        <TransactionForm itemName="Packing Materials" currentStock={currentStock} />
      </div>
    </div>
  );
};

export default PackingMaterials;
