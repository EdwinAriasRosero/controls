import { Component, input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

export type LayoutMode = 'vertical' | 'horizontal';

@Component({
  selector: 'ea-layout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  encapsulation: ViewEncapsulation.None
})
export class LayoutComponent {

  mode = input<LayoutMode>('vertical');

}
