import { useQuery, useMutation } from "@apollo/client";
import { GET_GREEN_LEAF_INTAKES, CREATE_GREEN_LEAF_INTAKE } from "../../graphql/queries";
import SummarySection from "./GreenLeafComponents/SummarySection";
import ChartsSection from "./GreenLeafComponents/ChartsSection";
import IntakeTable from "./GreenLeafComponents/IntakeTable";
import IntakeForm from "./GreenLeafComponents/IntakeForm";
import ProductionConsumption from "./GreenLeafComponents/ProductionConsumption";
import EfficiencyPanel from "./GreenLeafComponents/EfficiencyPanel";
import Loading from "../Loading";

interface GreenLeafIntake {
  id: string;
  date: string;
  time: string;
  supplier: string;
  supplierType: string;
  vehicleNumber?: string;
  grossWeight: number;
  tareWeight: number;
  netWeight: number;
  quality?: string;
  session: string;
  remarks?: string;
  createdAt: string;
}

interface GreenLeafSummary {
  todayIntake: number;
  thisMonthIntake: number;
  averageDailyIntake: number;
  conversionRatio: number;
  unprocessedLeaf: number;
}

const GreenLeaf = () => {
  const { data, loading, error, refetch } = useQuery(GET_GREEN_LEAF_INTAKES, {
    fetchPolicy: 'cache-and-network',
  });

  const [createIntake] = useMutation(CREATE_GREEN_LEAF_INTAKE, {
    onCompleted: () => refetch(),
  });

  const handleCreateIntake = async (input: {
    supplier: string;
    supplierType: string;
    vehicleNumber?: string;
    grossWeight: number;
    tareWeight: number;
    quality?: string;
    session: string;
    remarks?: string;
  }) => {
    try {
      await createIntake({
        variables: {
          input: {
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().split(' ')[0].substring(0, 5),
            ...input,
            netWeight: input.grossWeight - input.tareWeight,
          },
        },
      });
      return { success: true };
    } catch (err) {
      console.error("Error creating green leaf intake:", err);
      return { success: false, error: err };
    }
  };

  if (loading && !data) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading green leaf data: {error.message}</p>
        <button onClick={() => refetch()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Retry
        </button>
      </div>
    );
  }

  const intakes: GreenLeafIntake[] = data?.greenLeafIntakes || [];
  const summary: GreenLeafSummary = data?.greenLeafSummary || {
    todayIntake: 0,
    thisMonthIntake: 0,
    averageDailyIntake: 0,
    conversionRatio: 22.3,
    unprocessedLeaf: 0,
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Summary Cards */}
      <SummarySection
        todayIntake={summary.todayIntake}
        thisMonthIntake={summary.thisMonthIntake}
        averageDailyIntake={summary.averageDailyIntake}
        conversionRatio={summary.conversionRatio}
        rejectedWastage={0}
        unprocessedLeaf={summary.unprocessedLeaf}
      />

      {/* Charts Section */}
      <ChartsSection intakes={intakes} />

      {/* Intake Table */}
      <IntakeTable intakes={intakes} />

      {/* Intake Form */}
      <IntakeForm onSubmit={handleCreateIntake} />

      {/* Production Consumption */}
      <ProductionConsumption />

      {/* Efficiency & Insights */}
      <EfficiencyPanel />
    </div>
  );
};

export default GreenLeaf;
