import type {
  PaymentVerificationResult,
  PaymentVerificationOutcome,
} from './payment.types';
import { PAYMENT_CONFIG } from '../../config/payment';

/**
 * TEMPORARY payment verification service used only in MOCK mode.
 *
 * It simulates the backend payment-verification endpoint: the "backend"
 * records successful transactions as they are issued, and this service
 * looks them up. A transaction that was never recorded (or was recorded as
 * failed) cannot be verified as paid.
 *
 * When the real backend exists, replace this class with
 * BackendPaymentVerificationService (a thin Api.ts call) — the provider and
 * UI do not change.
 */
type Record = {
  transactionId: string;
  orderId: string;
  amount: string;
  currency: string;
  outcome: PaymentVerificationOutcome;
};

export class MockPaymentVerificationService {
  private static ledger = new Map<string, Record>();

  /** Called by the mock provider when a payment "completes". */
  static record(record: Record): void {
    MockPaymentVerificationService.ledger.set(record.transactionId, record);
  }

  /**
   * Simulated backend verification.
   * Returns VERIFIED only if the transaction was recorded as paid.
   */
  static async verifyPayment(
    orderId: string,
    transactionId?: string,
    amount?: string,
  ): Promise<PaymentVerificationResult> {
    // Simulate a network round-trip.
    console.log('[MOCK PAYMENT] Starting verification');
    await new Promise<void>(resolve => setTimeout(() => resolve(), 700));

    if (PAYMENT_CONFIG.mock.simulateVerificationFailure) {
      return {
        status: 'failed',
        orderId,
        transactionId,
        message: 'Verification failed (simulated backend outage)',
      };
    }

    if (!transactionId) {
      return {
        status: 'failed',
        orderId,
        message: 'Missing transaction id',
      };
    }

    const record = MockPaymentVerificationService.ledger.get(transactionId);

    if (!record) {
      return {
        status: 'failed',
        orderId,
        transactionId,
        message: 'Transaction not found on backend',
      };
    }

    if (amount !== undefined && record.amount !== amount) {
      return {
        status: 'failed',
        orderId,
        transactionId,
        message: 'Amount mismatch detected',
      };
    }

    const outcome = record.outcome;
    console.log('[MOCK PAYMENT] Verification complete:', outcome);
    return {
      status: outcome,
      orderId,
      transactionId,
      amount: record.amount,
      currency: record.currency,
      message:
        outcome === 'verified'
          ? 'Payment verified successfully'
          : 'Payment was not verified',
    };
  }

  /** Test helper: clears all recorded transactions. */
  static reset(): void {
    MockPaymentVerificationService.ledger.clear();
  }
}
