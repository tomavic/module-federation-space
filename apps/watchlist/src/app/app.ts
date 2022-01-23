import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** Used only when the remote runs on its own; inside the shell, the shell's layout wraps the routes. */
@Component({
  selector: 'watchlist-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class App {}
