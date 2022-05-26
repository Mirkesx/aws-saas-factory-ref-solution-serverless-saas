import { useEffect, useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { getRoutesGroupByName } from "./routes";
import Topbar from "./components/toolbars/Topbar";
import LateralMenu from "./components/menus/LateralMenu";
import AuthUtils from "./utils/authUtils";
import { useAppDispatch } from "./store/hooks";
import { init } from "./store/reducers/authSlice";
import "./fonts/OPTIOpus.otf";
import "./css/App.css";
import _ from "lodash";

function App(props: any) {
  const dispatch = useAppDispatch();
  const [routesType, setRoutesType] = useState("public");
  const accessibleRoutes: any[] = getRoutesGroupByName(routesType);

  function initAuthState() {
    const payload = {
      logged: true,
      access_token: AuthUtils.getAccessToken(),
      id_token: AuthUtils.getIdToken(),
    };
    dispatch(init(payload));
  }

  useEffect(() => {
    if (AuthUtils.checkToken()) {
      initAuthState();
      setRoutesType("private");
    } else {
      AuthUtils.performLogout();
      setRoutesType("public");
    }
  }, []);

  return (
    <div className="App">
      <Topbar path={props.history.location.pathname}  />
      {routesType === "private" ? <LateralMenu {...props} /> : <></>}
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
        <Redirect from="*" to={routesType === "private" ? '/' : '/login'} />
      </Switch>
    </div>
  );
}

export default App;
