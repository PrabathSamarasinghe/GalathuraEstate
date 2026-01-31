import type { Employee, AttendanceRecord, Transaction } from "./Interfaces";
import {
  Department,
  Designation,
  EmploymentType,
  EmployeeStatus,
  PayType,
  Shift,
  AttendanceStatus,
  TransactionType,
  ExpenseCategory,
  IncomeCategory,
  PaymentType,
} from "./enums";

// Dummy Employees Data
export const dummyEmployees: Employee[] = [
  {
    id: "EMP250001",
    fullName: "Kamal Perera",
    nicNumber: "852341567V",
    contactNumber: "0771234567",
    address: "123, Galle Road, Matara",
    department: Department.WITHERING,
    designation: Designation.SUPERVISOR,
    employmentType: EmploymentType.PERMANENT,
    joinDate: "2020-01-15",
    status: EmployeeStatus.ACTIVE,
    payType: PayType.MONTHLY_SALARY,
    rate: 45000,
    otRate: 500,
  },
  {
    id: "EMP250002",
    fullName: "Nimal Silva",
    nicNumber: "902341567V",
    contactNumber: "0772345678",
    address: "45, Temple Road, Galle",
    department: Department.ROLLING,
    designation: Designation.MACHINE_OPERATOR,
    employmentType: EmploymentType.PERMANENT,
    joinDate: "2019-03-20",
    status: EmployeeStatus.ACTIVE,
    payType: PayType.DAILY_WAGE,
    rate: 2500,
    otRate: 350,
  },
  {
    id: "EMP250003",
    fullName: "Sunil Fernando",
    nicNumber: "881234567V",
    contactNumber: "0773456789",
    address: "78, Station Road, Ambalangoda",
    department: Department.DRYER,
    designation: Designation.MACHINE_OPERATOR,
    employmentType: EmploymentType.PERMANENT,
    joinDate: "2018-06-10",
    status: EmployeeStatus.ACTIVE,
    payType: PayType.DAILY_WAGE,
    rate: 2600,
    otRate: 380,
  },
  {
    id: "EMP250004",
    fullName: "Kumari Jayasinghe",
    nicNumber: "956789012V",
    contactNumber: "0774567890",
    address: "12, Hill Street, Hikkaduwa",
    department: Department.PACKING,
    designation: Designation.HELPER,
    employmentType: EmploymentType.CASUAL,
    joinDate: "2021-09-01",
    status: EmployeeStatus.ACTIVE,
    payType: PayType.DAILY_WAGE,
    rate: 1800,
    otRate: 250,
  },
  {
    id: "EMP250005",
    fullName: "Saman Rathnayake",
    nicNumber: "872345678V",
    contactNumber: "0775678901",
    address: "34, Beach Road, Bentota",
    department: Department.BOILER,
    designation: Designation.MACHINE_OPERATOR,
    employmentType: EmploymentType.PERMANENT,
    joinDate: "2017-11-25",
    status: EmployeeStatus.ACTIVE,
    payType: PayType.DAILY_WAGE,
    rate: 2800,
    otRate: 400,
  },
  {
    id: "EMP250006",
    fullName: "Chamari Wickramasinghe",
    nicNumber: "926789012V",
    contactNumber: "0776789012",
    address: "56, Lake View, Koggala",
    department: Department.PACKING,
    designation: Designation.HELPER,
    employmentType: EmploymentType.CASUAL,
    joinDate: "2022-02-14",
    status: EmployeeStatus.ACTIVE,
    payType: PayType.DAILY_WAGE,
    rate: 1900,
    otRate: 260,
  },
  {
    id: "EMP250007",
    fullName: "Priyantha Samaraweera",
    nicNumber: "801234567V",
    contactNumber: "0777890123",
    address: "89, Main Street, Galle",
    department: Department.OFFICE,
    designation: Designation.CLERK,
    employmentType: EmploymentType.PERMANENT,
    joinDate: "2015-04-01",
    status: EmployeeStatus.ACTIVE,
    payType: PayType.MONTHLY_SALARY,
    rate: 38000,
    otRate: 400,
  },
  {
    id: "EMP250008",
    fullName: "Ranjith Gunawardena",
    nicNumber: "862345678V",
    contactNumber: "0778901234",
    address: "23, Church Road, Matara",
    department: Department.WITHERING,
    designation: Designation.HELPER,
    employmentType: EmploymentType.PERMANENT,
    joinDate: "2019-07-15",
    status: EmployeeStatus.ACTIVE,
    payType: PayType.DAILY_WAGE,
    rate: 2200,
    otRate: 300,
  },
  {
    id: "EMP250009",
    fullName: "Malini Amarasinghe",
    nicNumber: "946789012V",
    contactNumber: "0779012345",
    address: "67, Garden Lane, Deniyaya",
    department: Department.PACKING,
    designation: Designation.SUPERVISOR,
    employmentType: EmploymentType.PERMANENT,
    joinDate: "2020-05-20",
    status: EmployeeStatus.ACTIVE,
    payType: PayType.MONTHLY_SALARY,
    rate: 42000,
    otRate: 450,
  },
  {
    id: "EMP250010",
    fullName: "Tilak Bandara",
    nicNumber: "891234567V",
    contactNumber: "0770123456",
    address: "45, Forest Road, Elpitiya",
    department: Department.ROLLING,
    designation: Designation.HELPER,
    employmentType: EmploymentType.CASUAL,
    joinDate: "2021-11-10",
    status: EmployeeStatus.ACTIVE,
    payType: PayType.DAILY_WAGE,
    rate: 2000,
    otRate: 280,
  },
  {
    id: "EMP250011",
    fullName: "Anura Rajapaksha",
    nicNumber: "831234567V",
    contactNumber: "0771234560",
    address: "12, Tea Estate Road, Matara",
    department: Department.DRYER,
    designation: Designation.HELPER,
    employmentType: EmploymentType.PERMANENT,
    joinDate: "2018-02-28",
    status: EmployeeStatus.ACTIVE,
    payType: PayType.DAILY_WAGE,
    rate: 2100,
    otRate: 290,
  },
  {
    id: "EMP250012",
    fullName: "Sandun Lakmal",
    nicNumber: "952345678V",
    contactNumber: "0772345671",
    address: "78, Valley View, Akuressa",
    department: Department.ROLLING,
    designation: Designation.MACHINE_OPERATOR,
    employmentType: EmploymentType.CONTRACT,
    joinDate: "2022-08-01",
    status: EmployeeStatus.ACTIVE,
    payType: PayType.DAILY_WAGE,
    rate: 2400,
    otRate: 330,
  },
  {
    id: "EMP250013",
    fullName: "Dilani Perera",
    nicNumber: "906789012V",
    contactNumber: "0773456782",
    address: "34, Market Street, Galle",
    department: Department.OFFICE,
    designation: Designation.CLERK,
    employmentType: EmploymentType.PERMANENT,
    joinDate: "2019-12-15",
    status: EmployeeStatus.ACTIVE,
    payType: PayType.MONTHLY_SALARY,
    rate: 35000,
    otRate: 380,
  },
  {
    id: "EMP250014",
    fullName: "Gamini Wijesinghe",
    nicNumber: "781234567V",
    contactNumber: "0774567893",
    address: "56, Upper Road, Weligama",
    department: Department.BOILER,
    designation: Designation.SUPERVISOR,
    employmentType: EmploymentType.PERMANENT,
    joinDate: "2016-09-05",
    status: EmployeeStatus.ACTIVE,
    payType: PayType.MONTHLY_SALARY,
    rate: 48000,
    otRate: 520,
  },
  {
    id: "EMP250015",
    fullName: "Wasantha Kumar",
    nicNumber: "842345678V",
    contactNumber: "0775678904",
    address: "89, Lower Road, Matara",
    department: Department.WITHERING,
    designation: Designation.MACHINE_OPERATOR,
    employmentType: EmploymentType.PERMANENT,
    joinDate: "2017-03-12",
    status: EmployeeStatus.ACTIVE,
    payType: PayType.DAILY_WAGE,
    rate: 2550,
    otRate: 360,
  },
  {
    id: "EMP250016",
    fullName: "Indika Jayawardena",
    nicNumber: "922345678V",
    contactNumber: "0776789015",
    address: "23, School Lane, Tangalle",
    department: Department.PACKING,
    designation: Designation.HELPER,
    employmentType: EmploymentType.CASUAL,
    joinDate: "2023-01-20",
    status: EmployeeStatus.ACTIVE,
    payType: PayType.DAILY_WAGE,
    rate: 1850,
    otRate: 255,
  },
  {
    id: "EMP250017",
    fullName: "Chandrika Silva",
    nicNumber: "886789012V",
    contactNumber: "0777890126",
    address: "67, Park Avenue, Matara",
    department: Department.ROLLING,
    designation: Designation.HELPER,
    employmentType: EmploymentType.PERMANENT,
    joinDate: "2018-10-08",
    status: EmployeeStatus.ACTIVE,
    payType: PayType.DAILY_WAGE,
    rate: 2150,
    otRate: 295,
  },
  {
    id: "EMP250018",
    fullName: "Aruna Dissanayake",
    nicNumber: "751234567V",
    contactNumber: "0778901237",
    address: "12, River Road, Kamburupitiya",
    department: Department.DRYER,
    designation: Designation.SUPERVISOR,
    employmentType: EmploymentType.PERMANENT,
    joinDate: "2014-06-15",
    status: EmployeeStatus.ACTIVE,
    payType: PayType.MONTHLY_SALARY,
    rate: 46000,
    otRate: 480,
  },
  {
    id: "EMP250019",
    fullName: "Rohan Fernando",
    nicNumber: "932345678V",
    contactNumber: "0779012348",
    address: "45, Colombo Road, Galle",
    department: Department.BOILER,
    designation: Designation.HELPER,
    employmentType: EmploymentType.CONTRACT,
    joinDate: "2022-04-10",
    status: EmployeeStatus.ACTIVE,
    payType: PayType.DAILY_WAGE,
    rate: 2300,
    otRate: 320,
  },
  {
    id: "EMP250020",
    fullName: "Lalith Mendis",
    nicNumber: "791234567V",
    contactNumber: "0770123459",
    address: "78, Hospital Road, Matara",
    department: Department.WITHERING,
    designation: Designation.HELPER,
    employmentType: EmploymentType.CASUAL,
    joinDate: "2021-06-25",
    status: EmployeeStatus.INACTIVE,
    payType: PayType.DAILY_WAGE,
    rate: 1950,
    otRate: 270,
  },
];

// Dummy Attendance Records (for the last 7 days)
export const generateDummyAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  
  // Generate attendance for last 7 days
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() - dayOffset);
    const dateString = date.toISOString().split("T")[0];

    // Only use active employees
    const activeEmployees = dummyEmployees.filter(
      (emp) => emp.status === EmployeeStatus.ACTIVE
    );

    activeEmployees.forEach((employee, index) => {
      // Randomize attendance status (90% present, 5% absent, 5% half day)
      const rand = Math.random();
      let status: AttendanceStatus;
      let otHours = 0;

      if (rand < 0.85) {
        status = AttendanceStatus.PRESENT;
        // 40% chance of OT for present employees
        if (Math.random() < 0.4) {
          otHours = Math.floor(Math.random() * 4) + 1; // 1-4 hours OT
        }
      } else if (rand < 0.92) {
        status = AttendanceStatus.HALF_DAY;
      } else if (rand < 0.97) {
        status = AttendanceStatus.ABSENT;
      } else {
        status = AttendanceStatus.ON_LEAVE;
      }

      // Calculate wage
      let baseWage = 0;
      if (status === AttendanceStatus.PRESENT) {
        if (employee.payType === PayType.DAILY_WAGE) {
          baseWage = employee.rate;
        } else if (employee.payType === PayType.HOURLY) {
          baseWage = employee.rate * 8;
        } else if (employee.payType === PayType.MONTHLY_SALARY) {
          baseWage = employee.rate / 26;
        }
      } else if (status === AttendanceStatus.HALF_DAY) {
        if (employee.payType === PayType.DAILY_WAGE) {
          baseWage = employee.rate * 0.5;
        } else if (employee.payType === PayType.HOURLY) {
          baseWage = employee.rate * 4;
        } else if (employee.payType === PayType.MONTHLY_SALARY) {
          baseWage = (employee.rate / 26) * 0.5;
        }
      }

      const otWage = otHours > 0 && employee.otRate ? employee.otRate * otHours : 0;
      const calculatedWage = baseWage + otWage;

      // Determine shift (80% Full Day, 15% Day, 5% Night)
      let shift: Shift;
      const shiftRand = Math.random();
      if (shiftRand < 0.8) {
        shift = Shift.FULL_DAY;
      } else if (shiftRand < 0.95) {
        shift = Shift.DAY;
      } else {
        shift = Shift.NIGHT;
      }

      const remarks = [
        "",
        "",
        "",
        "",
        "Good performance",
        "Extra work done",
        "Training session",
      ];

      records.push({
        id: `ATT${date.getTime()}${index}`,
        employeeId: employee.id,
        employeeName: employee.fullName,
        department: employee.department,
        date: dateString,
        shift,
        status,
        otHours,
        calculatedWage,
        remarks: remarks[Math.floor(Math.random() * remarks.length)],
        markedAt: new Date(date.getTime() + 8 * 60 * 60 * 1000).toISOString(), // 8 AM
      });
    });
  }

  return records;
};

// Generate dummy transactions for last 3 months
const generateDummyTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const today = new Date();
  const threeMonthsAgo = new Date(today);
  threeMonthsAgo.setMonth(today.getMonth() - 3);

  let transactionCounter = 1;

  // Generate transactions for each day in the past 3 months
  for (let d = new Date(threeMonthsAgo); d <= today; d.setDate(d.getDate() + 1)) {
    const dateString = new Date(d).toISOString().split("T")[0];
    const dayOfMonth = new Date(d).getDate();

    // INCOME TRANSACTIONS
    // Made Tea Sales (3-4 times per week)
    if (d.getDay() === 1 || d.getDay() === 3 || d.getDay() === 5) {
      transactions.push({
        id: `TXN${String(transactionCounter++).padStart(6, "0")}`,
        date: dateString,
        type: TransactionType.INCOME,
        category: IncomeCategory.MADE_TEA_SALES,
        description: `Made tea sales - Batch ${Math.floor(Math.random() * 100) + 1}`,
        amount: Math.floor(Math.random() * 200000) + 800000, // 800k - 1M per sale
        paymentType: Math.random() > 0.3 ? PaymentType.BANK : PaymentType.CREDIT,
        referenceNo: `INV-${dateString.replace(/-/g, "")}-${Math.floor(Math.random() * 999) + 1}`,
        createdAt: new Date(d).toISOString(),
      });
    }

    // Other Income (occasional)
    if (Math.random() > 0.9) {
      const otherIncomes = [
        "Sale of tea waste",
        "Rental income from equipment",
        "Consulting services",
        "Sale of old machinery",
      ];
      transactions.push({
        id: `TXN${String(transactionCounter++).padStart(6, "0")}`,
        date: dateString,
        type: TransactionType.INCOME,
        category: IncomeCategory.OTHER_INCOME,
        description: otherIncomes[Math.floor(Math.random() * otherIncomes.length)],
        amount: Math.floor(Math.random() * 50000) + 10000,
        paymentType: PaymentType.BANK,
        createdAt: new Date(d).toISOString(),
      });
    }

    // EXPENSE TRANSACTIONS
    // Green Leaf Cost (daily purchases)
    if (Math.random() > 0.2) {
      transactions.push({
        id: `TXN${String(transactionCounter++).padStart(6, "0")}`,
        date: dateString,
        type: TransactionType.EXPENSE,
        category: ExpenseCategory.GREEN_LEAF_COST,
        description: `Green leaf purchase - ${Math.floor(Math.random() * 500) + 200} kg`,
        amount: Math.floor(Math.random() * 150000) + 50000,
        paymentType: Math.random() > 0.5 ? PaymentType.CASH : PaymentType.BANK,
        createdAt: new Date(d).toISOString(),
      });
    }

    // Labor Cost (weekly payroll)
    if (d.getDay() === 5) {
      // Every Friday
      transactions.push({
        id: `TXN${String(transactionCounter++).padStart(6, "0")}`,
        date: dateString,
        type: TransactionType.EXPENSE,
        category: ExpenseCategory.LABOR_COST,
        description: `Weekly payroll - Week ${Math.ceil(dayOfMonth / 7)}`,
        amount: Math.floor(Math.random() * 100000) + 200000,
        paymentType: PaymentType.BANK,
        referenceNo: `PAY-${dateString.replace(/-/g, "")}`,
        createdAt: new Date(d).toISOString(),
      });
    }

    // Fuel & Power (every 2-3 days)
    if (Math.random() > 0.6) {
      const fuelTypes = ["Diesel for generator", "Electricity bill payment", "Firewood purchase", "Coal purchase"];
      transactions.push({
        id: `TXN${String(transactionCounter++).padStart(6, "0")}`,
        date: dateString,
        type: TransactionType.EXPENSE,
        category: ExpenseCategory.FUEL_POWER,
        description: fuelTypes[Math.floor(Math.random() * fuelTypes.length)],
        amount: Math.floor(Math.random() * 80000) + 20000,
        paymentType: Math.random() > 0.7 ? PaymentType.CASH : PaymentType.BANK,
        createdAt: new Date(d).toISOString(),
      });
    }

    // Packing Materials (weekly)
    if (d.getDay() === 2) {
      // Every Tuesday
      const packingItems = [
        "Cardboard boxes - 500 units",
        "Tea bags - 10,000 units",
        "Labels and stickers",
        "Plastic wrapping rolls",
      ];
      transactions.push({
        id: `TXN${String(transactionCounter++).padStart(6, "0")}`,
        date: dateString,
        type: TransactionType.EXPENSE,
        category: ExpenseCategory.PACKING_MATERIALS,
        description: packingItems[Math.floor(Math.random() * packingItems.length)],
        amount: Math.floor(Math.random() * 60000) + 30000,
        paymentType: PaymentType.BANK,
        createdAt: new Date(d).toISOString(),
      });
    }

    // Factory Overheads (various)
    if (Math.random() > 0.85) {
      const overheads = [
        "Water bill payment",
        "Cleaning supplies",
        "Safety equipment",
        "Factory supplies",
        "Waste disposal",
      ];
      transactions.push({
        id: `TXN${String(transactionCounter++).padStart(6, "0")}`,
        date: dateString,
        type: TransactionType.EXPENSE,
        category: ExpenseCategory.FACTORY_OVERHEADS,
        description: overheads[Math.floor(Math.random() * overheads.length)],
        amount: Math.floor(Math.random() * 30000) + 5000,
        paymentType: Math.random() > 0.5 ? PaymentType.CASH : PaymentType.BANK,
        createdAt: new Date(d).toISOString(),
      });
    }

    // Maintenance & Repairs (occasional)
    if (Math.random() > 0.9) {
      const maintenance = [
        "Machine servicing - Rolling unit",
        "Dryer repair",
        "Building maintenance",
        "Equipment calibration",
        "Plumbing repairs",
      ];
      transactions.push({
        id: `TXN${String(transactionCounter++).padStart(6, "0")}`,
        date: dateString,
        type: TransactionType.EXPENSE,
        category: ExpenseCategory.MAINTENANCE_REPAIRS,
        description: maintenance[Math.floor(Math.random() * maintenance.length)],
        amount: Math.floor(Math.random() * 80000) + 20000,
        paymentType: PaymentType.BANK,
        createdAt: new Date(d).toISOString(),
      });
    }

    // Administrative (monthly on 5th)
    if (dayOfMonth === 5) {
      const adminExpenses = [
        { desc: "Office supplies", amount: Math.floor(Math.random() * 20000) + 10000 },
        { desc: "Telephone & internet", amount: Math.floor(Math.random() * 15000) + 8000 },
        { desc: "Insurance premium", amount: Math.floor(Math.random() * 40000) + 30000 },
      ];
      adminExpenses.forEach((exp) => {
        transactions.push({
          id: `TXN${String(transactionCounter++).padStart(6, "0")}`,
          date: dateString,
          type: TransactionType.EXPENSE,
          category: ExpenseCategory.ADMINISTRATIVE,
          description: exp.desc,
          amount: exp.amount,
          paymentType: PaymentType.BANK,
          createdAt: new Date(d).toISOString(),
        });
      });
    }

    // Transport & Handling (2-3 times per week)
    if (d.getDay() === 2 || d.getDay() === 4 || d.getDay() === 6) {
      const transport = [
        "Delivery charges - Made tea",
        "Vehicle fuel",
        "Transportation of green leaf",
        "Logistics charges",
      ];
      transactions.push({
        id: `TXN${String(transactionCounter++).padStart(6, "0")}`,
        date: dateString,
        type: TransactionType.EXPENSE,
        category: ExpenseCategory.TRANSPORT_HANDLING,
        description: transport[Math.floor(Math.random() * transport.length)],
        amount: Math.floor(Math.random() * 40000) + 15000,
        paymentType: Math.random() > 0.6 ? PaymentType.CASH : PaymentType.BANK,
        createdAt: new Date(d).toISOString(),
      });
    }

    // Financial Expenses (monthly on 1st)
    if (dayOfMonth === 1) {
      transactions.push({
        id: `TXN${String(transactionCounter++).padStart(6, "0")}`,
        date: dateString,
        type: TransactionType.EXPENSE,
        category: ExpenseCategory.FINANCIAL,
        description: "Bank charges and loan interest",
        amount: Math.floor(Math.random() * 30000) + 15000,
        paymentType: PaymentType.BANK,
        createdAt: new Date(d).toISOString(),
      });
    }
  }

  return transactions;
};

// Function to load dummy data into localStorage
export const loadDummyData = () => {
  try {
    // Load employees
    localStorage.setItem("galathura_employees", JSON.stringify(dummyEmployees));
    console.log(`✅ Loaded ${dummyEmployees.length} dummy employees`);

    // Load attendance records
    const attendanceRecords = generateDummyAttendance();
    localStorage.setItem("galathura_attendance", JSON.stringify(attendanceRecords));
    console.log(`✅ Loaded ${attendanceRecords.length} dummy attendance records (last 7 days)`);

    // Load transactions
    const transactions = generateDummyTransactions();
    localStorage.setItem("galathura_transactions", JSON.stringify(transactions));
    console.log(`✅ Loaded ${transactions.length} dummy transactions (last 3 months)`);

    // Force reload the page to reflect changes
    window.location.reload();
  } catch (error) {
    console.error("❌ Error loading dummy data:", error);
  }
};

// FlocalStorage.removeItem("galathura_transactions");
   
export const clearAllData = () => {
  if (window.confirm("Are you sure you want to clear all data? This cannot be undone.")) {
    localStorage.removeItem("galathura_employees");
    localStorage.removeItem("galathura_attendance");
    console.log("🗑️ All data cleared");
    window.location.reload();
  }
};
