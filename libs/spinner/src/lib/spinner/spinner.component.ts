import { Component, signal, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerService } from './spinner.service';

export type SpinnerInto = {
  status: boolean;
  message?: string;
};

@Component({
  selector: 'ea-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
  @if (spinner.spinnerStatus().status) {
    <div class="spinner-container" [style.color]="color()">

      @if (template){
        <ng-container *ngTemplateOutlet="template" />
      } @else {
        <div class="spinner" [style.border-left-color]="color()"></div>
      }

      @if (spinner.spinnerStatus().message){
        <div class="message" >{{ spinner.spinnerStatus().message }}</div>
      }
    </div>
  }`,
  styleUrl: './spinner.component.css',
})
export class SpinnerComponent {

  color = signal("white");
  template: TemplateRef<any> | undefined;

  constructor(public spinner: SpinnerService) { }
}
