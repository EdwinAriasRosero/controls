import { Component, input } from "@angular/core";
import { PortalComponent, PortalContentComponent } from '@ea-controls/portal';

const PORTAL_NAME = 'my-header-content-here';

@Component({
  selector: 'app-child',
  template: `
    <ea-portal-content name="${PORTAL_NAME}">
      child {{ name() }} content moved
    </ea-portal-content>

    This is a normal contetn from child {{ name() }}
    `,
  standalone: true,
  imports: [PortalContentComponent]
})
export class PortalChildComponentWrap {
  name = input.required<string>();
}


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PortalComponent, PortalChildComponentWrap],
  template: `
      <div style="border: solid thin blue">
        Parent Component
        <strong>
            <div ea-portal name="${PORTAL_NAME}" ></div>
        </strong>
      </div>

      Content from parent
  
      <button (click)="changeChild(1)">Child 1</button>
      <button (click)="changeChild(2)">Child 2</button>

      <div style="border: solid thin red">
          Space for children content
        
        @switch(child) {
            @case (1) {
            <app-child name="1" />
            }
            @case (2) {
            <app-child name="2" />
            }
        }
      </div>`
})
export class PortalComponentWrap {
  child = 1;

  changeChild(value: number) {
    this.child = value;
  }
}

