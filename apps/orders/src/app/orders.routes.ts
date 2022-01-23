import type { Route } from '@angular/router';

export const ordersRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./orders.component').then((m) => m.OrdersComponent),
  },
];
