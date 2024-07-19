# Repository

Simplify ngrx boilerplate for managing arrays of objects.

App often involves tables or collections of data. When using ngrx, developers typically create actions (add, remove, update) and reducers to handle these actions, along with selectors.

[ngrx official documentation](https://ngrx.io/)

## Installation

```bash
npm i @ngrx/store@latest
npm i @ea-controls/ngrx-repository@latest
```

## Configuration

Create an interface or class for your data structure:

```typescript
export interface UserEntity {
    id: string;
    name: string;
    description: string;
    status: string;
}
```

Create an entity adapter for your model:

```typescript
import { EntityAdapter } from '@ea-controls/ngrx-repository';

export const userAdapter = new EntityAdapter<UserEntity>("users");
```

Register your adapters in the module:

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    ...
    provideStore(),
    provideState(userAdapter.reducer())
  ],
};
```

## Usage

Use ngrx patterns. Inject the store and call actions using the adapter:

```typescript
import { Store } from "@ngrx/store";

@Component({...})
export class AddComponent {
    constructor(private store: Store) { }

    data: UserEntity[] = [];
    selected: UserEntity | undefined;

    ngOnInit(): void {
        this.store.select(userAdapter.feature).subscribe(data => this.data = data);
        this.store.select(userAdapter.selectById("2")).subscribe(data => this.selected = data);
    }

    add() {
        this.store.dispatch(userAdapter.addOne({
            id: `{new id}`,
            name: `Edwin`,
            description: "repository test",
            status: "active"
        }));
    }

    delete() {
        this.store.dispatch(userAdapter.removeOne({ id: this.data[0].id }));
    }
}
```

## Actions / Selectors

| Action/Selector  | Description                                | Values         |
|------------------|--------------------------------------------|----------------|
| addOne(...)      | Add a new item to the collection           | Entity object  |
| removeOne(...)   | Remove an item from the collection          | Entity object  |
| patchOne(...)    | Update an object in the collection          | Entity object  |
| setAll([...])    | Replace the entire collection with new data | Entity array   |
| removeById(id)   | Remove an item from the collection by ID    | string         |
| feature()        | Default selector, returns entire collection | -              |
| selectById(id)   | Selects an item from collection by ID       | string         |

### Customize ID Calculation

You can customize the ID calculation when creating the `EntityAdapter`. Use the following approach:

```typescript
import { EntityAdapter } from '@ea-controls/ngrx-repository';

export const userAdapter = new EntityAdapter<UserEntity>("users", (item) => `${item.id}.${item.name}`);
```

>Note: The default ID calculation uses `item.id`.

## Additional

Explore more packages that extend this approach, allowing integration with different databases or APIs for data management.

1. [@ea-controls/ngrx-repository-webapi](https://www.npmjs.com/package/@ea-controls/ngrx-repository-webapi)