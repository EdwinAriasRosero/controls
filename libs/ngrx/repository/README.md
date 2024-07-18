# repository

Avoid ngrx boilerplate for array of objects

App usually has table or collections of data, when developer tries to use ngrx it has to create actions (add, remove, update and add), also reducers for handling those actions and selectors

[ngrx official documentation](https://ngrx.io/)

## Installation

> npm i @ngrx/store@latest

> npm i @ea-controls/ngrx-repository@latest

## Configuration

Create an interface or class with your data structure

```ts
export interface UserEntity {
    id: string;
    name: string;
    description: string;
    status: string;
}
```

Create an entity adapter of your model

```ts
import { EntityAdapter } from '@ea-controls/ngrx-repository';

export const userAdapter = new EntityAdapter<UserEntity>("users");
```

Register your adapters in module

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    ...
    provideStore(),
    provideState(userAdapter.reducer())
  ],
};
```

## Usage

Follow same use of ngrx, you can inject an store and call actions from adapter

```ts
import { Store } from "@ngrx/store";

@Component({...})
export class AddComponent
{
    constructor(private store: Store) { }
}
```

Now you can use the predefined actions/selectors in adapter

```ts
@Component({...})
export class AddComponent
{
    constructor(private store: Store) { }

    data = signal<UserEntity[]>([]);
    selected = signal<UserEntity | undefined>(undefined);

    ngOnInit(): void {
        this.store.select(userAdapter.feature).subscribe(data => this.data.set(data))
        this.store.select(userAdapter.selectById("2")).subscribe(data => this.selected.set(data))
    }

    add() {
        this.store.dispatch(userAdapter.addOne({
            data: {
                id: `{new id}`,
                name: `Edwin`,
                description: "repository test",
                status: "active"
            }
        }))
    }

    delete() {
        this.store.dispatch(userAdapter.removeOne({ data: this.data()[0] }));
    }
}
```

## Actions / Selectors

<table>
<thead>
    <tr>
        <th>Action/Selector</th>
        <th>Description</th>
        <th>Values</th>
    </tr>
</thead>
<tbody>
    <tr>
        <td>addOne(...)</td>
        <td>Allows to add new item in the collection</td>
        <td>Entity object</td>
    </tr>
    <tr>
        <td>removeOne(...)</td>
        <td>Remove one item from collection</td>
        <td>Entity object</td>
    </tr>
    <tr>
        <td>patchOne(...)</td>
        <td>Update object in ngrx collection</td>
        <td>Entity object</td>
    </tr>
    <tr>
        <td>setAll([...])</td>
        <td>Replace whole collection with data array</td>
        <td>Entity object array</td>
    </tr>
    <tr>
        <td>removeById(id)</td>
        <td>Allows to remove one item from collection depending on id</td>
        <td>string</td>
    </tr>
    <tr>
        <td>feature()</td>
        <td>Default selector, return complete collection data</td>
        <td></td>
    </tr>
    <tr>
        <td>selectById(id)</td>
        <td>Return first coincidence of data depending on id</td>
        <td>string</td>
    </tr>
</tbody>
<table>

### Customize Id calculation

When entityAdapter is created the constructor allows to customize id calculation, follow next approach if you need to change this

```ts
import { EntityAdapter } from '@ea-controls/ngrx-repository';

export const userAdapter = new EntityAdapter<UserEntity>("users", (item) => `${item.id}.${item.name}` );
```

>Note: Consider default id is `item.id` 

## Additional

Check more packages for extending this approach allowing to use different dbs/apis for connecting data 