import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@galathura.lk' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@galathura.lk',
      passwordHash: hashedPassword,
      fullName: 'System Administrator',
      role: 'admin',
      isActive: true,
    },
  });
  console.log('✅ Created admin user:', admin.email);

  // Create system settings
  const settings = [
    { key: 'firewood_low_stock_threshold', value: '500', description: 'Low stock alert threshold for firewood (kg)' },
    { key: 'packing_materials_low_stock_threshold', value: '1000', description: 'Low stock alert threshold for packing materials' },
    { key: 'green_leaf_avg_conversion_ratio', value: '22', description: 'Average conversion ratio for green leaf to made tea (%)' },
    { key: 'currency', value: 'LKR', description: 'Currency code' },
    { key: 'company_name', value: 'Galathura Estate', description: 'Company name' },
  ];

  for (const setting of settings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log('✅ Created system settings');

  // Initialize Made Tea Stock for each grade
  const grades = ['OP1', 'OPA', 'BOP1', 'PEK', 'PEK1', 'FBOP', 'FBOPF1', 'BOPA', 'BOPFSP', 'BOPFEXSP', 'BM', 'BP', 'BOP1A', 'BT', 'DUST1', 'DUST'] as const;
  for (const grade of grades) {
    await prisma.madeTeaStock.upsert({
      where: { grade },
      update: {},
      create: { grade, quantity: 0 },
    });
  }
  console.log('✅ Initialized made tea stock grades');

  // Create sample employees
  const employees = [
    {
      id: 'EMP260001',
      fullName: 'Kamal Perera',
      nicNumber: '852341567V',
      contactNumber: '0771234567',
      address: '123, Galle Road, Matara',
      department: 'Withering' as const,
      designation: 'Supervisor' as const,
      employmentType: 'Permanent' as const,
      joinDate: new Date('2020-01-15'),
      status: 'Active' as const,
      payType: 'MonthlySalary' as const,
      rate: 45000,
      otRate: 500,
    },
    {
      id: 'EMP260002',
      fullName: 'Nimal Silva',
      nicNumber: '902341567V',
      contactNumber: '0772345678',
      address: '45, Temple Road, Galle',
      department: 'Rolling' as const,
      designation: 'MachineOperator' as const,
      employmentType: 'Permanent' as const,
      joinDate: new Date('2019-03-20'),
      status: 'Active' as const,
      payType: 'DailyWage' as const,
      rate: 2500,
      otRate: 350,
    },
    {
      id: 'EMP260003',
      fullName: 'Sunil Fernando',
      nicNumber: '881234567V',
      contactNumber: '0773456789',
      address: '78, Station Road, Ambalangoda',
      department: 'Dryer' as const,
      designation: 'MachineOperator' as const,
      employmentType: 'Permanent' as const,
      joinDate: new Date('2018-06-10'),
      status: 'Active' as const,
      payType: 'DailyWage' as const,
      rate: 2600,
      otRate: 380,
    },
    {
      id: 'EMP260004',
      fullName: 'Kumari Jayasinghe',
      nicNumber: '956789012V',
      contactNumber: '0774567890',
      address: '12, Hill Street, Hikkaduwa',
      department: 'Packing' as const,
      designation: 'Helper' as const,
      employmentType: 'Casual' as const,
      joinDate: new Date('2021-09-01'),
      status: 'Active' as const,
      payType: 'DailyWage' as const,
      rate: 1800,
      otRate: 250,
    },
    {
      id: 'EMP260005',
      fullName: 'Saman Rathnayake',
      nicNumber: '872345678V',
      contactNumber: '0775678901',
      address: '34, Beach Road, Bentota',
      department: 'Boiler' as const,
      designation: 'MachineOperator' as const,
      employmentType: 'Permanent' as const,
      joinDate: new Date('2017-11-25'),
      status: 'Active' as const,
      payType: 'DailyWage' as const,
      rate: 2800,
      otRate: 400,
    },
  ];

  for (const emp of employees) {
    await prisma.employee.upsert({
      where: { id: emp.id },
      update: {},
      create: emp,
    });
  }
  console.log(`✅ Created ${employees.length} sample employees`);

  // Generate sample transactions for P&L
  const today = new Date();
  const threeMonthsAgo = new Date(today);
  threeMonthsAgo.setMonth(today.getMonth() - 3);

  let transactionCounter = 1;
  const transactions = [];

  for (let d = new Date(threeMonthsAgo); d <= today; d.setDate(d.getDate() + 1)) {
    const dateOnly = new Date(d);
    dateOnly.setHours(0, 0, 0, 0);
    const dayOfMonth = d.getDate();
    const dayOfWeek = d.getDay();

    // Made Tea Sales (Mon, Wed, Fri)
    if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) {
      transactions.push({
        id: `TXN${String(transactionCounter++).padStart(6, '0')}`,
        date: dateOnly,
        type: 'Income' as const,
        category: 'Made Tea Sales',
        description: `Made tea sales - Batch ${Math.floor(Math.random() * 100) + 1}`,
        amount: Math.floor(Math.random() * 200000) + 800000,
        paymentType: Math.random() > 0.3 ? 'Bank' as const : 'Credit' as const,
        referenceNo: `INV-${dateOnly.toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(Math.random() * 999) + 1}`,
      });
    }

    // Green Leaf Cost (daily)
    if (Math.random() > 0.2) {
      transactions.push({
        id: `TXN${String(transactionCounter++).padStart(6, '0')}`,
        date: dateOnly,
        type: 'Expense' as const,
        category: 'Green Leaf Cost',
        description: `Green leaf purchase - ${Math.floor(Math.random() * 500) + 200} kg`,
        amount: Math.floor(Math.random() * 150000) + 50000,
        paymentType: Math.random() > 0.5 ? 'Cash' as const : 'Bank' as const,
      });
    }

    // Labor Cost (Friday payroll)
    if (dayOfWeek === 5) {
      transactions.push({
        id: `TXN${String(transactionCounter++).padStart(6, '0')}`,
        date: dateOnly,
        type: 'Expense' as const,
        category: 'Labor Cost',
        description: `Weekly payroll - Week ${Math.ceil(dayOfMonth / 7)}`,
        amount: Math.floor(Math.random() * 100000) + 200000,
        paymentType: 'Bank' as const,
        referenceNo: `PAY-${dateOnly.toISOString().split('T')[0].replace(/-/g, '')}`,
      });
    }

    // Fuel & Power
    if (Math.random() > 0.6) {
      const fuelTypes = ['Diesel for generator', 'Electricity bill payment', 'Firewood purchase', 'Coal purchase'];
      transactions.push({
        id: `TXN${String(transactionCounter++).padStart(6, '0')}`,
        date: dateOnly,
        type: 'Expense' as const,
        category: 'Fuel & Power',
        description: fuelTypes[Math.floor(Math.random() * fuelTypes.length)],
        amount: Math.floor(Math.random() * 80000) + 20000,
        paymentType: Math.random() > 0.7 ? 'Cash' as const : 'Bank' as const,
      });
    }

    // Packing Materials (Tuesday)
    if (dayOfWeek === 2) {
      transactions.push({
        id: `TXN${String(transactionCounter++).padStart(6, '0')}`,
        date: dateOnly,
        type: 'Expense' as const,
        category: 'Packing Materials',
        description: 'Packing materials purchase',
        amount: Math.floor(Math.random() * 60000) + 30000,
        paymentType: 'Bank' as const,
      });
    }

    // Transport (Tue, Thu, Sat)
    if (dayOfWeek === 2 || dayOfWeek === 4 || dayOfWeek === 6) {
      transactions.push({
        id: `TXN${String(transactionCounter++).padStart(6, '0')}`,
        date: dateOnly,
        type: 'Expense' as const,
        category: 'Transport & Handling',
        description: 'Delivery and transport charges',
        amount: Math.floor(Math.random() * 40000) + 15000,
        paymentType: Math.random() > 0.6 ? 'Cash' as const : 'Bank' as const,
      });
    }

    // Administrative (5th of month)
    if (dayOfMonth === 5) {
      transactions.push({
        id: `TXN${String(transactionCounter++).padStart(6, '0')}`,
        date: dateOnly,
        type: 'Expense' as const,
        category: 'Administrative Expenses',
        description: 'Office supplies and utilities',
        amount: Math.floor(Math.random() * 30000) + 20000,
        paymentType: 'Bank' as const,
      });
    }

    // Financial (1st of month)
    if (dayOfMonth === 1) {
      transactions.push({
        id: `TXN${String(transactionCounter++).padStart(6, '0')}`,
        date: dateOnly,
        type: 'Expense' as const,
        category: 'Financial Expenses',
        description: 'Bank charges and loan interest',
        amount: Math.floor(Math.random() * 30000) + 15000,
        paymentType: 'Bank' as const,
      });
    }
  }

  // Insert transactions in batches
  await prisma.transaction.createMany({
    data: transactions,
    skipDuplicates: true,
  });
  console.log(`✅ Created ${transactions.length} sample transactions`);

  // Create activity log entries
  await prisma.activityLog.createMany({
    data: [
      { activityType: 'SYSTEM', description: 'System initialized', entityType: 'system', entityId: 'init' },
      { activityType: 'USER', description: 'Admin user created', userId: admin.id, entityType: 'user', entityId: admin.id },
    ],
  });
  console.log('✅ Created activity log entries');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
