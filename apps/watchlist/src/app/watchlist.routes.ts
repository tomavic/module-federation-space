import type { Route } from '@angular/router';

export const watchlistRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./watchlist.component').then((m) => m.WatchlistComponent),
  },
];
