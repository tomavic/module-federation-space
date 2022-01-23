import { TestBed } from '@angular/core/testing';
import { initialState, PortfolioStore } from './portfolio.store';

describe('PortfolioStore', () => {
  const setup = () => TestBed.inject(PortfolioStore);

  it('starts with two watched symbols and no orders', () => {
    const store = setup();
    expect(store.watchlist()).toEqual(['AAPL', 'NVDA']);
    expect(store.orderCount()).toBe(0);
  });

  it('toggles a symbol on and off the watchlist', () => {
    const store = setup();
    store.toggleWatch('TSLA');
    expect(store.watchlist()).toEqual(['AAPL', 'NVDA', 'TSLA']);
    store.toggleWatch('AAPL');
    expect(store.watchlist()).toEqual(['NVDA', 'TSLA']);
    expect(store.watchCount()).toBe(2);
  });

  it('puts the newest order first and sums what was invested', () => {
    const store = setup();
    store.buy('AAPL', 200);
    store.buy('MSFT', 500, 2);

    expect(store.orders().map((o) => [o.id, o.symbol])).toEqual([
      [2, 'MSFT'],
      [1, 'AAPL'],
    ]);
    expect(store.invested()).toBe(1200);
  });

  it('resets to the initial state', () => {
    const store = setup();
    store.buy('AAPL', 200);
    store.toggleWatch('AAPL');
    store.reset();
    expect({ watchlist: store.watchlist(), orders: store.orders() }).toEqual(
      initialState,
    );
  });
});
