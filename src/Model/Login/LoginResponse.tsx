import { LoginData } from './LoginData';

export interface LoginResponse {
  status: number;
  message: string;
  data: LoginData;
}