export const typeDefs = `#graphql
  scalar DateTime
  scalar Date
  scalar Decimal

  # =====================================================
  # ENUMS
  # =====================================================

  enum Department {
    Withering
    Rolling
    Dryer
    Packing
    Boiler
    Office
  }

  enum Designation {
    Helper
    MachineOperator
    Supervisor
    Clerk
  }

  enum EmploymentType {
    Permanent
    Casual
    Contract
  }

  enum EmployeeStatus {
    Active
    Inactive
  }

  enum PayType {
    DailyWage
    MonthlySalary
    Hourly
  }

  enum Shift {
    Day
    Night
    FullDay
  }

  enum AttendanceStatus {
    Present
    Absent
    HalfDay
    OnLeave
  }

  enum TransactionType {
    Expense
    Income
  }

  enum PaymentType {
    Cash
    Bank
    Credit
  }

  enum SupplierType {
    estate
    smallholder
  }

  enum Session {
    AM
    PM
  }

  enum TeaGrade {
    OP1
    OPA
    BOP1
    PEK
    PEK1
    FBOP
    FBOPF1
    BOPA
    BOPFSP
    BOPFEXSP
    BM
    BP
    BOP1A
    BT
    DUST1
    DUST
  }

  enum InventoryTransactionType {
    inflow
    outflow
  }

  enum MadeTeaTransactionType {
    production
    dispatch
  }

  # =====================================================
  # TYPES
  # =====================================================

  type User {
    id: ID!
    username: String!
    email: String!
    fullName: String!
    role: String!
    isActive: Boolean!
    createdAt: DateTime!
    lastLogin: DateTime
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Employee {
    id: ID!
    fullName: String!
    nicNumber: String!
    contactNumber: String!
    address: String
    department: Department!
    designation: Designation!
    employmentType: EmploymentType!
    joinDate: Date!
    status: EmployeeStatus!
    payType: PayType!
    rate: Float!
    otRate: Float
    createdAt: DateTime!
    updatedAt: DateTime!
    attendanceRecords: [AttendanceRecord!]
  }

  type AttendanceRecord {
    id: ID!
    employeeId: String!
    employee: Employee!
    date: Date!
    shift: Shift!
    status: AttendanceStatus!
    otHours: Float!
    calculatedWage: Float!
    remarks: String
    markedAt: DateTime!
  }

  type AttendanceSummary {
    totalEmployees: Int!
    presentCount: Int!
    absentCount: Int!
    halfDayCount: Int!
    onLeaveCount: Int!
    otCount: Int!
    totalManDays: Float!
    totalOTHours: Float!
    totalWages: Float!
  }

  type Transaction {
    id: ID!
    date: Date!
    type: TransactionType!
    category: String!
    description: String!
    amount: Float!
    paymentType: PaymentType!
    referenceNo: String
    remarks: String
    createdAt: DateTime!
  }

  type TransactionSummary {
    todayExpenses: Float!
    todayIncome: Float!
    monthExpenses: Float!
    monthIncome: Float!
    netProfit: Float!
    categoryTotals: [CategoryTotal!]!
  }

  type CategoryTotal {
    category: String!
    total: Float!
    count: Int!
  }

  type ProfitLossStatement {
    madeTeaSales: Float!
    otherIncome: Float!
    totalIncome: Float!
    greenLeafCost: Float!
    laborCost: Float!
    fuelPower: Float!
    packingMaterials: Float!
    totalCostOfProduction: Float!
    grossProfit: Float!
    grossProfitMargin: Float!
    factoryOverheads: Float!
    maintenanceRepairs: Float!
    transportHandling: Float!
    administrative: Float!
    totalOperatingExpenses: Float!
    operatingProfit: Float!
    operatingProfitMargin: Float!
    financialExpenses: Float!
    netProfit: Float!
    netProfitMargin: Float!
  }

  type FirewoodTransaction {
    id: ID!
    date: Date!
    time: String!
    type: InventoryTransactionType!
    quantity: Float!
    factory: String
    supervisor: String
    remarks: String
    runningBalance: Float!
    createdAt: DateTime!
  }

  type FirewoodSummary {
    currentStock: Float!
    todayConsumption: Float!
    averageDailyConsumption: Float!
    daysRemaining: Float!
    lowStockThreshold: Float!
    isLowStock: Boolean!
  }

  type PackingMaterialsTransaction {
    id: ID!
    date: Date!
    time: String!
    type: InventoryTransactionType!
    quantity: Float!
    materialType: String
    factory: String
    supervisor: String
    remarks: String
    runningBalance: Float!
    createdAt: DateTime!
  }

  type PackingMaterialsSummary {
    currentStock: Float!
    todayConsumption: Float!
    averageDailyConsumption: Float!
    daysRemaining: Float!
    lowStockThreshold: Float!
    isLowStock: Boolean!
  }

  type GreenLeafIntake {
    id: ID!
    date: Date!
    time: String!
    supplier: String!
    supplierType: SupplierType!
    vehicleNumber: String!
    grossWeight: Float!
    tareWeight: Float!
    netWeight: Float!
    quality: String
    session: Session!
    remarks: String
    createdAt: DateTime!
  }

  type GreenLeafSummary {
    todayIntake: Float!
    thisMonthIntake: Float!
    averageDailyIntake: Float!
    conversionRatio: Float!
    unprocessedLeaf: Float!
  }

  type ProductionBatch {
    id: ID!
    batchNumber: String!
    date: Date!
    greenLeafUsed: Float!
    madeTeaProduced: Float!
    yieldPercentage: Float!
    createdAt: DateTime!
  }

  type MadeTeaStock {
    id: ID!
    grade: TeaGrade!
    quantity: Float!
    lastUpdated: DateTime!
    stockStatus: String!
  }

  type MadeTeaTransaction {
    id: ID!
    date: Date!
    time: String!
    reference: String!
    type: MadeTeaTransactionType!
    grade: TeaGrade!
    inflow: Float!
    outflow: Float!
    balance: Float!
    details: String
    createdAt: DateTime!
  }

  type MadeTeaSummary {
    totalStock: Float!
    todayProduction: Float!
    thisMonthProduction: Float!
    thisMonthDispatch: Float!
    gradeStocks: [MadeTeaStock!]!
    estimatedValue: Float!
  }

  type DispatchRecord {
    id: ID!
    date: Date!
    dispatchNumber: String!
    grade: TeaGrade!
    quantity: Float!
    destination: String!
    buyer: String
    vehicleNumber: String
    invoiceNumber: String
    remarks: String
    createdAt: DateTime!
  }

  type ActivityLog {
    id: ID!
    activityType: String!
    description: String!
    entityType: String
    entityId: String
    createdAt: DateTime!
  }

  type Alert {
    type: String!
    message: String!
    severity: String!
  }

  type DashboardKPIs {
    todayAttendance: AttendanceSummary!
    financialSummary: TransactionSummary!
    firewoodStatus: FirewoodSummary!
    packingMaterialsStatus: PackingMaterialsSummary!
    greenLeafStatus: GreenLeafSummary!
    madeTeaStatus: MadeTeaSummary!
    recentActivities: [ActivityLog!]!
    alerts: [Alert!]!
  }

  type SystemSetting {
    key: String!
    value: String!
    description: String
  }

  # =====================================================
  # INPUTS
  # =====================================================

  input EmployeeInput {
    fullName: String!
    nicNumber: String!
    contactNumber: String!
    address: String
    department: Department!
    designation: Designation!
    employmentType: EmploymentType!
    joinDate: Date!
    status: EmployeeStatus!
    payType: PayType!
    rate: Float!
    otRate: Float
  }

  input EmployeeFilterInput {
    department: Department
    employmentType: EmploymentType
    status: EmployeeStatus
    searchTerm: String
  }

  input AttendanceInput {
    employeeId: ID!
    date: Date!
    shift: Shift!
    status: AttendanceStatus!
    otHours: Float!
    remarks: String
  }

  input BulkAttendanceInput {
    date: Date!
    shift: Shift!
    records: [SingleAttendanceInput!]!
  }

  input SingleAttendanceInput {
    employeeId: ID!
    status: AttendanceStatus!
    otHours: Float!
    remarks: String
  }

  input AttendanceFilterInput {
    date: Date
    dateFrom: Date
    dateTo: Date
    department: Department
    shift: Shift
    status: AttendanceStatus
    employeeId: ID
  }

  input TransactionInput {
    date: Date!
    type: TransactionType!
    category: String!
    description: String!
    amount: Float!
    paymentType: PaymentType!
    referenceNo: String
    remarks: String
  }

  input TransactionFilterInput {
    dateFrom: Date
    dateTo: Date
    type: TransactionType
    category: String
    paymentType: PaymentType
    searchTerm: String
  }

  input FirewoodTransactionInput {
    date: Date!
    time: String!
    type: InventoryTransactionType!
    quantity: Float!
    factory: String
    supervisor: String
    remarks: String
  }

  input PackingMaterialsTransactionInput {
    date: Date!
    time: String!
    type: InventoryTransactionType!
    quantity: Float!
    materialType: String
    factory: String
    supervisor: String
    remarks: String
  }

  input GreenLeafIntakeInput {
    date: Date!
    time: String!
    supplier: String!
    supplierType: SupplierType!
    vehicleNumber: String!
    grossWeight: Float!
    tareWeight: Float!
    quality: String
    session: Session!
    remarks: String
  }

  input ProductionBatchInput {
    batchNumber: String!
    date: Date!
    greenLeafUsed: Float!
    madeTeaProduced: Float!
  }

  input DispatchRecordInput {
    date: Date!
    dispatchNumber: String!
    grade: TeaGrade!
    quantity: Float!
    destination: String!
    buyer: String
    vehicleNumber: String
    invoiceNumber: String
    remarks: String
  }

  # =====================================================
  # QUERIES
  # =====================================================

  type Query {
    # Auth
    me: User

    # Employees
    employees(filter: EmployeeFilterInput, limit: Int, offset: Int): [Employee!]!
    employee(id: ID!): Employee
    employeeCount(filter: EmployeeFilterInput): Int!
    nextEmployeeId: String!

    # Attendance
    attendanceRecords(filter: AttendanceFilterInput, limit: Int, offset: Int): [AttendanceRecord!]!
    attendanceRecord(id: ID!): AttendanceRecord
    attendanceSummary(date: Date!): AttendanceSummary!

    # Transactions
    transactions(filter: TransactionFilterInput, limit: Int, offset: Int): [Transaction!]!
    transaction(id: ID!): Transaction
    transactionSummary(dateFrom: Date, dateTo: Date): TransactionSummary!
    profitLossStatement(dateFrom: Date!, dateTo: Date!): ProfitLossStatement!
    nextTransactionId: String!

    # Inventory - Firewood
    firewoodTransactions(dateFrom: Date, dateTo: Date, limit: Int, offset: Int): [FirewoodTransaction!]!
    firewoodSummary: FirewoodSummary!

    # Inventory - Packing Materials
    packingMaterialsTransactions(dateFrom: Date, dateTo: Date, limit: Int, offset: Int): [PackingMaterialsTransaction!]!
    packingMaterialsSummary: PackingMaterialsSummary!

    # Inventory - Green Leaf
    greenLeafIntakes(dateFrom: Date, dateTo: Date, limit: Int, offset: Int): [GreenLeafIntake!]!
    greenLeafSummary: GreenLeafSummary!

    # Production
    productionBatches(dateFrom: Date, dateTo: Date, limit: Int, offset: Int): [ProductionBatch!]!
    productionBatch(id: ID!): ProductionBatch

    # Made Tea
    madeTeaStocks: [MadeTeaStock!]!
    madeTeaTransactions(dateFrom: Date, dateTo: Date, grade: TeaGrade, limit: Int, offset: Int): [MadeTeaTransaction!]!
    madeTeaSummary: MadeTeaSummary!

    # Dispatch
    dispatchRecords(dateFrom: Date, dateTo: Date, grade: TeaGrade, limit: Int, offset: Int): [DispatchRecord!]!
    dispatchRecord(id: ID!): DispatchRecord

    # Dashboard
    dashboardKPIs(date: Date): DashboardKPIs!
    activityLogs(limit: Int, offset: Int): [ActivityLog!]!

    # System
    systemSettings: [SystemSetting!]!
    systemSetting(key: String!): SystemSetting
  }

  # =====================================================
  # MUTATIONS
  # =====================================================

  type Mutation {
    # Auth
    login(username: String!, password: String!): AuthPayload!
    register(username: String!, email: String!, password: String!, fullName: String!): AuthPayload!

    # Employees
    createEmployee(input: EmployeeInput!): Employee!
    updateEmployee(id: ID!, input: EmployeeInput!): Employee!
    deleteEmployee(id: ID!): Boolean!

    # Attendance
    createAttendanceRecord(input: AttendanceInput!): AttendanceRecord!
    createBulkAttendance(input: BulkAttendanceInput!): [AttendanceRecord!]!
    updateAttendanceRecord(id: ID!, input: AttendanceInput!): AttendanceRecord!
    deleteAttendanceRecord(id: ID!): Boolean!

    # Transactions
    createTransaction(input: TransactionInput!): Transaction!
    updateTransaction(id: ID!, input: TransactionInput!): Transaction!
    deleteTransaction(id: ID!): Boolean!

    # Inventory - Firewood
    createFirewoodTransaction(input: FirewoodTransactionInput!): FirewoodTransaction!
    deleteFirewoodTransaction(id: ID!): Boolean!

    # Inventory - Packing Materials
    createPackingMaterialsTransaction(input: PackingMaterialsTransactionInput!): PackingMaterialsTransaction!
    deletePackingMaterialsTransaction(id: ID!): Boolean!

    # Inventory - Green Leaf
    createGreenLeafIntake(input: GreenLeafIntakeInput!): GreenLeafIntake!
    deleteGreenLeafIntake(id: ID!): Boolean!

    # Production
    createProductionBatch(input: ProductionBatchInput!): ProductionBatch!
    deleteProductionBatch(id: ID!): Boolean!

    # Dispatch
    createDispatchRecord(input: DispatchRecordInput!): DispatchRecord!
    deleteDispatchRecord(id: ID!): Boolean!

    # System
    updateSystemSetting(key: String!, value: String!): SystemSetting!
  }
`;
