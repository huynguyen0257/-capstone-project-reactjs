import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import {UserPage} from "../pages"
function UserRoute() {
  let match = useRouteMatch();
  return (
    <Router>
      <h1>User Category</h1>
      <Switch>
        <Route path={match.path}>
          <UserPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default UserRoute;
