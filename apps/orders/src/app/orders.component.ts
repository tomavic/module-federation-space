import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MarketService, PortfolioStore } from '@space/shared';

@Component({
  selector: 'orders-page',
  imports: [MatButtonModule, CurrencyPipe, DatePipe],
  template: `
    <section class="page">
      <h1>Orders</h1>
      <p class="caption">
        This page is the <strong>orders</strong> remote, a separate build loaded
        at runtime.
      </p>
      @if (portfolio.orderCount()) {
        <table class="data-table">
          <caption class="cdk-visually-hidden">
            Your orders, newest first
          </caption>
          <thead>
            <tr>
              <th scope="col">Order</th>
              <th scope="col">Stock</th>
              <th scope="col" class="num">Quantity</th>
              <th scope="col" class="num">Price paid</th>
              <th scope="col" class="num">Time</th>
            </tr>
          </thead>
          <tbody>
            @for (order of portfolio.orders(); track order.id) {
              <tr>
                <th scope="row">#{{ order.id }}</th>
                <td>{{ order.symbol }}</td>
                <td class="num">{{ order.quantity }}</td>
                <td class="num">{{ order.price | currency }}</td>
                <td class="num">{{ order.placedAt | date: 'mediumTime' }}</td>
              </tr>
            }
          </tbody>
        </table>
        <div class="summary">
          <span
            >Invested
            <strong data-testid="invested">{{
              portfolio.invested() | currency
            }}</strong></span
          >
          <span
            >Worth now <strong>{{ worth() | currency }}</strong></span
          >
          <span [class.down]="profit() < 0" [class.up]="profit() >= 0">
            {{ profit() < 0 ? 'Loss' : 'Gain' }}
            <strong>{{ profit() | currency }}</strong>
          </span>
          <button
            mat-stroked-button
            type="button"
            data-testid="reset"
            (click)="portfolio.reset()"
          >
            Start over
          </button>
        </div>
      } @else {
        <p data-testid="empty">No orders yet. Buy from your watchlist.</p>
      }
    </section>
  `,
})
export class OrdersComponent {
  protected readonly portfolio = inject(PortfolioStore);
  private readonly market = inject(MarketService);

  protected readonly worth = computed(() =>
    this.portfolio
      .orders()
      .reduce(
        (sum, order) =>
          sum +
          order.quantity *
            (this.market.bySymbol().get(order.symbol)?.price ?? order.price),
        0,
      ),
  );
  protected readonly profit = computed(
    () => this.worth() - this.portfolio.invested(),
  );
}
