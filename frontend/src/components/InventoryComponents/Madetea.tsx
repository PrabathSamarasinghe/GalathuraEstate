import { useQuery, useMutation } from "@apollo/client";
import { GET_MADE_TEA_DATA, CREATE_PRODUCTION_BATCH, CREATE_DISPATCH_RECORD } from "../../graphql/queries";
import StockSummary from "./MadeteaComponents/StockSummary";
import ChartsSection from "./MadeteaComponents/ChartsSection";
import ProductionEntry from "./MadeteaComponents/ProductionEntry";
import DispatchForm from "./MadeteaComponents/DispatchForm";
import InventoryLedger from "./MadeteaComponents/InventoryLedger";
import PerformanceInsights from "./MadeteaComponents/PerformanceInsights";
import Loading from "../Loading";

interface MadeTeaStock {
  id: string;
  grade: string;
  quantity: number;
  lastUpdated: string;
  stockStatus: string;
}

interface MadeTeaTransaction {
  id: string;
  date: string;
  time: string;
  reference: string;
  type: string;
  grade: string;
  inflow: number;
  outflow: number;
  balance: number;
  details?: string;
  createdAt: string;
}

interface MadeTeaSummary {
  totalStock: number;
  todayProduction: number;
  thisMonthProduction: number;
  thisMonthDispatch: number;
  estimatedValue: number;
}

const Madetea = () => {
  const { data, loading, error, refetch } = useQuery(GET_MADE_TEA_DATA, {
    fetchPolicy: 'cache-and-network',
  });

  const [createProductionBatch] = useMutation(CREATE_PRODUCTION_BATCH, {
    onCompleted: () => refetch(),
  });

  const [createDispatchRecord] = useMutation(CREATE_DISPATCH_RECORD, {
    onCompleted: () => refetch(),
  });

  const handleCreateProduction = async (data: {
    batchNumber: string;
    greenLeafUsed: number;
    grades: Record<string, number>;
    totalOutput: number;
    yieldPercentage: number;
  }) => {
    try {
      const gradeOutputs = Object.entries(data.grades)
        .filter(([_, quantity]) => quantity > 0)
        .map(([grade, quantity]) => ({ grade, quantity }));

      await createProductionBatch({
        variables: {
          input: {
            date: new Date().toISOString().split('T')[0],
            greenLeafUsed: data.greenLeafUsed,
            gradeOutputs,
          },
        },
      });
    } catch (err) {
      console.error("Error creating production batch:", err);
      throw err;
    }
  };

  const handleCreateDispatch = async (data: {
    grade: string;
    quantity: number;
    buyer: string;
    invoiceNumber: string;
    packingType: string;
    remarks?: string;
  }) => {
    try {
      await createDispatchRecord({
        variables: {
          input: {
            date: new Date().toISOString().split('T')[0],
            grade: data.grade,
            quantity: data.quantity,
            destination: data.buyer,
            buyer: data.buyer,
            invoiceNumber: data.invoiceNumber,
            remarks: data.remarks,
          },
        },
      });
    } catch (err) {
      console.error("Error creating dispatch record:", err);
      throw err;
    }
  };

  if (loading && !data) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading made tea data: {error.message}</p>
        <button onClick={() => refetch()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Retry
        </button>
      </div>
    );
  }

  const stocks: MadeTeaStock[] = data?.madeTeaStocks || [];
  const transactions: MadeTeaTransaction[] = data?.madeTeaTransactions || [];
  const summary: MadeTeaSummary = data?.madeTeaSummary || {
    totalStock: 0,
    todayProduction: 0,
    thisMonthProduction: 0,
    thisMonthDispatch: 0,
    estimatedValue: 0,
  };

  const gradeStocks = stocks.map(s => ({
    grade: s.grade,
    quantity: s.quantity,
    isOverstocked: s.quantity > 4000,
    isLowStock: s.quantity < 800,
  }));

  return (
    <div className="space-y-6 pb-8">
      {/* Stock Summary */}
      <StockSummary
        totalStock={summary.totalStock}
        todayProduction={summary.todayProduction}
        thisMonthProduction={summary.thisMonthProduction}
        thisMonthDispatch={summary.thisMonthDispatch}
        gradeStocks={gradeStocks}
        estimatedValue={summary.estimatedValue}
      />

      {/* Charts Section */}
      <ChartsSection transactions={transactions} gradeStocks={gradeStocks} />

      {/* Production and Dispatch Forms */}
      <div className="grid grid-cols-2 gap-6">
        <ProductionEntry onSubmit={handleCreateProduction} />
        <DispatchForm gradeStocks={gradeStocks} onSubmit={handleCreateDispatch} />
      </div>

      {/* Inventory Ledger */}
      <InventoryLedger transactions={transactions} />

      {/* Performance Insights */}
      <PerformanceInsights />
    </div>
  );
};

export default Madetea;
