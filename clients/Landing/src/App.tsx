import { Switch, Route, Redirect } from "react-router-dom";
import { getRoutesGroupByName } from "./routes";
import { Elements } from "@stripe/react-stripe-js";
import "./css/App.css";
import "./css/global.css";
import _ from 'lodash';
import { environment } from "./environments/environment";
import {loadStripe} from '@stripe/stripe-js';

const stripePromise = loadStripe(environment.stripePublicKey);

function App() {
  let accessibleRoutes: any[] = getRoutesGroupByName("public");
  return (
    <Elements stripe={stripePromise} options={{ locale: 'en'} } >
      <Switch>
        {_.map(accessibleRoutes, (route: any, idx: number) => {
          return (
            <Route
              key={idx}
              path={route.path}
              exact={route.exact}
              component={route.component}
            />
          );
        })}
        <Redirect from="*" to="/" />
      </Switch>
    </Elements>
  );
}

export default App;
