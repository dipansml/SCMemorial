
export interface ForgotPasswordResponse {
  status: number;
  message: string;
  data: ForgotPasswordData;
}

export interface ForgotPasswordData {
  code: string;
  email: string;
}