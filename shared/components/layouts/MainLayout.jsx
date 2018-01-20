import React, { Component, PropTypes } from 'react';
import { Header, Navigation }          from 'react-mdl';
import { Link }                        from 'react-router';

import Notifcations from '../../containers/Notifications.jsx';
import ErrorDialog from '../../containers/ErrorDialog.jsx';
import Footer       from '../../containers/Footer.jsx';

import './MainLayout.less';

export default class MainLayout extends Component {
    static propTypes = {
        showWelcomeScreen      : PropTypes.bool,
        showFooter             : PropTypes.bool,
        children               : PropTypes.object,
        footerLinks            : PropTypes.object,
        onWelcomeScreenDismiss : PropTypes.func
    };

    static contextTypes = { i18n: React.PropTypes.object };

    render() {
        const { l } = this.context.i18n;

        const { showFooter, children } = this.props;

        const title = <span style = {{ 'letterSpacing': '3px' }}>JagerEye</span>;

        return (
            <div className = 'MainLayout'>
                <ErrorDialog />

                <Header title={title}>
                    <Navigation>
                        <Link to = '/dashboard'>{l('Dashboard')}</Link>
                        <Link to = '/cameras'>{l('Cameras')}</Link>
                        <Notifcations />
                    </Navigation>
                </Header>
                <div className = 'MainLayout__content'>
                    {children}
                </div>

                {
                    showFooter
                    ? <Footer />
                    : null
                }
            </div>
        );
    }
}
