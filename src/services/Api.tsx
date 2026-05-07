import { LoginResponse } from '../Model/Login/LoginResponse';
import { StudentListResponse } from '../Model/StudentList/StudentListResponse';
import { RestApi } from './RestApi';

// Request
export interface LoginPayload {
  username: string;
  password: string;
  role: String;
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
};