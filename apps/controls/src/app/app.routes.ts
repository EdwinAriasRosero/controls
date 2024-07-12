import { Route } from '@angular/router';
import { LayoutComponentWrap } from './layout/layout.component';
import { PortalComponentWrap } from './portal/portal.component';

export const appRoutes: Route[] = [
    { path: 'layout', component: LayoutComponentWrap },
    { path: 'portal', component: PortalComponentWrap },
];
