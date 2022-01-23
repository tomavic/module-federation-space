import {
  withNativeFederation,
  fromPackageJson,
  mappingsFromWorkspace,
} from '@angular-architects/native-federation/config';

export default withNativeFederation({
  name: 'watchlist',

  exposes: {
    './routes': './apps/watchlist/src/app/watchlist.routes.ts',
  },

  //shareScope: autoShareScope({level: 'minor'}),

  shared: fromPackageJson({
    singleton: true,
    strictVersion: true,
    requiredVersion: 'auto',
    build: 'package',
  }).patch(['@angular/*'], { includeSecondaries: { keepAll: true } }),

  // One instance of the shared library (and its PortfolioStore) for the shell and every remote.
  sharedMappings: mappingsFromWorkspace({ singleton: true })
    .filter(['@space/*'])
    .get(),

  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
    // Node-only and test entry points of @angular/* packages.
    /\/schematics(\/|$)/,
    /\/testing(\/|$)/,
  ],

  // Please read our docs about configuring native federation:
  // https://native-federation.com/docs/v4/angular-adapter/configuration/

  features: {
    denseChunking: true,
    denseExternals: true,
    strictImports: false,
  },
});
