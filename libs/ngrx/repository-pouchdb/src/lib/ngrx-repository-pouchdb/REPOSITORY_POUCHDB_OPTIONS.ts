import { InjectionToken } from "@angular/core";
import { ExtendedPouchDbEffectRegisterOptions } from './entity-pouchdb-options-extended';

export const REPOSITORY_POUCHDB_OPTIONS = new InjectionToken<ExtendedPouchDbEffectRegisterOptions>('REPOSITORY_POUCHDB_OPTIONS');
