# Layout

Layout with usual position designed with flex, it allows user to choose between vertical and horizontal position

# Demo

https://stackblitz.com/edit/stackblitz-starters-pppgnh?file=src%2Fmain.ts

# Installation
> npm i @control-ea/layout

# Instructions

## Modules

```ts
import { LayoutComponent } from '@control-ea/layout';
```

## Use

Apply classes to parent tags (Usually html, body and app-root), this should be in styles.scss

```css
html,
body,
app-root {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}
```

Use &lt;ea-layout&gt; tag for starting, after you can use optional attributes in your sections

1. ea-header
1. ea-footer
1. ea-left-sidebar
1. ea-right-sidebar

> Note: All the position sections are fixed, by default content has overflow (It can be replaced by styles if needed)

```html
<ea-layout mode="vertical | horizontal">

    <section ea-header style="background-color: yellow;">
        Header
    </section>

    <section ea-left-sidebar style="background-color: aqua;">
        Left
    </section>

    <section ea-right-sidebar style="background-color: bisque;">
        Right
    </section>

    <section ea-footer style="background-color: lightgreen;">
        Footer
    </section>

    My content

</ea-layout>
```

# Result

### Vertical

![Vertical layout](https://github.com/EdwinAriasRosero/controls/blob/main/libs/layout/assets/vertical.png?raw=true)


### Horizontal

![Horizontal layout](https://github.com/EdwinAriasRosero/controls/blob/main/libs/layout/assets/horizontal.png?raw=true)