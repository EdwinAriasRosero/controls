# Slidder

The Slidder component allows users to create a carousel with customizable content.

# Demo

Check out the demo on StackBlitz: [Demo](https://stackblitz.com/edit/stackblitz-starters-ggdtzg?file=src%2Fmain.ts)

# Installation

```bash
npm i @ea-controls/slidder
```

# Instructions

## Modules

Import `SlidderComponent` and `SlidderItemDirective` from `@ea-controls/slidder` in your TypeScript file:

```ts
import { SlidderComponent, SlidderItemDirective } from "@ea-controls/slidder";
```

## Usage

In Component A, define the Slidder with customizable content:

```html
<div ea-slidder style="width: 100%; height: 300px;">
    <div class="bg-image1" *ea-slidder-item>Content in my slide</div>
    <div class="bg-image2" *ea-slidder-item></div>
    <div class="bg-image3" *ea-slidder-item></div>
</div>
```

Add corresponding CSS classes for background images:

```css
.bg-image1 { background-image: url("https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"); }
.bg-image2 { background-image: url("https://media.istockphoto.com/id/1489732075/photo/dumpy-tree-frog-sitting-on-branch.jpg?b=1&s=170667a&w=0&k=20&c=sqzeuxnDiu97GcMl3H-ZL0cmYdyuxH5MIcfVg3zz83I="); }
.bg-image3 { background-image: url("https://cdn.create.vista.com/api/media/small/7201773/stock-photo-green-frog"); }
```

## Options

| Property        | Description                          | Values  |
|-----------------|--------------------------------------|---------|
| interval        | Time in ms to change sliders         | number  |
| showIndicator   | Show/Hide indicator of current slide item | boolean |
| showNavigation  | Show/Hide navigation arrows           | boolean |
