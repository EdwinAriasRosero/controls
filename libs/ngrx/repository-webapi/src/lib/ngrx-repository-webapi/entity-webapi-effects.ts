import { Injectable } from '@angular/core';
import { catchError, exhaustMap, map, switchMap } from 'rxjs/operators';
import { Actions, ofType, createEffect, } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { EntityAdapter } from "@ea-controls/ngrx-repository";
import { EMPTY, of } from 'rxjs';


export interface WebApiEffectRegisterSettings {
    urlBase?: string;

    tranformGetResponse?: (data: any, action: string) => any;

    tranformPostData?: (data: any, action: string) => any;
    tranformPatchData?: (data: any, action: string) => any;
    tranformRemoveData?: (data: any, action: string) => any;

    getId?: (data: any) => string;
    getUrl?: (action: any) => string;
    postUrl?: (action: any) => string;
    patchUrl?: (action: any, a: any) => string;
    removeUrl?: (action: any, a: any) => string;
}

export class WebApiEffectRegister {

    static entityList: EntityAdapter<any>[] = [];

    static register<T>(entityAdapter: EntityAdapter<T>) {
        entityAdapter.launchBeforeActions = true;
        WebApiEffectRegister.entityList.push(entityAdapter);
    }

    static options: WebApiEffectRegisterSettings = {
        urlBase: "https://localhost:4200",
        tranformGetResponse: data => data,
        getId: (data: any) => data.id,
        getUrl: (action: string) => `${WebApiEffectRegister.options.urlBase}/${action}`,
        postUrl: (action: string) => `${WebApiEffectRegister.options.urlBase}/${action}`,
        patchUrl: (action: string, data: any) => `${WebApiEffectRegister.options.urlBase}/${action}/${WebApiEffectRegister.options.getId!(data)}`,
        removeUrl: (action: string, data: any) => `${WebApiEffectRegister.options.urlBase}/${action}/${WebApiEffectRegister.options.getId!(data)}`,
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
        const actions = WebApiEffectRegister
            .entityList
            .map(e => ({ name: e.name, onSuccess: e._setAll, invokerType: e._getAll.type, onError: e._erroGetAll }));

        return this.actions$.pipe(
            ofType(...actions.map(x => x.invokerType)),
            exhaustMap((action) => {
                const actionInfo = actions.find(u => u.invokerType === action.type)!;

                return this.httpClient
                    .get<any>(WebApiEffectRegister.options.getUrl!(actionInfo.name))
                    .pipe(
                        map((response) => actionInfo.onSuccess({
                            data: WebApiEffectRegister.options.tranformGetResponse
                                ? WebApiEffectRegister.options.tranformGetResponse(response, actionInfo.name)
                                : response
                        })),
                        catchError((error) => of(actionInfo!.onError({ error })))
                    );

            }))

    });

    add$ = createEffect(() => {
        const actions = WebApiEffectRegister
            .entityList
            .map(e => ({ name: e.name, onSuccess: e._addOne, invokerType: e._beforeAddOne.type, onError: e._errorAddOne }));

        return this.actions$.pipe(
            ofType(...actions.map(x => x.invokerType)),
            switchMap(action => {

                const actionInfo = actions.find(u => u.invokerType === action.type)!;

                const data = WebApiEffectRegister.options.tranformPostData
                    ? WebApiEffectRegister.options.tranformPostData((<any>action).data, actionInfo.name)
                    : (<any>action).data;

                return this.httpClient.post(WebApiEffectRegister.options.postUrl!(actionInfo.name), data)
                    .pipe(
                        map(() => actionInfo.onSuccess({ data: data })),
                        catchError((error) => of(actionInfo!.onError({ error })))
                    );
            }))
    });

    patch$ = createEffect(() => {
        const actions = WebApiEffectRegister
            .entityList
            .map(e => ({ name: e.name, onSuccess: e._patchOne, invokerType: e._beforePatchOne.type, onError: e._errorPatchOne }));

        return this.actions$.pipe(
            ofType(...actions.map(x => x.invokerType)),
            switchMap(action => {

                const actionInfo = actions.find(u => u.invokerType === action.type)!;

                const data = WebApiEffectRegister.options.tranformPatchData
                    ? WebApiEffectRegister.options.tranformPatchData((<any>action).data, actionInfo.name)
                    : (<any>action).data;

                return this.httpClient.patch(WebApiEffectRegister.options.patchUrl!(actionInfo.name, data), data)
                    .pipe(
                        map(_ => actionInfo.onSuccess({ data: data })),
                        catchError((error) => of(actionInfo!.onError({ error })))
                    );
            }))
    });

    remove$ = createEffect(() => {
        const actions = WebApiEffectRegister
            .entityList
            .map(e => ({ name: e.name, onSuccess: e._removeOne, invokerType: e._beforeRemoveOne.type, onError: e._errorRemoveOne }));

        return this.actions$.pipe(
            ofType(...actions.map(x => x.invokerType)),
            switchMap(action => {

                const actionInfo = actions.find(u => u.invokerType === action.type)!;

                const data = WebApiEffectRegister.options.tranformRemoveData
                    ? WebApiEffectRegister.options.tranformRemoveData((<any>action).data, actionInfo.name)
                    : (<any>action).data;

                return this.httpClient.delete(WebApiEffectRegister.options.removeUrl!(actionInfo.name, data))
                    .pipe(
                        map(_ => actionInfo.onSuccess({ data: data })),
                        catchError((error) => of(actionInfo!.onError({ error })))
                    );

            }))
    });

    removeById$ = createEffect(() => {
        const actions = WebApiEffectRegister
            .entityList
            .map(e => ({ name: e.name, onSuccess: e._removeById, invokerType: e._beforeRemoveById.type, onError: e._errorRemoveById }));

        return this.actions$.pipe(
            ofType(...actions.map(x => x.invokerType)),
            switchMap(action => {

                const actionInfo = actions.find(u => u.invokerType === action.type)!;

                const data = (<any>action).id;

                return this.httpClient.delete(WebApiEffectRegister.options.removeUrl!(actionInfo.name, { data }))
                    .pipe(
                        map(_ => actionInfo.onSuccess({ id: data })),
                        catchError((error) => of(actionInfo!.onError({ error })))
                    );

            }))
    });
}