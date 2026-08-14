import { AppState } from 'react-native';
import { navigationRef } from '../../navigation/navigationRef';
import { PAYMENT_CONFIG } from '../../config/payment';
import { paymentStateStore } from './PaymentStateStore';
import type { PaymentProvider } from './PaymentProvider';
import {
  PaymentError,
} from './payment.types';
import type {
  PaymentOrder,
  PaymentRequest,
  PaymentResult,
  PaymentVerificationResult,
} from './payment.types';
import { MockOrderService } from './MockOrderService';
import { MockPaymentVerificationService } from './MockPaymentVerificationService';

/**
 * MOCK CCAvenue payment adapter.
 *
 * ============================================================================
 * THIS IS A LOCAL SIMULATION ONLY.
 * ============================================================================
 * - It never contacts CCAvenue or any server.
 * - The "CCAvenue Test Payment" screen this adapter opens is a UI simulation.
 * - Card data entered on that screen is interpreted locally, is NOT stored,
 *   is NOT logged and is NEVER sent anywhere.
 * - These are mock/dummy test values, NOT official CCAvenue test cards.
 *
 * It behaves like a real gateway from the app's perspective:
 *   1. creates an order, 2. opens a payment surface, 3. simulates processing,
 *   4. returns a normalized PaymentResult (success/failed/cancelled),
 *   5. records the outcome so verification can succeed/fail.
 */

/** Mock local test cards (NOT official CCAvenue test cards). */
export const MOCK_TEST_CARDS = {
  SUCCESS: '4111111111111111',
  FAILED: '4000000000000002',
} as const;

export interface MockCardInput {
  cardNumber: string;
  cardHolderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

type PendingSession = {
  request: PaymentRequest;
  resolve: (result: PaymentResult) => void;
  reject: (error: PaymentError) => void;
  resolved: boolean;
  processingStartedAt: number;
  interrupted: boolean;
  timeoutHandle: ReturnType<typeof setTimeout> | null;
  appStateSub: any;
  cleanup: () => void;
};

let currentSession: PendingSession | null = null;
let txnCounter = 0;

function generateTransactionId(outcome: 'success' | 'failed'): string {
  txnCounter += 1;
  const stamp = Date.now().toString();
  const seq = String(txnCounter).padStart(4, '0');
  return `MOCKTXN-${outcome.toUpperCase()}-${stamp}-${seq}`;
}

function luhnCheck(digits: string): boolean {
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number(digits[i]);
    if (double) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    double = !double;
  }
  return sum % 10 === 0;
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function resolveSession(result: PaymentResult): void {
  if (!currentSession || currentSession.resolved) {
    return;
  }
  currentSession.resolved = true;
  currentSession.cleanup();
  const resolve = currentSession.resolve;
  currentSession = null;
  resolve(result);
}

function rejectSession(error: PaymentError): void {
  if (!currentSession || currentSession.resolved) {
    return;
  }
  currentSession.resolved = true;
  currentSession.cleanup();
  const reject = currentSession.reject;
  currentSession = null;
  reject(error);
}

/** Normalized mock result builder. */
function buildResult(
  status: PaymentResult['status'],
  request: PaymentRequest,
  transactionId?: string,
  message?: string,
): PaymentResult {
  return {
    status,
    orderId: request.orderId || '',
    transactionId,
    amount: request.amount,
    currency: request.currency,
    message:
      message ||
      (status === 'success'
        ? 'Payment successful'
        : status === 'failed'
        ? 'Payment failed'
        : 'Payment cancelled by user'),
    provider: 'CCAvenue',
    mode: 'MOCK',
    verificationStatus:
      status === 'success' ? 'verified' : status === 'failed' ? 'failed' : undefined,
    paidAt: status === 'success' ? new Date().toISOString() : undefined,
  };
}

function ensureSession(): PendingSession {
  if (!currentSession) {
    throw new PaymentError({
      code: 'UNKNOWN',
      message: 'No active payment session',
      userMessage: 'Payment session expired. Please try again.',
    });
  }
  return currentSession;
}

export class MockCCAvenueProvider implements PaymentProvider {
  readonly name = 'CCAvenue';
  readonly mode = 'MOCK' as const;

  async createOrder(request: PaymentRequest): Promise<PaymentOrder> {
    if (request.orderId && MockOrderService.hasOrderBeenCreated(request.orderId)) {
      throw new PaymentError({
        code: 'DUPLICATE_ORDER',
        message: 'Order already exists',
        userMessage: 'This order has already been created.',
      });
    }
    return MockOrderService.createOrder({
      amount: request.amount,
      currency: request.currency,
      meta: request.meta,
    });
  }

  startPayment(request: PaymentRequest): Promise<PaymentResult> {
    if (currentSession) {
      return Promise.reject(
        new PaymentError({
          code: 'DUPLICATE_PAYMENT',
          message: 'A payment is already in progress',
          userMessage: 'A payment is already being processed.',
        }),
      );
    }

    return new Promise<PaymentResult>((resolve, reject) => {
      const session: PendingSession = {
        request,
        resolve,
        reject,
        resolved: false,
        processingStartedAt: 0,
        interrupted: false,
        timeoutHandle: null,
        appStateSub: null,
        cleanup: () => {
          if (session.appStateSub) {
            session.appStateSub.remove();
            session.appStateSub = null;
          }
          if (session.timeoutHandle) {
            clearTimeout(session.timeoutHandle);
            session.timeoutHandle = null;
          }
        },
      };
      currentSession = session;

      if (!navigationRef.isReady()) {
        rejectSession(
          new PaymentError({
            code: 'UNKNOWN',
            message: 'Navigation not ready',
            userMessage: 'Payment could not be started.',
          }),
        );
        return;
      }

      console.log('[MOCK PAYMENT] Opening CCAvenue Test Payment screen');
      navigationRef.navigate('MockCCAvenuePayment', {
        orderId: request.orderId || '',
        amount: request.amount,
        currency: request.currency,
        billingName: request.billingName,
        billingEmail: request.billingEmail,
        billingPhone: request.billingPhone,
        description: request.description,
      });
    });
  }

  /**
   * Called by the "CCAvenue Test Payment" screen when the user taps PAY NOW.
   * Card data is interpreted LOCALLY and never leaves the device.
   */
  submitMockPayment(card: MockCardInput): Promise<PaymentResult> {
    const session = ensureSession();
    const digits = card.cardNumber.replace(/\s+/g, '');

    // Local test-card mapping (mock values, not official CCAvenue test cards).
    const isFailed = digits === MOCK_TEST_CARDS.FAILED;

    if (!luhnCheck(digits)) {
      throw new PaymentError({
        code: 'UNKNOWN',
        message: 'Invalid card number',
        userMessage: 'Please enter a valid card number.',
      });
    }

    if (PAYMENT_CONFIG.mock.simulateNetworkFailure) {
      return this.failWith(
        session,
        'NETWORK_ERROR',
        'Payment could not be completed. Please check your connection.',
      );
    }

    if (PAYMENT_CONFIG.mock.networkErrorCards.includes(digits)) {
      return this.failWith(
        session,
        'NETWORK_ERROR',
        'Payment could not be completed. Please check your connection.',
      );
    }

    if (PAYMENT_CONFIG.mock.timeoutCards.includes(digits)) {
      return this.failWith(
        session,
        'TIMEOUT',
        'Payment timed out. Please try again.',
      );
    }

    console.log('[MOCK PAYMENT] Starting payment');
    session.processingStartedAt = Date.now();

    // The gateway timeout and the background-interruption guard are created
    // HERE — only when the user actually presses PAY. They must NEVER start
    // when the payment screen opens or while the user fills in the form.
    console.log('[MOCK PAYMENT] Starting timeout');
    session.timeoutHandle = setTimeout(() => {
      if (!session.resolved) {
        rejectSession(
          new PaymentError({
            code: 'TIMEOUT',
            message: 'Payment timed out',
            userMessage: 'Payment timed out. Please try again.',
          }),
        );
      }
    }, PAYMENT_CONFIG.mock.timeoutMs);

    session.appStateSub = AppState.addEventListener('change', nextState => {
      if (!session.resolved) {
        if (nextState === 'background') {
          session.interrupted = true;
        } else if (nextState === 'active' && session.interrupted) {
          rejectSession(
            new PaymentError({
              code: 'INTERRUPTED',
              message: 'Payment interrupted',
              userMessage:
                'Payment was interrupted while the app was in the background. Please try again.',
            }),
          );
        }
      }
    });

    paymentStateStore.setState('PAYMENT_PROCESSING');

    if (isFailed) {
      console.log('[MOCK PAYMENT] Payment result: FAILED');
      return this.completeWith(session, 'failed');
    }

    // Everything else that passes Luhn behaves like a successful payment.
    console.log('[MOCK PAYMENT] Payment result: SUCCESS');
    return this.completeWith(session, 'success');
  }

  private async completeWith(
    session: PendingSession,
    outcome: 'success' | 'failed',
  ): Promise<PaymentResult> {
    try {
      await delay(PAYMENT_CONFIG.mock.processingDelayMs);

      if (session.resolved) {
        return buildResult(
          outcome === 'success' ? 'success' : 'failed',
          session.request,
        );
      }

      const transactionId = generateTransactionId(outcome);
      const result = buildResult(
        outcome === 'success' ? 'success' : 'failed',
        session.request,
        transactionId,
      );

      // Record the outcome so verification can succeed/fail like a backend.
      MockPaymentVerificationService.record({
        transactionId,
        orderId: session.request.orderId || '',
        amount: session.request.amount,
        currency: session.request.currency,
        outcome: outcome === 'success' ? 'verified' : 'failed',
      });

      console.log('[MOCK PAYMENT] Mock gateway processing finished:', outcome);
      resolveSession(result);
      return result;
    } catch {
      return this.failWith(
        session,
        'UNKNOWN',
        'Payment could not be completed. Please try again.',
      );
    }
  }

  private async failWith(
    session: PendingSession,
    code: 'NETWORK_ERROR' | 'TIMEOUT' | 'UNKNOWN',
    userMessage: string,
  ): Promise<PaymentResult> {
    await delay(600);
    rejectSession(
      new PaymentError({
        code,
        message: userMessage,
        userMessage,
      }),
    );
    // The returned value is never observed (the promise already rejected),
    // but the type contract requires a PaymentResult.
    return buildResult('failed', session.request);
  }

  verifyPayment(
    orderId: string,
    transactionId?: string,
    amount?: string,
  ): Promise<PaymentVerificationResult> {
    return MockPaymentVerificationService.verifyPayment(
      orderId,
      transactionId,
      amount,
    );
  }

  /** Cancel button / back navigation on the test screen. */
  cancelMockPayment(): void {
    const session = ensureSession();
    const result = buildResult('cancelled', session.request);
    resolveSession(result);
  }

  async cancelPayment(): Promise<void> {
    if (currentSession) {
      this.cancelMockPayment();
    }
  }
}

export const mockCCAvenueProvider = new MockCCAvenueProvider();
