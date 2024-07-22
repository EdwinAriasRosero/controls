# repository-pouchDb

Extend `@ea-controls/ngrx-repository` for using local pouchdb database storage in localStorage.

[ngrx official documentation](https://ngrx.io/)

[@ea-controls/ngrx-repository](https://www.npmjs.com/package/@ea-controls/ngrx-repository)

[pouchDb](https://pouchdb.com/)

## Installation

```bash
npm i @ngrx/store@latest
npm i @ea-controls/ngrx-repository@latest
npm i @ea-controls/ngrx-repository-pouchdb@latest
```

## Configuration

Follow the same configuration steps as `@ea-controls/ngrx-repository`. Afterward, configure the web API effects:

```typescript
import { PouchDbEffect, PouchDbEffectRegister } from "@ea-controls/ngrx-repository-webapi";

export const userAdapter = new EntityAdapter<UserEntity>("items");

PouchDbEffectRegister.register(userAdapter);
// Register other adapters as needed

PouchDbEffectRegister.configure({
    idField: 'userId'
});

export const appConfig: ApplicationConfig = {
  providers: [
    ...
    provideEffects(PouchDbEffect)
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

## PouchDbEffectRegister Options

Configure `@ea-controls/ngrx-repository-pouchdb` for flexible data transformation and URL formats.

| Option                  | Description                                          | Input                                   | Output                         |
|-------------------------|------------------------------------------------------|-----------------------------------------|--------------------------------|
| idField                 | Entity Id field           | sring   | - |