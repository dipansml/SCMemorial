export class PaymentInitiateResponse {
  status: number;
  message: string;
  data: PaymentData;

  constructor(
    status: number,
    message: string,
    data: PaymentData,
  ) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}

export class PaymentData {
  student_code: string;
  finalPayAmt: string;
  first_name: string;
  form_no: string;
  redirect_url: string;
  cancel_url: string;
  currency: string;
  language: string;
  amount: string;
  merchant_id: string;
  order_id: string;
  merchant_param1: string;
  merchant_param2: string;
  merchant_param3: string;
  merchant_param4: string;
  merchant_param5: string;

  constructor(data: any) {
    this.student_code = data.student_code ?? '';
    this.finalPayAmt = data.finalPayAmt ?? '';
    this.first_name = data.first_name ?? '';
    this.form_no = data.form_no ?? '';
    this.redirect_url = data.redirect_url ?? '';
    this.cancel_url = data.cancel_url ?? '';
    this.currency = data.currency ?? '';
    this.language = data.language ?? '';
    this.amount = data.amount ?? '';
    this.merchant_id = data.merchant_id ?? '';
    this.order_id = data.order_id ?? '';
    this.merchant_param1 = data.merchant_param1 ?? '';
    this.merchant_param2 = data.merchant_param2 ?? '';
    this.merchant_param3 = data.merchant_param3 ?? '';
    this.merchant_param4 = data.merchant_param4 ?? '';
    this.merchant_param5 = data.merchant_param5 ?? '';
  }
}