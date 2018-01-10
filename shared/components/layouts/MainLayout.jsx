import React, { Component, PropTypes } from 'react';
import { Header, Navigation } from 'react-mdl';

import Notifcations from '../../containers/Notifications.jsx';
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

        const title = <span style = {{ 'letter-spacing': '3px' }}>JagerEye</span>;

        return (
            <div className = 'MainLayout'>
                <Header title={title}>
                    <Navigation>
                        <a href = '/dashboard'>{l('Dashboard')}</a>
                        <a href = '/cameras'>{l('Cameras')}</a>
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
