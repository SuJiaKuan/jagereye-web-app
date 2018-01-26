import React               from 'react';
import { Route, Redirect } from 'react-router';

import App from './containers/App.jsx';

import MainLayout from './containers/layouts/MainLayout.jsx';

import DashboardPageContainer         from './containers/pages/DashboardPage.jsx';
import CamerasPageContainer           from './containers/pages/CamerasPage.jsx';

export default (
    <Route component={App} >
        <Redirect from='/' to='/dashboard' />
        <Redirect from='' to='/dashboard' />

        <Route component={MainLayout} path='/'>
            <Route component={DashboardPageContainer} path='/dashboard' />
            <Route component={CamerasPageContainer} path='/cameras' />
        </Route>
    </Route>
);
