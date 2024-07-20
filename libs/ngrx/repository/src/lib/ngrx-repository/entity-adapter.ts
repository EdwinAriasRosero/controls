import { Action, createAction, createFeatureSelector, createReducer, createSelector, MemoizedSelector, on, props } from "@ngrx/store";

export class EntityAdapter<T> {

    public feature: MemoizedSelector<object, T[]>;
    public initialState: T[] = [];

    _getAll = createAction(`[${this.name}] repository get all`);
    _addOne = createAction(`[${this.name}] repository add`, props<{ data: T }>());
    _patchOne = createAction(`[${this.name}] repository patch`, props<{ data: T }>());
    _removeOne = createAction(`[${this.name}] repository remove`, props<{ data: T }>());
    _removeById = createAction(`[${this.name}] repository removeById`, props<{ id: string }>());

    _setAll = createAction(`[${this.name}] repository set all`, props<{ data: T[] }>());
    _beforeAddOne = createAction(`[${this.name}] repository before add`, props<{ data: T }>());
    _beforePatchOne = createAction(`[${this.name}] repository before patch`, props<{ data: T }>());
    _beforeRemoveOne = createAction(`[${this.name}] repository before remove`, props<{ data: T }>());
    _beforeRemoveById = createAction(`[${this.name}] repository before removeById`, props<{ id: string }>());

    _erroGetAll = createAction(`[${this.name}] repository error get all`, props<{ error: string }>());
    _errorAddOne = createAction(`[${this.name}] repository error add`, props<{ error: string }>());
    _errorPatchOne = createAction(`[${this.name}] repository error patch`, props<{ error: string }>());
    _errorRemoveOne = createAction(`[${this.name}] repository error remove`, props<{ error: string }>());
    _errorRemoveById = createAction(`[${this.name}] repository error removeById`, props<{ error: string }>());


    launchBeforeActions: boolean = false;

    constructor(public name: string,
        private getId?: (input: T) => string) {

        this.feature = createFeatureSelector<T[]>(this.name);
    }


    selectById = (id: string) => createSelector(this.feature, (items) => {
        return items.find(i => this.getId ? this.getId(i) === id : (<any>i).id === id)
    });

    public reducer() {
        const reducer = createReducer(
            this.initialState,
            on(this._setAll, (state, { data }) => data),
            on(this._addOne, (state, { data }) => ([...state, data])),
            on(this._removeOne, (state, { data }) => state.filter(d => d !== data)),
            on(this._patchOne, (state, { data }) => state.map(d => d === data ? data : d)),
            on(this._removeById, (state, { id }) => state.filter(d => (<any>d).id !== id)),
        );

        return { name: this.name, reducer: reducer };
    }

    getAll() {
        return this._getAll();
    }

    addOne(entity: T) {
        return this.launchBeforeActions
            ? this._beforeAddOne({ data: entity })
            : this._addOne({ data: entity });
    }

    removeOne(entity: T) {
        return this.launchBeforeActions
            ? this._beforeRemoveOne({ data: entity })
            : this._removeOne({ data: entity });
    }

    patchOne(entity: T) {
        return this.launchBeforeActions
            ? this._beforePatchOne({ data: entity })
            : this._patchOne({ data: entity });
    }

    removeByIdOne(entity: string) {
        return this.launchBeforeActions
            ? this._beforeRemoveById({ id: entity })
            : this._removeById({ id: entity });
    }
}