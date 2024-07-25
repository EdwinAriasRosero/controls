import { EnvironmentProviders, makeEnvironmentProviders } from "@angular/core";
import { EntityAdapter } from "@ea-controls/ngrx-repository";
import { provideEffects } from "@ngrx/effects";
import { PouchDbEffect } from "./entity-pouchdb-effects";
import { ExtendedPouchDbEffectRegisterOptions } from "./entity-pouchdb-options-extended";
import { PouchDbEffectRegisterOptions } from "./entity-pouchdb-options";
import { REPOSITORY_POUCHDB_OPTIONS } from "./REPOSITORY_POUCHDB_OPTIONS";
import PouchDB from "pouchdb";

export const provideRepositoryPouchDb = (options?: PouchDbEffectRegisterOptions): EnvironmentProviders => {

    let defaultOptions: ExtendedPouchDbEffectRegisterOptions = {
        idField: "id",
        adapters: [],
        dbs: [],
        getDb: function (adapter: EntityAdapter<any>): PouchDB.Database<{}> {
            const db = this.dbs.find(x => x.name === adapter.name);

            if (db) {
                return db.instance;
            } else {
                const newDb = new PouchDB(adapter.name);
                this.dbs.push({ name: adapter.name, instance: newDb });
                return newDb;
            }
        }
    };

    options?.adapters.forEach(adapter => {
        adapter.launchBeforeActions = true;
    });

    return makeEnvironmentProviders([
        {
            provide: REPOSITORY_POUCHDB_OPTIONS,
            useValue: { ...defaultOptions, ...options }
        },
        provideEffects([PouchDbEffect])
    ]);
};
