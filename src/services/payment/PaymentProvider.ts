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
 * PaymentService talks only to an object implementing this interface.
 * The UI never changes regardless of the underlying provider.
 */
export interface PaymentProvider {
  /** Provider display name. */
  readonly name: string;
  /** Which mode this adapter implements. */
  readonly mode: PaymentMode;

  /** Create an order before starting payment. */
  createOrder(request: PaymentRequest): Promise<PaymentOrder>;

  /** Start the actual payment session. */
  startPayment(request: PaymentRequest): Promise<PaymentResult>;

  /** Verify a completed payment (idempotency + fraud check). */
  verifyPayment(
    orderId: string,
    transactionId?: string,
    amount?: string,
  ): Promise<PaymentVerificationResult>;

  /** Cancel an in-flight payment session. */
  cancelPayment(): Promise<void>;
}
