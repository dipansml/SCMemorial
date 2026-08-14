import type { PaymentOrder, OrderStatus } from './payment.types';
import { PAYMENT_CONFIG } from '../../config/payment';

/**
 * TEMPORARY order service used only while PAYMENT_MODE === "MOCK".
 *
 * It mimics what a real backend order-creation endpoint will do later:
 * generate a unique order id, lock in the amount/currency and return a
 * PENDING order. Each call returns a fresh, unique order id.
 *
 * When real CCAvenue + backend are available, replace this with the real
 * order-creation API call (see RealCCAvenueProvider.createOrder). The UI
 * does not reference this file.
 */
export class MockOrderService {
  private static counter = 0;
  private static createdOrderIds = new Set<string>();

  private static dateStamp(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}${m}${day}`;
  }

  private static pad(n: number, width: number): string {
    return String(n).padStart(width, '0');
  }

  /**
   * Generates a unique order id like "MOCK-ORDER-20260814-0001".
   * Never repeats within an app session.
   */
  private static nextOrderId(): string {
    MockOrderService.counter += 1;
    const seq = MockOrderService.pad(MockOrderService.counter, 4);
    return `MOCK-ORDER-${MockOrderService.dateStamp()}-${seq}`;
  }

  static async createOrder(params: {
    amount: string;
    currency: string;
    meta?: Record<string, string>;
  }): Promise<PaymentOrder> {
    // Simulate a short round-trip to an order API.
    await new Promise<void>(resolve => setTimeout(() => resolve(), 500));

    const orderId = MockOrderService.nextOrderId();
    MockOrderService.createdOrderIds.add(orderId);

    const order: PaymentOrder = {
      orderId,
      amount: params.amount,
      currency: params.currency,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      mode: PAYMENT_CONFIG.mode,
      meta: params.meta,
    };

    return order;
  }

  static async updateOrderStatus(
    _orderId: string,
    _status: OrderStatus,
  ): Promise<void> {
    // Simulate a backend status update. Later this becomes a real API call.
    await new Promise<void>(resolve => setTimeout(() => resolve(), 300));
    // Intentionally a no-op registry update: the mock keeps order status
    // implicitly tied to the payment result returned to the UI.
  }

  static hasOrderBeenCreated(orderId: string): boolean {
    return MockOrderService.createdOrderIds.has(orderId);
  }
}
