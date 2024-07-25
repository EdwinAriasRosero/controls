import { PouchDbEffectRegisterOptions } from "./entity-pouchdb-options";
import PouchDB from "pouchdb";

export type ExtendedPouchDbEffectRegisterOptions = PouchDbEffectRegisterOptions & {
    dbs: { name: string; instance: PouchDB.Database<{}>; }[];
};
