import { useMutation, useQuery } from '@apollo/client';
import {
  GET_ATTENDANCE_RECORDS,
  GET_ATTENDANCE_SUMMARY,
  CREATE_ATTENDANCE,
  CREATE_BULK_ATTENDANCE,
  UPDATE_ATTENDANCE,
  DELETE_ATTENDANCE,
} from '../graphql/queries';
import { Shift, AttendanceStatus } from '../utils/enums';
import type { Employee } from './useEmployees';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employee?: Employee;
  date: string;
  shift: Shift;
  status: AttendanceStatus;
  otHours: number;
  calculatedWage: number;
  remarks?: string;
  markedAt: string;
}

export interface AttendanceSummary {
  totalEmployees: number;
  presentCount: number;
  absentCount: number;
  halfDayCount: number;
  onLeaveCount: number;
  otCount: number;
  totalManDays: number;
  totalOTHours: number;
  totalWages: number;
}

interface AttendanceFilterInput {
  employeeId?: string;
  date?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: AttendanceStatus;
}

interface AttendanceInput {
  employeeId: string;
  date: string;
  shift?: Shift;
  status: AttendanceStatus;
  otHours?: number;
  remarks?: string;
}

interface BulkAttendanceInput {
  date: string;
  shift: Shift;
  records: {
    employeeId: string;
    status: AttendanceStatus;
    otHours?: number;
    remarks?: string;
  }[];
}

interface GetAttendanceRecordsResponse {
  attendanceRecords: AttendanceRecord[];
}

interface GetAttendanceSummaryResponse {
  attendanceSummary: AttendanceSummary;
}

export const useAttendanceRecords = (
  filter?: AttendanceFilterInput,
  limit?: number,
  offset?: number
) => {
  const { data, loading, error, refetch } = useQuery<GetAttendanceRecordsResponse>(
    GET_ATTENDANCE_RECORDS,
    {
      variables: { filter, limit, offset },
      fetchPolicy: 'cache-and-network',
    }
  );

  return {
    records: data?.attendanceRecords || [],
    loading,
    error,
    refetch,
  };
};

export const useAttendanceSummary = (date: string) => {
  const { data, loading, error, refetch } = useQuery<GetAttendanceSummaryResponse>(
    GET_ATTENDANCE_SUMMARY,
    {
      variables: { date },
      skip: !date,
      fetchPolicy: 'cache-and-network',
    }
  );

  return {
    summary: data?.attendanceSummary || null,
    loading,
    error,
    refetch,
  };
};

export const useCreateAttendance = () => {
  const [createMutation, { loading, error }] = useMutation(CREATE_ATTENDANCE, {
    refetchQueries: [GET_ATTENDANCE_RECORDS, GET_ATTENDANCE_SUMMARY],
  });

  const createAttendance = async (input: AttendanceInput) => {
    const { data } = await createMutation({ variables: { input } });
    return data?.createAttendanceRecord;
  };

  return { createAttendance, loading, error };
};

export const useCreateBulkAttendance = () => {
  const [createMutation, { loading, error }] = useMutation(CREATE_BULK_ATTENDANCE, {
    refetchQueries: [GET_ATTENDANCE_RECORDS, GET_ATTENDANCE_SUMMARY],
  });

  const createBulkAttendance = async (input: BulkAttendanceInput) => {
    const { data } = await createMutation({ variables: { input } });
    return data?.createBulkAttendance;
  };

  return { createBulkAttendance, loading, error };
};

export const useUpdateAttendance = () => {
  const [updateMutation, { loading, error }] = useMutation(UPDATE_ATTENDANCE, {
    refetchQueries: [GET_ATTENDANCE_RECORDS, GET_ATTENDANCE_SUMMARY],
  });

  const updateAttendance = async (id: string, input: AttendanceInput) => {
    const { data } = await updateMutation({ variables: { id, input } });
    return data?.updateAttendanceRecord;
  };

  return { updateAttendance, loading, error };
};

export const useDeleteAttendance = () => {
  const [deleteMutation, { loading, error }] = useMutation(DELETE_ATTENDANCE, {
    refetchQueries: [GET_ATTENDANCE_RECORDS, GET_ATTENDANCE_SUMMARY],
  });

  const deleteAttendance = async (id: string) => {
    const { data } = await deleteMutation({ variables: { id } });
    return data?.deleteAttendanceRecord;
  };

  return { deleteAttendance, loading, error };
};
