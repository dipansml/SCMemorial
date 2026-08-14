import type { PaymentMode } from '../../config/payment';

/**
 * Payment state machine exposed to the UI.
 * The UI only reacts to these states; it never cares whether the
 * underlying provider is MOCK or real CCAvenue.
 */
export type PaymentState =
  | 'IDLE'
  | 'CREATING_ORDER'
  | 'PAYMENT_INITIATED'
  | 'PAYMENT_PROCESSING'
  | 'PAYMENT_SUCCESS'
  | 'PAYMENT_FAILED'
  | 'PAYMENT_CANCELLED'
  | 'PAYMENT_VERIFICATION_PENDING'
  | 'PAYMENT_VERIFIED'
  | 'PAYMENT_VERIFICATION_FAILED';

export type PaymentOutcome = 'success' | 'failed' | 'cancelled';

export type PaymentVerificationOutcome = 'verified' | 'failed' | 'pending';

/** Order status kept by the (mock) order service. */
export type OrderStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';

/** A payment initiated from the checkout/UI. */
export interface PaymentRequest {
  /** Optional order id. If omitted, the provider creates the order. */
  orderId?: string;
  /** Amount as decimal string, e.g. "999.00". */
  amount: string;
  /** ISO currency code, e.g. "INR". */
  currency: string;
  billingName?: string;
  billingEmail?: string;
  billingPhone?: string;
  /** Human-readable description shown on the payment screen. */
  description?: string;
  /** Free-form metadata (kept local, not sent to a server). */
  meta?: Record<string, string>;
}

/** Order record produced before payment starts. */
export interface PaymentOrder {
  orderId: string;
  amount: string;
  currency: string;
  status: OrderStatus;
  createdAt: string;
  mode: PaymentMode;
  meta?: Record<string, string>;
}

/**
 * Normalized payment result returned to the UI.
 * Identical shape whether the payment was MOCK or real CCAvenue.
 */
export interface PaymentResult {
  /** success | failed | cancelled */
  status: PaymentOutcome;
  orderId: string;
  /** Present for success/failed, absent for cancelled. */
  transactionId?: string;
  amount: string;
  currency: string;
  message: string;
  provider: string;
  mode: PaymentMode;
  /** Verification outcome once the (mock) backend check runs. */
  verificationStatus?: PaymentVerificationOutcome;
  /** ISO timestamp of completion. */
  paidAt?: string;
}

/** Result of verifying a payment against the (mock) backend. */
export interface PaymentVerificationResult {
  status: PaymentVerificationOutcome;
  orderId: string;
  transactionId?: string;
  amount?: string;
  currency?: string;
  message: string;
}

/** Structured, user-safe payment error. Internal details never shown. */
export interface PaymentErrorInfo {
  code:
    | 'DUPLICATE_PAYMENT'
    | 'DUPLICATE_ORDER'
    | 'NETWORK_ERROR'
    | 'TIMEOUT'
    | 'INTERRUPTED'
    | 'PROVIDER_NOT_CONFIGURED'
    | 'UNKNOWN';
  /** Short stable identifier. */
  message: string;
  /** Friendly message safe to show to the user. */
  userMessage: string;
  /** Optional internal detail — never render in the UI. */
  technicalDetail?: string;
}

export class PaymentError extends Error {
  code: PaymentErrorInfo['code'];
  userMessage: string;
  technicalDetail?: string;

  constructor(info: PaymentErrorInfo) {
    super(info.message);
    this.name = 'PaymentError';
    this.code = info.code;
    this.userMessage = info.userMessage;
    this.technicalDetail = info.technicalDetail;
  }
}

/** Defensive: guard any raw throwable into a PaymentError. */
export function toPaymentError(error: unknown): PaymentError {
  if (error instanceof PaymentError) {
    return error;
  }
  const raw = error instanceof Error ? error.message : String(error);
  return new PaymentError({
    code: 'UNKNOWN',
    message: 'Unexpected payment error',
    userMessage: 'Payment could not be completed. Please try again.',
    technicalDetail: raw,
  });
}
