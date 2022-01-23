import type { NativeFederationResult } from '@angular-architects/native-federation';
import type { Route } from '@angular/router';

/** The market page is the shell's own; the other two are remotes, fetched the first time you open them. */
export const appRoutes = (
  loadRemote: NativeFederationResult['loadRemoteModule'],
): Route[] => [
  {
    path: '',
    title: 'Market',
    loadComponent: () =>
      import('./market/market.component').then((m) => m.MarketComponent),
  },
  {
    path: 'watchlist',
    title: 'Watchlist',
    loadChildren: () =>
      loadRemote<{ watchlistRoutes: Route[] }>('watchlist', './routes').then(
        (m) => m.watchlistRoutes,
      ),
  },
  {
    path: 'orders',
    title: 'Orders',
    loadChildren: () =>
      loadRemote<{ ordersRoutes: Route[] }>('orders', './routes').then(
        (m) => m.ordersRoutes,
      ),
  },
  { path: '**', redirectTo: '' },
];
