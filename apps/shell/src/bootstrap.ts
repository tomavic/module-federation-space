import type { NativeFederationResult } from '@angular-architects/native-federation';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { App } from './app/app';
import { appRoutes } from './app/app.routes';

export function bootstrap(
  loadRemote: NativeFederationResult['loadRemoteModule'],
) {
  return bootstrapApplication(App, {
    providers: [
      provideBrowserGlobalErrorListeners(),
      provideRouter(appRoutes(loadRemote), withComponentInputBinding()),
    ],
  });
}
