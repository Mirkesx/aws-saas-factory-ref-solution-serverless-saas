import _ from 'lodash';
import ChooseTenant from './components/pages/ChooseTenant';
import SignFile from './components/pages/SignFile';
import Account from './components/pages/Account';
import SignedFiles from './components/pages/SignedFiles';

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
        path: '/login',
        name: 'login',
        restricted: false,
        exact: true,
        component: ChooseTenant,
        menuLabel: 'Home'
      }
    ]
  },
  {
    name: 'private',
    routes: [
      {
        path: '/',
        name: 'home',
        restricted: false,
        exact: true,
        component: SignFile,
        menuLabel: 'Home'
      },
      {
        path: '/sign-file',
        name: 'signFile',
        restricted: false,
        exact: true,
        component: SignFile,
        menuLabel: 'Sign a File'
      },
      {
        path: '/verify-file',
        name: 'verifyFile',
        restricted: false,
        exact: true,
        component: null,
        menuLabel: 'Verify a Signed File'
      },
      {
        path: '/signed-files',
        name: 'listSignedFile',
        restricted: false,
        exact: true,
        component: SignedFiles,
        menuLabel: 'List Signed Files'
      },
      {
        path: '/add-certificate',
        name: 'addCertificate',
        restricted: false,
        exact: true,
        component: null,
        menuLabel: 'Add a certificate'
      },
      {
        path: '/account',
        name: 'account',
        restricted: false,
        exact: true,
        component: Account,
        menuLabel: 'Account'
      },
      {
        path: '/settings',
        name: 'settings',
        restricted: false,
        exact: true,
        component: null,
        menuLabel: 'Settings'
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
