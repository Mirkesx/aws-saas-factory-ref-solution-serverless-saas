import { createRoot } from "react-dom/client";
import "./css/index.css";
import App from "./App";
import store from "./store";
import { Provider } from "react-redux";
import reportWebVitals from "./reportWebVitals";
import { Router, Route } from "react-router-dom";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();
const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);

root.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="*" render={(props: any) => <App {...props} />} />
    </Router>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
