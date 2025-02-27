# repository-webapi

Extend `@ea-controls/ngrx-repository` to make API calls using the same adapter action calls.

[ngrx official documentation](https://ngrx.io/)

[@ea-controls/ngrx-repository](https://www.npmjs.com/package/@ea-controls/ngrx-repository)

## Installation

```bash
npm i @ea-controls/ngrx-repository-webapi@latest
```

## Configuration

Follow the same configuration steps as `@ea-controls/ngrx-repository`. Afterward, configure the web API effects:

Register in app.config.ts (standalone components) the following code

```typescript

import { EntityAdapter } from "@ea-controls/ngrx-repository";
import { provideRepositoryWebApi } from "@ea-controls/ngrx-repository-webapi";

export const userAdapter = new EntityAdapter<UserEntity>("items");

export const appConfig: ApplicationConfig = {
  providers: [
    ...
    provideRepositoryWebApi({
      adapters: [userAdapter], // <-- Add your adapters
      urlBase: `http://localhost:3000` // <-- Api url base
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

## provideRepositoryWebApi Options

Configure `@ea-controls/ngrx-repository-webapi` for flexible data transformation and URL formats.

| Option                  | Description                                          | Input                                   | Output                         |
|-------------------------|------------------------------------------------------|-----------------------------------------|--------------------------------|
| urlBase                 | Base URL for all API requests                        | -                                       | -                              |
| transformResponse       | Transform data before updating the ngrx model        | data returned by httpClient.get method   | Processed data by user         |
| tranformBeforeSendingData       | Modify data before making httpClient.[post/patch/delete] request     | data sent in ngrx action                | Processed data by user         |
| getUrl                  | URL used in httpClient.get method                    | Current EntityAdapter                   | URL string (default `${urlBase}/${adapterName}`) |
| postUrl                 | URL used in httpClient.post method                   | Current EntityAdapter and data          | URL string (default `${urlBase}/${adapterName}`) |
| patchUrl                | URL used in httpClient.patch method                  | Current EntityAdapter and data          | URL string (default `${urlBase}/${adapterName}/${id}`) |
| removeUrl               | URL used in httpClient.delete method                 | Current EntityAdapter and data          | URL string (default `${urlBase}/${adapterName}/${id}`) |
| updateWithPatch         | If update should be patch or put verb                | true/false                              | - |
