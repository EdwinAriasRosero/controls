import { Injectable } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
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
            mergeMap(async (action) => {
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

    executeAction$ = (
        invokerAction: (adapter: EntityAdapter<any>) => string,
        pocuhDbAction: (adapter: EntityAdapter<any>, currentData: any, transformedData: any) => Promise<boolean>,
        successAction: (adapter: EntityAdapter<any>, currentData: any, transformedData: any) => any,
        failAction: (adapter: EntityAdapter<any>, error: any) => any
    ) => {
        return this.actions$.pipe(
            ofType(...PouchDbEffectRegister.entityList.map(x => invokerAction(x))),
            mergeMap(async (action) => {
                const actionAdapter = PouchDbEffectRegister.entityList.find(u => invokerAction(u) === action.type)!;

                try {
                    const currentData = (<any>action).data;
                    const transformedData = { ...structuredClone((<any>action).data), _id: (<any>action).data[PouchDbEffectRegister.options.idField!] };
                    const result = await pocuhDbAction(actionAdapter, currentData, transformedData);

                    if (result) {
                        (<any>action).onSuccess && (<any>action).onSuccess(currentData);
                        return successAction(actionAdapter, currentData, transformedData);
                    }

                    return EMPTY;

                } catch (error: any) {
                    (<any>action).onFail ? (<any>action).onFail(error) : console.error(error);
                    return failAction(actionAdapter, error);
                }
            }))
    }

    add$ = createEffect(() => {
        return this.executeAction$(
            adapter => adapter.actions.beforeAddOne.type,
            async (adapter, currentData, transformedData) => { await PouchDbEffectRegister.getDb(adapter).put(transformedData); return true; },
            (adapter, currentData) => adapter.actions.addOne({ data: currentData }),
            (adapter, error) => adapter.actions.errorAddOne({ error })
        );
    });

    patch$ = createEffect((): any => {
        return this.executeAction$(
            adapter => adapter.actions.beforePatchOne.type,
            async (adapter, currentData, transformedData) => {
                const db = PouchDbEffectRegister.getDb(adapter);
                const doc = await db.get(transformedData._id);

                if (doc) {
                    const newDoc = { ...doc, ...currentData };
                    await db.put(newDoc);
                    return true;
                } else {
                    return false;
                }
            },
            (adapter, currentData) => adapter.actions.patchOne({ data: currentData }),
            (adapter, error) => adapter.actions.errorPatchOne({ error })
        );
    });

    remove$ = createEffect((): any => {
        return this.executeAction$(
            adapter => adapter.actions.beforeRemoveOne.type,
            async (adapter, currentData, transformedData) => {
                const db = PouchDbEffectRegister.getDb(adapter);
                const doc = await db.get(transformedData._id);

                if (doc) {
                    await db.remove(doc._id, doc._rev);
                    return true;
                } else {
                    return false;
                }
            },
            (adapter, currentData) => adapter.actions.removeOne({ data: currentData }),
            (adapter, error) => adapter.actions.errorRemoveOne({ error })
        );
    });

    removeById$ = createEffect((): any => {
        return this.executeAction$(
            adapter => adapter.actions.beforeRemoveById.type,
            async (adapter, currentData, transformedData) => {
                let doc = await PouchDbEffectRegister.getDb(adapter).get(transformedData._id);

                if (doc) {
                    await PouchDbEffectRegister.getDb(adapter).remove(doc._id, doc._rev);
                    return true;
                } else {
                    return false;
                }
            },
            (adapter, currentData) => adapter.actions.removeById({ id: currentData }),
            (adapter, error) => adapter.actions.errorRemoveById({ error })
        );
    });
}