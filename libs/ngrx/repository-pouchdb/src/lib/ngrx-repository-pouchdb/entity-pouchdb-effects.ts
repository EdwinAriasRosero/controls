import { Injectable } from '@angular/core';
import { exhaustMap, switchMap } from 'rxjs/operators';
import { Actions, ofType, createEffect, } from '@ngrx/effects';
import { EntityAdapter } from "@ea-controls/ngrx-repository";
import { EMPTY } from 'rxjs';
import PouchDB from "pouchdb";

export interface PouchDbEffectRegisterSettings {
    idField?: string;
}

export class PouchDbEffectRegister {

    static entityList: EntityAdapter<any>[] = [];

    static register<T>(entityAdapter: EntityAdapter<T>) {
        entityAdapter.launchBeforeActions = true;
        PouchDbEffectRegister.entityList.push(entityAdapter);
    }

    static options: PouchDbEffectRegisterSettings = {
        idField: "id"
    };

    static configure(options: PouchDbEffectRegisterSettings) {
        this.options = { ...this.options, ...options };
    }

    static dbs: { name: string, instance: PouchDB.Database<{}> }[] = [];

    static getDb(adapter: EntityAdapter<any>): PouchDB.Database<{}> {

        const db = PouchDbEffectRegister.dbs.find(x => x.name === adapter.name);
        if (db) {
            return db.instance;
        } else {
            const newDb = new PouchDB(adapter.name);
            PouchDbEffectRegister.dbs.push({ name: adapter.name, instance: newDb });
            return newDb;
        }

    }
}

@Injectable()
export class PouchDbEffect {

    constructor(private actions$: Actions) { }

    get$ = createEffect(() => {

        return this.actions$.pipe(
            ofType(...PouchDbEffectRegister.entityList.map(x => x.actions.getAll.type)),
            exhaustMap(async (action) => {
                const actionInfo = PouchDbEffectRegister.entityList.find(u => u.actions.getAll.type === action.type)!;

                try {
                    const response = await PouchDbEffectRegister.getDb(actionInfo).allDocs({ include_docs: true });
                    let newData = response.rows
                        .map(x => x.doc)
                        .map(x => ({ ...x, [PouchDbEffectRegister.options.idField!]: (<any>x)._id }));

                    newData.forEach(d => {
                        if (PouchDbEffectRegister.options.idField !== "_id") {
                            delete d["_id"];
                            delete d["_rev"];
                        }
                    })

                    return actionInfo.actions.setAll({
                        data: newData ?? []
                    });

                } catch (error: any) {
                    return actionInfo!.actions.erroGetAll({ error });
                }
            }))
    });

    add$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(...PouchDbEffectRegister.entityList.map(x => x.actions.beforeAddOne.type)),
            exhaustMap(async (action) => {

                const actionInfo = PouchDbEffectRegister.entityList.find(u => u.actions.beforeAddOne.type === action.type)!;
                const currentData = (<any>action).data;

                try {
                    const cloneItem = { ...structuredClone((<any>action).data), _id: (<any>action).data[PouchDbEffectRegister.options.idField!] };
                    await PouchDbEffectRegister.getDb(actionInfo).put(cloneItem);

                    (<any>action).onSuccess && (<any>action).onSuccess(currentData);
                    return actionInfo.actions.addOne({ data: currentData });

                } catch (error: any) {
                    (<any>action).onFail ? (<any>action).onFail(error) : console.error(error);
                    return actionInfo!.actions.errorAddOne({ error });
                }
            }))
    });

    patch$ = createEffect((): any => {
        return this.actions$.pipe(
            ofType(...PouchDbEffectRegister.entityList.map(x => x.actions.beforePatchOne.type)),
            exhaustMap(async (action) => {

                const actionInfo = PouchDbEffectRegister.entityList.find(u => u.actions.beforePatchOne.type === action.type)!;
                const currentData = (<any>action).data;
                const cloneItem = { ...structuredClone((<any>action).data), _id: (<any>action).data[PouchDbEffectRegister.options.idField!] };

                try {
                    let doc = await PouchDbEffectRegister.getDb(actionInfo).get(cloneItem._id);

                    if (doc) {

                        const newDoc = { ...doc, ...currentData };
                        await PouchDbEffectRegister.getDb(actionInfo).put(newDoc);

                        (<any>action).onSuccess && (<any>action).onSuccess(currentData);
                        return actionInfo.actions.patchOne({ data: currentData });
                    } else {
                        return EMPTY;
                    }

                } catch (error: any) {
                    (<any>action).onFail ? (<any>action).onFail(error) : console.error(error);
                    return actionInfo!.actions.errorPatchOne({ error });
                }
            }))
    });

    remove$ = createEffect((): any => {
        return this.actions$.pipe(
            ofType(...PouchDbEffectRegister.entityList.map(x => x.actions.beforeRemoveOne.type)),
            exhaustMap(async (action) => {

                const actionInfo = PouchDbEffectRegister.entityList.find(u => u.actions.beforeRemoveOne.type === action.type)!;
                const currentData = (<any>action).data;
                const cloneItem = { ...structuredClone((<any>action).data), _id: (<any>action).data[PouchDbEffectRegister.options.idField!] };

                try {
                    let doc = await PouchDbEffectRegister.getDb(actionInfo).get(cloneItem._id);

                    if (doc) {
                        await PouchDbEffectRegister.getDb(actionInfo).remove(doc._id, doc._rev);

                        (<any>action).onSuccess && (<any>action).onSuccess(currentData);
                        return actionInfo.actions.removeOne({ data: currentData });
                    } else {
                        return EMPTY;
                    }

                }
                catch (error: any) {
                    (<any>action).onFail ? (<any>action).onFail(error) : console.error(error);
                    return actionInfo!.actions.errorRemoveOne({ error });
                }
            }))
    });

    removeById$ = createEffect((): any => {
        return this.actions$.pipe(
            ofType(...PouchDbEffectRegister.entityList.map(x => x.actions.beforeRemoveById.type)),
            switchMap(async (action) => {

                const actionInfo = PouchDbEffectRegister.entityList.find(u => u.actions.beforeRemoveById.type === action.type)!;
                const data = (<any>action).id;

                try {
                    let doc = await PouchDbEffectRegister.getDb(actionInfo).get(data);

                    if (doc) {
                        await PouchDbEffectRegister.getDb(actionInfo).remove(doc._id, doc._rev);

                        (<any>action).onSuccess && (<any>action).onSuccess(data);
                        return actionInfo.actions.removeById({ id: data });
                    } else {
                        return EMPTY;
                    }

                }
                catch (error: any) {
                    (<any>action).onFail ? (<any>action).onFail(error) : console.error(error);
                    return actionInfo!.actions.errorRemoveById({ error });
                }
            }))
    });
}