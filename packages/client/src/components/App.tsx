import * as React                                        from "react";
import { BrowserRouter as Router, Route, Switch }        from "react-router-dom";
import HomePage                                          from "../pages/HomePage";
import { Settings }                                      from "../pages/Settings";
import PrivateRoute                                      from "../pages/PrivateRoute";
import { getIntegrations, getWorkers }                   from "../actions/worker";
import { connect }                                       from "react-redux";
import { IReduxState }                                   from "../common/IReduxState";
import { getIsAuthenticated }                            from "../selectors";
import { setContactAction, setIsAuthenticated, setUser } from "../actions/app";
import { auth }                                          from "../services/AuthService";
import NavbarComponent                                   from "./NavbarComponent";
import { parseJwt }                                      from "@ffn/communicator-tools";

class App extends React.Component<any, any> {

  async componentDidMount() {
    const {setIsAuthenticated, getWorkers, getIntegrations, setContact, setUser} = this.props;
    const res = await auth.login();
    if (res) {
      if (!localStorage.contactId) {
        localStorage.contactId = await setContact();
      }
      await getWorkers();
      await getIntegrations();
      setUser(parseJwt(localStorage.accessToken).sub);
      setIsAuthenticated(true);
    }
  }

  render() {
    return (
      <Router>
        <NavbarComponent/>
        <Switch>
          <PrivateRoute path="/" component={HomePage} exact/>
          <Route path="/settings" component={Settings} exact/>
        </Switch>
      </Router>
    );
  }
}

export default connect((state: IReduxState) => ({
  isAuthenticated: getIsAuthenticated(state),
}), {
  setUser: setUser,
  getWorkers: getWorkers,
  getIntegrations: getIntegrations,
  setIsAuthenticated: setIsAuthenticated,
  setContact: setContactAction
})(App);