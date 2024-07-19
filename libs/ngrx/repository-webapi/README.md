# repository-webapi

Extend `@ea-controls/ngrx-repository` to make API calls using the same adapter action calls.

[ngrx official documentation](https://ngrx.io/)

[@ea-controls/ngrx-repository](https://link-to-your-package)

## Installation

```bash
npm i @ngrx/store@latest
npm i @ea-controls/ngrx-repository@latest
npm i @ea-controls/ngrx-repository-webapi@latest
```

## Configuration

Follow the same configuration steps as `@ea-controls/ngrx-repository`. Afterward, configure the web API effects:

```typescript
import { WebApiEffect, WebApiEffectRegister } from "@ea-controls/ngrx-repository-webapi";

export const userAdapter = new EntityAdapter<UserEntity>("items");

WebApiEffectRegister.register(userAdapter);
// Register other adapters as needed

WebApiEffectRegister.configure({
  urlBase: `http://localhost:3000`
});

export const appConfig: ApplicationConfig = {
  providers: [
    ...
    provideEffects(WebApiEffect)
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

## WebApiEffectRegister Options

Configure `@ea-controls/ngrx-repository-webapi` for flexible data transformation and URL formats.

| Option                  | Description                                          | Input                                   | Output                         |
|-------------------------|------------------------------------------------------|-----------------------------------------|--------------------------------|
| urlBase                 | Base URL for all API requests                        | -                                       | -                              |
| transformGetResponse    | Transform data before updating the ngrx model        | data returned by httpClient.get method   | Processed data by user         |
| transformPostData       | Modify data before making httpClient.post request     | data sent in ngrx action                | Processed data by user         |
| transformPatchData      | Modify data before making httpClient.patch request    | data sent in ngrx action                | Processed data by user         |
| transformRemoveData     | Modify data before making httpClient.delete request   | data sent in ngrx action                | Processed data by user         |
| getId                   | Calculate ID used in delete/patch and other operations| data sent in ngrx action                | New ID (string)                |
| getUrl                  | URL used in httpClient.get method                    | Current adapter name                    | URL string (default `${urlBase}/${adapterName}`) |
| postUrl                 | URL used in httpClient.post method                   | Current adapter name                    | URL string (default `${urlBase}/${adapterName}`) |
| patchUrl                | URL used in httpClient.patch method                  | Current adapter name, ID                | URL string (default `${urlBase}/${adapterName}/${id}`) |
| removeUrl               | URL used in httpClient.delete method                 | Current adapter name, ID                | URL string (default `${urlBase}/${adapterName}/${id}`) |

### Customize ID Calculation

You can customize the ID calculation when creating the `EntityAdapter`. Use the following approach:

```typescript
import { EntityAdapter } from '@ea-controls/ngrx-repository';

export const userAdapter = new EntityAdapter<UserEntity>("users", (item) => `${item.id}.${item.name}`);
```

>Note: The default ID calculation uses `item.id`.

## Additional Information

Explore additional packages that extend this approach, enabling integration with different databases or APIs for data management.
