import { Component, inject, VERSION } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PortfolioStore } from '@space/shared';

@Component({
  selector: 'shell-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatTabsModule,
  ],
  template: `
    <mat-toolbar>
      <span>Stock Space</span>
    </mat-toolbar>
    <nav mat-tab-nav-bar [tabPanel]="panel" aria-label="Sections">
      <a
        mat-tab-link
        routerLink="/"
        routerLinkActive
        #market="routerLinkActive"
        [routerLinkActiveOptions]="{ exact: true }"
        [active]="market.isActive"
        >Market</a
      >
      <a
        mat-tab-link
        routerLink="/watchlist"
        routerLinkActive
        #watch="routerLinkActive"
        [active]="watch.isActive"
        >Watchlist ({{ portfolio.watchCount() }})</a
      >
      <a
        mat-tab-link
        routerLink="/orders"
        routerLinkActive
        #orders="routerLinkActive"
        [active]="orders.isActive"
        >Orders ({{ portfolio.orderCount() }})</a
      >
    </nav>
    <mat-tab-nav-panel #panel>
      <router-outlet />
    </mat-tab-nav-panel>
    <footer class="page caption">
      Shell on Angular {{ version }}. Watchlist and Orders are separate builds,
      loaded at runtime with Native Federation.
    </footer>
  `,
})
export class App {
  protected readonly portfolio = inject(PortfolioStore);
  protected readonly version = VERSION.full;
}
