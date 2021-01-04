import React from "react";
import AppRoute from "./route/app.route";
import store from "./redux/store";
import { Provider } from "react-redux";
import "antd/dist/antd.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  
  // register();
  // registerServiceWorker();
  // askForPermissioToReceiveNotifications();
  return (
    <div className="App">
      <Provider store={store}>
        <AppRoute />
      </Provider>
    </div>
  );
}

export default App;
