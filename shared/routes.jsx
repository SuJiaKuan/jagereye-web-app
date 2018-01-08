import React               from 'react';
import { Route, Redirect } from 'react-router';

import App from './containers/App.jsx';

import MainLayout from './containers/layouts/MainLayout.jsx';

import DashboardPageContainer         from './containers/pages/DashboardPage.jsx';
import CamerasPageContainer           from './containers/pages/CamerasPage.jsx';
import ActivationsPageContainer       from './containers/pages/ActivationsPage.jsx';
import ActivationPageContainer        from './containers/pages/ActivationPage.jsx';
import ShareResultPageContainer       from './containers/pages/ShareResultPage.jsx';
import CustomShareResultPageContainer from './containers/pages/CustomShareResultPage.jsx';
import PromoPageContainer             from './containers/pages/PromoPage.jsx';

export default (
    <Route component={App} >
        <Redirect from='/' to='/dashboard' />
        <Redirect from='' to='/dashboard' />

        <Route component={MainLayout} path='/'>
            <Redirect from='/kmda/start' to='/activations?search=english' />

            <Route component={DashboardPageContainer} path='/dashboard' />
            <Route component={CamerasPageContainer} path='/cameras' />

            <Route component={ActivationsPageContainer} path='/activations' />

            <Route component={ActivationPageContainer} path='/activations/:id' />
            <Route component={ActivationPageContainer} path='/activations/:id/:title' />


            <Route component={ShareResultPageContainer} path='/result/:id/:accountId' />
            <Route component={CustomShareResultPageContainer} path='/share/:key' />

            <Route component={PromoPageContainer} path='/promo/:key' />

        </Route>
    </Route>
);
