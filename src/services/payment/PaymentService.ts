import type { PaymentProvider } from './PaymentProvider';
import { paymentStateStore } from './PaymentStateStore';
import {
  PaymentError,
  toPaymentError,
} from './payment.types';
import type {
  PaymentOrder,
  PaymentRequest,
  PaymentResult,
  PaymentState,
  PaymentVerificationResult,
} from './payment.types';

/**
 * PaymentService — the ONLY payment entry point used by the UI.
 */
class PaymentService {
  private provider: PaymentProvider | null = null;
  private processing = false;
  private lastOrder: PaymentOrder | null = null;

  /** Register a payment provider at runtime. */
  setProvider(provider: PaymentProvider): void {
    this.provider = provider;
  }

  /** Currently active provider (useful for diagnostics only). */
  getActiveProvider(): PaymentProvider | null {
    return this.provider;
  }

  isProcessing(): boolean {
    return this.processing;
  }

  getState(): PaymentState {
    return paymentStateStore.getState();
  }

  subscribe(listener: (state: PaymentState) => void): () => void {
    return paymentStateStore.subscribe(listener);
  }

  private setState(state: PaymentState): void {
    paymentStateStore.setState(state);
  }

  /**
   * Full checkout-to-result flow.
   * Returns a normalized PaymentResult for success / failed / cancelled.
   * Throws only for programming errors (e.g. duplicate invocation).
   */
  async startPayment(request: PaymentRequest): Promise<PaymentResult> {
    if (this.processing) {
      throw new PaymentError({
        code: 'DUPLICATE_PAYMENT',
        message: 'Payment already in progress',
        userMessage: 'A payment is already being processed. Please wait.',
      });
    }

    if (!this.provider) {
      throw new PaymentError({
        code: 'PROVIDER_NOT_CONFIGURED',
        message: 'No payment provider is configured',
        userMessage: 'Online payment is not available right now. Please try again later.',
      });
    }

    this.processing = true;
    this.lastOrder = null;

    try {
      // 1. Create the order.
      this.setState('CREATING_ORDER');
      const order = await this.provider.createOrder(request);
      this.lastOrder = order;

      const paymentRequest: PaymentRequest = {
        ...request,
        orderId: order.orderId,
      };

      // 2. Start the payment session.
      this.setState('PAYMENT_INITIATED');
      let result: PaymentResult;
      try {
        result = await this.provider.startPayment(paymentRequest);
      } catch (error) {
        const paymentError = toPaymentError(error);
        result = {
          status: 'failed',
          orderId: order.orderId,
          amount: order.amount,
          currency: order.currency,
          message: paymentError.userMessage,
          provider: this.provider.name,
          mode: this.provider.mode,
          verificationStatus: 'failed',
        };
      }

      this.setState('PAYMENT_PROCESSING');

      // 3. Non-terminal outcome bookkeeping.
      if (result.status === 'cancelled') {
        this.setState('PAYMENT_CANCELLED');
        return result;
      }

      if (result.status === 'failed') {
        this.setState('PAYMENT_FAILED');
        return result;
      }

      // 4. Verify a successful payment.
      this.setState('PAYMENT_VERIFICATION_PENDING');
      let verification: PaymentVerificationResult;
      try {
        verification = await this.provider.verifyPayment(
          order.orderId,
          result.transactionId,
          result.amount,
        );
      } catch {
        verification = {
          status: 'failed',
          orderId: order.orderId,
          transactionId: result.transactionId,
          message: 'Verification could not be completed',
        };
      }

      if (verification.status !== 'verified') {
        this.setState('PAYMENT_VERIFICATION_FAILED');
        result = {
          ...result,
          status: 'failed',
          verificationStatus: 'failed',
          message: 'Payment could not be verified. Please try again.',
        };
        return result;
      }

      this.setState('PAYMENT_VERIFIED');
      result = { ...result, verificationStatus: 'verified' };
      this.setState('PAYMENT_SUCCESS');
      return result;
    } finally {
      this.processing = false;
    }
  }

  /** Cancel the in-flight payment session. */
  async cancelPayment(): Promise<void> {
    if (this.provider) {
      await this.provider.cancelPayment();
    }
  }

  /** Reset the state store (e.g. when the user leaves the payment flow). */
  reset(): void {
    paymentStateStore.reset();
  }
}

export const paymentService = new PaymentService();
