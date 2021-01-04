import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Result, Button } from "antd";
import PrivateRoute from "./private.route";
import { LoginPage, ForgetPasswordPage } from "../pages";
import managerRoute from "./manager.route";
import BuildingGuardRoute from "./building.guard.route";
import { useDispatch } from "react-redux";
import {
  setRoles,
  setUniversities,
  setPolicyLevels,
  setPolicies,
  setCaseHistoryStatus,
  setBuildings,
  setRelatives,
} from "../redux";
import {
  getRoles,
  getUniversities,
  getPolicyLevels,
  getCaseHistoryStatus,
  getBuildings,
  getRelatives,
  getPolicies,
} from "../services";
import { logOut } from "../services";

function AppRoute() {
  const dispatch = useDispatch();
  React.useEffect(() => {
    getRoles().then((res) => {
      dispatch(setRoles(res.data));
    });
    getUniversities().then((res) => {
      dispatch(setUniversities(res.data));
    });
    getPolicyLevels().then((res) => {
      dispatch(setPolicyLevels(res.data));
    });
    getPolicies().then((res) => {
      dispatch(setPolicies(res.data));
    });
    getBuildings().then((res) => {
      dispatch(setBuildings(res.data));
    });
    getCaseHistoryStatus().then((res) => {
      dispatch(setCaseHistoryStatus(res.data));
    });
    // getRelatives().then((res) => {
    //   dispatch(setRelatives(res.data));
    // });
  }, []);
  return (
    <Router>
      <Switch>
        <Route path="/login" exact>
          <LoginPage />
        </Route>
        <Route path="/forgetPassword" exact>
          <ForgetPasswordPage />
        </Route>
        <PrivateRoute path="/manager" component={managerRoute} />
        <PrivateRoute path="/building-guard" component={BuildingGuardRoute} />
        <Route path="/" exact>
          <Redirect to="/manager" />
        </Route>

        <Route path="/no_internet_connection" exact>
          <Result
            status="404"
            title="Failed to connect with back-end server, please try again"
            subTitle=""
            extra={
              <Button onClick={() => window.history.back()} type="primary">
                Back Login
              </Button>
            }
          />
        </Route>
        <Route path="/invalid-role" exact>
          <Result
            status="404"
            title="Your role is invalid. Please check your account"
            subTitle=""
            extra={
              <Button
                onClick={() => {
                  logOut();
                  window.history.back();
                }}
                type="primary"
              >
                Back Login
              </Button>
            }
          />
        </Route>

        <Route path="/no_building" exact>
          <Result
            status="404"
            title="Your account is not have responsibility on any building. Please contact your manager"
            subTitle=""
            extra={
              <Button
                onClick={() => {
                  logOut();
                  window.history.back();
                }}
                type="primary"
              >
                Back Login
              </Button>
            }
          />
        </Route>
        
      </Switch>
    </Router>
  );
}

export default AppRoute;
