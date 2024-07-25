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
import { PouchDbEffect, PouchDbEffectRegister } from "@ea-controls/ngrx-repository-pouchdb";
import { provideEffects } from '@ngrx/effects';
import { EntityAdapter } from "@ea-controls/ngrx-repository";

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