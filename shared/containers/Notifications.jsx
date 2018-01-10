import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux';

import { checkNotifications } from '../actions/notifications';
import connectDataFetchers from '../lib/connectDataFetchers.jsx';

import Notifcations from '../components/Notifications.jsx';

class NotificationsContainer extends Component {
    static propTypes = {
        notificationList : PropTypes.arrayOf(PropTypes.object),
        isChecked        : PropTypes.bool,
        dispatch         : PropTypes.func
    };

    handleBtnClick = () => {
        this.props.dispatch(checkNotifications());
    }

    render() {
        return (
            <Notifcations
                {...this.props}
                onBtnClick = {this.handleBtnClick}
            />
        );
    }
}

function mapStateToProps({ notifications }) {
    const { notificationList, isChecked } = notifications;

    return {
        notificationList,
        isChecked
    };
}

export default connect(mapStateToProps)(
    connectDataFetchers(NotificationsContainer, [])
);
