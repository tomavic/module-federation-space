import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

export interface Order {
  id: number;
  symbol: string;
  quantity: number;
  price: number;
  placedAt: number;
}

export interface PortfolioState {
  watchlist: string[];
  orders: Order[];
}

export const initialState: PortfolioState = {
  watchlist: ['AAPL', 'NVDA'],
  orders: [],
};

/**
 * Cross-app state: the shell adds symbols to the watchlist, the watchlist remote
 * places orders, the orders remote lists them. One instance serves all three because
 * `@space/shared` is a shared singleton in every federation config.
 */
export const PortfolioStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ watchlist, orders }) => ({
    watchCount: computed(() => watchlist().length),
    orderCount: computed(() => orders().length),
    invested: computed(() =>
      orders().reduce((sum, order) => sum + order.price * order.quantity, 0),
    ),
  })),
  withMethods((store) => ({
    toggleWatch(symbol: string): void {
      patchState(store, ({ watchlist }) => ({
        watchlist: watchlist.includes(symbol)
          ? watchlist.filter((s) => s !== symbol)
          : [...watchlist, symbol],
      }));
    },
    buy(symbol: string, price: number, quantity = 1): void {
      patchState(store, ({ orders }) => ({
        orders: [
          {
            id: (orders[0]?.id ?? 0) + 1,
            symbol,
            quantity,
            price,
            placedAt: Date.now(),
          },
          ...orders,
        ],
      }));
    },
    reset(): void {
      patchState(store, initialState);
    },
  })),
);
