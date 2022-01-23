# Module Federation Space

A micro-frontend demo in Angular 22: one shell app and two remote apps. They are built and deployed separately, loaded into one page at runtime, and share state through a single NgRx Signal Store.

**[Open the live demo](https://tomavic.github.io/module-federation-space/)**. Watch a stock on the Market page, buy it on the Watchlist page, and see it on the Orders page. The counts in the tabs update from every app.

| App               | Kind    | What it shows                                                            |
| ----------------- | ------- | ------------------------------------------------------------------------ |
| `apps/shell`      | host    | Layout, navigation, and the Market page with live (simulated) prices     |
| `apps/watchlist`  | remote  | Watched stocks, with Buy and Remove                                      |
| `apps/orders`     | remote  | Orders placed, what they cost and what they are worth now                |
| `packages/shared` | library | `MarketService` (price feed) and `PortfolioStore` (watchlist and orders) |

## How it fits together

```mermaid
flowchart LR
  subgraph Browser
    Shell[shell<br/>Market page, layout]
    W[watchlist remote]
    O[orders remote]
    S[(@space/shared<br/>PortfolioStore, MarketService<br/>one shared instance)]
  end
  M[federation.manifest.json] -- where each remote lives --> Shell
  Shell -- loadRemoteModule on /watchlist --> W
  Shell -- loadRemoteModule on /orders --> O
  Shell --- S
  W --- S
  O --- S
```

1. The shell starts by reading `federation.manifest.json`, which maps each remote name to its `remoteEntry.json`. Moving a remote to another server means editing this file, not rebuilding the shell.
2. Each remote exposes its routes (`./routes`). The shell lazy-loads them like any other route, the first time you open `/watchlist` or `/orders`.
3. Angular, Material, NgRx and `@space/shared` are shared as singletons. The remotes run on the shell's copy of Angular, so `PortfolioStore` (`providedIn: 'root'`) is one instance across all three apps. A purchase in one remote shows up in the shell's tab count and in the other remote, with no events or messaging code between them.

Built with [Native Federation](https://www.npmjs.com/package/@angular-architects/native-federation), which works with the Angular esbuild builder and browser import maps, inside an [Nx](https://nx.dev) workspace.

## Run it

Requires Node 22 and pnpm 10.

```shell
pnpm install
pnpm nx run-many -t serve -p shell watchlist orders
```

Open http://localhost:4200. The remotes also run on their own at http://localhost:4201 and http://localhost:4202.

```shell
pnpm nx run-many -t test     # Vitest: the store, the price feed and each page
pnpm nx run-many -t lint
pnpm nx run-many -t build    # each app into dist/apps/<name>/browser
```

## Deploy

CI lints, tests and builds every push and pull request. On a push to the default branch, [`tools/assemble-pages.mjs`](tools/assemble-pages.mjs) puts the shell at the site root and each remote under `remotes/<name>/`. It then rewrites the manifest to those URLs, and the site is published to GitHub Pages. Each app is still its own build, so in a real setup each one could ship from its own pipeline and server.

## History

This repo began in 2022 as a Lerna workspace with three Angular 13 apps on webpack Module Federation. It was rebuilt in 2026 on Nx, Angular 22 and Native Federation. The original code is in the git history.

## Licence

[MIT](LICENSE)
