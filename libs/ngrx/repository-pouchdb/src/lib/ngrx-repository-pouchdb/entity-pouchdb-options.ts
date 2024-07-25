import { EntityAdapter } from "@ea-controls/ngrx-repository";

export interface PouchDbEffectRegisterOptions {
    idField?: string;
    adapters: EntityAdapter<any>[];
    getDb?(adapter: EntityAdapter<any>): PouchDB.Database<{}>;
}
