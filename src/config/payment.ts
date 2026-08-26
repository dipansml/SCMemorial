/**
 * Payment configuration.
 */

export type PaymentMode = 'ONLINE';

export type PaymentEnvironment = 'development' | 'staging' | 'production';

export interface PaymentConfig {
  mode: PaymentMode;
  environment: PaymentEnvironment;
}

export const PAYMENT_CONFIG: PaymentConfig = {
  mode: 'ONLINE',
  environment: 'development',
};
