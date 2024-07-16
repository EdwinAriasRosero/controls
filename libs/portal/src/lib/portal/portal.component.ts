import { Component, effect, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Portal, PortalModule } from "@angular/cdk/portal";
import { Subscription } from 'rxjs';
import { PortalService } from './portal.service';

@Component({
  selector: 'ea-portal, *[ea-portal]',
  standalone: true,
  imports: [CommonModule, PortalModule],
  template: `
  @if (selectedPortal) {
    <ng-template [cdkPortalOutlet]="selectedPortal"></ng-template>
  }`
})
export class PortalComponent<T> {

  name = input('');
  selectedPortal!: Portal<T>;

  private subscription?: Subscription;

  constructor(private portalService: PortalService) {

    effect(() => {
      this.subscription?.unsubscribe();

      this.subscription = this.portalService.subscribe(this.name(), domportal => {
        this.selectedPortal = domportal;
      });
    });

  }
}



