# Slidder

Control to show a carousel with content defined by user

# Demo

https://stackblitz.com/edit/stackblitz-starters-coddjt?file=src%2Fmain.ts

# Installation
> npm i @ea-controls/slidder

# Instructions

## Modules
```ts
import { SlidderComponent, SlidderItemDirective } from "@ea-controls/slidder";
```

## Usage

In component `A` adds global position

```hmtl
<div ea-slidder style="width: 100%; height: 300px;">
    <div class="bg-image1" *ea-slidder-item>Content in my slide</div>
    <div class="bg-image2" *ea-slidder-item></div>
    <div class="bg-image3" *ea-slidder-item></div>
</div>
```

```css
.bg-image1 {  background-image: url("https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"); }
.bg-image2 {  background-image: url("https://media.istockphoto.com/id/1489732075/photo/dumpy-tree-frog-sitting-on-branch.jpg?b=1&s=170667a&w=0&k=20&c=sqzeuxnDiu97GcMl3H-ZL0cmYdyuxH5MIcfVg3zz83I="); }
.bg-image3 {  background-image: url("https://cdn.create.vista.com/api/media/small/7201773/stock-photo-green-frog");
```

## Options

<table>
<thead>
    <tr>
        <th>Property</th>
        <th>Description</th>
        <th>Values</th>
    </tr>
</thead>
<tbody>
    <tr>
        <td>interval</td>
        <td>Time in ms to change sliders</td>
        <td>number</td>
    </tr>
    <tr>
        <td>showIndicator</td>
        <td>Show/Hide indicator of current slide item</td>
        <td>boolean</td>
    </tr>
    <tr>
        <td>showNavigation</td>
        <td>Show/Hide navigation arrows</td>
        <td>boolean</td>
    </tr>
</tbody>
<table>