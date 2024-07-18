import { Action, createAction, createFeatureSelector, createReducer, MemoizedSelector, on, props } from "@ngrx/store";

export class EntityAdapter<T> {

    public getAll = createAction(`[${this.name}] repository get all`);
    public addOne = createAction(`[${this.name}] repository add`, props<{ data: T }>());
    public patchOne = createAction(`[${this.name}] repository patch`, props<{ data: T }>());
    public removeOne = createAction(`[${this.name}] repository delete`, props<{ data: T }>());
    public removeById = createAction(`[${this.name}] repository deleteById`, props<{ id: string }>());
    public feature: MemoizedSelector<object, T[]>;
    public initialState: T[] = [];

    constructor(public name: string) {
        this.feature = createFeatureSelector<T[]>(this.name);
    }

    public reducer() {
        const reducer = createReducer(
            this.initialState,
            on(this.addOne, (state, { data }) => ([...state, data])),
            on(this.removeOne, (state, { data }) => state.filter(d => d !== data)),
            on(this.patchOne, (state, { data }) => state.map(d => d === data ? data : d)),
            on(this.removeById, (state, { id }) => state.filter(d => (<any>d).id !== id)),
        );

        return { name: this.name, reducer: reducer };
    }

}