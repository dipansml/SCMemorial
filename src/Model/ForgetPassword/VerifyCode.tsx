export class VerifyCodeData {
  email: string;
  user_id: string;

  constructor(data: any) {
    this.email = data?.email ?? '';
    this.user_id = data?.user_id ?? '';
  }
}

export class VerifyCodeResponse {
  status: number;
  message: string;
  data: VerifyCodeData;

  constructor(data: any) {
    this.status = data?.status ?? 0;
    this.message = data?.message ?? '';
    this.data = new VerifyCodeData(data?.data);
  }
}