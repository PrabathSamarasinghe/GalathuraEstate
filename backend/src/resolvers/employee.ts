import type { Context } from '../index.js';
import type { Employee, Prisma } from '@prisma/client';

interface EmployeeFilterInput {
  department?: string;
  employmentType?: string;
  status?: string;
  searchTerm?: string;
}

interface EmployeeInput {
  fullName: string;
  nicNumber: string;
  contactNumber: string;
  address?: string;
  department: string;
  designation: string;
  employmentType: string;
  joinDate: string;
  status: string;
  payType: string;
  rate: number;
  otRate?: number;
}

export const employeeResolvers = {
  Query: {
    employees: async (
      _: unknown,
      { filter, limit = 100, offset = 0 }: { filter?: EmployeeFilterInput; limit?: number; offset?: number },
      { prisma }: Context
    ) => {
      const where: Prisma.EmployeeWhereInput = {};

      if (filter) {
        if (filter.department) where.department = filter.department as any;
        if (filter.employmentType) where.employmentType = filter.employmentType as any;
        if (filter.status) where.status = filter.status as any;
        if (filter.searchTerm) {
          where.OR = [
            { fullName: { contains: filter.searchTerm } },
            { nicNumber: { contains: filter.searchTerm } },
            { id: { contains: filter.searchTerm } },
          ];
        }
      }

      return prisma.employee.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      });
    },

    employee: async (_: unknown, { id }: { id: string }, { prisma }: Context) => {
      return prisma.employee.findUnique({ where: { id } });
    },

    employeeCount: async (
      _: unknown,
      { filter }: { filter?: EmployeeFilterInput },
      { prisma }: Context
    ) => {
      const where: Prisma.EmployeeWhereInput = {};

      if (filter) {
        if (filter.department) where.department = filter.department as any;
        if (filter.employmentType) where.employmentType = filter.employmentType as any;
        if (filter.status) where.status = filter.status as any;
      }

      return prisma.employee.count({ where });
    },

    nextEmployeeId: async (_: unknown, __: unknown, { prisma }: Context) => {
      const year = new Date().getFullYear().toString().slice(-2);
      const lastEmployee = await prisma.employee.findFirst({
        where: { id: { startsWith: `EMP${year}` } },
        orderBy: { id: 'desc' },
      });

      if (lastEmployee) {
        const lastNum = parseInt(lastEmployee.id.slice(5));
        return `EMP${year}${String(lastNum + 1).padStart(4, '0')}`;
      }

      return `EMP${year}0001`;
    },
  },

  Mutation: {
    createEmployee: async (
      _: unknown,
      { input }: { input: EmployeeInput },
      { prisma, user }: Context
    ) => {
      // Generate employee ID
      const year = new Date().getFullYear().toString().slice(-2);
      const lastEmployee = await prisma.employee.findFirst({
        where: { id: { startsWith: `EMP${year}` } },
        orderBy: { id: 'desc' },
      });

      let newId = `EMP${year}0001`;
      if (lastEmployee) {
        const lastNum = parseInt(lastEmployee.id.slice(5));
        newId = `EMP${year}${String(lastNum + 1).padStart(4, '0')}`;
      }

      const employee = await prisma.employee.create({
        data: {
          id: newId,
          fullName: input.fullName,
          nicNumber: input.nicNumber,
          contactNumber: input.contactNumber,
          address: input.address,
          department: input.department as any,
          designation: input.designation as any,
          employmentType: input.employmentType as any,
          joinDate: new Date(input.joinDate),
          status: input.status as any,
          payType: input.payType as any,
          rate: input.rate,
          otRate: input.otRate,
          createdById: user?.id,
        },
      });

      // Log activity
      await prisma.activityLog.create({
        data: {
          activityType: 'EMPLOYEE_CREATED',
          description: `Employee ${employee.fullName} (${employee.id}) created`,
          userId: user?.id,
          entityType: 'employee',
          entityId: employee.id,
        },
      });

      return employee;
    },

    updateEmployee: async (
      _: unknown,
      { id, input }: { id: string; input: EmployeeInput },
      { prisma, user }: Context
    ) => {
      const employee = await prisma.employee.update({
        where: { id },
        data: {
          fullName: input.fullName,
          nicNumber: input.nicNumber,
          contactNumber: input.contactNumber,
          address: input.address,
          department: input.department as any,
          designation: input.designation as any,
          employmentType: input.employmentType as any,
          joinDate: new Date(input.joinDate),
          status: input.status as any,
          payType: input.payType as any,
          rate: input.rate,
          otRate: input.otRate,
          updatedById: user?.id,
        },
      });

      return employee;
    },

    deleteEmployee: async (
      _: unknown,
      { id }: { id: string },
      { prisma, user }: Context
    ) => {
      await prisma.employee.delete({ where: { id } });

      await prisma.activityLog.create({
        data: {
          activityType: 'EMPLOYEE_DELETED',
          description: `Employee ${id} deleted`,
          userId: user?.id,
          entityType: 'employee',
          entityId: id,
        },
      });

      return true;
    },
  },

  Employee: {
    attendanceRecords: async (parent: Employee, _: unknown, { prisma }: Context) => {
      return prisma.attendanceRecord.findMany({
        where: { employeeId: parent.id },
        orderBy: { date: 'desc' },
        take: 30,
      });
    },
  },
};
