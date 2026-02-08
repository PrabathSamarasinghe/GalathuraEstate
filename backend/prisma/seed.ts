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
