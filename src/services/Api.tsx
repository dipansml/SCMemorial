import { StudentExamResponse } from '../Model/ExamList/StudentExamResponse';
import { LoginResponse } from '../Model/Login/LoginResponse';
import { StudentListResponse } from '../Model/StudentList/StudentListResponse';
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
};