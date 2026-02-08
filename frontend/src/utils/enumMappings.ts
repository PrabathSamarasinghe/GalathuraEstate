// Mapping from frontend display values to GraphQL enum values

export const toGraphQLEnum = {
  // Department - same values
  department: (val: string) => val,
  
  // Designation
  designation: (val: string) => {
    const map: Record<string, string> = {
      'Helper': 'Helper',
      'Machine Operator': 'MachineOperator',
      'Supervisor': 'Supervisor',
      'Clerk': 'Clerk',
    };
    return map[val] || val;
  },
  
  // EmploymentType
  employmentType: (val: string) => {
    const map: Record<string, string> = {
      'Permanent': 'Permanent',
      'Casual / Daily Paid': 'Casual',
      'Contract': 'Contract',
    };
    return map[val] || val;
  },
  
  // EmployeeStatus - same values
  status: (val: string) => val,
  
  // PayType
  payType: (val: string) => {
    const map: Record<string, string> = {
      'Daily wage': 'DailyWage',
      'Monthly salary': 'MonthlySalary',
      'Hourly': 'Hourly',
    };
    return map[val] || val;
  },
  
  // Shift
  shift: (val: string) => {
    const map: Record<string, string> = {
      'Day': 'Day',
      'Night': 'Night',
      'Full Day': 'FullDay',
    };
    return map[val] || val;
  },
  
  // AttendanceStatus
  attendanceStatus: (val: string) => {
    const map: Record<string, string> = {
      'Present': 'Present',
      'Absent': 'Absent',
      'Half Day': 'HalfDay',
      'On Leave': 'OnLeave',
    };
    return map[val] || val;
  },
  
  // TransactionType - same values
  transactionType: (val: string) => val,
  
  // InventoryTransactionType
  inventoryTransactionType: (val: string) => {
    const map: Record<string, string> = {
      'Inflow': 'inflow',
      'Outflow': 'outflow',
      'inflow': 'inflow',
      'outflow': 'outflow',
    };
    return map[val] || val.toLowerCase();
  },
  
  // PaymentType
  paymentType: (val: string) => {
    const map: Record<string, string> = {
      'Cash': 'Cash',
      'Bank': 'Bank',
      'Credit': 'Credit',
    };
    return map[val] || val;
  },
};

// Mapping from GraphQL enum values back to frontend display values
export const fromGraphQLEnum = {
  // Designation
  designation: (val: string) => {
    const map: Record<string, string> = {
      'Helper': 'Helper',
      'MachineOperator': 'Machine Operator',
      'Supervisor': 'Supervisor',
      'Clerk': 'Clerk',
    };
    return map[val] || val;
  },
  
  // EmploymentType
  employmentType: (val: string) => {
    const map: Record<string, string> = {
      'Permanent': 'Permanent',
      'Casual': 'Casual / Daily Paid',
      'Contract': 'Contract',
    };
    return map[val] || val;
  },
  
  // PayType
  payType: (val: string) => {
    const map: Record<string, string> = {
      'DailyWage': 'Daily wage',
      'MonthlySalary': 'Monthly salary',
      'Hourly': 'Hourly',
    };
    return map[val] || val;
  },
  
  // Shift
  shift: (val: string) => {
    const map: Record<string, string> = {
      'Day': 'Day',
      'Night': 'Night',
      'FullDay': 'Full Day',
    };
    return map[val] || val;
  },
  
  // AttendanceStatus
  attendanceStatus: (val: string) => {
    const map: Record<string, string> = {
      'Present': 'Present',
      'Absent': 'Absent',
      'HalfDay': 'Half Day',
      'OnLeave': 'On Leave',
    };
    return map[val] || val;
  },
};
