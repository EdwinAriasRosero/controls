import { EntityAdapter } from "@ea-controls/ngrx-repository";


export interface WebApiEffectOptions {

    adapters: EntityAdapter<any>[];

    urlBase?: string;
    updateWithPatch?: boolean;

    tranformResponse?: (data: any, adapter: EntityAdapter<any>) => any;
    tranformBeforeSendingData?: (data: any, adapter: EntityAdapter<any>) => any;

    getUrl?: (adapter: EntityAdapter<any>) => string;
    postUrl?: (adapter: EntityAdapter<any>, data: any) => string;
    patchUrl?: (adapter: EntityAdapter<any>, data: any) => string;
    removeUrl?: (adapter: EntityAdapter<any>, data: any) => string;
}
