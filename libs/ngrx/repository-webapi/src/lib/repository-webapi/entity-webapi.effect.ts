import { Injectable } from '@angular/core';
import { exhaustMap, map, switchMap } from 'rxjs/operators';
import { Actions, ofType, createEffect, } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { EntityAdapter } from "@ea-controls/repository";
import { EMPTY } from 'rxjs';


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

    get$ = createEffect((): any => {
        const actions = WebApiEffectRegister
            .entityList
            .map(e => ({ name: e.name, type: e.getAll.type, setType: e.setAll }));

        return this.actions$.pipe(
            ofType(...actions.map(x => x.type)),
            exhaustMap((action) => {
                const actionInfo = actions.find(u => u.type === action.type);
                const url = actionInfo?.name;

                if (url) {
                    return this.httpClient
                        .get<any>(WebApiEffectRegister.options.getUrl!(url))
                        .pipe(
                            map((response) => {

                                return WebApiEffectRegister.options.tranformGetResponse
                                    ? actionInfo.setType({ data: WebApiEffectRegister.options.tranformGetResponse(response, url) })
                                    : actionInfo.setType({ data: response });
                            })
                        );
                } else {
                    throw Error(`action '${action.type}' is not registered`);
                }

            }))

    });

    add$ = createEffect((): any => {
        const actions = WebApiEffectRegister
            .entityList
            .map(e => ({ name: e.name, type: e.addOne.type }));

        return this.actions$.pipe(
            ofType(...actions.map(x => x.type)),
            switchMap(action => {

                const url = actions.find(u => u.type === action.type)?.name;

                if (url) {
                    const data = WebApiEffectRegister.options.tranformPostData
                        ? WebApiEffectRegister.options.tranformPostData((<any>action).data, url)
                        : (<any>action).data;

                    return this.httpClient.post(WebApiEffectRegister.options.postUrl!(url), data)
                        .pipe(
                            switchMap(response => EMPTY)
                        );
                } else {
                    throw Error(`action '${action.type}' is not registered`);
                }

            }))
    });

    patch$ = createEffect((): any => {
        const actions = WebApiEffectRegister
            .entityList
            .map(e => ({ name: e.name, type: e.patchOne.type }));

        return this.actions$.pipe(
            ofType(...actions.map(x => x.type)),
            switchMap(action => {

                const url = actions.find(u => u.type === action.type)?.name;

                if (url) {
                    const data = WebApiEffectRegister.options.tranformPatchData
                        ? WebApiEffectRegister.options.tranformPatchData((<any>action).data, url)
                        : (<any>action).data;

                    return this.httpClient.patch(WebApiEffectRegister.options.patchUrl!(url, data), data);
                } else {
                    throw Error(`action '${action.type}' is not registered`);
                }

            }))
    });

    remove$ = createEffect((): any => {
        const actions = WebApiEffectRegister
            .entityList
            .map(e => ({ name: e.name, type: e.removeOne.type }));

        return this.actions$.pipe(
            ofType(...actions.map(x => x.type)),
            switchMap(action => {

                const url = actions.find(u => u.type === action.type)?.name;

                if (url) {
                    return this.httpClient.delete(WebApiEffectRegister.options.removeUrl!(url, (<any>action).data))
                        .pipe(
                            switchMap(_ => EMPTY)
                        );
                } else {
                    throw Error(`action '${action.type}' is not registered`);
                }

            }))
    });

    removeById$ = createEffect((): any => {
        const actions = WebApiEffectRegister
            .entityList
            .map(e => ({ name: e.name, type: e.removeById.type }));

        return this.actions$.pipe(
            ofType(...actions.map(x => x.type)),
            switchMap(action => {

                const url = actions.find(u => u.type === action.type)?.name;

                if (url) {
                    return this.httpClient.delete(WebApiEffectRegister.options.removeUrl!(url, { id: (<any>action).id }));
                } else {
                    throw Error(`action '${action.type}' is not registered`);
                }

            }))
    });


}