import { PaymentHistoryData } from './PaymentHistoryData';

export interface PaymentHistoryResponse {
  status: number;
  message: string;
  data: PaymentHistoryData;
}