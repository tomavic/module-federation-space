import { TestBed } from '@angular/core/testing';
import { MarketService } from './market.service';

describe('MarketService', () => {
  it('moves prices by at most 1% per tick and tracks the change from opening', () => {
    const market = TestBed.inject(MarketService);
    const before = market.bySymbol().get('AAPL')!;

    market.tick(() => 1); // the largest step up
    const after = market.bySymbol().get('AAPL')!;

    expect(after.price).toBeCloseTo(before.price * 1.01, 2);
    expect(after.change).toBeCloseTo(after.price - 228.4, 2);
    expect(after.changePercent).toBeCloseTo(1, 1);
  });

  it('keeps prices unchanged on a neutral tick', () => {
    const market = TestBed.inject(MarketService);
    const before = market.quotes().map((q) => q.price);
    market.tick(() => 0.5);
    expect(market.quotes().map((q) => q.price)).toEqual(before);
  });
});
