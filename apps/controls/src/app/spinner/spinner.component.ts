import { Component } from "@angular/core";
import { SpinnerComponent, SpinnerService } from '@ea-spinner';
import { timer } from "rxjs";

@Component({
    selector: 'app-layout',
    template: `<ea-spinner><img src="https://i.pinimg.com/originals/ab/76/17/ab761745f01df090ec38b827dd65e58a.gif" /></ea-spinner>`,
    standalone: true,
    imports: [SpinnerComponent]
})
export class SpinnerComponentWrap {

    constructor(private spinnerService: SpinnerService) {

        this.spinnerService.show("Saving data...");

        timer(1000).subscribe(_ => {
            this.spinnerService.show("Data saved...");
        })

        timer(2000).subscribe(_ => {
            this.spinnerService.show("Loading data...");
        })

        // timer(3000).subscribe(_ => {
        //     this.spinnerService.hide();
        // });

    }
}