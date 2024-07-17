import { Route } from '@angular/router';
import { LayoutComponentWrap } from './layout/layout.component';
import { PortalComponentWrap } from './portal/portal.component';
import { SpinnerComponentWrap } from './spinner/spinner.component';
import { SlidderComponentWrap } from './slidder/slidder.component';

export const appRoutes: Route[] = [
    { path: 'layout', component: LayoutComponentWrap },
    { path: 'portal', component: PortalComponentWrap },
    { path: 'spinner', component: SpinnerComponentWrap },
    { path: 'slidder', component: SlidderComponentWrap },
];
