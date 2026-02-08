import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_KPIS } from '../graphql/queries';

interface AttendanceSummary {
  totalEmployees: number;
  presentCount: number;
  absentCount: number;
  halfDayCount: number;
  onLeaveCount: number;
  otCount: number;
  totalManDays: number;
  totalOTHours: number;
  totalWages: number;
}

interface CategoryTotal {
  category: string;
  total: number;
  count: number;
}

interface FinancialSummary {
  todayExpenses: number;
  todayIncome: number;
  monthExpenses: number;
  monthIncome: number;
  netProfit: number;
  categoryTotals: CategoryTotal[];
}

interface InventoryStatus {
  currentStock: number;
  todayConsumption: number;
  averageDailyConsumption: number;
  daysRemaining: number;
  lowStockThreshold: number;
  isLowStock: boolean;
}

interface GreenLeafStatus {
  todayIntake: number;
  thisMonthIntake: number;
  averageDailyIntake: number;
  conversionRatio: number;
  unprocessedLeaf: number;
}

interface GradeStock {
  grade: string;
  quantity: number;
  stockStatus: string;
}

interface MadeTeaStatus {
  totalStock: number;
  todayProduction: number;
  thisMonthProduction: number;
  thisMonthDispatch: number;
  gradeStocks: GradeStock[];
  estimatedValue: number;
}

interface RecentActivity {
  id: string;
  activityType: string;
  description: string;
  createdAt: string;
}

interface Alert {
  type: string;
  message: string;
  severity: string;
}

interface DashboardKPIs {
  todayAttendance: AttendanceSummary;
  financialSummary: FinancialSummary;
  firewoodStatus: InventoryStatus;
  packingMaterialsStatus: InventoryStatus;
  greenLeafStatus: GreenLeafStatus;
  madeTeaStatus: MadeTeaStatus;
  recentActivities: RecentActivity[];
  alerts: Alert[];
}

interface GetDashboardKPIsResponse {
  dashboardKPIs: DashboardKPIs;
}

export const useDashboardKPIs = (date?: string) => {
  const { data, loading, error, refetch } = useQuery<GetDashboardKPIsResponse>(
    GET_DASHBOARD_KPIS,
    {
      variables: { date },
      fetchPolicy: 'cache-and-network',
      pollInterval: 60000, // Refresh every minute
    }
  );

  return {
    kpis: data?.dashboardKPIs || null,
    loading,
    error,
    refetch,
  };
};
