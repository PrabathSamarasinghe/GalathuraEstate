import StockSummary from "./MadeteaComponents/StockSummary";
import ChartsSection from "./MadeteaComponents/ChartsSection";
import ProductionEntry from "./MadeteaComponents/ProductionEntry";
import DispatchForm from "./MadeteaComponents/DispatchForm";
import InventoryLedger from "./MadeteaComponents/InventoryLedger";
import PerformanceInsights from "./MadeteaComponents/PerformanceInsights";

const Madetea = () => {
  // Sample data - replace with actual data from your API
  const gradeStocks = [
    { grade: 'BOP', quantity: 3500 },
    { grade: 'FBOP', quantity: 2200 },
    { grade: 'OP', quantity: 1800 },
    { grade: 'Dust', quantity: 1000 },
    { grade: 'Others', quantity: 500 },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Stock Summary */}
      <StockSummary
        totalStock={9000}
        todayProduction={450}
        thisMonthProduction={11000}
        thisMonthDispatch={9650}
        gradeStocks={gradeStocks.map(g => ({
          ...g,
          isOverstocked: g.quantity > 4000,
          isLowStock: g.quantity < 800,
        }))}
        estimatedValue={4500000}
      />

      {/* Charts Section */}
      <ChartsSection />

      {/* Production and Dispatch Forms */}
      <div className="grid grid-cols-2 gap-6">
        <ProductionEntry />
        <DispatchForm gradeStocks={gradeStocks} />
      </div>

      {/* Inventory Ledger */}
      <InventoryLedger />

      {/* Performance Insights */}
      <PerformanceInsights />
    </div>
  );
};

export default Madetea;
