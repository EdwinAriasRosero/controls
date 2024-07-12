# Spinner

Add a circular indicator of progress

# Installation
> npm i @control-ea/spinner

# Instructions

## Modules
```ts
import { SpinnerComponent } from '@control-ea/spinner';
```

## Use

Add in `app.component.html` the tag `<ea-spinner color="{optional}" />`

> Note: only add this tag once.

```hmtl app.component.ts
<ea-spinner color="red" />
```

In components now you can inject `SpinnerService` and use its methods `show(message?)` or `hide()`

```ts
constructor(private spinnerService: SpinnerService) {

    this.spinnerService.show("Saving data...");

    timer(1000).subscribe(_ => {
        this.spinnerService.show("Data saved...");
    })

    timer(2000).subscribe(_ => {
        this.spinnerService.show("Loading data...");
    })

    timer(3000).subscribe(_ => {
        this.spinnerService.hide();
    });

}
```

> Note: color and message inputs are optional
> Note: You can send optional content in `<ea-spinner> <img src="img.gif"> </ea-spinner>` if you want to customize spinner, services you can continue using in same way

## Result

![Spinner](https://github.com/EdwinAriasRosero/controls/blob/main/libs/spinner/assets/spinner.png?raw=true)

## Custom content

![Custom spinner](https://github.com/EdwinAriasRosero/controls/blob/main/libs/spinner/assets/spinner-custom.png?raw=true)
