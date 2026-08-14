import type { PaymentProvider } from './PaymentProvider';
import { PaymentError } from './payment.types';
import type {
  PaymentOrder,
  PaymentRequest,
  PaymentResult,
  PaymentVerificationResult,
} from './payment.types';

/**
 * Real CCAvenue payment adapter — INTENTIONALLY NOT IMPLEMENTED YET.
 *
 * The app currently runs in MOCK mode (PAYMENT_CONFIG.mode === "MOCK"), so
 * this class is never selected. It exists so the architecture already has a
 * clearly marked seam where the official CCAvenue integration will live.
 *
 * Nothing here invents CCAvenue endpoints, SDK classes, encryption
 * algorithms or callback URLs. Each TODO below marks the exact insertion
 * point for the future implementation.
 *
 * The React Native UI (CheckoutScreen / PaymentResultScreen) will NOT change
 * when this provider is enabled — it only talks to PaymentService.
 */
export class RealCCAvenueProvider implements PaymentProvider {
  readonly name = 'CCAvenue';
  readonly mode = 'CCAVENUE' as const;

  private notConfigured(): PaymentError {
    return new PaymentError({
      code: 'PROVIDER_NOT_CONFIGURED',
      message: 'Real CCAvenue is not configured',
      userMessage:
        'Online payment is not available right now. Please try again later.',
    });
  }

  async createOrder(_request: PaymentRequest): Promise<PaymentOrder> {
    // TODO(real CCAvenue):
    // 1. Read merchant credentials from PAYMENT_CONFIG.ccavenue.credentials
    //    (merchantId / accessCode / workingKey / encryptionKey) — injected
    //    securely, never hardcoded in the app.
    // 2. POST to the backend order-creation endpoint
    //    (PAYMENT_CONFIG.ccavenue.endpoints.orderCreation) with the amount
    //    and customer details.
    // 3. The backend returns the CCAvenue order/request parameters that the
    //    SDK/webview needs to start the session.
    throw this.notConfigured();
  }

  async startPayment(_request: PaymentRequest): Promise<PaymentResult> {
    // TODO(real CCAvenue):
    // 1. Launch the official CCAvenue payment surface (Android SDK,
    //    iOS SDK/webview) with the order parameters returned by createOrder.
    // 2. Wait for the gateway's success/failure/cancel callback.
    // 3. Map the gateway response into the normalized PaymentResult shape
    //    defined in payment.types.ts (status/orderId/transactionId/...).
    throw this.notConfigured();
  }

  async verifyPayment(
    _orderId: string,
    _transactionId?: string,
    _amount?: string,
  ): Promise<PaymentVerificationResult> {
    // TODO(real CCAvenue):
    // 1. Call the backend payment-verification endpoint
    //    (PAYMENT_CONFIG.ccavenue.endpoints.paymentVerification) with the
    //    orderId + transactionId.
    // 2. The backend validates the transaction against CCAvenue and returns
    //    VERIFIED / FAILED / PENDING.
    throw this.notConfigured();
  }

  async cancelPayment(): Promise<void> {
    // TODO(real CCAvenue): if the SDK/webview supports aborting an
    // in-flight session, close it here. Otherwise no-op.
    throw this.notConfigured();
  }
}

export const realCCAvenueProvider = new RealCCAvenueProvider();
