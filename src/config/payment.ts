/**
 * Payment configuration.
 *
 * ============================================================================
 * CURRENTLY RUNNING IN MOCK/TEST MODE.
 * ============================================================================
 *
 * The app is wired to a local, self-contained MOCK CCAvenue payment adapter.
 * NO real CCAvenue request is ever made and NO dummy credential is ever sent
 * to the real CCAvenue gateway.
 *
 * TO SWITCH TO REAL CCAVENUE LATER:
 *   1. Obtain real merchant credentials + backend API from CCAvenue.
 *   2. Change `mode` below to "CCAVENUE".
 *   3. Fill in the real values in `ccavenue` (or better: inject them via a
 *      secure build-time environment / secret manager).
 *   4. Implement the backend order-creation + verification endpoints and
 *      point `ccavenue.endpoints` at them.
 *   5. Plug the official CCAvenue Android/iOS SDK into the native boundaries
 *      (see android/.../payment/CCAvenuePaymentModule.kt and
 *      ios/SCMemorial/CCAvenuePaymentModule.swift).
 *
 * No Checkout/Payment/Result UI changes are required when switching.
 */

export type PaymentMode = 'MOCK' | 'CCAVENUE';

export type PaymentEnvironment = 'development' | 'staging' | 'production';

export interface CCAvenueCredentials {
  /** DUMMY VALUE. Replace with the real merchant id before going live. */
  merchantId: string;
  /** DUMMY VALUE. Replace with the real access code before going live. */
  accessCode: string;
  /** DUMMY VALUE. Replace with the real working key before going live. */
  workingKey: string;
  /** DUMMY VALUE. Replace with the real encryption key before going live. */
  encryptionKey: string;
  /** "SANDBOX" for testing, "PROD" for live. Only meaningful when mode = CCAVENUE. */
  environment: 'SANDBOX' | 'PROD';
}

export interface CCAvenueEndpoints {
  /** TODO(real CCAvenue): backend endpoint that creates a CCAvenue order. */
  orderCreation: string;
  /** TODO(real CCAvenue): backend endpoint that verifies a CCAvenue payment. */
  paymentVerification: string;
  /** TODO(real CCAvenue): backend redirect/callback URL after payment. */
  redirectUrl: string;
  /** TODO(real CCAvenue): backend callback/return URL used by the gateway. */
  callbackUrl: string;
}

export interface PaymentConfig {
  /** Master switch: "MOCK" (current) or "CCAVENUE" (future). */
  mode: PaymentMode;
  environment: PaymentEnvironment;
  /** Convenience flag so code can guard against accidental live calls. */
  isMock: boolean;
  ccavenue: {
    /** Dummy values ONLY. Never sent anywhere while isMock is true. */
    credentials: CCAvenueCredentials;
    endpoints: CCAvenueEndpoints;
  };
  mock: {
    /** Simulated gateway processing delay in ms. */
    processingDelayMs: number;
    /** Simulated gateway timeout in ms. */
    timeoutMs: number;
    /** Set true to simulate a network failure during processing. */
    simulateNetworkFailure: boolean;
    /** Set true to make the (mock) backend verification fail. */
    simulateVerificationFailure: boolean;
    /** Cards that always produce a mocked network error. */
    networkErrorCards: string[];
    /** Card that always produces a mocked gateway timeout. */
    timeoutCards: string[];
  };
}

export const PAYMENT_MODE: PaymentMode = 'MOCK';

export const IS_PAYMENT_MOCK: boolean = PAYMENT_MODE === 'MOCK';

export const PAYMENT_CONFIG: PaymentConfig = {
  mode: PAYMENT_MODE,
  environment: 'development',
  isMock: IS_PAYMENT_MOCK,
  ccavenue: {
    // ========================================================================
    // DUMMY PLACEHOLDER VALUES — these are NOT real CCAvenue credentials.
    // They are never transmitted anywhere. Replace before enabling CCAVENUE.
    // ========================================================================
    credentials: {
      merchantId: 'DUMMY_MERCHANT_ID',
      accessCode: 'DUMMY_ACCESS_CODE',
      workingKey: 'DUMMY_WORKING_KEY',
      encryptionKey: 'DUMMY_ENCRYPTION_KEY',
      environment: 'SANDBOX',
    },
    endpoints: {
      orderCreation: '',
      paymentVerification: '',
      redirectUrl: '',
      callbackUrl: '',
    },
  },
  mock: {
    processingDelayMs: 2000,
    timeoutMs: 15000,
    simulateNetworkFailure: false,
    simulateVerificationFailure: false,
    networkErrorCards: ['4000000000000069'],
    timeoutCards: ['4000000000000127'],
  },
};
