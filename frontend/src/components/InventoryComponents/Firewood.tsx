import { useQuery, useMutation } from "@apollo/client";
import { GET_FIREWOOD_TRANSACTIONS, CREATE_FIREWOOD_TRANSACTION } from "../../graphql/queries";
import { toGraphQLEnum } from "../../utils/enumMappings";
import SummarySection from "./FirewoodComponents/SummarySection";
import ChartsSection from "./FirewoodComponents/ChartsSection";
import InventoryTable from "./FirewoodComponents/InventoryTable";
import TransactionForm from "./FirewoodComponents/TransactionForm";
import Loading from "../Loading";

interface FirewoodTransaction {
  id: string;
  date: string;
  time: string;
  type: string;
  quantity: number;
  factory?: string;
  supervisor?: string;
  remarks?: string;
  runningBalance: number;
  createdAt: string;
}

interface FirewoodSummary {
  currentStock: number;
  todayConsumption: number;
  averageDailyConsumption: number;
  daysRemaining: number;
  lowStockThreshold: number;
  isLowStock: boolean;
}

const Firewood = () => {
  const { data, loading, error, refetch } = useQuery(GET_FIREWOOD_TRANSACTIONS, {
    fetchPolicy: 'cache-and-network',
  });

  const [createTransaction] = useMutation(CREATE_FIREWOOD_TRANSACTION, {
    onCompleted: () => refetch(),
  });

  const handleCreateTransaction = async (input: {
    type: string;
    quantity: number;
    factory?: string;
    supervisor?: string;
    remarks?: string;
    price?: number;
  }) => {
    try {
      await createTransaction({
        variables: {
          input: {
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().split(' ')[0].substring(0, 5),
            type: toGraphQLEnum.inventoryTransactionType(input.type),
            quantity: input.quantity,
            factory: input.factory,
            supervisor: input.supervisor,
            remarks: input.remarks,
          },
        },
      });
      return { success: true };
    } catch (err) {
      console.error("Error creating firewood transaction:", err);
      return { success: false, error: err };
    }
  };

  if (loading && !data) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading firewood data: {error.message}</p>
        <button onClick={() => refetch()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Retry
        </button>
      </div>
    );
  }

  const transactions: FirewoodTransaction[] = data?.firewoodTransactions || [];
  const summary: FirewoodSummary = data?.firewoodSummary || {
    currentStock: 0,
    todayConsumption: 0,
    averageDailyConsumption: 0,
    daysRemaining: 0,
    lowStockThreshold: 500,
    isLowStock: false,
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Summary Cards */}
      <SummarySection
        stock={summary.currentStock}
        todayConsumption={summary.todayConsumption}
        averageDailyConsumption={summary.averageDailyConsumption}
        lowStockThreshold={summary.lowStockThreshold}
      />

      {/* Charts Section */}
      <ChartsSection transactions={transactions} />

      {/* Transaction Ledger and Form */}
      <div className="grid gap-6">
        <InventoryTable transactions={transactions} />
        <TransactionForm 
          itemName="Firewood" 
          currentStock={summary.currentStock}
          onSubmit={handleCreateTransaction}
        />
      </div>
    </div>
  );
};

export default Firewood;
