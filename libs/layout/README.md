# Layout

The Layout component allows flexible positioning options with the ability to choose between vertical and horizontal layouts.

# Demo

Check out the demo on StackBlitz: [Demo](https://stackblitz.com/edit/stackblitz-starters-pppgnh?file=src%2Fmain.ts)

# Installation

```bash
npm i @ea-controls/layout
```

# Instructions

## Modules

Import the `LayoutComponent` from `@ea-controls/layout` in your TypeScript file:

```ts
import { LayoutComponent } from '@ea-controls/layout';
```

## Usage

Apply these CSS rules to your main container tags (`html`, `body`, and `app-root`) in your `styles.scss`:

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

Use the `<ea-layout>` tag to start defining your layout. You can use optional attributes in your sections:

- `ea-header`
- `ea-footer`
- `ea-left-sidebar`
- `ea-right-sidebar`

By default, all positioned sections are fixed, and content has overflow (which can be overridden with styles if necessary).

```html
<ea-layout mode="vertical | horizontal">

    <section ea-header style="background-color: yellow;">
        Header
    </section>

    <section ea-left-sidebar style="background-color: aqua;">
        Left Sidebar
    </section>

    <section ea-right-sidebar style="background-color: bisque;">
        Right Sidebar
    </section>

    <section ea-footer style="background-color: lightgreen;">
        Footer
    </section>

    <!-- Your main content goes here -->

</ea-layout>
```

# Result

### Vertical Layout

![Vertical layout](https://github.com/EdwinAriasRosero/controls/blob/main/libs/layout/assets/vertical.png?raw=true)

### Horizontal Layout

![Horizontal layout](https://github.com/EdwinAriasRosero/controls/blob/main/libs/layout/assets/horizontal.png?raw=true)