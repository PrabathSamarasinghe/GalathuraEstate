import { gql } from '@apollo/client';

// =====================================================
// AUTH
// =====================================================

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
        email
        fullName
        role
      }
    }
  }
`;

export const REGISTER = gql`
  mutation Register($username: String!, $email: String!, $password: String!, $fullName: String!) {
    register(username: $username, email: $email, password: $password, fullName: $fullName) {
      token
      user {
        id
        username
        email
        fullName
        role
      }
    }
  }
`;

export const ME = gql`
  query Me {
    me {
      id
      username
      email
      fullName
      role
    }
  }
`;

// =====================================================
// EMPLOYEES
// =====================================================

export const GET_EMPLOYEES = gql`
  query GetEmployees($filter: EmployeeFilterInput, $limit: Int, $offset: Int) {
    employees(filter: $filter, limit: $limit, offset: $offset) {
      id
      fullName
      nicNumber
      contactNumber
      address
      department
      designation
      employmentType
      joinDate
      status
      payType
      rate
      otRate
      createdAt
    }
    employeeCount(filter: $filter)
  }
`;

export const GET_EMPLOYEE = gql`
  query GetEmployee($id: ID!) {
    employee(id: $id) {
      id
      fullName
      nicNumber
      contactNumber
      address
      department
      designation
      employmentType
      joinDate
      status
      payType
      rate
      otRate
      createdAt
      attendanceRecords {
        id
        date
        shift
        status
        otHours
        calculatedWage
      }
    }
  }
`;

export const GET_NEXT_EMPLOYEE_ID = gql`
  query GetNextEmployeeId {
    nextEmployeeId
  }
`;

export const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee($input: EmployeeInput!) {
    createEmployee(input: $input) {
      id
      fullName
      department
      status
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($id: ID!, $input: EmployeeInput!) {
    updateEmployee(id: $id, input: $input) {
      id
      fullName
      department
      status
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;

// =====================================================
// ATTENDANCE
// =====================================================

export const GET_ATTENDANCE_RECORDS = gql`
  query GetAttendanceRecords($filter: AttendanceFilterInput, $limit: Int, $offset: Int) {
    attendanceRecords(filter: $filter, limit: $limit, offset: $offset) {
      id
      employeeId
      employee {
        id
        fullName
        department
        designation
        payType
        rate
        otRate
      }
      date
      shift
      status
      otHours
      calculatedWage
      remarks
      markedAt
    }
  }
`;

export const GET_ATTENDANCE_SUMMARY = gql`
  query GetAttendanceSummary($date: Date!) {
    attendanceSummary(date: $date) {
      totalEmployees
      presentCount
      absentCount
      halfDayCount
      onLeaveCount
      otCount
      totalManDays
      totalOTHours
      totalWages
    }
  }
`;

export const CREATE_ATTENDANCE = gql`
  mutation CreateAttendance($input: AttendanceInput!) {
    createAttendanceRecord(input: $input) {
      id
      employeeId
      date
      status
      calculatedWage
    }
  }
`;

export const CREATE_BULK_ATTENDANCE = gql`
  mutation CreateBulkAttendance($input: BulkAttendanceInput!) {
    createBulkAttendance(input: $input) {
      id
      employeeId
      date
      shift
      status
      otHours
      calculatedWage
    }
  }
`;

export const UPDATE_ATTENDANCE = gql`
  mutation UpdateAttendance($id: ID!, $input: AttendanceInput!) {
    updateAttendanceRecord(id: $id, input: $input) {
      id
      status
      calculatedWage
    }
  }
`;

export const DELETE_ATTENDANCE = gql`
  mutation DeleteAttendance($id: ID!) {
    deleteAttendanceRecord(id: $id)
  }
`;

// =====================================================
// TRANSACTIONS
// =====================================================

export const GET_TRANSACTIONS = gql`
  query GetTransactions($filter: TransactionFilterInput, $limit: Int, $offset: Int) {
    transactions(filter: $filter, limit: $limit, offset: $offset) {
      id
      date
      type
      category
      description
      amount
      paymentType
      referenceNo
      remarks
      createdAt
    }
  }
`;

export const GET_TRANSACTION_SUMMARY = gql`
  query GetTransactionSummary($dateFrom: Date, $dateTo: Date) {
    transactionSummary(dateFrom: $dateFrom, dateTo: $dateTo) {
      todayExpenses
      todayIncome
      monthExpenses
      monthIncome
      netProfit
      categoryTotals {
        category
        total
        count
      }
    }
  }
`;

export const GET_PROFIT_LOSS = gql`
  query GetProfitLoss($dateFrom: Date!, $dateTo: Date!) {
    profitLossStatement(dateFrom: $dateFrom, dateTo: $dateTo) {
      madeTeaSales
      otherIncome
      totalIncome
      greenLeafCost
      laborCost
      fuelPower
      packingMaterials
      totalCostOfProduction
      grossProfit
      grossProfitMargin
      factoryOverheads
      maintenanceRepairs
      transportHandling
      administrative
      totalOperatingExpenses
      operatingProfit
      operatingProfitMargin
      financialExpenses
      netProfit
      netProfitMargin
    }
  }
`;

export const GET_NEXT_TRANSACTION_ID = gql`
  query GetNextTransactionId {
    nextTransactionId
  }
`;

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($input: TransactionInput!) {
    createTransaction(input: $input) {
      id
      date
      type
      category
      amount
    }
  }
`;

export const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($id: ID!, $input: TransactionInput!) {
    updateTransaction(id: $id, input: $input) {
      id
      date
      type
      category
      amount
    }
  }
`;

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`;

// =====================================================
// DASHBOARD
// =====================================================

export const GET_DASHBOARD_KPIS = gql`
  query GetDashboardKPIs($date: Date) {
    dashboardKPIs(date: $date) {
      todayAttendance {
        totalEmployees
        presentCount
        absentCount
        halfDayCount
        onLeaveCount
        otCount
        totalManDays
        totalOTHours
        totalWages
      }
      financialSummary {
        todayExpenses
        todayIncome
        monthExpenses
        monthIncome
        netProfit
        categoryTotals {
          category
          total
          count
        }
      }
      firewoodStatus {
        currentStock
        todayConsumption
        averageDailyConsumption
        daysRemaining
        lowStockThreshold
        isLowStock
      }
      packingMaterialsStatus {
        currentStock
        todayConsumption
        averageDailyConsumption
        daysRemaining
        lowStockThreshold
        isLowStock
      }
      greenLeafStatus {
        todayIntake
        thisMonthIntake
        averageDailyIntake
        conversionRatio
        unprocessedLeaf
      }
      madeTeaStatus {
        totalStock
        todayProduction
        thisMonthProduction
        thisMonthDispatch
        gradeStocks {
          grade
          quantity
          stockStatus
        }
        estimatedValue
      }
      recentActivities {
        id
        activityType
        description
        createdAt
      }
      alerts {
        type
        message
        severity
      }
    }
  }
`;

// =====================================================
// INVENTORY - FIREWOOD
// =====================================================

export const GET_FIREWOOD_TRANSACTIONS = gql`
  query GetFirewoodTransactions($dateFrom: Date, $dateTo: Date, $limit: Int, $offset: Int) {
    firewoodTransactions(dateFrom: $dateFrom, dateTo: $dateTo, limit: $limit, offset: $offset) {
      id
      date
      time
      type
      quantity
      factory
      supervisor
      remarks
      runningBalance
      createdAt
    }
    firewoodSummary {
      currentStock
      todayConsumption
      averageDailyConsumption
      daysRemaining
      lowStockThreshold
      isLowStock
    }
  }
`;

export const CREATE_FIREWOOD_TRANSACTION = gql`
  mutation CreateFirewoodTransaction($input: FirewoodTransactionInput!) {
    createFirewoodTransaction(input: $input) {
      id
      date
      type
      quantity
      runningBalance
    }
  }
`;

// =====================================================
// INVENTORY - PACKING MATERIALS
// =====================================================

export const GET_PACKING_MATERIALS_TRANSACTIONS = gql`
  query GetPackingMaterialsTransactions($dateFrom: Date, $dateTo: Date, $limit: Int, $offset: Int) {
    packingMaterialsTransactions(dateFrom: $dateFrom, dateTo: $dateTo, limit: $limit, offset: $offset) {
      id
      date
      time
      type
      quantity
      materialType
      factory
      supervisor
      remarks
      runningBalance
      createdAt
    }
    packingMaterialsSummary {
      currentStock
      todayConsumption
      averageDailyConsumption
      daysRemaining
      lowStockThreshold
      isLowStock
    }
  }
`;

export const CREATE_PACKING_MATERIALS_TRANSACTION = gql`
  mutation CreatePackingMaterialsTransaction($input: PackingMaterialsTransactionInput!) {
    createPackingMaterialsTransaction(input: $input) {
      id
      date
      type
      quantity
      runningBalance
    }
  }
`;

// =====================================================
// INVENTORY - GREEN LEAF
// =====================================================

export const GET_GREEN_LEAF_INTAKES = gql`
  query GetGreenLeafIntakes($dateFrom: Date, $dateTo: Date, $limit: Int, $offset: Int) {
    greenLeafIntakes(dateFrom: $dateFrom, dateTo: $dateTo, limit: $limit, offset: $offset) {
      id
      date
      time
      supplier
      supplierType
      vehicleNumber
      grossWeight
      tareWeight
      netWeight
      quality
      session
      remarks
      createdAt
    }
    greenLeafSummary {
      todayIntake
      thisMonthIntake
      averageDailyIntake
      conversionRatio
      unprocessedLeaf
    }
  }
`;

export const CREATE_GREEN_LEAF_INTAKE = gql`
  mutation CreateGreenLeafIntake($input: GreenLeafIntakeInput!) {
    createGreenLeafIntake(input: $input) {
      id
      date
      supplier
      netWeight
    }
  }
`;

// =====================================================
// PRODUCTION & MADE TEA
// =====================================================

export const GET_PRODUCTION_BATCHES = gql`
  query GetProductionBatches($dateFrom: Date, $dateTo: Date, $limit: Int, $offset: Int) {
    productionBatches(dateFrom: $dateFrom, dateTo: $dateTo, limit: $limit, offset: $offset) {
      id
      batchNumber
      date
      greenLeafUsed
      madeTeaProduced
      yieldPercentage
      createdAt
    }
  }
`;

export const GET_MADE_TEA_DATA = gql`
  query GetMadeTeaData($dateFrom: Date, $dateTo: Date, $limit: Int, $offset: Int) {
    madeTeaStocks {
      id
      grade
      quantity
      lastUpdated
      stockStatus
    }
    madeTeaTransactions(dateFrom: $dateFrom, dateTo: $dateTo, limit: $limit, offset: $offset) {
      id
      date
      time
      reference
      type
      grade
      inflow
      outflow
      balance
      details
      createdAt
    }
    madeTeaSummary {
      totalStock
      todayProduction
      thisMonthProduction
      thisMonthDispatch
      estimatedValue
    }
  }
`;

export const CREATE_PRODUCTION_BATCH = gql`
  mutation CreateProductionBatch($input: ProductionBatchInput!) {
    createProductionBatch(input: $input) {
      id
      batchNumber
      date
      greenLeafUsed
      madeTeaProduced
      yieldPercentage
    }
  }
`;

// =====================================================
// DISPATCH
// =====================================================

export const GET_DISPATCH_RECORDS = gql`
  query GetDispatchRecords($dateFrom: Date, $dateTo: Date, $grade: TeaGrade, $limit: Int, $offset: Int) {
    dispatchRecords(dateFrom: $dateFrom, dateTo: $dateTo, grade: $grade, limit: $limit, offset: $offset) {
      id
      date
      dispatchNumber
      grade
      quantity
      destination
      buyer
      vehicleNumber
      invoiceNumber
      remarks
      createdAt
    }
  }
`;

export const CREATE_DISPATCH_RECORD = gql`
  mutation CreateDispatchRecord($input: DispatchRecordInput!) {
    createDispatchRecord(input: $input) {
      id
      dispatchNumber
      grade
      quantity
      destination
    }
  }
`;

// =====================================================
// SYSTEM
// =====================================================

export const GET_SYSTEM_SETTINGS = gql`
  query GetSystemSettings {
    systemSettings {
      key
      value
      description
    }
  }
`;

export const UPDATE_SYSTEM_SETTING = gql`
  mutation UpdateSystemSetting($key: String!, $value: String!) {
    updateSystemSetting(key: $key, value: $value) {
      key
      value
    }
  }
`;
