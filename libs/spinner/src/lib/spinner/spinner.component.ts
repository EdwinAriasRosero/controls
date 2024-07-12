import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerService } from './spinner.service';

@Component({
  selector: 'ea-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `@if (spinner.spinnerStatus().status) {
  <div class="spinner-container" [style.color]="color()">

    <ng-content>
      <div class="spinner" [style.border-left-color]="color()"></div>
    </ng-content>

    @if (spinner.spinnerStatus().message){
      <div class="message" >{{ spinner.spinnerStatus().message }}</div>
    }
  </div>
  }`,
  styleUrl: './spinner.component.css',
})
export class SpinnerComponent {

  color = input('blue');

  constructor(public spinner: SpinnerService) { }
}

export type SpinnerInto = {
  status: boolean;
  message?: string;
};
