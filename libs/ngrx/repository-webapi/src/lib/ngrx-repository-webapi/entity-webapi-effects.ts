import { Injectable } from '@angular/core';
import { catchError, exhaustMap, map, switchMap, tap } from 'rxjs/operators';
import { Actions, ofType, createEffect, } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { EntityAdapter } from "@ea-controls/ngrx-repository";
import { of } from 'rxjs';


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
            exhaustMap((action) => {
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

    add$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(...WebApiEffectRegister.entityList.map(x => x.actions.beforeAddOne.type)),
            switchMap(action => {

                const actionInfo = WebApiEffectRegister.entityList.find(u => u.actions.beforeAddOne.type === action.type)!;
                const currentData = (<any>action).data;
                const data = WebApiEffectRegister.options.tranformBeforeSendingData!(currentData, actionInfo);

                return this.httpClient.post(WebApiEffectRegister.options.postUrl!(actionInfo, currentData), data)
                    .pipe(
                        map(() => {
                            (<any>action).onSuccess && (<any>action).onSuccess(currentData);
                            return actionInfo.actions.addOne({ data: currentData });
                        }),
                        catchError((error) => {
                            (<any>action).onFail ? (<any>action).onFail(error) : console.error(error);
                            return of(actionInfo!.actions.errorAddOne({ error }));
                        })
                    );
            }))
    });

    patch$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(...WebApiEffectRegister.entityList.map(x => x.actions.beforePatchOne.type)),
            switchMap(action => {

                const actionInfo = WebApiEffectRegister.entityList.find(u => u.actions.beforePatchOne.type === action.type)!;
                const currentData = (<any>action).data;
                const data = WebApiEffectRegister.options.tranformBeforeSendingData!(currentData, actionInfo);

                if (WebApiEffectRegister.options.updateWithPatch) {
                    return this.httpClient.patch(WebApiEffectRegister.options.patchUrl!(actionInfo, currentData), data)
                        .pipe(
                            map(() => {
                                (<any>action).onSuccess && (<any>action).onSuccess(currentData);
                                return actionInfo.actions.patchOne({ data: currentData });
                            }),
                            catchError((error) => {
                                (<any>action).onFail ? (<any>action).onFail(error) : console.error(error);
                                return of(actionInfo!.actions.errorPatchOne({ error }));
                            })
                        );
                } else {
                    return this.httpClient.put(WebApiEffectRegister.options.patchUrl!(actionInfo, currentData), data)
                        .pipe(
                            map(() => {
                                (<any>action).onSuccess && (<any>action).onSuccess(currentData);
                                return actionInfo.actions.patchOne({ data: currentData });
                            }),
                            catchError((error) => {
                                (<any>action).onFail ? (<any>action).onFail(error) : console.error(error);
                                return of(actionInfo!.actions.errorPatchOne({ error }));
                            })
                        );
                }
            }))
    });

    remove$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(...WebApiEffectRegister.entityList.map(x => x.actions.beforeRemoveOne.type)),
            switchMap(action => {

                const actionInfo = WebApiEffectRegister.entityList.find(u => u.actions.beforeRemoveOne.type === action.type)!;
                const currentData = (<any>action).data;
                //const data = WebApiEffectRegister.options.tranformBeforeSendingData!(currentData, actionInfo);

                return this.httpClient.delete(WebApiEffectRegister.options.removeUrl!(actionInfo, currentData))
                    .pipe(
                        map(() => {
                            (<any>action).onSuccess && (<any>action).onSuccess(currentData);
                            return actionInfo.actions.removeOne({ data: currentData });
                        }),
                        catchError((error) => {
                            (<any>action).onFail ? (<any>action).onFail(error) : console.error(error);
                            return of(actionInfo!.actions.errorRemoveOne({ error }));
                        })
                    );
            }))
    });

    removeById$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(...WebApiEffectRegister.entityList.map(x => x.actions.beforeRemoveById.type)),
            switchMap(action => {

                const actionInfo = WebApiEffectRegister.entityList.find(u => u.actions.beforeRemoveById.type === action.type)!;
                const data = (<any>action).id;

                return this.httpClient.delete(WebApiEffectRegister.options.removeUrl!(actionInfo, { data }))
                    .pipe(
                        map(() => {
                            (<any>action).onSuccess && (<any>action).onSuccess(data);
                            return actionInfo.actions.removeById({ id: data });
                        }),
                        catchError((error) => {
                            (<any>action).onFail ? (<any>action).onFail(error) : console.error(error);
                            return of(actionInfo!.actions.errorRemoveById({ error }));
                        })
                    );
            }))
    });
}