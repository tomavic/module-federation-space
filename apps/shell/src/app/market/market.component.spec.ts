import { TestBed } from '@angular/core/testing';
import { PortfolioStore } from '@space/shared';
import { MarketComponent } from './market.component';

describe('MarketComponent', () => {
  it('lists every quote and toggles a stock on the shared watchlist', async () => {
    const fixture = TestBed.createComponent(MarketComponent);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const tsla = root.querySelector<HTMLButtonElement>(
      '[data-testid="watch-TSLA"]',
    )!;

    expect(root.querySelectorAll('tbody tr')).toHaveLength(5);
    expect(tsla.getAttribute('aria-pressed')).toBe('false');

    tsla.click();
    await fixture.whenStable();

    expect(tsla.getAttribute('aria-pressed')).toBe('true');
    expect(tsla.textContent?.trim()).toBe('Watching');
    expect(TestBed.inject(PortfolioStore).watchlist()).toContain('TSLA');
  });
});
