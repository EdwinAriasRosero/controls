import { Component, signal } from "@angular/core";
import { SpinnerService, SpinnerTemplateDirective } from '@ea-controls/spinner';
import { timer } from "rxjs";

@Component({
    selector: 'app-layout',
    template: `<button (click)="show(false)">show default</button>
        <button (click)="show(true)">show custom</button>
        
        @if (showCustom()){
            <div *ea-spinner-template>
                <img src="https://cdn.pixabay.com/animation/2022/09/16/21/13/21-13-08-279_512.gif" />
            </div>
        }
    `,
    standalone: true,
    imports: [SpinnerTemplateDirective]
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