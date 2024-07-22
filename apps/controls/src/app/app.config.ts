import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { WebApiEffect, WebApiEffectRegister } from "@ea-controls/ngrx-repository-webapi";
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient } from '@angular/common/http';
import { EntityAdapter } from '@ea-controls/ngrx-repository';
import { UserEntity } from './repository/repository.component';

export const userAdapter = new EntityAdapter<UserEntity>("items", input => input.userId);

WebApiEffectRegister.register(userAdapter);
WebApiEffectRegister.configure({
  urlBase: `http://localhost:3000`,
  tranformResponse: (data: any[], action: EntityAdapter<any>) => {
    var newData = data.map(d => ({
      ...d,
      userId: d.id
    }));

    newData.forEach(v => delete v["id"]);

    console.log(newData);
    return newData;
  },
  tranformBeforeSendingData: (data: any, action: EntityAdapter<any>) => {
    let newData = { ...data, id: data.userId };
    delete newData["userId"]

    console.log(newData);
    return newData;
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
