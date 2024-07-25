import { inject, Injectable } from '@angular/core';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Actions, ofType, createEffect, } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { EntityAdapter } from "@ea-controls/ngrx-repository";
import { Observable, of } from 'rxjs';
import { REPOSITORY_WEBAPI_OPTIONS } from './REPOSITORY_WEBAPI_OPTIONS';

@Injectable()
export class WebApiEffect {

    options = inject(REPOSITORY_WEBAPI_OPTIONS);

    constructor(private actions$: Actions,
        private httpClient: HttpClient
    ) { }

    get$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(...this.options.adapters.map(x => x.actions.getAll.type)),
            mergeMap((action) => {
                const actionInfo = this.options.adapters.find(u => u.actions.getAll.type === action.type)!;

                return this.httpClient
                    .get<any>(this.options.getUrl!(actionInfo))
                    .pipe(
                        map(response => {
                            return actionInfo.actions.setAll({
                                data: this.options.tranformResponse!(response, actionInfo)
                            });
                        }),
                        catchError((error) => {
                            (<any>actionInfo).onFail ? (<any>actionInfo).onFail(error) : console.error(error);
                            return of(actionInfo!.actions.erroGetAll({ error }));
                        })
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
            ofType(...this.options.adapters.map(x => invokerAction(x))),
            mergeMap(action => {

                const actionAdapter = this.options.adapters.find(u => invokerAction(u) === action.type)!;
                const currentData = (<any>action).data;
                const transformedData = this.options.tranformBeforeSendingData!(currentData, actionAdapter);

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
            (adapter, currentData, transformedData) => this.httpClient.post(this.options.postUrl!(adapter, currentData), transformedData),
            (adapter, currentData) => adapter.actions.addOne({ data: currentData }),
            (adapter, error) => adapter.actions.errorAddOne({ error })
        );
    });

    patch$ = createEffect(() => {
        return this.makeRequest$(
            adapter => adapter.actions.beforePatchOne.type,
            (adapter, currentData, transformedData) => {
                const url = this.options.patchUrl!(adapter, currentData);
                return this.options.updateWithPatch ? this.httpClient.patch(url, transformedData) : this.httpClient.put(url, transformedData);
            },
            (adapter, currentData) => adapter.actions.patchOne({ data: currentData }),
            (adapter, error) => adapter.actions.errorPatchOne({ error })
        );
    });

    remove$ = createEffect(() => {
        return this.makeRequest$(
            adapter => adapter.actions.beforeRemoveOne.type,
            (adapter, currentData) => this.httpClient.delete(this.options.removeUrl!(adapter, currentData)),
            (adapter, currentData) => adapter.actions.removeOne({ data: currentData }),
            (adapter, error) => adapter.actions.errorRemoveOne({ error })
        );
    });

    removeById$ = createEffect(() => {
        return this.makeRequest$(
            adapter => adapter.actions.beforeRemoveById.type,
            (adapter, currentData) => this.httpClient.delete(this.options.removeUrl!(adapter, currentData.id)),
            (adapter, currentData) => adapter.actions.removeById({ id: currentData.id }),
            (adapter, error) => adapter.actions.errorRemoveById({ error })
        );
    });
}