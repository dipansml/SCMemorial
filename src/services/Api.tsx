import { DashboardResponse } from '../Model/Dashboard/DashboardResponse';
import { EventResponse } from '../Model/EventList/EventResponse';
import { FeeAmountForSelectedMonthResponse } from '../Model/FeeAmountForSelectedMonth/FeeAmountForSelectedMonthResponse';
import { StudentExamResponse } from '../Model/ExamList/StudentExamResponse';
import { FeeStructureResponse } from '../Model/FeesStructure/FeeStructureResponse';
import { StudentHomeworkResponse } from '../Model/Homework/StudentHomeworkResponse';
import { LoginResponse } from '../Model/Login/LoginResponse';
import { PaymentHistoryResponse } from '../Model/PaymentHistory/PaymentHistoryResponse';
import { StudentAttendanceResponse } from '../Model/StudentAttendance/StudentAttendanceResponse';
import { StudentLibraryResponse } from '../Model/StudentLibrary/StudentLibraryResponse';
import { StudentListResponse } from '../Model/StudentList/StudentListResponse';
import { ViewFeeStructureResponse } from '../Model/ViewFeeStructure/ViewFeeStructureResponse';
import { RestApi } from './RestApi';

// Request
export interface LoginPayload {
  username: string;
  password: string;
  role: String;
}

export interface ExamListPayload {
  user_id: string;
}

export interface FeesStructurePayload {
  user_id: string;
}

export interface PaymentHistoryPayload {
  user_id: string;
}

export interface EventListPayload {
  user_id: string;
}

export interface StudentLibraryPayload {
  user_id: string;
}

export interface StudentHomeworkPayload {
  user_id: string;
}

export interface DashboardPayload {
  user_id: string;
}

export interface StudentAttendancePayload {
  user_id: string;
  month_date: string,
}

export interface FeeAmountForSelectedMonthPayload {
  user_id: string;
  ids: number[];
}


// API
export const Api = {
  studentLogin: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await RestApi.post('/login', payload);
    return response.data;
  },

   getStudentList: async (): Promise<StudentListResponse> => {
    const response = await RestApi.post('/student-list');
    return response.data;
  },

   getStudentExamList: async (payload: ExamListPayload): Promise<StudentExamResponse> => {
    const response = await RestApi.post('/student-exam-date', payload);
    return response.data;
  },

  getStudentFeesStructure: async (payload: FeesStructurePayload): Promise<FeeStructureResponse> => {
    const response = await RestApi.post('/student-fee-structure', payload);
    return response.data;
  },

  getStudentPaymentHistory: async (payload: PaymentHistoryPayload): Promise<PaymentHistoryResponse> => {
    const response = await RestApi.post('/student-payment-history', payload);
    return response.data;
  },

  getEventList: async (payload: EventListPayload): Promise<EventResponse> => {
    const response = await RestApi.post('/student-events', payload);
    return response.data;
  },

  getStudentLibrary: async (payload: StudentLibraryPayload): Promise<StudentLibraryResponse> => {
    const response = await RestApi.post('/student-library', payload);
    return response.data;
  },

   getStudentHomework: async (payload: StudentHomeworkPayload): Promise<StudentHomeworkResponse> => {
    const response = await RestApi.post('/student-homework', payload);
    return response.data;
  },

  getDashboard: async (payload: DashboardPayload): Promise<DashboardResponse> => {
    const response = await RestApi.post('/student-dashboard', payload);
    return response.data;
  },

  getStudentAttendance: async (payload: StudentAttendancePayload): Promise<StudentAttendanceResponse> => {
    const response = await RestApi.post('/student-attendance', payload);
    return response.data;
  },

  getViewFeeStructure: async (payload: FeesStructurePayload): Promise<ViewFeeStructureResponse> => {
    const response = await RestApi.post('/view-fee-structure', payload);
    return response.data;
  },

  getFeeAmountForSelectedMonth: async (payload: FeeAmountForSelectedMonthPayload): Promise<FeeAmountForSelectedMonthResponse> => {
    const response = await RestApi.post('/fee-amount-for-selected-month', payload);
    return response.data;
  },
};