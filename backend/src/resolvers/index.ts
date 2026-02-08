import { authResolvers } from './auth.js';
import { employeeResolvers } from './employee.js';
import { attendanceResolvers } from './attendance.js';
import { transactionResolvers } from './transaction.js';
import { inventoryResolvers } from './inventory.js';
import { dashboardResolvers } from './dashboard.js';
import { systemResolvers } from './system.js';

export const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...employeeResolvers.Query,
    ...attendanceResolvers.Query,
    ...transactionResolvers.Query,
    ...inventoryResolvers.Query,
    ...dashboardResolvers.Query,
    ...systemResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...employeeResolvers.Mutation,
    ...attendanceResolvers.Mutation,
    ...transactionResolvers.Mutation,
    ...inventoryResolvers.Mutation,
    ...systemResolvers.Mutation,
  },
  Employee: employeeResolvers.Employee,
  AttendanceRecord: attendanceResolvers.AttendanceRecord,
  FirewoodTransaction: inventoryResolvers.FirewoodTransaction,
  PackingMaterialsTransaction: inventoryResolvers.PackingMaterialsTransaction,
  GreenLeafIntake: inventoryResolvers.GreenLeafIntake,
  MadeTeaTransaction: inventoryResolvers.MadeTeaTransaction,
};
