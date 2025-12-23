import type { ReactNode } from "react";
import type { Department, Designation, EmploymentType, EmployeeStatus, PayType, Shift, AttendanceStatus, TransactionType, ExpenseCategory, IncomeCategory, PaymentType } from "./enums";

interface LayoutProps {
  children: ReactNode;
}

// Employee Interfaces
interface Employee {
  id: string; // auto-generated
  fullName: string;
  nicNumber: string;
  contactNumber: string;
  address?: string;
  department: Department;
  designation: Designation;
  employmentType: EmploymentType;
  joinDate: string; // ISO date format
  status: EmployeeStatus;
  payType: PayType;
  rate: number; // per day / hour / month depending on payType
  otRate?: number; // optional OT rate
}

interface EmployeeFormData extends Omit<Employee, 'id'> {
  id?: string; // optional for edit mode
}

interface EmployeeFilters {
  department?: Department | '';
  employmentType?: EmploymentType | '';
  status?: EmployeeStatus | '';
  searchTerm?: string;
}

// Attendance Interfaces
interface AttendanceRecord {
  id: string; // auto-generated
  employeeId: string;
  employeeName: string;
  department: Department;
  date: string; // ISO date format (YYYY-MM-DD)
  shift: Shift;
  status: AttendanceStatus;
  otHours: number;
  calculatedWage: number;
  remarks?: string;
  markedBy?: string; // user who marked attendance
  markedAt?: string; // timestamp
  lastEditedBy?: string; // user who last edited
  lastEditedAt?: string; // timestamp
}

interface AttendanceFormData {
  employeeId: string;
  date: string;
  shift: Shift;
  status: AttendanceStatus;
  otHours: number;
  remarks?: string;
}

interface AttendanceFilters {
  date?: string;
  department?: Department | '';
  shift?: Shift | '';
  status?: AttendanceStatus | '';
  searchTerm?: string;
}

interface AttendanceSummary {
  totalEmployees: number;
  presentCount: number;
  absentCount: number;
  halfDayCount: number;
  onLeaveCount: number;
  otCount: number;
  totalManDays: number;
  totalOTHours: number;
}

// Transaction Interfaces
interface Transaction {
  id: string; // auto-generated
  date: string; // ISO date format (YYYY-MM-DD)
  type: TransactionType;
  category: ExpenseCategory | IncomeCategory;
  description: string;
  amount: number;
  paymentType: PaymentType;
  referenceNo?: string;
  remarks?: string;
  createdAt: string; // timestamp
  createdBy?: string;
  lastEditedAt?: string;
  lastEditedBy?: string;
}

interface TransactionFormData {
  date: string;
  type: TransactionType;
  category: ExpenseCategory | IncomeCategory;
  description: string;
  amount: number;
  paymentType: PaymentType;
  referenceNo?: string;
  remarks?: string;
}

interface TransactionFilters {
  dateFrom?: string;
  dateTo?: string;
  type?: TransactionType | '';
  category?: ExpenseCategory | IncomeCategory | '';
  paymentType?: PaymentType | '';
  searchTerm?: string;
}

interface TransactionSummary {
  todayExpenses: number;
  todayIncome: number;
  monthExpenses: number;
  monthIncome: number;
  categoryTotals: { category: string; total: number }[];
}

export type {
    LayoutProps,
    Employee,
    EmployeeFormData,
    EmployeeFilters,
    AttendanceRecord,
    AttendanceFormData,
    AttendanceFilters,
    AttendanceSummary,
    Transaction,
    TransactionFormData,
    TransactionFilters,
    TransactionSummary,
}