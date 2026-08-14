import type { PaymentState } from './payment.types';

/**
 * Tiny observable store that broadcasts the current payment state.
 * Screens subscribe to disable buttons / show loaders; the UI never needs
 * to know which provider produced the state.
 */
type Listener = (state: PaymentState) => void;

class PaymentStateStore {
  private state: PaymentState = 'IDLE';
  private listeners = new Set<Listener>();

  getState(): PaymentState {
    return this.state;
  }

  setState(state: PaymentState): void {
    if (state === this.state) {
      return;
    }
    this.state = state;
    this.listeners.forEach(listener => {
      try {
        listener(state);
      } catch (error) {
        // A subscriber must never break the payment flow.
        console.warn('PaymentStateStore listener error:', error);
      }
    });
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  reset(): void {
    this.setState('IDLE');
  }
}

export const paymentStateStore = new PaymentStateStore();
