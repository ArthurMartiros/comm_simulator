import * as qs                         from 'qs';
import * as React                      from 'react';
import { connect }                     from 'react-redux';
import { Redirect, Route, withRouter } from 'react-router-dom';
import { IReduxState }                 from "../common/IReduxState";
import { getIsAuthenticated }          from "../selectors";

class PrivateRoute extends React.Component<IProps> {

  renderRoute = (routeProp) => {
    const {
      authenticated,
      component: Component,
      ...rest
    } = this.props;
    const {
      logout,
      code,
      error,
      error_description,
    } = qs.parse(routeProp.location.search, {
      ignoreQueryPrefix: true,
    });
    if (logout || !authenticated) {
      return (
        <div className='notAuthorized'>Not Authorized</div>
      );
    }
    if (code) {
      return <Redirect to="/"/>;
    }
    if (error) {
      return (
        <>
          <div>{error.replace('_', ' ')}</div>
          {!!error_description && (
            <div>{error_description}</div>
          )}
        </>
      );
    }
    return (
      <Component {...rest} {...routeProp}/>
    );
  };

  public render() {
    return <Route render={this.renderRoute}/>;
  }
}

export default withRouter<any, any>(connect((state: IReduxState) => ({
  authenticated: getIsAuthenticated(state),
}))(PrivateRoute));

interface IProps {
  component?: any;
  authenticated: boolean;
}
