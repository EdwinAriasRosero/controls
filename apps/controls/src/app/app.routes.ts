import { Route } from '@angular/router';
import { LayoutComponentWrap } from './layout/layout.component';
import { PortalComponentWrap } from './portal/portal.component';
import { SpinnerComponentWrap } from './spinner/spinner.component';
import { SlidderComponentWrap } from './slidder/slidder.component';
import { RepositoryWebApiComponent } from './repository/repository-webapi.component';
import { RepositoryPouchDbComponent } from './repository/repository-pouchdb.component';

export const appRoutes: Route[] = [
    { path: 'layout', component: LayoutComponentWrap },
    { path: 'portal', component: PortalComponentWrap },
    { path: 'spinner', component: SpinnerComponentWrap },
    { path: 'slidder', component: SlidderComponentWrap },
    { path: 'repository-webapi', component: RepositoryWebApiComponent },
    { path: 'repository-pouchdb', component: RepositoryPouchDbComponent },
];
