import { TestBed } from '@angular/core/testing';
import { PortfolioStore } from '@space/shared';
import { OrdersComponent } from './orders.component';

describe('OrdersComponent', () => {
  it('shows an empty state, then the orders and what they cost', async () => {
    const fixture = TestBed.createComponent(OrdersComponent);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('[data-testid="empty"]')).not.toBeNull();

    const store = TestBed.inject(PortfolioStore);
    store.buy('AAPL', 200);
    store.buy('MSFT', 500, 2);
    await fixture.whenStable();

    expect(root.querySelectorAll('tbody tr')).toHaveLength(2);
    expect(
      root.querySelector('[data-testid="invested"]')?.textContent?.trim(),
    ).toBe('$1,200.00');
  });
});
