import { paymentService } from './PaymentService';
import type { PaymentRequest, PaymentResult, PaymentState } from './payment.types';

/**
 * Public CCAvenue payment API used by screens.
 *
 * The UI calls ONLY this facade (or PaymentService directly). Whether the
 * underlying adapter is the MOCK simulation or the real CCAvenue provider is
 * decided by PAYMENT_CONFIG.mode — the UI never changes.
 *
 *   await CCAvenuePayment.startPayment({
 *     orderId,
 *     amount,
 *     currency,
 *     billingName,
 *     billingEmail,
 *     billingPhone,
 *   });
 */
export const CCAvenuePayment = {
  startPayment(request: PaymentRequest): Promise<PaymentResult> {
    return paymentService.startPayment(request);
  },

  cancelPayment(): Promise<void> {
    return paymentService.cancelPayment();
  },

  getState(): PaymentState {
    return paymentService.getState();
  },

  isProcessing(): boolean {
    return paymentService.isProcessing();
  },

  subscribe(listener: (state: PaymentState) => void): () => void {
    return paymentService.subscribe(listener);
  },

  reset(): void {
    paymentService.reset();
  },
};
