import { NativeModules, Alert } from 'react-native';
import { Api } from '../Api';
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

  static async postAbortedResponseToPhp(
    response: CCAvenuePaymentResponse,
  ): Promise<void> {
    try {
      const payload = {
        orderId: response.orderId,
        trackingId: response.trackingId,
        bankRefNo: response.bankRefNo,
        orderStatus: response.orderStatus,
        failureMessage: response.failureMessage,
        paymentMode: response.paymentMode,
        statusMessage: response.statusMessage,
        currency: response.currency,
        amount: response.amount,
        billingName: response.billingName,
        cardName: response.cardName,
        statusCode: response.statusCode,
        responseCode: response.responseCode,
        merchantParam1: response.merchantParam1,
        merchantParam2: response.merchantParam2,
        merchantParam3: response.merchantParam3,
        merchantParam4: response.merchantParam4,
        merchantParam5: response.merchantParam5,
      };

      console.log('===== CCAVENUE RESPONSE =====');
      console.log('orderId     = ', payload.orderId);
      console.log('amount      = ', payload.amount);
      console.log('orderStatus = ', payload.orderStatus);
      console.log('trackingId  = ', payload.trackingId);
      console.log('merchantParam1 = ', payload.merchantParam1);
      console.log('merchantParam2 = ', payload.merchantParam2);
      console.log('merchantParam3 = ', payload.merchantParam3);
      console.log('merchantParam4 = ', payload.merchantParam4);
      console.log('merchantParam5 = ', payload.merchantParam5);
      console.log('=============================');

      const phpResponse = await Api.sendCcavenueResponse(payload);
      const phpBody = phpResponse?.data ?? phpResponse;

      console.log('===== PHP RESPONSE =====');
      console.log(phpBody);
      console.log('=======================');

      const alertMessage =
        typeof phpBody === 'string'
          ? phpBody
          : JSON.stringify(phpBody, null, 2);

      Alert.alert('Alert For Test', alertMessage);
    } catch (error: any) {
      Alert.alert(
        'Alert For Test',
        `PHP response API failed: ${error?.message || 'Unknown error'}`,
      );
    }
  }
}
