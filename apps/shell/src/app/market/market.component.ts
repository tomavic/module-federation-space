import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MarketService, PortfolioStore } from '@space/shared';

@Component({
  selector: 'shell-market',
  imports: [MatButtonModule, CurrencyPipe, DecimalPipe],
  template: `
    <section class="page">
      <h1>Market</h1>
      <p class="caption">
        Simulated prices, updated every 1.5 seconds. This page is part of the
        shell.
      </p>
      <table class="data-table">
        <caption class="cdk-visually-hidden">
          Live prices
        </caption>
        <thead>
          <tr>
            <th scope="col">Stock</th>
            <th scope="col" class="num">Price</th>
            <th scope="col" class="num">Today</th>
            <th scope="col"><span class="cdk-visually-hidden">Watch</span></th>
          </tr>
        </thead>
        <tbody>
          @for (quote of market.quotes(); track quote.symbol) {
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
                  mat-stroked-button
                  type="button"
                  [attr.aria-pressed]="watched().has(quote.symbol)"
                  [attr.data-testid]="'watch-' + quote.symbol"
                  (click)="portfolio.toggleWatch(quote.symbol)"
                >
                  {{ watched().has(quote.symbol) ? 'Watching' : 'Watch' }}
                </button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </section>
  `,
})
export class MarketComponent {
  protected readonly market = inject(MarketService);
  protected readonly portfolio = inject(PortfolioStore);
  protected readonly watched = computed(
    () => new Set(this.portfolio.watchlist()),
  );
}
