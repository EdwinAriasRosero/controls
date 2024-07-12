import { Route } from '@angular/router';
import { LayoutComponentWrap } from './layout/layout.component';
import { PortalComponentWrap } from './portal/portal.component';
import { SpinnerComponentWrap } from './spinner/spinner.component';

export const appRoutes: Route[] = [
    { path: 'layout', component: LayoutComponentWrap },
    { path: 'portal', component: PortalComponentWrap },
    { path: 'spinner', component: SpinnerComponentWrap },
];
