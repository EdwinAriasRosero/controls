# repository-pouchDb

Extend `@ea-controls/ngrx-repository` for using local pouchdb database storage in localStorage.

[ngrx official documentation](https://ngrx.io/)

[@ea-controls/ngrx-repository](https://www.npmjs.com/package/@ea-controls/ngrx-repository)

[pouchDb](https://pouchdb.com/)

## Installation

```bash
npm i @ea-controls/ngrx-repository-pouchdb@latest
```

## Configuration

Follow the same configuration steps as `@ea-controls/ngrx-repository`. Afterward, configure the web API effects:

Register in app.config.ts (standalone components) the following code

```typescript
import { EntityAdapter } from "@ea-controls/ngrx-repository";
import { provideRepositoryPouchDb } from "@ea-controls/ngrx-repository-pouchdb";

export const userAdapter = new EntityAdapter<UserEntity>("items");

export const appConfig: ApplicationConfig = {
  providers: [
    ...
    provideRepositoryPouchDb({
      adapters: [userAdapter], // <-- Add your adapters
      idField: 'userId' // <-- Default id field
      ... // <-- Other options
    })
  ],
};
```

## Usage

Follow the same usage instructions as `@ea-controls/ngrx-repository`.

>Note: For fetching data for the first time, you should call the `getAll()` method manually.

```typescript
@Component({...})
export class RepositoryComponentWrap implements OnInit {
    
    constructor(private store: Store) { }

    ngOnInit(): void {
        this.store.dispatch(userAdapter.getAll());
    }
}
```

## provideRepositoryPouchDb Options

Configure `@ea-controls/ngrx-repository-pouchdb` for flexible data transformation and URL formats.

| Option                  | Description                                          | Input                                   | Output                         |
|-------------------------|------------------------------------------------------|-----------------------------------------|--------------------------------|
| idField                 | Entity Id field           | sring   | - |
| getDb                 | Callback for building PouchDb instance           | EntityAdapter   | Returns new instance of PouchDb, if you extend this consider caching your db instances |