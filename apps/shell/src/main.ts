import { initFederation } from '@angular-architects/native-federation';

// Read where each remote lives, then start Angular with a loader bound to that manifest.
initFederation('federation.manifest.json', {
  hostRemoteEntry: { url: './remoteEntry.json' },
})
  .then(({ loadRemoteModule }) =>
    import('./bootstrap').then((m) => m.bootstrap(loadRemoteModule)),
  )
  .catch((err) => console.error(err));
