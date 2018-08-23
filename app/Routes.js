/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes.json';
import App from './containers/App';
import VesicleAnalyzer from './views/VesicleAnalyzer/VesicleAnalyzer';
import FrontPage from './views/FrontPage/FrontPage';

export default () => (
  <App>
    <Switch>
      <Route path={routes.VESICLE_ANALYZER} component={VesicleAnalyzer} />
      <Route path={routes.FrontPage} component={FrontPage} />
    </Switch>
  </App>
);
