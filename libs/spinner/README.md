# Spinner

The Spinner component provides a circular progress indicator.

# Demo

Check out the demo on StackBlitz: [Demo](https://stackblitz.com/edit/stackblitz-starters-coddjt?file=src%2Fmain.ts)

# Installation

```bash
npm i @ea-controls/spinner
```

# Configuration

```ts
// app.config.ts

import { provideEaSpinner } from '@ea-controls/spinner';

export const appConfig: ApplicationConfig = {
  providers: [
    ...
    provideEaSpinner({ // <-- provide spinner
        color?: string // <-- default color is white
    })
  ],
};
```

# Usage

In your component, inject `SpinnerService` and use its methods `show(message?)` or `hide()` to control the spinner:

```ts
// app.component.ts

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

## Customization

You can change spinner animation, follow below instructions, use structural directive `*ea-spinner-template`

```html
<!-- app.component.html -->

<div *ea-spinner-template>
    <img src="https://cdn.pixabay.com/animation/2022/09/16/21/13/21-13-08-279_512.gif" />
</div>
```

## Result

![Spinner](https://github.com/EdwinAriasRosero/controls/blob/main/libs/spinner/assets/spinner.PNG?raw=true)

## Custom Content

You can customize the spinner content as shown below:

![Custom Spinner](https://github.com/EdwinAriasRosero/controls/blob/main/libs/spinner/assets/spinner-custom.PNG?raw=true)
