import {
    Action, ActionCreator, createAction, createFeatureSelector,
    createReducer, createSelector, MemoizedSelector, on, props, ReducerTypes
} from "@ngrx/store";

export class EntityAdapterOptions<T> {
    getId?: (input: T) => string = (input: T) => (<any>input).id;
    ons?: ReducerTypes<T[], readonly ActionCreator[]>[] = [];
}

export class EntityAdapter<T> {

    public feature: MemoizedSelector<object, T[]>;
    public initialState: T[] = [];
    public launchBeforeActions: boolean = false;
    public options: EntityAdapterOptions<T> = new EntityAdapterOptions<T>();

    public actions = {
        getAll: createAction(`[${this.name}] repository get all`),
        addOne: createAction(`[${this.name}] repository add`, props<{ data: T }>()),
        patchOne: createAction(`[${this.name}] repository patch`, props<{ data: T }>()),
        removeOne: createAction(`[${this.name}] repository remove`, props<{ data: T }>()),
        removeById: createAction(`[${this.name}] repository removeById`, props<{ id: string }>()),
        setAll: createAction(`[${this.name}] repository set all`, props<{ data: T[] }>()),

        beforeAddOne: createAction(`[${this.name}] repository before adding`, props<{ data: T, onSuccess?: (data: T) => void, onFail?: (data: T) => void }>()),
        beforePatchOne: createAction(`[${this.name}] repository before patching`, props<{ data: T, onSuccess?: (data: T) => void, onFail?: (data: T) => void }>()),
        beforeRemoveOne: createAction(`[${this.name}] repository before removing`, props<{ data: T, onSuccess?: (data: T) => void, onFail?: (data: T) => void }>()),
        beforeRemoveById: createAction(`[${this.name}] repository before removeById`, props<{ id: string, onSuccess?: (data: T) => void, onFail?: (data: T) => void }>()),

        erroGetAll: createAction(`[${this.name}] repository error getting all`, props<{ error: string }>()),
        errorAddOne: createAction(`[${this.name}] repository error adding`, props<{ error: string }>()),
        errorPatchOne: createAction(`[${this.name}] repository error patching`, props<{ error: string }>()),
        errorRemoveOne: createAction(`[${this.name}] repository error removing`, props<{ error: string }>()),
        errorRemoveById: createAction(`[${this.name}] repository error removeById`, props<{ error: string }>()),
    };

    constructor(public name: string,
        options?: EntityAdapterOptions<T>) {

        if (options) {
            this.options = { ...this.options, ...options };
        }

        this.feature = createFeatureSelector<T[]>(this.name);
    }

    public getId(input: T): string {
        return this.options.getId!(input);
    }

    public reducer() {
        const reducer = createReducer(
            this.initialState,
            on(this.actions.setAll, (state, { data }) => data),
            on(this.actions.addOne, (state, { data }) => ([...state, data])),
            on(this.actions.removeOne, (state, { data }) => state.filter(d => this.getId(d).toString() !== this.getId(data).toString())),
            on(this.actions.patchOne, (state, { data }) => state.map(d => this.getId(d).toString() === this.getId(data).toString() ? data : d)),
            on(this.actions.removeById, (state, { id }) => state.filter(d => this.getId(d).toString() !== id.toString())),
            ...this.options.ons!
        );

        return { name: this.name, reducer: reducer };
    }

    selectById = (id: string) => createSelector(this.feature, (items) => {
        return items.find(i => this.getId(i) === id)
    });

    getAll() {
        return this.actions.getAll();
    }

    setAll(entities: T[]) {
        return this.actions.setAll({ data: entities });
    }

    addOne(entity: T, onSuccess?: (data: T) => void, onFail?: (data: T) => void) {
        return this.launchBeforeActions
            ? this.actions.beforeAddOne({ data: entity, onSuccess, onFail })
            : this.actions.addOne({ data: entity });
    }

    removeOne(entity: T, onSuccess?: (data: T) => void, onFail?: (data: T) => void) {
        return this.launchBeforeActions
            ? this.actions.beforeRemoveOne({ data: entity, onSuccess, onFail })
            : this.actions.removeOne({ data: entity });
    }

    patchOne(entity: T, onSuccess?: (data: T) => void, onFail?: (data: T) => void) {
        return this.launchBeforeActions
            ? this.actions.beforePatchOne({ data: entity, onSuccess, onFail })
            : this.actions.patchOne({ data: entity });
    }

    removeByIdOne(entity: string, onSuccess?: (data: T) => void, onFail?: (data: T) => void) {
        return this.launchBeforeActions
            ? this.actions.beforeRemoveById({ id: entity, onSuccess, onFail })
            : this.actions.removeById({ id: entity });
    }
}