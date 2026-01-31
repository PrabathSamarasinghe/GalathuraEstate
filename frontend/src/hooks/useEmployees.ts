import { useMutation, useQuery } from '@apollo/client';
import {
  GET_EMPLOYEES,
  GET_EMPLOYEE,
  GET_NEXT_EMPLOYEE_ID,
  CREATE_EMPLOYEE,
  UPDATE_EMPLOYEE,
  DELETE_EMPLOYEE,
} from '../graphql/queries';
import { Department, Designation, EmploymentType, PayType, EmployeeStatus } from '../utils/enums';

export interface Employee {
  id: string;
  fullName: string;
  nicNumber: string;
  contactNumber?: string;
  address?: string;
  department: Department;
  designation: Designation;
  employmentType: EmploymentType;
  joinDate: string;
  status: EmployeeStatus;
  payType: PayType;
  rate: number;
  otRate?: number;
  createdAt: string;
}

interface EmployeeFilterInput {
  department?: Department;
  status?: EmployeeStatus;
  searchTerm?: string;
}

interface GetEmployeesResponse {
  employees: Employee[];
  employeeCount: number;
}

interface GetEmployeeResponse {
  employee: Employee;
}

interface NextEmployeeIdResponse {
  nextEmployeeId: string;
}

export const useEmployees = (filter?: EmployeeFilterInput, limit?: number, offset?: number) => {
  const { data, loading, error, refetch } = useQuery<GetEmployeesResponse>(GET_EMPLOYEES, {
    variables: { filter, limit, offset },
    fetchPolicy: 'cache-and-network',
  });

  return {
    employees: data?.employees || [],
    totalCount: data?.employeeCount || 0,
    loading,
    error,
    refetch,
  };
};

export const useEmployee = (id: string) => {
  const { data, loading, error, refetch } = useQuery<GetEmployeeResponse>(GET_EMPLOYEE, {
    variables: { id },
    skip: !id,
    fetchPolicy: 'cache-and-network',
  });

  return {
    employee: data?.employee || null,
    loading,
    error,
    refetch,
  };
};

export const useNextEmployeeId = () => {
  const { data, loading, refetch } = useQuery<NextEmployeeIdResponse>(GET_NEXT_EMPLOYEE_ID, {
    fetchPolicy: 'network-only',
  });

  return {
    nextId: data?.nextEmployeeId || 'EMP0001',
    loading,
    refetch,
  };
};

export const useCreateEmployee = () => {
  const [createMutation, { loading, error }] = useMutation(CREATE_EMPLOYEE, {
    refetchQueries: [GET_EMPLOYEES],
  });

  const createEmployee = async (input: Omit<Employee, 'id' | 'createdAt'>) => {
    const { data } = await createMutation({ variables: { input } });
    return data?.createEmployee;
  };

  return { createEmployee, loading, error };
};

export const useUpdateEmployee = () => {
  const [updateMutation, { loading, error }] = useMutation(UPDATE_EMPLOYEE, {
    refetchQueries: [GET_EMPLOYEES],
  });

  const updateEmployee = async (id: string, input: Partial<Employee>) => {
    const { data } = await updateMutation({ variables: { id, input } });
    return data?.updateEmployee;
  };

  return { updateEmployee, loading, error };
};

export const useDeleteEmployee = () => {
  const [deleteMutation, { loading, error }] = useMutation(DELETE_EMPLOYEE, {
    refetchQueries: [GET_EMPLOYEES],
  });

  const deleteEmployee = async (id: string) => {
    const { data } = await deleteMutation({ variables: { id } });
    return data?.deleteEmployee;
  };

  return { deleteEmployee, loading, error };
};
