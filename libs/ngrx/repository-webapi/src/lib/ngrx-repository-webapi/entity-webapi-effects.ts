import { Injectable } from '@angular/core';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Actions, ofType, createEffect, } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { EntityAdapter } from "@ea-controls/ngrx-repository";
import { Observable, of } from 'rxjs';

export interface WebApiEffectRegisterSettings {
    urlBase?: string;
    updateWithPatch?: boolean;

    tranformResponse?: (data: any, adapter: EntityAdapter<any>) => any;
    tranformBeforeSendingData?: (data: any, adapter: EntityAdapter<any>) => any;

    getUrl?: (adapter: EntityAdapter<any>) => string;
    postUrl?: (adapter: EntityAdapter<any>, data: any) => string;
    patchUrl?: (adapter: EntityAdapter<any>, data: any) => string;
    removeUrl?: (adapter: EntityAdapter<any>, data: any) => string;
}

export class WebApiEffectRegister {

    static entityList: EntityAdapter<any>[] = [];

    static register<T>(entityAdapter: EntityAdapter<T>) {
        entityAdapter.launchBeforeActions = true;
        WebApiEffectRegister.entityList.push(entityAdapter);
    }

    static options: WebApiEffectRegisterSettings = {
        urlBase: "https://localhost:4200",

        tranformResponse: (data: any, adapter: EntityAdapter<any>) => data,
        tranformBeforeSendingData: (data: any, adapter: EntityAdapter<any>) => data,

        updateWithPatch: false,

        getUrl: (adapter: EntityAdapter<any>) => {
            return `${WebApiEffectRegister.options.urlBase}/${adapter.name}`;
        },
        postUrl: (adapter: EntityAdapter<any>, data: any) => {
            return `${WebApiEffectRegister.options.urlBase}/${adapter.name}`;
        },
        patchUrl: (adapter: EntityAdapter<any>, data: any) => {
            return `${WebApiEffectRegister.options.urlBase}/${adapter.name}/${adapter.getId(data)}`;
        },
        removeUrl: (adapter: EntityAdapter<any>, data: any) => {
            return `${WebApiEffectRegister.options.urlBase}/${adapter.name}/${adapter.getId(data)}`;
        }
    };

    static configure(options: WebApiEffectRegisterSettings) {
        this.options = { ...this.options, ...options };
    }
}

@Injectable()
export class WebApiEffect {

    constructor(private actions$: Actions,
        private httpClient: HttpClient
    ) { }

    get$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(...WebApiEffectRegister.entityList.map(x => x.actions.getAll.type)),
            mergeMap((action) => {
                const actionInfo = WebApiEffectRegister.entityList.find(u => u.actions.getAll.type === action.type)!;

                return this.httpClient
                    .get<any>(WebApiEffectRegister.options.getUrl!(actionInfo))
                    .pipe(
                        map(response => {
                            return actionInfo.actions.setAll({
                                data: WebApiEffectRegister.options.tranformResponse!(response, actionInfo)
                            });
                        }),
                        catchError((error) => of(actionInfo!.actions.erroGetAll({ error })))
                    );
            }))
    });

    makeRequest$ = (
        invokerAction: (adapter: EntityAdapter<any>) => string,
        httpMethodInvoker: (adapter: EntityAdapter<any>, currentData: any, transformedData: any) => Observable<Object>,
        successAction: (adapter: EntityAdapter<any>, currentData: any, transformedData: any) => any,
        failAction: (adapter: EntityAdapter<any>, error: any) => any
    ) => {

        return this.actions$.pipe(
            ofType(...WebApiEffectRegister.entityList.map(x => invokerAction(x))),
            mergeMap(action => {

                const actionAdapter = WebApiEffectRegister.entityList.find(u => invokerAction(u) === action.type)!;
                const currentData = (<any>action).data;
                const transformedData = WebApiEffectRegister.options.tranformBeforeSendingData!(currentData, actionAdapter);

                return httpMethodInvoker(actionAdapter, currentData, transformedData)
                    .pipe(
                        map(() => {
                            (<any>action).onSuccess && (<any>action).onSuccess(currentData);
                            return successAction(actionAdapter, currentData, transformedData);
                        }),
                        catchError((error) => {
                            (<any>action).onFail ? (<any>action).onFail(error) : console.error(error);
                            return of(failAction(actionAdapter, error));
                        })
                    );
            }))

    }

    add$ = createEffect(() => {
        return this.makeRequest$(
            adapter => adapter.actions.beforeAddOne.type,
            (adapter, currentData, transformedData) => this.httpClient.post(WebApiEffectRegister.options.postUrl!(adapter, currentData), transformedData),
            (adapter, currentData) => adapter.actions.addOne({ data: currentData }),
            (adapter, error) => adapter.actions.errorAddOne({ error })
        );
    });

    patch$ = createEffect(() => {
        return this.makeRequest$(
            adapter => adapter.actions.beforePatchOne.type,
            (adapter, currentData, transformedData) => {
                const url = WebApiEffectRegister.options.patchUrl!(adapter, currentData);
                return WebApiEffectRegister.options.updateWithPatch ? this.httpClient.patch(url, transformedData) : this.httpClient.put(url, transformedData);
            },
            (adapter, currentData) => adapter.actions.patchOne({ data: currentData }),
            (adapter, error) => adapter.actions.errorPatchOne({ error })
        );
    });

    remove$ = createEffect(() => {
        return this.makeRequest$(
            adapter => adapter.actions.beforeRemoveOne.type,
            (adapter, currentData) => this.httpClient.delete(WebApiEffectRegister.options.removeUrl!(adapter, currentData)),
            (adapter, currentData) => adapter.actions.removeOne({ data: currentData }),
            (adapter, error) => adapter.actions.errorRemoveOne({ error })
        );
    });

    removeById$ = createEffect(() => {
        return this.makeRequest$(
            adapter => adapter.actions.beforeRemoveById.type,
            (adapter, currentData) => this.httpClient.delete(WebApiEffectRegister.options.removeUrl!(adapter, currentData.id)),
            (adapter, currentData) => adapter.actions.removeById({ id: currentData.id }),
            (adapter, error) => adapter.actions.errorRemoveById({ error })
        );
    });
}