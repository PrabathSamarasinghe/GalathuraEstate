export const InventoryTabs = {
  FIREWOOD: "firewood",
  PACKINGMATERIALS: "packingmaterials",
  MADETEA: "madetea",
  GREENLEAF: "greenleaf",
} as const;

export type InventoryTabs = (typeof InventoryTabs)[keyof typeof InventoryTabs];

// Employee Enums
export const Department = {
  WITHERING: "Withering",
  ROLLING: "Rolling",
  DRYER: "Dryer",
  PACKING: "Packing",
  BOILER: "Boiler",
  OFFICE: "Office",
} as const;

export type Department = (typeof Department)[keyof typeof Department];

export const Designation = {
  HELPER: "Helper",
  MACHINE_OPERATOR: "Machine Operator",
  SUPERVISOR: "Supervisor",
  CLERK: "Clerk",
} as const;

export type Designation = (typeof Designation)[keyof typeof Designation];

export const EmploymentType = {
  PERMANENT: "Permanent",
  CASUAL: "Casual / Daily Paid",
  CONTRACT: "Contract",
} as const;

export type EmploymentType = (typeof EmploymentType)[keyof typeof EmploymentType];

export const EmployeeStatus = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
} as const;

export type EmployeeStatus = (typeof EmployeeStatus)[keyof typeof EmployeeStatus];

export const PayType = {
  DAILY_WAGE: "Daily wage",
  MONTHLY_SALARY: "Monthly salary",
  HOURLY: "Hourly",
} as const;

export type PayType = (typeof PayType)[keyof typeof PayType];

// Attendance Enums
export const Shift = {
  DAY: "Day",
  NIGHT: "Night",
  FULL_DAY: "Full Day",
} as const;

export type Shift = (typeof Shift)[keyof typeof Shift];

export const AttendanceStatus = {
  PRESENT: "Present",
  ABSENT: "Absent",
  HALF_DAY: "Half Day",
  ON_LEAVE: "On Leave",
} as const;

export type AttendanceStatus = (typeof AttendanceStatus)[keyof typeof AttendanceStatus];

// Transaction Enums
export const TransactionType = {
  EXPENSE: "Expense",
  INCOME: "Income",
} as const;

export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];

export const ExpenseCategory = {
  GREEN_LEAF_COST: "Green Leaf Cost",
  LABOR_COST: "Labor Cost",
  FUEL_POWER: "Fuel & Power",
  PACKING_MATERIALS: "Packing Materials",
  FACTORY_OVERHEADS: "Factory Overheads",
  MAINTENANCE_REPAIRS: "Maintenance & Repairs",
  ADMINISTRATIVE: "Administrative Expenses",
  TRANSPORT_HANDLING: "Transport & Handling",
  FINANCIAL: "Financial Expenses",
} as const;

export type ExpenseCategory = (typeof ExpenseCategory)[keyof typeof ExpenseCategory];

export const IncomeCategory = {
  MADE_TEA_SALES: "Made Tea Sales",
  OTHER_INCOME: "Other Income",
} as const;

export type IncomeCategory = (typeof IncomeCategory)[keyof typeof IncomeCategory];

export const PaymentType = {
  CASH: "Cash",
  BANK: "Bank",
  CREDIT: "Credit",
} as const;

export type PaymentType = (typeof PaymentType)[keyof typeof PaymentType];

// Description options for each expense category
export const ExpenseDescriptions = {
  [ExpenseCategory.GREEN_LEAF_COST]: [
    "Green Leaf Purchase",
    "Transportation of Green Leaf",
    "Weighing Charges",
  ],
  [ExpenseCategory.LABOR_COST]: [
    "Factory Wages",
    "Overtime",
    "Casual Labor",
    "Bonus",
    "EPF/ETF",
  ],
  [ExpenseCategory.FUEL_POWER]: [
    "Firewood",
    "Electricity",
    "Diesel",
    "Generator Fuel",
  ],
  [ExpenseCategory.PACKING_MATERIALS]: [
    "Tea Bags",
    "Cartons",
    "Labels",
    "Wrapping Material",
    "Packaging Supplies",
  ],
  [ExpenseCategory.FACTORY_OVERHEADS]: [
    "Water",
    "Cleaning",
    "Security",
    "Insurance",
    "Factory Supplies",
  ],
  [ExpenseCategory.MAINTENANCE_REPAIRS]: [
    "Machinery Repair",
    "Building Maintenance",
    "Equipment Servicing",
    "Spare Parts",
  ],
  [ExpenseCategory.ADMINISTRATIVE]: [
    "Office Supplies",
    "Telephone/Internet",
    "Professional Fees",
    "Bank Charges",
    "Licenses & Permits",
  ],
  [ExpenseCategory.TRANSPORT_HANDLING]: [
    "Vehicle Fuel",
    "Vehicle Maintenance",
    "Transport Hire",
    "Loading/Unloading",
  ],
  [ExpenseCategory.FINANCIAL]: [
    "Loan Interest",
    "Bank Charges",
    "Other Financial Charges",
  ],
} as const;

export const IncomeDescriptions = {
  [IncomeCategory.MADE_TEA_SALES]: [
    "Bulk Tea Sales",
    "Retail Sales",
    "Export Sales",
    "Auction Sales",
  ],
  [IncomeCategory.OTHER_INCOME]: [
    "By-product Sales",
    "Interest Income",
    "Miscellaneous Income",
  ],
} as const;