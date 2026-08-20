import { NativeModules } from 'react-native';
import type {
  CCAvenuePaymentRequest,
  CCAvenuePaymentResponse,
} from './CCAvenueTypes';

const CCAvenueNative = NativeModules.CCAvenueModule;

if (__DEV__) {
  console.log('CCAvenueModule:', CCAvenueNative);
}

export class CCAvenueService {
  static async startPayment(
    request: CCAvenuePaymentRequest,
  ): Promise<CCAvenuePaymentResponse> {
    if (!CCAvenueNative) {
      throw new Error(
        'CCAvenue native module is not available. Ensure native module is properly linked.',
      );
    }
    return CCAvenueNative.startPayment({
      orderId: request.orderId,
      amount: request.amount,
      currency: request.currency || 'INR',
      customerName: request.customerName,
      studentCode: request.studentCode || '',
      formNo: request.formNo || '',
      merchantParam1: request.merchantParam1 || '',
      merchantParam2: request.merchantParam2 || '',
      merchantParam3: request.merchantParam3 || request.amount,
      merchantParam4: request.merchantParam4 || request.studentCode || '',
      merchantParam5: request.merchantParam5 || request.customerName,
    });
  }
}
