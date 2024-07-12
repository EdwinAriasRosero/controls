import { Component } from "@angular/core";
import { PortalComponent, PortalContentComponent } from '@ea-portal';

const PORTAL_NAME = 'my-header-content-here';

@Component({
    selector: 'app-portal-child',
    template: `
    <ea-portal-content name="${PORTAL_NAME}">
        <div style="border: solid thin blue;">
            Content from child
        </div>
    </ea-portal-content>

    Normal Child content`,
    standalone: true,
    imports: [PortalContentComponent]
})
export class PortalChildComponentWrap {

}


@Component({
    selector: 'app-portal',
    template: `
    <div style="border: solid thin red;">
        parent content
        <ea-portal name="${PORTAL_NAME}" />
    </div>
    <main>My normal content<main>
 
    <app-portal-child />
    `,
    standalone: true,
    imports: [PortalComponent, PortalChildComponentWrap]
})
export class PortalComponentWrap {

}

