import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Actions, ofType, createEffect, } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { EntityAdapter } from "@ea-controls/repository";
import { EMPTY } from 'rxjs';


export interface WebApiEffectRegisterSettings {
    urlFormat?: string;
}

export class WebApiEffectRegister {

    static entityList: EntityAdapter<any>[] = [];

    static register<T>(entityAdapter: EntityAdapter<T>) {
        WebApiEffectRegister.entityList.push(entityAdapter);
    }

    static options: WebApiEffectRegisterSettings = {
        urlFormat: "https://localhost:4200/${entityName}"
    };

    static configure(options: WebApiEffectRegisterSettings) {
        this.options = { ...this.options, ...options };
    }

    static getUrl(name: string) {
        return (WebApiEffectRegister.options.urlFormat || '')
            ?.replace("${entityName}", name);
    }
}

@Injectable()
export class WebApiEffect {

    constructor(private actions$: Actions,
        private httpClient: HttpClient
    ) { }

    get$ = createEffect(() => {
        const addActions = WebApiEffectRegister
            .entityList
            .map(e => ({ name: e.name, type: e.getAll.type }));

        return this.actions$.pipe(
            ofType(...addActions.map(x => x.type)),
            switchMap((action) => {
                const url = addActions.find(u => u.type === action.type)?.name;

                if (url) {
                    return this.httpClient.get<any>(WebApiEffectRegister.getUrl(url));
                } else {
                    throw Error(`action '${action.type}' is not registered`);
                }

            }))

    });

    add$ = createEffect((): any => {
        const addActions = WebApiEffectRegister
            .entityList
            .map(e => ({ name: e.name, type: e.addOne.type }));

        return this.actions$.pipe(
            ofType(...addActions.map(x => x.type)),
            switchMap(action => {

                const url = addActions.find(u => u.type === action.type)?.name;

                if (url) {
                    return this.httpClient.post(WebApiEffectRegister.getUrl(url), (<any>action).data)
                        .pipe(
                            switchMap(response => EMPTY)
                        );
                } else {
                    throw Error(`action '${action.type}' is not registered`);
                }

            }))
    });

    patch$ = createEffect((): any => {
        const addActions = WebApiEffectRegister
            .entityList
            .map(e => ({ name: e.name, type: e.patchOne.type }));

        return this.actions$.pipe(
            ofType(...addActions.map(x => x.type)),
            switchMap(action => {

                const url = addActions.find(u => u.type === action.type)?.name;

                if (url) {
                    return this.httpClient.patch(`${WebApiEffectRegister.getUrl(url)}/${(<any>action).data.id}`, (<any>action).data);
                } else {
                    throw Error(`action '${action.type}' is not registered`);
                }

            }))
    });

    remove$ = createEffect((): any => {
        const addActions = WebApiEffectRegister
            .entityList
            .map(e => ({ name: e.name, type: e.removeOne.type }));

        return this.actions$.pipe(
            ofType(...addActions.map(x => x.type)),
            switchMap(action => {

                const url = addActions.find(u => u.type === action.type)?.name;

                if (url) {
                    return this.httpClient.delete(`${WebApiEffectRegister.getUrl(url)}/${(<any>action).data.id}`);
                } else {
                    throw Error(`action '${action.type}' is not registered`);
                }

            }))
    });

    removeById$ = createEffect((): any => {
        const addActions = WebApiEffectRegister
            .entityList
            .map(e => ({ name: e.name, type: e.removeById.type }));

        return this.actions$.pipe(
            ofType(...addActions.map(x => x.type)),
            switchMap(action => {

                const url = addActions.find(u => u.type === action.type)?.name;

                if (url) {
                    return this.httpClient.delete(`${WebApiEffectRegister.getUrl(url)}/${(<any>action).id}`);
                } else {
                    throw Error(`action '${action.type}' is not registered`);
                }

            }))
    });


}