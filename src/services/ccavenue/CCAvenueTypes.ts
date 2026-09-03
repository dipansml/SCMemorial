export interface CCAvenuePaymentRequest {
  orderId: string;
  amount: string;
  currency: string;
  customerName: string;
  studentCode?: string;
  formNo?: string;
  merchantParam1?: string;
  merchantParam2?: string;
  merchantParam3?: string;
  merchantParam4?: string;
  merchantParam5?: string;
}

export interface CCAvenueMerchantMeta {
  customerName?: string;
  studentCode?: string;
  formNo?: string;
  payeeUserId?: string;
  sessionYearId?: string;
  selId?: string;
  loginUserId?: string;
}

export interface CCAvenuePaymentResponse {
  orderId: string;
  trackingId: string;
  bankRefNo: string;
  orderStatus: string;
  paymentMode: string;
  amount: string;
  currency: string;
  billingName: string;
  responseCode: string;
  statusMessage: string;
  failureMessage: string;
  merchantParam1: string;
  merchantParam2: string;
  merchantParam3: string;
  merchantParam4: string;
  merchantParam5: string;
  cardName: string;
  statusCode: string;
}
