# repository-webapi

Extends `@ea-controls/ngrx-repository` making calls to web api with same adapter action calls

[ngrx official documentation](https://ngrx.io/)

[@ea-controls/ngrx-repository]()

## Installation

> npm i @ngrx/store@latest

> npm i @ea-controls/ngrx-repository@latest

> npm i @ea-controls/ngrx-repository-webapi@latest

## Configuration

Follow same configuration instructions of `@ea-controls/ngrx-repository`, after you can configure web api effects

```ts
import { WebApiEffect, WebApiEffectRegister } from "@ea-controls/ngrx-repository-webapi";

export const userAdapter = new EntityAdapter<UserEntity>("items");

WebApiEffectRegister.register(userAdapter);
WebApiEffectRegister.register(...);
WebApiEffectRegister.register(...);

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

Follow same usage instructions of `@ea-controls/ngrx-repository`

>Note: For getting data first time you should call manually

```ts
@Component(...)
export class RepositoryComponentWrap implements OnInit {
    
    constructor(private store: Store) { }

    ngOnInit(): void {
        this.store.dispatch(userAdapter.getAll());
    }
}
```

## Configuration

`@ea-controls/ngrx-repository-webapi` allows users to configure multiple data transformation and url format in order to be more flexible

### WebApiEffectRegister options

<table>
<thead>
    <tr>
        <th>Option</th>
        <th>Description</th>
        <th>Input</th>
        <th>Output</th>
    </tr>
</thead>
<tbody>
    <tr>
        <td>urlBase</td>
        <td>Url used to make all the petitions</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>tranformGetResponse(data, action)</td>
        <td>Allows to transform data before updating the ngrx model</td>
        <td>`data` returned by httpClient get method, `action` has entity adapter name</td>
        <td>New data processed by user</td>
    </tr>
    <tr>
        <td>tranformPostData(data, action)</td>
        <td>Modify the data before making httpClient.post request</td>
        <td>`data` send in ngrx action, `action` has entity adapter name</td>
        <td>New data processed by user</td>
    </tr>
    <tr>
        <td>tranformPatchData(data, action)</td>
        <td>Modify the data before making httpClient.post request</td>
        <td>`data` send in ngrx action, `action` has entity adapter name</td>
        <td>New data processed by user</td>
    </tr>
    <tr>
        <td>tranformRemoveData(data, action)</td>
        <td>Modify the data before making httpClient.delete request</td>
       <td>`data` send in ngrx action, `action` has entity adapter name</td>
        <td>New data processed by user</td>
    </tr>
    <tr>
        <td>getId: (data: any)</td>
        <td>Allows to calculate used in delete/patch and other operations</td>
       <td>`data` send in ngrx action</td>
        <td>New id, string</td>
    </tr>
    <tr>
        <td>getUrl: (action: any)</td>
        <td>Url used in httpCliend.get method</td>
        <td>Current adapter name</td>
        <td>get url string, by default `${urlBase}/${apdaterName}`</td>
    </tr>
    <tr>
        <td>postUrl: (action: any)</td>
        <td>Url used in httpCliend.post method</td>
        <td>Current adapter name</td>
        <td>get url string, by default `${urlBase}/${apdaterName}`</td>
    </tr>
    <tr>
        <td>patchUrl: (action: any)</td>
        <td>Url used in httpCliend.patch method</td>
        <td>Current adapter name</td>
        <td>get url string, by default `${urlBase}/${apdaterName}/${id}`</td>
    </tr>
    <tr>
        <td>removeUrl: (action: any)</td>
        <td>Url used in httpCliend.delete method</td>
        <td>Current adapter name</td>
        <td>get url string, by default `${urlBase}/${apdaterName}/${id}`</td>
    </tr>
</tbody>
<table>
