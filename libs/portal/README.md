# Portal

The Portal component facilitates moving HTML content from one component (Component A) to another (Component B).

# Demo

Check out the demo on StackBlitz: [Demo](https://stackblitz.com/edit/stackblitz-starters-jsxndn?file=src%2Fmain.ts)

## Dependencies

- @angular/cdk@18.x.x

# Installation

```bash
npm i @ea-controls/portal
```

# Instructions

## Modules

Import the `PortalComponent` and `PortalContentComponent` from `@ea-controls/portal` in your TypeScript file:

```ts
import { PortalComponent, PortalContentComponent } from '@ea-controls/portal';
```

## Usage

### ea-portal

In Component A, define the global position where content will be moved:

```html
<!-- Parent Component -->
<ea-portal name="my-name" />
```

Alternatively, you can use a `<div>` approach:

```html
<!-- Parent Component -->
<div ea-portal name="my-name" />
```

### ea-portal-content

In Component B, specify the content to be shown in the global position identified by the same `name` attribute:

```html
<ea-portal-content name="my-name">
    My child content
</ea-portal-content>
```

> Note: The `name` attribute must be identical in both the parent and child components to share content effectively.
