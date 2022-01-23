import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MarketService, PortfolioStore, type Quote } from '@space/shared';

@Component({
  selector: 'watchlist-page',
  imports: [MatButtonModule, CurrencyPipe, DecimalPipe],
  template: `
    <section class="page">
      <h1>Watchlist</h1>
      <p class="caption">
        This page is the <strong>watchlist</strong> remote, a separate build
        loaded at runtime.
      </p>
      @if (rows().length) {
        <table class="data-table">
          <caption class="cdk-visually-hidden">
            Watched stocks
          </caption>
          <thead>
            <tr>
              <th scope="col">Stock</th>
              <th scope="col" class="num">Price</th>
              <th scope="col" class="num">Today</th>
              <th scope="col">
                <span class="cdk-visually-hidden">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            @for (quote of rows(); track quote.symbol) {
              <tr>
                <th scope="row">
                  <strong>{{ quote.symbol }}</strong> {{ quote.name }}
                </th>
                <td class="num">{{ quote.price | currency }}</td>
                <td
                  class="num"
                  [class.down]="quote.change < 0"
                  [class.up]="quote.change >= 0"
                >
                  {{ quote.change < 0 ? '▼' : '▲' }}
                  {{ quote.changePercent | number: '1.2-2' }}%
                </td>
                <td class="actions">
                  <button
                    mat-flat-button
                    type="button"
                    [attr.data-testid]="'buy-' + quote.symbol"
                    (click)="buy(quote)"
                  >
                    Buy 1
                  </button>
                  <button
                    mat-button
                    type="button"
                    [attr.data-testid]="'unwatch-' + quote.symbol"
                    (click)="portfolio.toggleWatch(quote.symbol)"
                  >
                    Remove<span class="cdk-visually-hidden">
                      {{ quote.symbol }}</span
                    >
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      } @else {
        <p data-testid="empty">
          Nothing on your watchlist. Pick stocks on the Market page.
        </p>
      }
    </section>
  `,
})
export class WatchlistComponent {
  protected readonly portfolio = inject(PortfolioStore);
  private readonly market = inject(MarketService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly rows = computed(() =>
    this.portfolio
      .watchlist()
      .map((symbol) => this.market.bySymbol().get(symbol))
      .filter((quote): quote is Quote => quote !== undefined),
  );

  protected buy(quote: Quote): void {
    this.portfolio.buy(quote.symbol, quote.price);
    this.snackBar.open(
      `Bought 1 ${quote.symbol} at $${quote.price.toFixed(2)}`,
      undefined,
      { duration: 3000 },
    );
  }
}
