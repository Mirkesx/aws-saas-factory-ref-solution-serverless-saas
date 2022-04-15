import _ from 'lodash';
import HomePage from './components/pages/homePage';

interface ApplicationRouteGroup {
  name: string;
  routes: ApplicationRoute[];
}

interface ApplicationRoute {
  path: string;
  name: string;
  restricted: boolean;
  exact?: boolean;
  component: any;
  menuLabel?: string;
}

export const appRoutes: ApplicationRouteGroup[] = [
  {
    name: 'public',
    routes: [
      {
        path: '/',
        name: 'home',
        restricted: false,
        exact: true,
        component: HomePage,
        menuLabel: 'Home'
      }
    ]
  }
];

export function getRoutesGroupByName(
  name: string,
  excludeRestricted: boolean = true
) {
  let result: any = _.find(appRoutes, { name })?.routes;
  if (excludeRestricted) {
    result = _.filter(result, { restricted: !excludeRestricted });
  }
  
  return result;
}
