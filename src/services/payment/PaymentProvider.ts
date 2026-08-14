import type { PaymentMode } from '../../config/payment';
import type {
  PaymentOrder,
  PaymentRequest,
  PaymentResult,
  PaymentVerificationResult,
} from './payment.types';

/**
 * Contract every payment gateway adapter must implement.
 *
 * The CheckoutScreen talks only to PaymentService (see PaymentService.ts).
 * PaymentService talks only to an object implementing this interface.
 * Today that object is MockCCAvenueProvider; later it will be
 * RealCCAvenueProvider — the UI never changes.
 */
export interface PaymentProvider {
  /** Provider display name, e.g. "CCAvenue". */
  readonly name: string;
  /** Which mode this adapter implements. */
  readonly mode: PaymentMode;

  /**
   * Create an order before starting payment.
   * Real flow: backend order creation API.
   * Mock flow: local MockOrderService.
   */
  createOrder(request: PaymentRequest): Promise<PaymentOrder>;

  /**
   * Start the actual payment session.
   * Mock flow: opens the "CCAvenue Test Payment" screen and resolves when the
   * user picks SUCCESS / FAILED / CANCELLED.
   * Real flow: launches the official CCAvenue SDK/webview.
   */
  startPayment(request: PaymentRequest): Promise<PaymentResult>;

  /**
   * Verify a completed payment (idempotency + fraud check).
   * Real flow: backend verification API against CCAvenue.
   * Mock flow: local MockPaymentVerificationService.
   */
  verifyPayment(
    orderId: string,
    transactionId?: string,
    amount?: string,
  ): Promise<PaymentVerificationResult>;

  /**
   * Cancel an in-flight payment session.
   * Mock flow: resolves the pending test screen as CANCELLED.
   * Real flow: closes the CCAvenue session if possible.
   */
  cancelPayment(): Promise<void>;
}
