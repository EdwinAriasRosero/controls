import { EnvironmentProviders, makeEnvironmentProviders } from "@angular/core";
import { EntityAdapter } from "@ea-controls/ngrx-repository";
import { provideEffects } from "@ngrx/effects";
import { WebApiEffect } from "./entity-webapi-effects";
import { WebApiEffectOptions } from "./entity-webapi-options";
import { REPOSITORY_WEBAPI_OPTIONS } from "./REPOSITORY_WEBAPI_OPTIONS";

export const provideRepositoryWebApi = (options?: WebApiEffectOptions): EnvironmentProviders => {

    let defaultOptions: WebApiEffectOptions = {
        urlBase: "https://localhost:4200",
        adapters: [],

        tranformResponse: (data: any, adapter: EntityAdapter<any>) => data,
        tranformBeforeSendingData: (data: any, adapter: EntityAdapter<any>) => data,

        updateWithPatch: false,

        getUrl: function (adapter: EntityAdapter<any>) {
            return `${this.urlBase}/${adapter.name}`;
        },
        postUrl: function (adapter: EntityAdapter<any>, data: any) {
            return `${this.urlBase}/${adapter.name}`;
        },
        patchUrl: function (adapter: EntityAdapter<any>, data: any) {
            return `${this.urlBase}/${adapter.name}/${adapter.getId(data)}`;
        },
        removeUrl: function (adapter: EntityAdapter<any>, data: any) {
            return `${this.urlBase}/${adapter.name}/${adapter.getId(data)}`;
        }
    };

    options?.adapters.forEach(adapter => {
        adapter.launchBeforeActions = true;
    });

    return makeEnvironmentProviders([
        {
            provide: REPOSITORY_WEBAPI_OPTIONS,
            useValue: { ...defaultOptions, ...options }
        },
        provideEffects([WebApiEffect])
    ]);

};
