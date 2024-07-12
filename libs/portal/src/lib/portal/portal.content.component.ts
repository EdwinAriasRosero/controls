import { DomPortal } from "@angular/cdk/portal";
import { Component, OnDestroy, viewChild, input, effect } from "@angular/core";
import { PortalService } from './portal.service';

@Component({
  selector: 'ea-portal-content',
  template: `<div #domPortalContent>
      <ng-content />
    </div>`,
  standalone: true
})
export class PortalContentComponent<T> implements OnDestroy {

  private domPortalContent = viewChild.required<T>('domPortalContent');
  private domPortal!: DomPortal<T>;

  name = input('');

  constructor(private portalService: PortalService) {

    effect(() => {
      if (this.name() && this.domPortalContent()) {
        this.domPortal = new DomPortal(this.domPortalContent());
        this.portalService.updateContent(this.name(), this.domPortal);
      }
    });
  }

  ngOnDestroy(): void {
    this.portalService.clearContent(this.name());
  }
}