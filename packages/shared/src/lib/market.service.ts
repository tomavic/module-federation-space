import {
  computed,
  DestroyRef,
  inject,
  Injectable,
  signal,
} from '@angular/core';

export interface Quote {
  symbol: string;
  name: string;
  price: number;
  /** Change since the session opened, in currency and in percent. */
  change: number;
  changePercent: number;
}

const OPENING: readonly Pick<Quote, 'symbol' | 'name' | 'price'>[] = [
  { symbol: 'AAPL', name: 'Apple', price: 228.4 },
  { symbol: 'MSFT', name: 'Microsoft', price: 512.1 },
  { symbol: 'NVDA', name: 'NVIDIA', price: 141.7 },
  { symbol: 'SONY', name: 'Sony', price: 24.9 },
  { symbol: 'TSLA', name: 'Tesla', price: 318.2 },
];

const round = (value: number) => Math.round(value * 100) / 100;

/**
 * A simulated price feed: every 1.5 seconds each price moves by up to ±1%.
 * It is provided in root and its library is shared as a singleton, so the shell
 * and every remote read the same ticking prices.
 */
@Injectable({ providedIn: 'root' })
export class MarketService {
  readonly quotes = signal<Quote[]>(
    OPENING.map((quote) => ({ ...quote, change: 0, changePercent: 0 })),
  );
  readonly bySymbol = computed(
    () => new Map(this.quotes().map((quote) => [quote.symbol, quote])),
  );

  constructor() {
    const timer = setInterval(() => this.tick(), 1500);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }

  /** Moves every price one step. `random` returns 0..1, like `Math.random`. */
  tick(random: () => number = Math.random): void {
    this.quotes.update((quotes) =>
      quotes.map((quote, i) => {
        const opening = OPENING[i].price;
        const price = round(quote.price * (1 + (random() - 0.5) / 50));
        const change = round(price - opening);
        return {
          ...quote,
          price,
          change,
          changePercent: round((change / opening) * 100),
        };
      }),
    );
  }
}
