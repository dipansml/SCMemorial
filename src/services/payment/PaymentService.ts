import { PAYMENT_CONFIG } from '../../config/payment';
import type { PaymentProvider } from './PaymentProvider';
import { mockCCAvenueProvider } from './MockCCAvenueProvider';
import { realCCAvenueProvider } from './RealCCAvenueProvider';
import { paymentStateStore } from './PaymentStateStore';
import { MockOrderService } from './MockOrderService';
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
 *
 * CheckoutScreen → PaymentService → PaymentProvider (MOCK or CCAVENUE).
 *
 * The UI never knows whether the underlying provider is the MockCCAvenue
 * adapter or the real CCAvenue adapter. Swapping providers is a one-line
 * configuration change (PAYMENT_CONFIG.mode) with zero UI changes.
 */
class PaymentService {
  private provider: PaymentProvider;
  private processing = false;
  private lastOrder: PaymentOrder | null = null;

  constructor() {
    this.provider =
      PAYMENT_CONFIG.mode === 'CCAVENUE'
        ? realCCAvenueProvider
        : mockCCAvenueProvider;
  }

  /** Currently active provider (useful for diagnostics only). */
  getActiveProvider(): PaymentProvider {
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
        // Network / timeout / interruption land the user on a FAILED result
        // so they can retry — never leak internal details.
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
        await MockOrderService.updateOrderStatus(order.orderId, 'CANCELLED');
        return result;
      }

      if (result.status === 'failed') {
        this.setState('PAYMENT_FAILED');
        await MockOrderService.updateOrderStatus(order.orderId, 'FAILED');
        return result;
      }

      // 4. Verify a successful payment against the (mock) backend.
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
        await MockOrderService.updateOrderStatus(order.orderId, 'FAILED');
        return result;
      }

      this.setState('PAYMENT_VERIFIED');
      result = { ...result, verificationStatus: 'verified' };
      await MockOrderService.updateOrderStatus(order.orderId, 'PAID');
      this.setState('PAYMENT_SUCCESS');
      return result;
    } finally {
      this.processing = false;
    }
  }

  /** Cancel the in-flight payment session (mock screen cancel/back). */
  async cancelPayment(): Promise<void> {
    await this.provider.cancelPayment();
  }

  /** Reset the state store (e.g. when the user leaves the payment flow). */
  reset(): void {
    paymentStateStore.reset();
  }
}

export const paymentService = new PaymentService();
