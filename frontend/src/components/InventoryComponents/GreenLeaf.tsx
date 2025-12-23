import SummarySection from "./GreenLeafComponents/SummarySection";
import ChartsSection from "./GreenLeafComponents/ChartsSection";
import IntakeTable from "./GreenLeafComponents/IntakeTable";
import IntakeForm from "./GreenLeafComponents/IntakeForm";
import ProductionConsumption from "./GreenLeafComponents/ProductionConsumption";
import EfficiencyPanel from "./GreenLeafComponents/EfficiencyPanel";

const GreenLeaf = () => {
  // Sample data - replace with actual data from your API
  const todayIntake = 3500;
  const thisMonthIntake = 45000;
  const averageDailyIntake = 1500;
  const conversionRatio = 22.3;
  const rejectedWastage = 35;
  const unprocessedLeaf = 850;

  return (
    <div className="space-y-6 pb-8">
      {/* Summary Cards */}
      <SummarySection
        todayIntake={todayIntake}
        thisMonthIntake={thisMonthIntake}
        averageDailyIntake={averageDailyIntake}
        conversionRatio={conversionRatio}
        rejectedWastage={rejectedWastage}
        unprocessedLeaf={unprocessedLeaf}
      />

      {/* Charts Section */}
      <ChartsSection />

      {/* Intake Table */}
      <IntakeTable />

      {/* Intake Form */}
      <IntakeForm />

      {/* Production Consumption */}
      <ProductionConsumption />

      {/* Efficiency & Insights */}
      <EfficiencyPanel />
    </div>
  );
};

export default GreenLeaf;
