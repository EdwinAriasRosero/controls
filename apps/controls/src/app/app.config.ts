import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { WebApiEffect, WebApiEffectRegister } from "@ea-controls/ngrx-repository-webapi";
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient } from '@angular/common/http';
import { EntityAdapter } from '@ea-controls/repository';
import { UserEntity } from './repository/repository.component';

export const userAdapter = new EntityAdapter<UserEntity>("items");

WebApiEffectRegister.register(userAdapter);
WebApiEffectRegister.configure({
  urlBase: `http://localhost:3000`,
  tranformGetResponse: (data: any, action: string) => {
    console.log(action, data);
    return data;
  },
  getId: (data: any) => {
    console.log('id invoked', data);

    return data.id;
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(),
    provideStore(),
    provideState(userAdapter.reducer()),
    provideEffects(WebApiEffect),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      connectInZone: true // If set to true, the connection is established within the Angular zone
    })

  ],
};
