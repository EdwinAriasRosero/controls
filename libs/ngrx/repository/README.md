# Repository

Simplify ngrx boilerplate for managing arrays of objects.

App often involves tables or collections of data. When using ngrx, developers typically create actions (add, remove, update) and reducers to handle these actions, along with selectors.

[ngrx official documentation](https://ngrx.io/)

# Demo

Check out the demo on StackBlitz: [Demo](https://stackblitz.com/edit/stackblitz-starters-78qyqt?file=src%2Fmain.ts)

## Installation

```bash
npm i @ea-controls/ngrx-repository@latest
```

## Configuration

Create an interface or class for your data structure (You can create a new user.adapter.ts and do it there):

```typescript
export interface UserEntity {
    id: string;
    name: string;
    description: string;
    status: string;
}
```

Create an entity adapter for your model `user.adapter.ts`:

```typescript
import { EntityAdapter } from '@ea-controls/ngrx-repository';

export const userAdapter = new EntityAdapter<UserEntity>("users", {...options});
```

Register your adapters in the module `app.config.ts for standalone component`:

```typescript
import { provideStore, provideState } from '@ngrx/store';

export const appConfig: ApplicationConfig = {
  providers: [
    ...
    provideStore(), // <-- provideStore
    provideState(userAdapter.reducer()) // <-- Add userAdapter reducer
  ],
};
```

### Add reducers and actions (Optional)

You can create your own actions and associations between actions and state changes (Reducers) `user.adapter.ts`

```ts
import { createAction, on } from "@ngrx/store";

//new action
export const removeFirstUser = createAction(`[users] custom action update by name`);

//In userAdapter you can send your associations between actions and state changes
export const userAdapter = new EntityAdapter<UserEntity>("users", {
    ons: [
        on(removeFirstUser, (state) => state.slice(1)),
    ]
});
```

### Add custom selectors

EntityAdapter exposes feature for extending selectors `user.adapter.ts`

```ts
import { createSelector } from "@ngrx/store";

export const userAdapter = new EntityAdapter<UserEntity>("users");

export const getById = (id: string) => 
    createSelector(userAdapter.feature, users => items.find(i => userAdapter.getId(i) === id));
```

Now you can use it in your components

```typescript
import { signal } from '@angular/core';
import { JsonPipe } from "@angular/common";
import { provideStore, provideState } from '@ngrx/store';
import { Store } from "@ngrx/store";

@Component({...})
export class App {
    constructor(private store: Store) { 
        this.store.select(getById).subscribe(user => console.log('User filtered by ID', user)); // <-- Using getById Selector
    }
}
```

## Usage

Use ngrx pattern. Inject the store and dispatch actions using the adapter:

```typescript
import { signal } from '@angular/core';
import { JsonPipe } from "@angular/common";
import { provideStore, provideState } from '@ngrx/store';
import { Store } from "@ngrx/store";

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <button (click)="add()">Add</button>
    <button (click)="delete()">delete First</button>

    <div style="border: solid thin blue;">
        {{ selected() | json }}
    </div>

    <div style="border: solid thin red;">
    @for (item of data(); track item) {
    <ul>
        <li> {{ item | json }} </li>
    </ul>
    }
    </div>
  `,
  imports: [JsonPipe]
})
export class App {
  constructor(private store: Store) { }

    static id: number = 0;
    data = signal<UserEntity[]>([]);
    selected = signal<UserEntity | undefined>();

    ngOnInit(): void {
        this.store.select(userAdapter.feature).subscribe(data => this.data.set(data));
        this.store.select(userAdapter.selectById("2")).subscribe(data => this.selected.set(data));
    }

    add() {
        App.id = this.data().length;

        this.store.dispatch(userAdapter.addOne({
            id: `${App.id}`,
            name: `Edwin`,
            description: "test",
            status: "active"
        }));
    }

    delete() {
      let item = this.data()[0];
      this.store.dispatch(userAdapter.removeOne(item));
    }
}
```

## Actions / Selectors

| Action/Selector  | Description                                 | Values         |
|------------------|---------------------------------------------|----------------|
| addOne(...)      | Add a new item to the collection            | Entity object / onSuccess? / onFail? |
| removeOne(...)   | Remove an item from the collection          | Entity object / onSuccess? / onFail? |
| patchOne(...)    | Update an object in the collection          | Entity object / onSuccess? / onFail? |
| setAll([...])    | Replace the entire collection with new data | Entity array                         |
| removeById(id)   | Remove an item from the collection by ID    | string / onSuccess? / onFail?        |
| feature()        | Default selector, returns entire collection | -                                    |
| selectById(id)   | Selects an item from collection by ID       | string                               |

## onSuccess/onFail

Some actions receive extra callback information that allows you to run a statement upon success or failure.

Imagine you need to remove an item, and after it is removed, you want to perform another action. To achieve this, you can follow the approach below:

> Note: By default, these callbacks are disabled. However, if you extend this library, you can provide them with new behavior using `userAdapter.actions.before.....`.

```typescript
this.store.dispatch(userAdapter.addOne({...} as UserEntity, 
    (data) => { console.log('success operation', data); }, 
    (error) => { console.error('Error while removing', error) }
));
```

### Customize ID Calculation

You can customize the ID calculation when creating the `EntityAdapter`. Use the following approach:

```typescript
import { EntityAdapter } from '@ea-controls/ngrx-repository';

export const userAdapter = new EntityAdapter<UserEntity>("users", { getId: (input) => input.userId });
```

>Note: The default ID calculation uses `item.id`.

## Extensions

You can extend `@ea-controls/ngrx-repository` creating your own effects that manages STATE, for achieving this change `{adapter}.launchBeforeActions = true` and now implement new `before actions`

```typescript
export const userAdapter = new EntityAdapter<UserEntity>("items");
userAdapter.launchBeforeActions = true;
```

Now addOne, removeOne and other methods should execute beforeActions, and you should execute action dispatchers manually

```typescript
@Injectable()
export class AdapterExtensionEffect {

    constructor(private actions$: Actions, private httpClient: HttpClient) { }

    get$ = createEffect(() => {

        return this.actions$.pipe(
            ofType(userAdapter.getAll().type),
            switchMap(action => {
                return this.httpClient.get<any>('http://myUrl.com/users')
                    .pipe(
                        map((response) => userAdapter.setAll(response)),
                        //map((response) => userAdapter.actions.setAll({ data: response })),
                        catchError((error) => of(userAdapter._erroGetAll({ error })))
                    );

            }))

    });

    save$ = createEffect(() => {

        return this.actions$.pipe(
            ofType(userAdapter.actions.beforeAddOne.type),
            switchMap(action => {
                return this.httpClient.post<any>('http://myUrl.com/users', action.data)
                    .pipe(
                        tap(response => {
                            //Using onSuccess/onFail actions
                            action.onSuccess && action.onSuccess(action.data);
                        })
                        map(response => userAdapter.addOne(response)),
                        //map((response) => userAdapter.actions.addOne({ data: response })),
                        catchError((error) => of(userAdapter._erroAddOne({ error })))
                    );

            }))

    });
}
```


## Additional

Explore more packages that extend this approach, allowing integration with different databases or APIs for data management.

1. [@ea-controls/ngrx-repository-webapi](https://www.npmjs.com/package/@ea-controls/ngrx-repository-webapi)
1. [@ea-controls/ngrx-repository-pouchdb](https://www.npmjs.com/package/@ea-controls/ngrx-repository-pouchdb)