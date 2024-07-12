# Portal

Portal moves html content from component A to component B

# Demo

https://stackblitz.com/edit/stackblitz-starters-jsxndn?file=src%2Fmain.ts

## Dependencies

1. @angular/cdk@18.x.x

# Installation
> npm i @control-ea/portal

# Instructions

## Modules
```ts
import { PortalComponent, PortalContentComponent } from '@control-ea/portal';
```

## Use

In component `A` adds global position

```hmtl
Parent Component
<ea-portal name="my-name" />
```

In component `B` adds the content to be showed in global position
```hmtl
<ea-portal-content name="my-name">
    My child content
<ea-portal-content>
```

> Note: name attribute must be the same for sharing content betwwen parent and child components
