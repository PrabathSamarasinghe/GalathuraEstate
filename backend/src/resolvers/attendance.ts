import type { Context } from '../index.js';
import type { AttendanceRecord, Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

interface AttendanceFilterInput {
  date?: string;
  dateFrom?: string;
  dateTo?: string;
  department?: string;
  shift?: string;
  status?: string;
  employeeId?: string;
}

interface AttendanceInput {
  employeeId: string;
  date: string;
  shift: string;
  status: string;
  otHours: number;
  remarks?: string;
}

interface BulkAttendanceInput {
  date: string;
  shift: string;
  records: {
    employeeId: string;
    status: string;
    otHours: number;
    remarks?: string;
  }[];
}

async function calculateWage(
  prisma: Context['prisma'],
  employeeId: string,
  status: string,
  otHours: number
): Promise<number> {
  const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
  if (!employee) return 0;

  const rate = Number(employee.rate);
  const otRate = employee.otRate ? Number(employee.otRate) : 0;
  let wage = 0;

  switch (status) {
    case 'Present':
      wage = rate;
      break;
    case 'HalfDay':
      wage = rate / 2;
      break;
    case 'Absent':
    case 'OnLeave':
      wage = 0;
      break;
  }

  // Add OT
  if (otHours > 0 && otRate > 0) {
    wage += otHours * otRate;
  }

  return wage;
}

export const attendanceResolvers = {
  Query: {
    attendanceRecords: async (
      _: unknown,
      { filter, limit = 100, offset = 0 }: { filter?: AttendanceFilterInput; limit?: number; offset?: number },
      { prisma }: Context
    ) => {
      const where: Prisma.AttendanceRecordWhereInput = {};

      if (filter) {
        if (filter.date) {
          where.date = new Date(filter.date);
        }
        if (filter.dateFrom && filter.dateTo) {
          where.date = {
            gte: new Date(filter.dateFrom),
            lte: new Date(filter.dateTo),
          };
        }
        if (filter.shift) where.shift = filter.shift as any;
        if (filter.status) where.status = filter.status as any;
        if (filter.employeeId) where.employeeId = filter.employeeId;
        if (filter.department) {
          where.employee = { department: filter.department as any };
        }
      }

      return prisma.attendanceRecord.findMany({
        where,
        include: { employee: true },
        take: limit,
        skip: offset,
        orderBy: [{ date: 'desc' }, { markedAt: 'desc' }],
      });
    },

    attendanceRecord: async (_: unknown, { id }: { id: string }, { prisma }: Context) => {
      return prisma.attendanceRecord.findUnique({
        where: { id },
        include: { employee: true },
      });
    },

    attendanceSummary: async (
      _: unknown,
      { date }: { date: string },
      { prisma }: Context
    ) => {
      const targetDate = new Date(date);
      
      const records = await prisma.attendanceRecord.findMany({
        where: { date: targetDate },
        include: { employee: true },
      });

      const totalEmployees = await prisma.employee.count({
        where: { status: 'Active' },
      });

      const presentCount = records.filter(r => r.status === 'Present').length;
      const absentCount = records.filter(r => r.status === 'Absent').length;
      const halfDayCount = records.filter(r => r.status === 'HalfDay').length;
      const onLeaveCount = records.filter(r => r.status === 'OnLeave').length;
      const otCount = records.filter(r => Number(r.otHours) > 0).length;
      
      const totalManDays = presentCount + (halfDayCount * 0.5);
      const totalOTHours = records.reduce((sum, r) => sum + Number(r.otHours), 0);
      const totalWages = records.reduce((sum, r) => sum + Number(r.calculatedWage), 0);

      return {
        totalEmployees,
        presentCount,
        absentCount,
        halfDayCount,
        onLeaveCount,
        otCount,
        totalManDays,
        totalOTHours,
        totalWages,
      };
    },
  },

  Mutation: {
    createAttendanceRecord: async (
      _: unknown,
      { input }: { input: AttendanceInput },
      { prisma, user }: Context
    ) => {
      const calculatedWage = await calculateWage(
        prisma,
        input.employeeId,
        input.status,
        input.otHours
      );

      const record = await prisma.attendanceRecord.create({
        data: {
          employeeId: input.employeeId,
          date: new Date(input.date),
          shift: input.shift as any,
          status: input.status as any,
          otHours: input.otHours,
          calculatedWage,
          remarks: input.remarks,
          markedById: user?.id,
        },
        include: { employee: true },
      });

      return record;
    },

    createBulkAttendance: async (
      _: unknown,
      { input }: { input: BulkAttendanceInput },
      { prisma, user }: Context
    ) => {
      const results: AttendanceRecord[] = [];
      const targetDate = new Date(input.date);

      for (const record of input.records) {
        const calculatedWage = await calculateWage(
          prisma,
          record.employeeId,
          record.status,
          record.otHours
        );

        // Upsert to handle duplicates
        const attendance = await prisma.attendanceRecord.upsert({
          where: {
            employeeId_date_shift: {
              employeeId: record.employeeId,
              date: targetDate,
              shift: input.shift as any,
            },
          },
          update: {
            status: record.status as any,
            otHours: record.otHours,
            calculatedWage,
            remarks: record.remarks,
            lastEditedById: user?.id,
            lastEditedAt: new Date(),
          },
          create: {
            employeeId: record.employeeId,
            date: targetDate,
            shift: input.shift as any,
            status: record.status as any,
            otHours: record.otHours,
            calculatedWage,
            remarks: record.remarks,
            markedById: user?.id,
          },
          include: { employee: true },
        });

        results.push(attendance);
      }

      // Log activity
      await prisma.activityLog.create({
        data: {
          activityType: 'BULK_ATTENDANCE',
          description: `Bulk attendance marked for ${results.length} employees on ${input.date}`,
          userId: user?.id,
          entityType: 'attendance',
          entityId: input.date,
        },
      });

      return results;
    },

    updateAttendanceRecord: async (
      _: unknown,
      { id, input }: { id: string; input: AttendanceInput },
      { prisma, user }: Context
    ) => {
      const calculatedWage = await calculateWage(
        prisma,
        input.employeeId,
        input.status,
        input.otHours
      );

      return prisma.attendanceRecord.update({
        where: { id },
        data: {
          shift: input.shift as any,
          status: input.status as any,
          otHours: input.otHours,
          calculatedWage,
          remarks: input.remarks,
          lastEditedById: user?.id,
          lastEditedAt: new Date(),
        },
        include: { employee: true },
      });
    },

    deleteAttendanceRecord: async (
      _: unknown,
      { id }: { id: string },
      { prisma }: Context
    ) => {
      await prisma.attendanceRecord.delete({ where: { id } });
      return true;
    },
  },

  AttendanceRecord: {
    employee: async (parent: AttendanceRecord, _: unknown, { prisma }: Context) => {
      return prisma.employee.findUnique({ where: { id: parent.employeeId } });
    },
  },
};
