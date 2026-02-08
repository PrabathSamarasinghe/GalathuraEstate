import { useMutation, useQuery } from '@apollo/client';
import {
  GET_TRANSACTIONS,
  GET_TRANSACTION_SUMMARY,
  GET_PROFIT_LOSS,
  GET_NEXT_TRANSACTION_ID,
  CREATE_TRANSACTION,
  UPDATE_TRANSACTION,
  DELETE_TRANSACTION,
} from '../graphql/queries';
import { TransactionType, ExpenseCategory, IncomeCategory, PaymentType } from '../utils/enums';

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  category: ExpenseCategory | IncomeCategory;
  description: string;
  amount: number;
  paymentType: PaymentType;
  referenceNo?: string;
  remarks?: string;
  createdAt: string;
}

interface TransactionFilterInput {
  type?: TransactionType;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface CategoryTotal {
  category: string;
  total: number;
  count: number;
}

interface TransactionSummary {
  todayExpenses: number;
  todayIncome: number;
  monthExpenses: number;
  monthIncome: number;
  netProfit: number;
  categoryTotals: CategoryTotal[];
}

export interface ProfitLossStatement {
  madeTeaSales: number;
  otherIncome: number;
  totalIncome: number;
  greenLeafCost: number;
  laborCost: number;
  fuelPower: number;
  packingMaterials: number;
  totalCostOfProduction: number;
  grossProfit: number;
  grossProfitMargin: number;
  factoryOverheads: number;
  maintenanceRepairs: number;
  transportHandling: number;
  administrative: number;
  totalOperatingExpenses: number;
  operatingProfit: number;
  operatingProfitMargin: number;
  financialExpenses: number;
  netProfit: number;
  netProfitMargin: number;
}

interface GetTransactionsResponse {
  transactions: Transaction[];
}

interface GetTransactionSummaryResponse {
  transactionSummary: TransactionSummary;
}

interface GetProfitLossResponse {
  profitLossStatement: ProfitLossStatement;
}

interface NextTransactionIdResponse {
  nextTransactionId: string;
}

export const useTransactions = (filter?: TransactionFilterInput, limit?: number, offset?: number) => {
  const { data, loading, error, refetch } = useQuery<GetTransactionsResponse>(GET_TRANSACTIONS, {
    variables: { filter, limit, offset },
    fetchPolicy: 'cache-and-network',
  });

  return {
    transactions: data?.transactions || [],
    loading,
    error,
    refetch,
  };
};

export const useTransactionSummary = (dateFrom?: string, dateTo?: string) => {
  const { data, loading, error, refetch } = useQuery<GetTransactionSummaryResponse>(
    GET_TRANSACTION_SUMMARY,
    {
      variables: { dateFrom, dateTo },
      fetchPolicy: 'cache-and-network',
    }
  );

  return {
    summary: data?.transactionSummary || null,
    loading,
    error,
    refetch,
  };
};

export const useProfitLoss = (dateFrom: string, dateTo: string) => {
  const { data, loading, error, refetch } = useQuery<GetProfitLossResponse>(GET_PROFIT_LOSS, {
    variables: { dateFrom, dateTo },
    skip: !dateFrom || !dateTo,
    fetchPolicy: 'cache-and-network',
  });

  return {
    statement: data?.profitLossStatement || null,
    loading,
    error,
    refetch,
  };
};

export const useNextTransactionId = () => {
  const { data, loading, refetch } = useQuery<NextTransactionIdResponse>(GET_NEXT_TRANSACTION_ID, {
    fetchPolicy: 'network-only',
  });

  return {
    nextId: data?.nextTransactionId || 'TXN0001',
    loading,
    refetch,
  };
};

export const useCreateTransaction = () => {
  const [createMutation, { loading, error }] = useMutation(CREATE_TRANSACTION, {
    refetchQueries: [GET_TRANSACTIONS, GET_TRANSACTION_SUMMARY],
  });

  const createTransaction = async (input: Omit<Transaction, 'id' | 'createdAt'>) => {
    const { data } = await createMutation({ variables: { input } });
    return data?.createTransaction;
  };

  return { createTransaction, loading, error };
};

export const useUpdateTransaction = () => {
  const [updateMutation, { loading, error }] = useMutation(UPDATE_TRANSACTION, {
    refetchQueries: [GET_TRANSACTIONS, GET_TRANSACTION_SUMMARY],
  });

  const updateTransaction = async (id: string, input: Partial<Transaction>) => {
    const { data } = await updateMutation({ variables: { id, input } });
    return data?.updateTransaction;
  };

  return { updateTransaction, loading, error };
};

export const useDeleteTransaction = () => {
  const [deleteMutation, { loading, error }] = useMutation(DELETE_TRANSACTION, {
    refetchQueries: [GET_TRANSACTIONS, GET_TRANSACTION_SUMMARY],
  });

  const deleteTransaction = async (id: string) => {
    const { data } = await deleteMutation({ variables: { id } });
    return data?.deleteTransaction;
  };

  return { deleteTransaction, loading, error };
};
