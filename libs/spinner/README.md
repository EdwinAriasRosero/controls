# Spinner

The Spinner component provides a circular progress indicator.

# Demo

Check out the demo on StackBlitz: [Demo](https://stackblitz.com/edit/stackblitz-starters-coddjt?file=src%2Fmain.ts)

# Installation

```bash
npm i @ea-controls/spinner
```

# Instructions

## Modules

Import `SpinnerComponent` from `@ea-controls/spinner` in your TypeScript file:

```ts
import { SpinnerComponent } from '@ea-controls/spinner';
```

## Usage

Add the `<ea-spinner>` tag in your `app.component.html`. You can optionally specify a color attribute.

```html
<ea-spinner color="red"></ea-spinner>
```

In your component, inject `SpinnerService` and use its methods `show(message?)` or `hide()` to control the spinner:

```ts
import { SpinnerService } from '@ea-controls/spinner';
import { timer } from 'rxjs';

constructor(private spinnerService: SpinnerService) {
    this.spinnerService.show("Saving data...");

    timer(1000).subscribe(_ => {
        this.spinnerService.show("Data saved...");
    });

    timer(2000).subscribe(_ => {
        this.spinnerService.show("Loading data...");
    });

    timer(3000).subscribe(_ => {
        this.spinnerService.hide();
    });
}
```

> Note: `color` and `message` inputs in `<ea-spinner>` are optional.

You can also customize the content inside `<ea-spinner>` if needed:

```html
<ea-spinner>
    <img src="img.gif">
</ea-spinner>
```

## Result

![Spinner](https://github.com/EdwinAriasRosero/controls/blob/main/libs/spinner/assets/spinner.PNG?raw=true)

## Custom Content

You can customize the spinner content as shown below:

![Custom Spinner](https://github.com/EdwinAriasRosero/controls/blob/main/libs/spinner/assets/spinner-custom.PNG?raw=true)
