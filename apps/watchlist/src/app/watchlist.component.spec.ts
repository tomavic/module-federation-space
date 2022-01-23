import { TestBed } from '@angular/core/testing';
import { PortfolioStore } from '@space/shared';
import { WatchlistComponent } from './watchlist.component';

describe('WatchlistComponent', () => {
  async function setup() {
    const fixture = TestBed.createComponent(WatchlistComponent);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    return { fixture, root, store: TestBed.inject(PortfolioStore) };
  }

  it('shows the watched stocks and places an order at the current price', async () => {
    const { root, store } = await setup();
    expect(root.querySelectorAll('tbody tr')).toHaveLength(2);

    root.querySelector<HTMLButtonElement>('[data-testid="buy-AAPL"]')!.click();

    expect(store.orders()).toHaveLength(1);
    expect(store.orders()[0]).toMatchObject({ symbol: 'AAPL', quantity: 1 });
  });

  it('shows a hint once the watchlist is empty', async () => {
    const { fixture, root, store } = await setup();
    store.toggleWatch('AAPL');
    store.toggleWatch('NVDA');
    await fixture.whenStable();
    expect(root.querySelector('[data-testid="empty"]')).not.toBeNull();
  });
});
