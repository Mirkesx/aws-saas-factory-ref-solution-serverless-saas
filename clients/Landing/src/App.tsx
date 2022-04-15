import { Switch, Route, Redirect } from "react-router-dom";
import { getRoutesGroupByName } from "./routes";
import "./css/App.css";
import "./css/global.css";
import _ from 'lodash';

function App() {
  let accessibleRoutes: any[] = getRoutesGroupByName("public");
  return (
    <>
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
    </>
  );
}

export default App;
