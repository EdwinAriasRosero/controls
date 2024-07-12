import { Component, signal } from "@angular/core";
import { SpinnerComponent, SpinnerService } from '@ea-spinner';
import { timer } from "rxjs";

@Component({
    selector: 'app-layout',
    template: `<button (click)="show(false)">show default</button>
        <button (click)="show(true)">show custom</button>

        @if (!showCustom()) {
            <ea-spinner />
        } @else {
            <ea-spinner>
                <img src="https://i.pinimg.com/originals/ab/76/17/ab761745f01df090ec38b827dd65e58a.gif" />
            </ea-spinner>
        }`,
    standalone: true,
    imports: [SpinnerComponent]
})
export class SpinnerComponentWrap {

    showCustom = signal(false);

    constructor(private spinnerService: SpinnerService) { }

    show(custom: boolean) {
        this.showCustom.set(custom);

        this.spinnerService.show('Saving data...');

        timer(1000).subscribe((_) => {
            this.spinnerService.show('Data saved...');
        });

        timer(2000).subscribe((_) => {
            this.spinnerService.show('Loading data...');
        });

        timer(3000).subscribe((_) => {
            this.spinnerService.hide();
        });
    }
}