import { Component, contentChildren, Directive, effect, input, OnDestroy, signal, TemplateRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';

@Directive({
  selector: '[ea-slidder-item]',
  standalone: true
})
export class SlidderItemDirective<T> {
  constructor(public templateRef: TemplateRef<T>) { }
}


@Component({
  selector: '[ea-slidder]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slidder.component.html',
  styleUrl: './slidder.component.css',
  encapsulation: ViewEncapsulation.None
})
export class SlidderComponent implements OnDestroy {

  items = contentChildren<SlidderItemDirective<any>>(SlidderItemDirective);
  interval = input(3000);
  currentVisible = signal(0);
  showIndicator = signal(true);
  showNavigation = signal(true);
  subscription?: Subscription;

  constructor() {

    effect(() => {
      this.subscription?.unsubscribe();

      if (this.items().length > 0 && this.interval() !== 0) {
        this.subscription = interval(this.interval()).subscribe(_ => this.next());
      }

    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  next(): void {
    this.currentVisible.update(current => ((current + 2 > this.items().length) ? 0 : current + 1));
  }

  previous(): void {
    this.currentVisible.update(current => current > 0 ? current - 1 : this.items().length - 1);
  }

  exact(value: number) {
    this.currentVisible.set(value);
  }

}