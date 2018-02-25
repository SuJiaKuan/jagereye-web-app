import React               from 'react';
import { Route, Redirect } from 'react-router';

import App from './containers/App.jsx';

import MainLayout from './containers/layouts/MainLayout.jsx';

import CamerasPageContainer           from './containers/pages/CamerasPage.jsx';

export default (
    <Route component={App} >
        <Redirect from='/' to='/cameras' />
        <Redirect from='' to='/cameras' />

        <Route component={MainLayout} path='/'>
            <Route component={CamerasPageContainer} path='/cameras' />
        </Route>
    </Route>
);
